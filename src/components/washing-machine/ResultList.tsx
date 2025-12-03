'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ProcessedImage } from '@/hooks/useImageProcessor';

interface ResultListProps {
  images: ProcessedImage[];
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
  onViewDetail: (image: ProcessedImage) => void;
}

export function ResultList({
  images,
  onRemove,
  onDownload,
  onViewDetail
}: ResultListProps) {
  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
           <span className="text-2xl">🧺</span> Keranjang Hasil
        </h2>
        {images.length > 0 && (
           <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {images.filter(i => i.processed).length} Selesai
           </span>
        )}
        {images.some(i => i.processed) && (
            <Button
                size="sm"
                variant="outline"
                className="ml-auto text-xs h-8 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
                onClick={async () => {
                    const { default: JSZip } = await import('jszip');
                    const zip = new JSZip();
                    const processedImages = images.filter(i => i.processed);
                    
                    if (processedImages.length === 0) return;

                    const toastId = toast.loading('Membuat file ZIP...');

                    try {
                        await Promise.all(processedImages.map(async (img) => {
                            if (!img.processed) return;
                            const response = await fetch(img.processed);
                            const blob = await response.blob();
                            const fileName = img.fileName.replace(/\.[^/.]+$/, '') + '-clean.png';
                            zip.file(fileName, blob);
                        }));

                        const content = await zip.generateAsync({ type: 'blob' });
                        const url = URL.createObjectURL(content);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `laundry-magic-${Date.now()}.zip`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        toast.success('ZIP berhasil didownload! 📦', { id: toastId });
                    } catch (error) {
                        console.error('ZIP Error:', error);
                        toast.error('Gagal membuat ZIP', { id: toastId });
                    }
                }}
            >
                <Download className="w-3 h-3 mr-1.5" />
                ZIP
            </Button>
        )}
      </div>
      
      <div className="flex-1 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 p-4 overflow-y-auto custom-scrollbar relative">
        {images.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 opacity-60">
            <div className="w-20 h-20 border-4 border-gray-300 rounded-full flex items-center justify-center mb-4">
                <div className="w-12 h-1 bg-gray-300 rounded-full rotate-45" />
            </div>
            <p className="font-medium">Keranjang Kosong</p>
            <p className="text-sm">Belum ada cucian</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={cn(
                    "group relative bg-white rounded-2xl p-3 shadow-sm border transition-all duration-300 hover:shadow-md",
                    image.processed ? "border-green-100 bg-green-50/30" : "border-gray-100"
                  )}
                >
                  {/* Image Preview Area */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-[url('/checkerboard.svg')] bg-repeat relative mb-3 group-hover:shadow-inner transition-shadow">
                    <img
                      src={image.processed || image.original}
                      alt={image.fileName}
                      className={cn(
                        "w-full h-full object-contain transition-all duration-500",
                        !image.processed && !image.isProcessing && "grayscale opacity-80",
                        image.isProcessing && "scale-110 blur-sm"
                      )}
                    />
                    
                    {/* Status Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {image.isProcessing && (
                            <div className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md animate-pulse">
                                Mencuci {image.progress}%
                            </div>
                        )}
                        {!image.processed && !image.isProcessing && (
                            <div className="bg-gray-900/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                                Menunggu
                            </div>
                        )}
                    </div>

                    {/* Action Buttons Overlay (Hover) */}
                    {image.processed && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 rounded-full bg-white text-gray-900 hover:bg-blue-50"
                                onClick={() => onViewDetail(image)}
                                title="Lihat Detail"
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                className="h-8 w-8 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-lg"
                                onClick={() => onDownload(image.id)}
                                title="Download PNG"
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between px-1">
                     <div className="flex-1 min-w-0 mr-2">
                        <p className="text-xs font-medium text-gray-700 truncate" title={image.fileName}>
                            {image.fileName}
                        </p>
                        <p className="text-[10px] text-gray-400">
                            {image.processed ? '✨ Bersih & Rapi' : '🧺 Kotor'}
                        </p>
                     </div>
                     <button 
                        onClick={() => onRemove(image.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Hapus"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  </div>
                  
                  {/* Success Indicator Tag */}
                  {image.processed && (
                     <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm transform rotate-12 border-2 border-white">
                        CLEAN
                     </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
