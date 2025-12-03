/**
 * Sound Effects Manager
 * Handles all sound effects for the washing machine theme
 */

export class SoundManager {
    private static instance: SoundManager;
    private audioContext: AudioContext | null = null;
    private isMuted: boolean = false;
    private loopingOscillator: OscillatorNode | null = null;
    private loopingGain: GainNode | null = null;

    private constructor() {
        if (typeof window !== 'undefined') {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopLoop();
        }
        return this.isMuted;
    }

    private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
        if (this.isMuted || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Sound: Upload file
    playUpload() {
        this.playTone(800, 0.1);
        setTimeout(() => this.playTone(1000, 0.1), 100);
    }

    // Sound: Start washing
    playWashingStart() {
        this.playTone(400, 0.2);
        setTimeout(() => this.playTone(500, 0.2), 150);
        setTimeout(() => this.playTone(600, 0.3), 300);
    }

    // Sound: Washing cycle (continuous)
    playWashing() {
        if (this.isMuted || !this.audioContext) return;

        const frequencies = [200, 220, 200, 180];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'triangle'), i * 400);
        });
    }

    // Sound: Rinsing
    playRinsing() {
        if (this.isMuted || !this.audioContext) return;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playTone(600 + i * 50, 0.15), i * 200);
        }
    }

    // Sound: Spinning
    playSpinning() {
        if (this.isMuted || !this.audioContext) return;

        for (let i = 0; i < 8; i++) {
            setTimeout(() => this.playTone(300 + i * 100, 0.1, 'sawtooth'), i * 100);
        }
    }

    // Sound: Complete (success)
    playComplete() {
        this.playTone(523, 0.2); // C
        setTimeout(() => this.playTone(659, 0.2), 200); // E
        setTimeout(() => this.playTone(784, 0.4), 400); // G
    }

    // Sound: Error
    playError() {
        this.playTone(200, 0.3);
        setTimeout(() => this.playTone(150, 0.5), 300);
    }

    // Sound: Button click
    playClick() {
        this.playTone(1200, 0.05);
    }

    // Sound: Continuous spin loop (for processing)
    playLoop() {
        if (this.isMuted || !this.audioContext) return;

        // Stop any existing loop first
        this.stopLoop();

        // Create oscillator for continuous humming sound
        this.loopingOscillator = this.audioContext.createOscillator();
        this.loopingGain = this.audioContext.createGain();

        this.loopingOscillator.connect(this.loopingGain);
        this.loopingGain.connect(this.audioContext.destination);

        // Low frequency hum like a washing machine
        this.loopingOscillator.frequency.value = 180;
        this.loopingOscillator.type = 'triangle';

        // Moderate volume
        this.loopingGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);

        this.loopingOscillator.start();
    }

    // Sound: Stop the loop
    stopLoop() {
        if (this.loopingOscillator) {
            try {
                this.loopingOscillator.stop();
            } catch (e) {
                // Oscillator already stopped
            }
            this.loopingOscillator = null;
            this.loopingGain = null;
        }
    }
}

export const soundManager = SoundManager.getInstance();
