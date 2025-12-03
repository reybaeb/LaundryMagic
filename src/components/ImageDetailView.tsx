'use client';

import { useState, useRef } from 'react';
import { X, Download, Check, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageDetailViewProps {
    isOpen: boolean;
    onClose: () => void;
    originalImage: string;
    processedImage: string;
    fileName: string;
}

const BACKGROUND_OPTIONS = [
    { type: 'transparent', label: 'Transparent', color: 'bg-[url(/checkerboard.svg)]' },
    { type: 'solid', label: 'White', color: 'bg-white' },
    { type: 'solid', label: 'Black', color: 'bg-black' },
    { type: 'solid', label: 'Gray', color: 'bg-gray-500' },
    { type: 'gradient', label: 'Blue Purple', color: 'bg-gradient-to-r from-blue-400 to-purple-500' },
    { type: 'gradient', label: 'Sunset', color: 'bg-gradient-to-r from-orange-400 to-pink-500' },
];

type Format = 'png' | 'jpg' | 'webp';

export function ImageDetailView({
    isOpen,
    onClose,
    originalImage,
    processedImage,
    fileName
}: ImageDetailViewProps) {
    const [currentBackground, setCurrentBackground] = useState(BACKGROUND_OPTIONS[0].color);
    const [customColor, setCustomColor] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<Format>('png');
    const [isHoveringOriginal, setIsHoveringOriginal] = useState(false);

    const handleDownload = async () => {
        try {
            const response = await fetch(processedImage);
            const blob = await response.blob();
            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            await new Promise((resolve) => { img.onload = resolve; });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Draw background
            // Draw background
            if (currentBackground === 'custom' && customColor) {
                 ctx.fillStyle = customColor;
                 ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else if (currentBackground !== 'bg-[url(/checkerboard.svg)]') {
                const option = BACKGROUND_OPTIONS.find(opt => opt.color === currentBackground);
                if (option) {
                    if (option.type === 'solid') {
                        // Map tailwind colors to hex/rgba
                        const colorMap: Record<string, string> = {
                            'bg-white': '#ffffff',
                            'bg-black': '#000000',
                            'bg-gray-500': '#6b7280',
                        };
                        ctx.fillStyle = colorMap[option.color] || '#ffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    } else if (option.type === 'gradient') {
                        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                        if (option.color.includes('from-blue-400')) {
                            gradient.addColorStop(0, '#60a5fa');
                            gradient.addColorStop(1, '#a855f7');
                        } else if (option.color.includes('from-orange-400')) {
                            gradient.addColorStop(0, '#fb923c');
                            gradient.addColorStop(1, '#ec4899');
                        }
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                }
            } else if (selectedFormat === 'jpg') {
                // Fix JPG Bug: Default to white if transparent is selected
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((convertedBlob) => {
                if (!convertedBlob) return;
                const link = document.createElement('a');
                link.href = URL.createObjectURL(convertedBlob);
                link.download = `clean-${fileName.split('.')[0]}.${selectedFormat}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, `image/${selectedFormat}`, selectedFormat === 'jpg' ? 0.95 : 1);

        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', duration: 0.4, bounce: 0.3 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Detail Gambar</h2>
                                <p className="text-sm text-gray-500 truncate max-w-md">{fileName}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </Button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            
                            {/* 1. Large Preview Area */}
                            <div 
                                className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner group"
                                onMouseEnter={() => setIsHoveringOriginal(true)}
                                onMouseLeave={() => setIsHoveringOriginal(false)}
                            >
                                {/* Background Layer */}
                                <div 
                                    className={cn("absolute inset-0 transition-colors duration-300", currentBackground !== 'custom' && currentBackground)}
                                    style={currentBackground === 'custom' && customColor ? { backgroundColor: customColor } : {}}
                                />
                                
                                {/* Image Layer */}
                                <img
                                    src={isHoveringOriginal ? originalImage : processedImage}
                                    alt="Preview"
                                    className="relative w-full h-full object-contain z-10 p-4 transition-all duration-300"
                                />

                                {/* Hint Badge */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                    Tahan untuk lihat asli
                                </div>
                            </div>

                            {/* 2. Background Selector */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Background</h3>
                                <div className="flex flex-wrap gap-3">
                                    {BACKGROUND_OPTIONS.map((bg) => (
                                        <button
                                            key={bg.label}
                                            onClick={() => {
                                                setCurrentBackground(bg.color);
                                                setCustomColor(null);
                                            }}
                                            className={cn(
                                                "w-16 h-12 rounded-xl border-2 transition-all relative overflow-hidden shadow-sm hover:scale-105 active:scale-95",
                                                bg.color,
                                                currentBackground === bg.color && !customColor
                                                    ? "border-purple-600 ring-2 ring-purple-100" 
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                            title={bg.label}
                                        >
                                            {currentBackground === bg.color && !customColor && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                    <div className="bg-white rounded-full p-0.5 shadow-sm">
                                                        <Check className="w-3 h-3 text-purple-600" strokeWidth={3} />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    
                                    {/* Color Wheel Picker */}
                                    <div className="relative w-16 h-12 rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition-all group">
                                        <input
                                            type="color"
                                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                                            onChange={(e) => {
                                                setCustomColor(e.target.value);
                                                setCurrentBackground('custom');
                                            }}
                                            value={customColor || '#ffffff'}
                                        />
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center",
                                                customColor ? "bg-transparent" : "bg-gradient-to-br from-red-500 via-green-500 to-blue-500"
                                            )}>
                                                {customColor && <Check className="w-3 h-3 text-white drop-shadow-md" strokeWidth={3} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Export Format */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider text-[10px] text-gray-400">Export Format</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { val: 'png', label: 'PNG', desc: 'Transparent' },
                                        { val: 'jpg', label: 'JPG', desc: 'Smaller size' },
                                        { val: 'webp', label: 'WebP', desc: 'Best quality' }
                                    ].map((fmt) => (
                                        <button
                                            key={fmt.val}
                                            onClick={() => setSelectedFormat(fmt.val as Format)}
                                            className={cn(
                                                "flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all duration-200",
                                                selectedFormat === fmt.val
                                                    ? "border-purple-500 bg-purple-50 text-purple-700 shadow-sm"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                            )}
                                        >
                                            <span className="text-lg font-black uppercase mb-1">{fmt.label}</span>
                                            <span className="text-[10px] opacity-70 font-medium">{fmt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <Button
                                size="lg"
                                className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                                onClick={handleDownload}
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download {selectedFormat.toUpperCase()}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
