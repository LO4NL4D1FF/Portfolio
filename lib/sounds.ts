// Soft cyberpunk UI sounds using Web Audio API.
// Short, filtered sine blips — no harsh square-wave chiptune.

class GameSounds {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private masterGain: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.masterGain = this.audioContext.createGain();
      // Global ceiling — keeps everything gentle
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.audioContext.destination);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  private ctx(): { ac: AudioContext; out: AudioNode } | null {
    if (!this.enabled || !this.audioContext || !this.masterGain) return null;
    // Some browsers start the context suspended — resume on first interaction
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return { ac: this.audioContext, out: this.masterGain };
  }

  /** Soft filtered sine blip — used for most UI interactions */
  private blip(freq: number, duration: number, gain: number, type: OscillatorType = 'sine') {
    const c = this.ctx();
    if (!c) return;
    const { ac, out } = c;
    const now = ac.currentTime;

    const osc = ac.createOscillator();
    const g = ac.createGain();
    const filter = ac.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.value = 2400;
    filter.Q.value = 0.7;

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gain, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(g);
    g.connect(out);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  /** Sine pitch sweep */
  private sweep(from: number, to: number, duration: number, gain: number) {
    const c = this.ctx();
    if (!c) return;
    const { ac, out } = c;
    const now = ac.currentTime;

    const osc = ac.createOscillator();
    const g = ac.createGain();
    const filter = ac.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), now + duration);

    filter.type = 'lowpass';
    filter.frequency.value = 3200;

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gain, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(g);
    g.connect(out);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  // ------- Public sounds -------

  playClick() {
    // Subtle, short tick — like a holo-UI tap
    this.blip(1800, 0.06, 0.08);
  }

  playSelect() {
    // Soft upward confirm
    this.sweep(700, 1100, 0.12, 0.07);
  }

  playHover() {
    // Very quiet pre-click tick — rarely used
    this.blip(900, 0.04, 0.03);
  }

  playOpen() {
    // Gentle rising uplink tone
    this.sweep(500, 900, 0.18, 0.08);
  }

  playClose() {
    // Gentle falling disconnect tone
    this.sweep(900, 500, 0.16, 0.07);
  }

  playSuccess() {
    // Small two-note confirm (no chiptune melody)
    this.blip(880, 0.09, 0.08);
    setTimeout(() => this.blip(1175, 0.14, 0.08), 90);
  }

  playStart() {
    // Short power-on: low rise + soft sparkle
    this.sweep(260, 720, 0.28, 0.09);
    setTimeout(() => this.blip(1320, 0.18, 0.06), 180);
  }
}

// Singleton
let gameSoundsInstance: GameSounds | null = null;

export const getGameSounds = () => {
  if (!gameSoundsInstance) {
    gameSoundsInstance = new GameSounds();
  }
  return gameSoundsInstance;
};

export default GameSounds;
