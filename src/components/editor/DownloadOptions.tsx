'use client';
import { Button } from '@/components/ui/button';
import { Download, FileImage } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DownloadOptionsProps {
    processedImage: string;
    originalImage: string;
}

type Format = 'png' | 'jpg' | 'webp';

export function DownloadOptions({ processedImage, originalImage }: DownloadOptionsProps) {
    const [selectedFormat, setSelectedFormat] = useState<Format>('png');

    const handleDownload = async () => {
        try {
            // Fetch the processed image
            const response = await fetch(processedImage);
            const blob = await response.blob();

            // Create canvas to convert format if needed
            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);

            await new Promise((resolve) => {
                img.onload = resolve;
            });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            ctx.drawImage(img, 0, 0);

            // Convert to selected format
            canvas.toBlob((convertedBlob) => {
                if (!convertedBlob) return;

                const link = document.createElement('a');
                link.href = URL.createObjectURL(convertedBlob);
                link.download = `removed-bg.${selectedFormat}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, `image/${selectedFormat}`, selectedFormat === 'jpg' ? 0.95 : 1);

        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const formats: { value: Format; label: string; desc: string }[] = [
        { value: 'png', label: 'PNG', desc: 'Transparent' },
        { value: 'jpg', label: 'JPG', desc: 'Smaller size' },
        { value: 'webp', label: 'WebP', desc: 'Best quality' },
    ];

    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-3">
                    Export Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {formats.map((format) => (
                        <button
                            key={format.value}
                            onClick={() => setSelectedFormat(format.value)}
                            className={cn(
                                "p-3 rounded-lg border-2 transition-all text-center",
                                selectedFormat === format.value
                                    ? "border-purple-500 bg-purple-500/10 text-purple-400"
                                    : "border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-white"
                            )}
                        >
                            <div className="font-bold text-sm">{format.label}</div>
                            <div className="text-xs opacity-70">{format.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            <Button
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 font-semibold shadow-lg shadow-purple-900/20"
                onClick={handleDownload}
            >
                <Download className="w-4 h-4 mr-2" />
                Download {selectedFormat.toUpperCase()}
            </Button>
        </div>
    );
}
