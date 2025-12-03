'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { WashingMachine } from '@/components/washing-machine/WashingMachine';
import { ResultList } from '@/components/washing-machine/ResultList';
import { ImageDetailView } from '@/components/ImageDetailView';
import { useImageProcessor, ProcessedImage } from '@/hooks/useImageProcessor';

export default function MinimalistRemover() {
  const {
    images,
    currentProcessing,
    simulatedProgress,
    processFiles,
    processImage,
    removeImage,
    handleDownload
  } = useImageProcessor();

  const [selectedImageForDetail, setSelectedImageForDetail] = useState<ProcessedImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartProcessing = () => {
    if (!currentProcessing) {
      const nextImage = images.find(i => !i.processed && !i.isProcessing);
      if (nextImage) processImage(nextImage.id);
      else if (images.length > 0) toast.info("Semua gambar sudah bersih! ✨");
      else toast.info("Masukkan gambar dulu ya! 🧺");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentProcessing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (currentProcessing) {
      toast.error('⏳ Tunggu proses saat ini selesai');
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const currentImage = currentProcessing ? images.find(img => img.id === currentProcessing) || null : null;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col overflow-hidden transition-colors duration-300">
      <Navbar />

      {/* Main Content - Fills remaining space */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 lg:py-8">
          <div className="h-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12">
            
            {/* Left Column: Washing Machine */}
            <div className="w-full max-w-md flex-shrink-0">
              <WashingMachine
                currentProcessing={currentProcessing}
                simulatedProgress={simulatedProgress}
                isDragging={isDragging}
                images={images}
                currentImage={currentImage}
                fileInputRef={fileInputRef}
                onStart={handleStartProcessing}
                onFileChange={handleFileChange}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileDrop}
                onGlassClick={() => !currentProcessing && fileInputRef.current?.click()}
              />
            </div>

            {/* Right Column: Result Panel */}
            <div className="w-full max-w-md lg:max-w-none lg:flex-1 h-[500px] lg:h-[600px]">
              <ResultList
                images={images}
                onRemove={removeImage}
                onDownload={handleDownload}
                onViewDetail={setSelectedImageForDetail}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Image Detail Modal */}
      {selectedImageForDetail && (
        <ImageDetailView
          isOpen={!!selectedImageForDetail}
          onClose={() => setSelectedImageForDetail(null)}
          originalImage={selectedImageForDetail.original}
          processedImage={selectedImageForDetail.processed!}
          fileName={selectedImageForDetail.fileName}
        />
      )}
    </div>
  );
}
