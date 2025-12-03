'use client';

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const BACKGROUND_OPTIONS = [
    { type: 'transparent', label: 'Transparent', color: 'bg-[url(/checkerboard.svg)]' }, // We'll need a checkerboard pattern
    { type: 'solid', label: 'White', color: 'bg-white' },
    { type: 'solid', label: 'Black', color: 'bg-black' },
    { type: 'solid', label: 'Gray', color: 'bg-gray-500' },
    { type: 'gradient', label: 'Blue Purple', color: 'bg-gradient-to-r from-blue-400 to-purple-500' },
    { type: 'gradient', label: 'Sunset', color: 'bg-gradient-to-r from-orange-400 to-pink-500' },
];

interface BackgroundOptionsProps {
    currentBackground: string;
    onBackgroundChange: (bg: string) => void;
}

export function BackgroundOptions({ currentBackground, onBackgroundChange }: BackgroundOptionsProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Background</h3>
            <div className="grid grid-cols-4 gap-3">
                {BACKGROUND_OPTIONS.map((bg) => (
                    <button
                        key={bg.label}
                        onClick={() => onBackgroundChange(bg.color)}
                        className={cn(
                            "relative h-12 rounded-lg border-2 transition-all overflow-hidden",
                            bg.color,
                            currentBackground === bg.color ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:border-muted-foreground/25"
                        )}
                        title={bg.label}
                    >
                        {currentBackground === bg.color && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
