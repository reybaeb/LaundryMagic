import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { soundManager } from '@/lib/sound-manager';
import { resizeImageBlob } from '@/lib/image-optimizer';
import { db } from '@/lib/db';

export interface ProcessedImage {
  id: string;
  original: string;
  processed: string | null;
  fileName: string;
  progress: number;
  isProcessing: boolean;
}

export function useImageProcessor() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [currentProcessing, setCurrentProcessing] = useState<string | null>(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  
  // Track Blob URLs for cleanup
  const blobUrlsRef = useRef<Set<string>>(new Set());

  // Load images from DB on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const storedImages = await db.getAllImages();
        if (storedImages.length > 0) {
          const loadedImages: ProcessedImage[] = storedImages.map(img => {
            const originalUrl = URL.createObjectURL(img.originalBlob);
            blobUrlsRef.current.add(originalUrl);
            
            let processedUrl = null;
            if (img.processedBlob) {
              processedUrl = URL.createObjectURL(img.processedBlob);
              blobUrlsRef.current.add(processedUrl);
            }

            return {
              id: img.id,
              original: originalUrl,
              processed: processedUrl,
              fileName: img.fileName,
              progress: img.processedBlob ? 100 : 0,
              isProcessing: false
            };
          });
          setImages(loadedImages);
        }
      } catch (error) {
        console.error('Failed to load images from DB:', error);
      }
    };
    loadImages();
  }, []);

  // Preload AI model
  useEffect(() => {
    const preloadModel = async () => {
      try {
        const { preload } = await import("@imgly/background-removal");
        await preload();
      } catch (error) {
        console.log('Model will load on first use');
      }
    };
    preloadModel();
  }, []);

  // Cleanup blob URLs ONLY on unmount
  useEffect(() => {
    return () => {
      // Revoke all tracked URLs when component unmounts
      blobUrlsRef.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
      blobUrlsRef.current.clear();
    };
  }, []);

  // Simulate realistic progress
  useEffect(() => {
    if (!currentProcessing) {
      setSimulatedProgress(0);
      return;
    }

    // Smoother progress simulation
    const timer = setInterval(() => {
      setSimulatedProgress(prev => {
        // If we are close to completion (triggered by actual progress), jump to it
        if (prev >= 98) return prev;
        
        // Non-linear increment: faster at start, slower at end
        const increment = prev < 30 ? 2 : prev < 60 ? 1 : 0.5;
        const next = prev + increment;
        
        // Cap at 95% until actual completion signal
        return next > 95 ? 95 : next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentProcessing]);

  // Helper function to convert unsupported image formats to PNG
  const convertImageToPNG = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        }, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;

    // Constants for file validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_FILES = 20;
    const MAX_TOTAL_IMAGES = 50;

    // Check file count limits
    if (files.length > MAX_FILES) {
      toast.error(`❌ Maksimal ${MAX_FILES} gambar per upload`);
      return;
    }

    if (images.length + files.length > MAX_TOTAL_IMAGES) {
      toast.error(`❌ Maksimal total ${MAX_TOTAL_IMAGES} gambar. Hapus beberapa gambar terlebih dahulu.`);
      return;
    }

    // Validate and convert files
    const processedFiles: Array<{ file: File; url: string; name: string }> = [];
    let skippedCount = 0;

    for (const file of files) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        toast.error(`❌ ${file.name} bukan file gambar yang valid`);
        skippedCount++;
        continue;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(1);
        toast.error(`❌ ${file.name} terlalu besar (${sizeMB}MB). Maksimal 10MB`);
        skippedCount++;
        continue;
      }

      // Check for AVIF or other unsupported formats
      if (file.type === 'image/avif' || file.type === 'image/webp' || file.type === 'image/heic') {
        try {
          // Convert to PNG using canvas
          const convertedBlob = await convertImageToPNG(file);
          const convertedFile = new File([convertedBlob], file.name.replace(/\.\w+$/, '.png'), { type: 'image/png' });
          
          // Check converted file size
          if (convertedFile.size > MAX_FILE_SIZE) {
            toast.error(`❌ ${file.name} terlalu besar setelah konversi`);
            skippedCount++;
            continue;
          }

          const url = URL.createObjectURL(convertedFile);
          blobUrlsRef.current.add(url); // Track URL

          processedFiles.push({
            file: convertedFile,
            url: url,
            name: file.name
          });
          toast.info(`✅ ${file.name} dikonversi ke PNG`);
        } catch (error) {
          toast.error(`❌ Gagal mengkonversi ${file.name}`);
          skippedCount++;
          continue;
        }
      } else {
        // Supported format
        const url = URL.createObjectURL(file);
        blobUrlsRef.current.add(url); // Track URL

        processedFiles.push({
          file: file,
          url: url,
          name: file.name
        });
      }
    }

    if (processedFiles.length === 0) {
      toast.error('❌ Tidak ada file valid untuk diupload');
      return;
    }

    const newImages: ProcessedImage[] = processedFiles.map((item, index) => {
      const id = `${Date.now()}-${index}`;
      
      // Save to DB
      db.addImage({
        id,
        fileName: item.name,
        originalBlob: item.file,
        createdAt: Date.now()
      }).catch(err => console.error('Failed to save to DB:', err));

      return {
        id,
        original: item.url,
        processed: null,
        fileName: item.name,
        progress: 0,
        isProcessing: false
      };
    });

    setImages(prev => [...prev, ...newImages]);
    soundManager.playUpload();
    
    // Success message with stats
    if (skippedCount > 0) {
      toast.success(`✅ ${processedFiles.length} foto ditambahkan. ${skippedCount} file dilewati.`);
    } else {
      toast.success(`✅ ${processedFiles.length} foto berhasil ditambahkan!`);
    }
  };

  const processImage = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    // Explicitly reset all states before starting
    setSimulatedProgress(0);
    setCurrentProcessing(imageId);

    // Force re-render by updating state synchronously
    setImages(prev => prev.map(img =>
      img.id === imageId ? { ...img, isProcessing: true, progress: 0, processed: null } : img
    ));

    // Start sounds
    soundManager.playWashingStart();

    // Small delay to ensure state update is reflected in UI
    await new Promise(resolve => setTimeout(resolve, 150));

    // Start looping sound
    soundManager.playLoop();

    try {
      // Import dynamically to avoid SSR issues
      const { removeBackground } = await import("@imgly/background-removal");
      
      const response = await fetch(image.original);
      let blob = await response.blob();

      // Optimize image size for faster processing
      const file = new File([blob], image.fileName);
      blob = await resizeImageBlob(file, 1280); // Resize to max 1280px

      // Track last progress to prevent too many re-renders
      let lastProgress = 0;

      const result = await removeBackground(blob, {
        debug: true, // Enable debug logs
        progress: (key: string, current: number, total: number) => {
          const percent = Math.round((current / total) * 100);
          
          // Throttle updates: only update every 5% or when complete
          if (percent >= lastProgress + 5 || percent === 100) {
            lastProgress = percent;
            setImages(prev => prev.map(img =>
              img.id === imageId ? { ...img, progress: percent } : img
            ));
            // Sync simulated progress but ensure it doesn't go backwards
            setSimulatedProgress(prev => Math.max(prev, percent));
          }
        }
      });

      const url = URL.createObjectURL(result);
      blobUrlsRef.current.add(url); // Track URL

      // Save processed result to DB
      await db.updateProcessedImage(imageId, result);

      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, processed: url, isProcessing: false, progress: 100 } : img
      ));

      setSimulatedProgress(100);
      setCurrentProcessing(null);

      // Stop looping sound
      soundManager.stopLoop();
      soundManager.playComplete();
      toast.success('Background berhasil dihapus! ✨');
    } catch (error: any) {
      console.error("Processing Error:", error); // Log full error
      soundManager.stopLoop();
      soundManager.playError();
      
      // Robust error message extraction
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as any).message);
      } else {
        errorMessage = String(error);
      }

      // Check for specific keywords safely
      const lowerMsg = errorMessage.toLowerCase();
      if (lowerMsg.includes("fetch") || lowerMsg.includes("network") || lowerMsg.includes("failed to fetch")) {
        errorMessage = "Gagal mengunduh model AI. Pastikan koneksi internet stabil (WiFi/Data).";
      } else if (lowerMsg.includes("memory")) {
        errorMessage = "Memori HP tidak cukup. Coba gambar yang lebih kecil.";
      } else if (lowerMsg.includes("sharedarraybuffer") || lowerMsg.includes("cross-origin")) {
        errorMessage = "Browser memblokir fitur canggih. Coba gunakan Chrome terbaru atau akses via localhost/HTTPS.";
      }

      toast.error(`Gagal memproses: ${errorMessage}`, {
        duration: 5000,
        action: {
          label: 'Coba Lagi',
          onClick: () => processImage(imageId)
        }
      });
      
      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, isProcessing: false, progress: 0 } : img
      ));
      setCurrentProcessing(null);
      setSimulatedProgress(0);
    }
  };

  const removeImage = (imageId: string) => {
    // Find the image to remove
    const imageToRemove = images.find(img => img.id === imageId);
    
    // Revoke blob URLs to prevent memory leak
    if (imageToRemove) {
      if (imageToRemove.original?.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.original);
        blobUrlsRef.current.delete(imageToRemove.original); // Remove from tracking
      }
      if (imageToRemove.processed?.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.processed);
        blobUrlsRef.current.delete(imageToRemove.processed); // Remove from tracking
      }
    }

    // Delete from DB
    db.deleteImage(imageId).catch(err => console.error('Failed to delete from DB:', err));
    
    setImages(prev => prev.filter(img => img.id !== imageId));
    soundManager.playClick();
  };

  // Traditional download fallback
  const traditionalDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Multiple attempts to force the filename
    link.href = url;
    link.download = filename;
    link.setAttribute('download', filename);
    link.style.display = 'none';

    document.body.appendChild(link);

    // Trigger click
    link.click();

    // Cleanup after delay
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 250);

    soundManager.playClick();
    toast.success(`📥 ${filename}`);
  };

  const handleDownload = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image?.processed) return;

    try {
      // Generate clean filename with .png extension
      const baseFileName = image.fileName
        .replace(/\.[^/.]+$/, '')           // Remove old extension
        .replace(/[^a-zA-Z0-9-_\s]/g, '')   // Remove special chars
        .trim()
        .substring(0, 30) || 'cleaned';     // Limit length

      const timestamp = Date.now();

      // CRITICAL: Filename MUST end with .png
      const finalFileName = `${baseFileName}-${timestamp}.png`;

      console.log('Download filename:', finalFileName);  // Debug

      // Create canvas and convert to blob
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';

      const downloadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('No canvas context'));
              return;
            }

            ctx.drawImage(img, 0, 0);

            // Convert to blob with PNG MIME type
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Blob creation failed'));
                return;
              }

              try {
                // Method 1: Try modern download API
                if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
                  // Modern browsers with File System Access API
                  (async () => {
                    try {
                      const handle = await (window as any).showSaveFilePicker({
                        suggestedName: finalFileName,
                        types: [{
                          description: 'PNG Image',
                          accept: { 'image/png': ['.png'] }
                        }]
                      });
                      const writable = await handle.createWritable();
                      await writable.write(blob);
                      await writable.close();
                      soundManager.playClick();
                      toast.success(`✅ ${finalFileName}`);
                      resolve();
                    } catch (e: any) {
                      if (e.name !== 'AbortError') {
                        // Fallback to traditional method
                        traditionalDownload(blob, finalFileName);
                        resolve();
                      }
                    }
                  })();
                } else {
                  // Fallback: Traditional download
                  traditionalDownload(blob, finalFileName);
                  resolve();
                }
              } catch (error) {
                reject(error);
              }
            }, 'image/png', 1.0);

          } catch (err) {
            reject(err);
          }
        };

        img.onerror = () => reject(new Error('Image load failed'));
        if (image.processed) {
          img.src = image.processed;
        } else {
          reject(new Error('No processed image'));
        }
      });

      await downloadPromise;

    } catch (error) {
      console.error('Download error:', error);
      toast.error('Gagal mengunduh. Coba lagi.');
    }
  };

  return {
    images,
    currentProcessing,
    simulatedProgress,
    processFiles,
    processImage,
    removeImage,
    handleDownload
  };
}
