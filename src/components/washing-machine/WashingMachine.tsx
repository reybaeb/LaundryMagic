'use client';

import { RefObject } from 'react';
import { Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProcessedImage } from '@/hooks/useImageProcessor';

interface WashingMachineProps {
  currentProcessing: string | null;
  simulatedProgress: number;
  isDragging: boolean;
  images: ProcessedImage[];
  currentImage: ProcessedImage | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onStart: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onGlassClick: () => void;
}

export function WashingMachine({
  currentProcessing,
  simulatedProgress,
  isDragging,
  images,
  currentImage,
  fileInputRef,
  onStart,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onGlassClick
}: WashingMachineProps) {
  return (
    <div className="flex flex-col justify-center w-full">
      {/* Machine Chassis */}
      <div className="relative bg-gray-100 rounded-[2.5rem] p-5 lg:p-6 shadow-2xl border border-gray-300">
        
        {/* Control Panel - Realistic Layout */}
        <div className="h-24 bg-gray-200 rounded-t-[2rem] -mx-5 -mt-5 mb-5 p-4 flex items-center justify-between border-b border-gray-300 shadow-inner relative z-20">
          
          {/* Left: Soap Drawer */}
          <div className="w-1/4 h-full flex items-center border-r border-gray-300 pr-4">
            <div className="w-full h-12 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-end px-2 relative overflow-hidden group cursor-pointer">
               <div className="absolute inset-y-0 left-0 w-1 bg-gray-300 group-hover:w-2 transition-all" />
               <div className="w-8 h-1 bg-gray-300 rounded-full" />
               <span className="absolute text-[9px] text-gray-400 bottom-1 left-2 font-mono">DETERGENT</span>
            </div>
          </div>

          {/* Center: THE KNOB (Start Button) */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div 
              className={cn(
                "w-16 h-16 rounded-full bg-gray-100 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06),inset_0_-2px_4px_rgba(0,0,0,0.1)] border-4 border-gray-300 flex items-center justify-center cursor-pointer transition-transform duration-500 ease-in-out hover:scale-105 active:scale-95",
                currentProcessing ? "rotate-90" : "rotate-0"
              )}
              onClick={onStart}
              title="Putar untuk Mulai Mencuci"
            >
              {/* Knob Indicator */}
              <div className="w-1.5 h-6 bg-slate-700 rounded-full relative shadow-sm">
                 {/* Small LED on knob */}
                 <div className={cn(
                   "absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors",
                   currentProcessing ? "bg-green-500 shadow-[0_0_5px_#22c55e]" : "bg-gray-400"
                 )} />
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-500 mt-1 tracking-wider">POWER</span>
          </div>

          {/* Right: Digital Display */}
          <div className="w-1/3 flex justify-end pl-4 border-l border-gray-300">
            <div className="bg-black rounded px-3 py-2 border-2 border-gray-600 shadow-inner min-w-[80px] text-right">
               <div className="flex items-center justify-end gap-1">
                  {currentProcessing && (
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                  <span className="font-mono text-green-500 text-lg leading-none font-bold tracking-widest" style={{ textShadow: '0 0 5px rgba(34,197,94,0.5)' }}>
                    {currentProcessing ? `${simulatedProgress}%` : 'READY'}
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* The Drum - Realistic Glass Door (ONLY UPLOAD ZONE) */}
        <div className="relative aspect-square w-full max-w-[320px] lg:max-w-[380px] mx-auto mb-4 lg:mb-6">
          {/* Outer Rim */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 via-white to-gray-300 shadow-[0_10px_20px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-gray-300" />
          
          {/* Door Hinge */}
          <div className="absolute top-1/2 -left-4 w-6 h-16 bg-gray-300 rounded-l-md border-l border-gray-400 shadow-sm -translate-y-1/2" />

          {/* Inner Rim */}
          <div className="absolute inset-3 lg:inset-4 rounded-full bg-gray-800 shadow-[inset_0_5px_10px_rgba(0,0,0,0.5)]" />

          {/* Glass Area */}
          <div className="absolute inset-6 lg:inset-8 rounded-full overflow-hidden">
             {/* Inner Seal/Gasket */}
             <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 p-2 lg:p-3 shadow-inner">
                
                {/* Interactive Glass Window */}
                <div
                  className={cn(
                    "relative w-full h-full rounded-full bg-gradient-to-br overflow-hidden cursor-pointer shadow-inner transition-all",
                    isDragging 
                      ? "from-blue-700 to-blue-800 ring-4 ring-blue-400 ring-offset-2 scale-105" 
                      : "from-slate-800 to-slate-900 hover:from-slate-700"
                  )}
                  onClick={onGlassClick}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/bmp,image/webp,image/avif"
                      multiple
                      onChange={onFileChange}
                      disabled={!!currentProcessing}
                    />

                    {/* Glass Content Area */}
                    <div className="absolute inset-0">
                      <AnimatePresence mode="wait">
                        {!currentImage ? (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full flex items-center justify-center"
                          >
                            <div className="text-center p-6 lg:p-8 relative z-10">
                              <div className={cn(
                                "w-14 lg:w-16 h-14 lg:h-16 rounded-full flex items-center justify-center mb-3 lg:mb-4 mx-auto transition-all backdrop-blur-sm border",
                                isDragging
                                  ? "bg-white/30 border-white/50 animate-bounce"
                                  : "bg-blue-500/20 border-blue-400/30 hover:bg-blue-500/30"
                              )}>
                                <Upload className={cn(
                                  "w-7 lg:w-8 h-7 lg:h-8",
                                  isDragging ? "text-white" : "text-blue-400"
                                )} />
                              </div>
                                <p className={cn(
                                  "text-sm lg:text-base font-medium mb-1",
                                  isDragging ? "text-white" : "text-slate-200"
                                )}>
                                  {isDragging ? "Lepaskan File Di Sini! 🎯" : (
                                    <>
                                      <span className="hidden lg:inline">Tarik Foto / Klik Disini</span>
                                      <span className="lg:hidden">Tap untuk Upload Foto</span>
                                    </>
                                  )}
                                </p>
                                <p className={cn(
                                  "text-xs lg:text-sm",
                                  isDragging ? "text-white/80" : "text-slate-400"
                                )}>
                                  {isDragging ? "Siap menerima gambar..." : "Mendukung JPG, PNG, WebP"}
                                </p>
                              {images.length > 0 && (
                                <p className="text-[10px] lg:text-xs text-blue-400 mt-2 bg-black/30 px-2 py-1 rounded-full inline-block">
                                  {images.filter(i => !i.processed).length} antrian • {images.filter(i => i.processed).length} bersih
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key={currentImage.id}
                            className="relative w-full h-full p-6 lg:p-8"
                          >
                            {/* Spinning Image Content */}
                            <motion.div
                              key={`spin-${currentImage.id}`}
                              animate={currentImage.isProcessing ? {
                                rotate: 360,
                              } : {}}
                              transition={currentImage.isProcessing ? {
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear"
                              } : {}}
                              className="w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-2xl"
                            >
                              <img
                                src={currentImage.original}
                                alt="Processing"
                                className="w-full h-full object-cover"
                              />
                            </motion.div>

                            {/* Water Animation */}
                            {currentImage.isProcessing && (
                              <motion.div
                                key={`water-${currentImage.id}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 rounded-full overflow-hidden pointer-events-none mix-blend-overlay"
                              >
                                <div className="absolute inset-0 bg-blue-500/30 animate-pulse" />
                                {[...Array(12)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute bg-white/40 rounded-full"
                                    style={{
                                        width: Math.random() * 20 + 5,
                                        height: Math.random() * 20 + 5,
                                        left: `${Math.random() * 100}%`,
                                        bottom: -20
                                    }}
                                    animate={{
                                        y: -400,
                                        x: Math.sin(i) * 50
                                    }}
                                    transition={{
                                        duration: Math.random() * 2 + 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                  />
                                ))}
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Glass Reflection */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-full" />
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
