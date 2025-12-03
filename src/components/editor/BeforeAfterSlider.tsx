'use client';
import { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
    originalImage: string;
    processedImage: string;
}

export function BeforeAfterSlider({ originalImage, processedImage }: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => setIsResizing(true);
    const handleMouseUp = () => setIsResizing(false);

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        if (!isResizing || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(x, 0), 100));
    };

    // Handle global mouse events when dragging
    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove as any);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[500px] overflow-hidden rounded-xl border bg-muted/50 select-none group"
            onMouseMove={handleMouseMove}
        >
            {/* Processed Image (Background) */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Original Image (Foreground - Clipped) */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-white/50"
                style={{ width: `${sliderPosition}%` }}
            >
                <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-contain max-w-none"
                    style={{ width: containerRef.current?.offsetWidth }}
                />
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-primary transform transition-transform hover:scale-110 active:scale-95">
                    <MoveHorizontal className="w-4 h-4" />
                </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">Original</div>
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">Removed</div>
        </div>
    );
}
