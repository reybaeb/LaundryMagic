'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle, Upload, Play, Download } from 'lucide-react';

export function PanduanDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Panduan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm p-0 overflow-hidden bg-transparent border-none shadow-none">
                {/* Accessibility Fix: Hidden Title & Description */}
                <DialogHeader className="sr-only">
                    <DialogTitle>Panduan Penggunaan</DialogTitle>
                    <DialogDescription>
                        Instruksi cara menggunakan aplikasi penghapus background.
                    </DialogDescription>
                </DialogHeader>

                {/* Laundry Tag Design */}
                <div className="bg-white relative mx-auto w-full max-w-[320px] shadow-2xl transform rotate-1">
                    {/* Tag Hole */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-600 z-20" />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] z-20" />
                    
                    {/* Stitching Effect */}
                    <div className="absolute top-0 left-0 right-0 h-12 border-b-2 border-dashed border-gray-300" />

                    <div className="pt-16 pb-8 px-6 flex flex-col items-center text-center">
                        <div className="mb-4">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase border-b-4 border-black pb-1">
                                CARA CUCI
                            </h2>
                            <p className="text-[10px] font-mono text-gray-500 mt-1 tracking-widest uppercase">
                                INSTRUKSI PENGGUNAAN
                            </p>
                        </div>

                        {/* Laundry Symbols Row */}
                        <div className="flex justify-center gap-4 mb-8 border-y border-gray-200 py-3 w-full">
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold">30°</span>
                                </div>
                                <span className="text-[8px] uppercase font-bold">Upload</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 border-2 border-black flex items-center justify-center">
                                    <div className="w-4 h-4 border border-black rounded-full" />
                                </div>
                                <span className="text-[8px] uppercase font-bold">Proses</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 border-2 border-black flex items-center justify-center relative">
                                    <div className="absolute top-0 left-0 w-full h-full border-t-2 border-black transform rotate-45" />
                                </div>
                                <span className="text-[8px] uppercase font-bold">Simpan</span>
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="space-y-6 w-full text-left">
                            <div className="flex gap-3">
                                <span className="font-black text-xl text-gray-300">01</span>
                                <div>
                                    <h3 className="font-bold text-sm uppercase">Masukkan Baju Kotor</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Tarik gambar ke kaca mesin cuci atau klik untuk memilih file.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="font-black text-xl text-gray-300">02</span>
                                <div>
                                    <h3 className="font-bold text-sm uppercase">Putar Knob</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Klik tombol putar (Knob) di panel atas untuk mulai mencuci.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="font-black text-xl text-gray-300">03</span>
                                <div>
                                    <h3 className="font-bold text-sm uppercase">Ambil Cucian</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Gambar bersih ada di keranjang kanan. Download PNG.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 border-t-2 border-black w-full text-center">
                            <p className="font-black text-lg uppercase tracking-widest">100% CLEAN</p>
                            <p className="text-[10px] text-gray-500">MADE WITH AI TECHNOLOGY</p>
                        </div>
                    </div>
                    
                    {/* Bottom Zigzag Cut */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-white" 
                         style={{ 
                             clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)',
                             transform: 'translateY(50%)'
                         }} 
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
