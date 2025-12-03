'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Trash2 } from 'lucide-react';
import { PanduanDialog } from '@/components/panduan-dialog';
import { soundManager } from '@/lib/sound-manager';

export function Navbar() {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <nav className="h-14 border-b border-gray-200 bg-white/90 backdrop-blur-sm flex-shrink-0 transition-colors sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="LaundryMagic Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain bg-transparent"
              priority
            />
          </div>
          <span className="text-lg font-semibold text-gray-900">LaundryMagic</span>
        </div>

        <div className="flex items-center gap-2">
          <PanduanDialog />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (confirm('Hapus semua data dan reset aplikasi?')) {
                const { db } = await import('@/lib/db');
                const database = await db.getDB();
                await database.clear('images');
                window.location.reload();
              }
            }}
            className="w-9 h-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            title="Reset Aplikasi"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newMuted = soundManager.toggleMute();
              setIsMuted(newMuted);
            }}
            className="w-9 h-9 p-0"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
