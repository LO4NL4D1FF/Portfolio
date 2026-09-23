// Procedural sound engine. Every sound in the game is synthesised here with the
// Web Audio API: no audio files are shipped. Spatial sounds use HRTF panning and
// a low-pass "occlusion" filter so things behind walls sound muffled.

const SR_FALLBACK = 44100;

function rand(a, b) { return a + Math.random() * (b - a); }

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ready = false;
    this.buffers = {};
    this.voices = new Set();
    this.volumes = { master: 0.9, sfx: 1, ambience: 1 };
    this.listenerPos = { x: 0, y: 1.6, z: 0 };
    this.occlusion = null; // (x,y,z) => number of walls between listener and point
    this.fear = 0;
    this.muffled = 0; // 0..1, used while hiding
  }

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC({ latencyHint: 'interactive' });
    this.ctx = ctx;
    this.sr = ctx.sampleRate || SR_FALLBACK;

    this.master = ctx.createGain();
    this.master.gain.value = this.volumes.master;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 12; comp.ratio.value = 4;
    comp.attack.value = 0.004; comp.release.value = 0.25;
    this.hideFilter = ctx.createBiquadFilter();
    this.hideFilter.type = 'lowpass'; this.hideFilter.frequency.value = 20000;
    this.master.connect(this.hideFilter); this.hideFilter.connect(comp); comp.connect(ctx.destination);

    this.sfx = ctx.createGain(); this.sfx.connect(this.master);
    this.amb = ctx.createGain(); this.amb.connect(this.master);
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.makeImpulse(2.8, 2.6);
    this.reverbSend = ctx.createGain(); this.reverbSend.gain.value = 0.55;
    this.reverbSend.connect(this.reverb); this.reverb.connect(this.master);

    this.noise = this.makeNoise('white', 3);
    this.pink = this.makeNoise('pink', 4);
    this.brown = this.makeNoise('brown', 4);
    this.buildBuffers();
    this.startAmbience();
    this.ready = true;
    this.decodeSamples();
  }

  setVolume(kind, v) {
    this.volumes[kind] = v;
    if (!this.ctx) return;
    if (kind === 'master') this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  // ---------- buffer synthesis helpers ----------
  makeImpulse(seconds, decay) {
    const len = Math.floor(this.sr * seconds);
    const buf = this.ctx.createBuffer(2, len, this.sr);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        // early reflections then a dense diffuse tail
        const er = i < this.sr * 0.08 && Math.random() < 0.004 ? rand(-1, 1) * 2 : 0;
        d[i] = (er + (Math.random() * 2 - 1)) * Math.pow(1 - t, decay) * (t < 0.002 ? t / 0.002 : 1);
      }
    }
    return buf;
  }

  makeNoise(kind, seconds) {
    const len = Math.floor(this.sr * seconds);
    const buf = this.ctx.createBuffer(1, len, this.sr);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'white') d[i] = w;
      else if (kind === 'pink') {
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      } else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    }
    return buf;
  }

  // Render a mono buffer from a per-sample function.
  synth(seconds, fn) {
    const len = Math.max(1, Math.floor(this.sr * seconds));
    const buf = this.ctx.createBuffer(1, len, this.sr);
    const d = buf.getChannelData(0);
    fn(d, this.sr, len);
    // normalise
    let peak = 0;
    for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(d[i]));
    if (peak > 0) for (let i = 0; i < len; i++) d[i] /= peak;
    return buf;
  }

  // Modal "stick-slip" creak: a train of impulses exciting wood resonances.
  makeCreak(seconds, baseRate, modes) {
    return this.synth(seconds, (d, sr, len) => {
      const res = modes.map(f => ({ f: f * rand(0.93, 1.07), y1: 0, y2: 0 }));
      for (const m of res) {
        const r = Math.exp(-Math.PI * (m.f / 18) / sr);
        m.a1 = 2 * r * Math.cos(2 * Math.PI * m.f / sr); m.a2 = -r * r;
      }
      let phase = 0;
      const wob = rand(0.5, 2.5), wob2 = rand(3, 7);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        const env = Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 0.7;
        const rate = baseRate * (0.55 + 0.9 * t + 0.35 * Math.sin(t * wob * 6.28) + 0.12 * Math.sin(t * wob2 * 6.28));
        phase += rate / sr;
        let x = 0;
        if (phase >= 1) { phase -= 1; x = (0.6 + Math.random() * 0.8) * env; }
        x += (Math.random() * 2 - 1) * 0.015 * env;
        let out = 0;
        for (const m of res) {
          const y = x + m.a1 * m.y1 + m.a2 * m.y2;
          m.y2 = m.y1; m.y1 = y; out += y;
        }
        d[i] = out;
      }
    });
  }

  makeThud(seconds, freq, noiseAmt, bright = 800) {
    return this.synth(seconds, (d, sr, len) => {
      let lp = 0; const k = Math.exp(-2 * Math.PI * bright / sr);
      let ph = 0;
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        const f = freq * (1 + 1.6 * Math.exp(-t * 40));
        ph += 2 * Math.PI * f / sr;
        const n = Math.random() * 2 - 1;
        lp = lp * k + n * (1 - k);
        d[i] = Math.sin(ph) * Math.exp(-t * 18) + lp * noiseAmt * Math.exp(-t * 30);
      }
    });
  }

  makeTine(freq, seconds, bright = 1) {
    return this.synth(seconds, (d, sr, len) => {
      const parts = [[1, 1, 3.2], [2.756, 0.35 * bright, 9], [5.404, 0.18 * bright, 16], [8.93, 0.06 * bright, 26]];
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        let s = 0;
        for (const [m, a, dec] of parts) s += a * Math.sin(2 * Math.PI * freq * m * t) * Math.exp(-t * dec);
        d[i] = s * (t < 0.002 ? t / 0.002 : 1);
      }
    });
  }

  makePiano(freq, seconds) {
    return this.synth(seconds, (d, sr, len) => {
      const B = 0.0004;
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        let s = 0;
        for (let n = 1; n <= 9; n++) {
          const fn = freq * n * Math.sqrt(1 + B * n * n);
          const det = 1 + (n % 2 ? 0.0009 : -0.0007);
          s += (1 / n ** 1.1) * (Math.sin(2 * Math.PI * fn * t) + 0.6 * Math.sin(2 * Math.PI * fn * det * t)) * Math.exp(-t * (0.8 + n * 0.55));
        }
        const hammer = (Math.random() * 2 - 1) * Math.exp(-t * 90) * 0.4;
        d[i] = s + hammer;
      }
    });
  }

  // Formant voice: a sawtooth glottal source through vowel formants.
  makeVoice(seconds, f0, contour, vowels, rough = 0.3, breath = 0.2) {
    const table = { a: [800, 1150, 2900], o: [450, 800, 2830], u: [325, 700, 2530], e: [400, 1600, 2700], i: [300, 2200, 3000], h: [600, 1400, 2500] };
    return this.synth(seconds, (d, sr, len) => {
      const fs = [0, 1, 2].map(() => ({ y1: 0, y2: 0 }));
      let ph = 0, jit = 0;
      for (let i = 0; i < len; i++) {
        const t = i / len;
        const vi = Math.min(vowels.length - 1, Math.floor(t * vowels.length));
        const vj = Math.min(vowels.length - 1, vi + 1);
        const frac = t * vowels.length - vi;
        const va = table[vowels[vi]], vb = table[vowels[vj]];
        jit += (Math.random() * 2 - 1) * 0.02; jit *= 0.995;
        const f = f0 * contour(t) * (1 + jit * rough + 0.012 * Math.sin(i / sr * 2 * Math.PI * 5.5));
        ph += f / sr; if (ph > 1) ph -= 1;
        const src = (2 * ph - 1) * (1 - breath) + (Math.random() * 2 - 1) * breath;
        const env = Math.min(1, t * 12) * Math.min(1, (1 - t) * 6);
        let out = 0;
        for (let k = 0; k < 3; k++) {
          const fc = va[k] + (vb[k] - va[k]) * frac;
          const bw = 80 + k * 60;
          const r = Math.exp(-Math.PI * bw / sr);
          const a1 = 2 * r * Math.cos(2 * Math.PI * fc / sr), a2 = -r * r;
          const y = src * (1 - r) + a1 * fs[k].y1 + a2 * fs[k].y2;
          fs[k].y2 = fs[k].y1; fs[k].y1 = y; out += y * (k === 0 ? 1 : 0.7 / k);
        }
        d[i] = Math.tanh(out * (1 + rough * 4)) * env;
      }
    });
  }

  buildBuffers() {
    const B = this.buffers;
    B.creakShort = [0, 1, 2, 3].map(() => this.makeCreak(rand(0.25, 0.5), rand(60, 140), [420, 980, 1850, 3100]));
    B.creakDoor = [0, 1, 2].map(() => this.makeCreak(rand(0.9, 1.5), rand(25, 60), [310, 760, 1490, 2600]));
    B.creakFloor = [0, 1, 2].map(() => this.makeCreak(rand(0.5, 0.9), rand(20, 45), [180, 460, 920]));
    B.stepWood = [0, 1, 2, 3, 4].map(() => this.makeThud(0.22, rand(80, 110), 0.9, rand(700, 1100)));
    B.stepTile = [0, 1, 2, 3].map(() => this.makeThud(0.16, rand(140, 180), 1.4, rand(2500, 3500)));
    B.stepSoft = [0, 1, 2].map(() => this.makeThud(0.2, rand(70, 90), 0.8, rand(350, 500)));
    B.stepHeavy = [0, 1, 2].map(() => this.makeThud(0.4, rand(55, 70), 1.2, 500));
    B.thud = this.makeThud(0.9, 48, 1.5, 700);
    B.slam = this.synth(2.2, (d, sr, len) => {
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / sr; const n = Math.random() * 2 - 1; lp = lp * 0.96 + n * 0.04;
        d[i] = Math.sin(2 * Math.PI * 42 * t * (1 + Math.exp(-t * 20))) * Math.exp(-t * 4) * 1.2 + lp * 4 * Math.exp(-t * 9) + n * 0.4 * Math.exp(-t * 60);
      }
    });
    B.latch = this.synth(0.12, (d, sr, len) => {
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        d[i] = (Math.sin(2 * Math.PI * 2300 * t) * 0.6 + Math.sin(2 * Math.PI * 3900 * t) * 0.4) * Math.exp(-t * 60) + (Math.random() * 2 - 1) * Math.exp(-t * 200) * 0.6 + (t > 0.05 ? Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-(t - 0.05) * 80) * 0.5 : 0);
      }
    });
    B.rattle = this.synth(0.7, (d, sr, len) => {
      const hits = [0, 0.07, 0.15, 0.21, 0.33, 0.4, 0.52];
      for (let i = 0; i < len; i++) {
        const t = i / sr; let s = 0;
        for (const h of hits) if (t > h) { const u = t - h; s += (Math.sin(2 * Math.PI * 1700 * u) * 0.5 + (Math.random() * 2 - 1) * 0.5 + Math.sin(2 * Math.PI * 110 * u) * 1.2) * Math.exp(-u * 45); }
        d[i] = s;
      }
    });
    B.keys = this.synth(0.6, (d, sr, len) => {
      const hits = [0, 0.05, 0.11, 0.2];
      for (let i = 0; i < len; i++) {
        const t = i / sr; let s = 0;
        for (const h of hits) if (t > h) { const u = t - h; s += (Math.sin(2 * Math.PI * 3200 * u) + 0.7 * Math.sin(2 * Math.PI * 4710 * u) + 0.4 * Math.sin(2 * Math.PI * 6900 * u)) * Math.exp(-u * 30); }
        d[i] = s;
      }
    });
    B.paper = this.synth(0.7, (d, sr, len) => {
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / len; const n = Math.random() * 2 - 1;
        lp = lp * 0.6 + n * 0.4;
        const crackle = Math.random() < 0.004 ? rand(-1, 1) * 3 : 0;
        d[i] = (n - lp + crackle) * Math.sin(Math.PI * t) * (0.5 + 0.5 * Math.sin(t * 40));
      }
    });
    B.click = this.synth(0.05, (d, sr, len) => { for (let i = 0; i < len; i++) { const t = i / sr; d[i] = (Math.random() * 2 - 1) * Math.exp(-t * 400) + Math.sin(2 * Math.PI * 3000 * t) * Math.exp(-t * 300) * 0.5; } });
    B.beep = this.synth(0.12, (d, sr, len) => { for (let i = 0; i < len; i++) { const t = i / sr; d[i] = Math.sin(2 * Math.PI * 1320 * t) * Math.min(1, t * 400) * Math.min(1, (0.12 - t) * 60); } });
    B.denied = this.synth(0.4, (d, sr, len) => { for (let i = 0; i < len; i++) { const t = i / sr; d[i] = Math.sign(Math.sin(2 * Math.PI * 180 * t)) * 0.5 * Math.min(1, (0.4 - t) * 20); } });
    B.clunk = this.synth(0.8, (d, sr, len) => {
      for (let i = 0; i < len; i++) { const t = i / sr; d[i] = Math.sin(2 * Math.PI * 70 * t) * Math.exp(-t * 9) + (Math.random() * 2 - 1) * Math.exp(-t * 50) * 0.8 + Math.sin(2 * Math.PI * 520 * t) * Math.exp(-t * 25) * 0.3; }
    });
    B.zap = this.synth(0.5, (d, sr, len) => {
      for (let i = 0; i < len; i++) { const t = i / sr; const gate = Math.random() < 0.3 ? 1 : 0; d[i] = ((Math.random() * 2 - 1) * gate + Math.sign(Math.sin(2 * Math.PI * 120 * t)) * 0.4) * Math.exp(-t * 7); }
    });
    B.hum = this.synth(2, (d, sr, len) => {
      for (let i = 0; i < len; i++) { const t = i / sr; d[i] = Math.sin(2 * Math.PI * 60 * t) * 0.6 + Math.sin(2 * Math.PI * 120 * t) * 0.3 + Math.sin(2 * Math.PI * 180 * t) * 0.15 + (Math.random() * 2 - 1) * 0.02; }
    });
    B.tick = this.synth(0.06, (d, sr, len) => { for (let i = 0; i < len; i++) { const t = i / sr; d[i] = (Math.sin(2 * Math.PI * 2100 * t) + (Math.random() * 2 - 1) * 0.6) * Math.exp(-t * 120); } });
    B.tock = this.synth(0.08, (d, sr, len) => { for (let i = 0; i < len; i++) { const t = i / sr; d[i] = (Math.sin(2 * Math.PI * 1500 * t) + (Math.random() * 2 - 1) * 0.5) * Math.exp(-t * 90); } });
    B.chime = this.synth(6, (d, sr, len) => {
      for (let i = 0; i < len; i++) { const t = i / sr; let s = 0; for (const [f, a, k] of [[220, 1, 0.7], [440 * 1.01, 0.5, 1.2], [659, 0.4, 1.6], [1187, 0.25, 2.5]]) s += a * Math.sin(2 * Math.PI * f * t) * Math.exp(-t * k); d[i] = s; }
    });
    B.ring = this.synth(2.0, (d, sr, len) => {
      for (let i = 0; i < len; i++) {
        const t = i / sr; const gate = Math.sin(2 * Math.PI * 20 * t) > 0 ? 1 : 0.15;
        const on = (t % 1.0) < 0.42 || (t > 0.55 && t < 0.97) ? 1 : 0;
        d[i] = (Math.sin(2 * Math.PI * 440 * t) + Math.sin(2 * Math.PI * 480 * t) + 0.3 * Math.sin(2 * Math.PI * 1310 * t)) * gate * on;
      }
    });
    B.static = this.synth(1.5, (d, sr, len) => {
      for (let i = 0; i < len; i++) { const n = Math.random() * 2 - 1; d[i] = n * (Math.random() < 0.02 ? 1.5 : 0.5); }
    });
    B.squelch = this.synth(0.25, (d, sr, len) => { for (let i = 0; i < len; i++) { const t = i / sr; d[i] = (Math.random() * 2 - 1) * Math.exp(-t * 15) + Math.sin(2 * Math.PI * 1000 * t) * 0.3 * (t < 0.05 ? 1 : 0); } });
    B.thunder = [0, 1].map(() => this.synth(rand(5, 7), (d, sr, len) => {
      let lp = 0, lp2 = 0;
      const cracks = [0, rand(0.1, 0.3), rand(0.4, 0.9), rand(1, 2)];
      for (let i = 0; i < len; i++) {
        const t = i / sr; const n = Math.random() * 2 - 1;
        lp = lp * 0.985 + n * 0.015; lp2 = lp2 * 0.9 + n * 0.1;
        let rumble = lp * 18 * (Math.exp(-t * 0.55)) * (0.7 + 0.3 * Math.sin(t * 7 + Math.sin(t * 2.3) * 3));
        let crack = 0; for (const c of cracks) if (t > c) crack += lp2 * 2.5 * Math.exp(-(t - c) * 6);
        d[i] = rumble + crack * (t < 0.02 ? t / 0.02 : 1);
      }
    }));
    // a close lightning strike: a tearing crack that splits into a boom
    B.crack = this.synth(3.5, (d, sr, len) => {
      let lp = 0, hp = 0, prev = 0;
      for (let i = 0; i < len; i++) {
        const t = i / sr; const n = Math.random() * 2 - 1;
        hp = 0.7 * (hp + n - prev); prev = n; lp = lp * 0.995 + n * 0.005;
        const tear = t < 0.35 ? hp * (0.5 + 0.5 * Math.sin(t * 90 + Math.sin(t * 13) * 4)) * Math.exp(-t * 6) : 0;
        d[i] = tear * 1.4 + lp * 26 * Math.exp(-t * 0.9) * Math.min(1, t * 20) + n * 0.8 * Math.exp(-t * 40);
      }
    });
    // raindrops on glass, sills and leaves
    B.patter = this.synth(4, (d, sr, len) => {
      const drops = Math.floor(4 * 260);
      for (let k = 0; k < drops; k++) {
        const at = Math.floor(Math.random() * len), f = rand(1800, 6000), a = rand(0.1, 1), dec = rand(250, 600);
        for (let i = 0; i < 600 && at + i < len; i++) { const t = i / sr; d[at + i] += Math.sin(2 * Math.PI * f * t * (1 - t * 3)) * Math.exp(-t * dec) * a; }
      }
    });
    // creature
    B.breath = this.synth(3.2, (d, sr, len) => {
      let lp = 0, bp1 = 0, bp2 = 0;
      for (let i = 0; i < len; i++) {
        const t = i / sr; const n = Math.random() * 2 - 1;
        lp = lp * 0.7 + n * 0.3;
        bp2 = bp1; bp1 = lp;
        const inhale = t < 1.2 ? Math.sin(Math.PI * t / 1.2) ** 2 * 0.6 : 0;
        const exhale = t > 1.5 && t < 3.0 ? Math.sin(Math.PI * (t - 1.5) / 1.5) ** 1.5 : 0;
        const rasp = 1 + 0.7 * Math.sin(2 * Math.PI * 38 * t) * (exhale > 0 ? 1 : 0.3);
        d[i] = (lp - bp2 * 0.5) * (inhale + exhale) * rasp;
      }
    });
    B.groan = [0, 1, 2].map(() => this.makeVoice(rand(1.8, 2.8), rand(75, 100), t => 1 + 0.25 * Math.sin(t * 3.14) - t * 0.3, ['u', 'o', 'a', 'o'], 0.8, 0.25));
    B.scream = this.makeVoice(1.9, 420, t => 0.7 + t * 0.6 + 0.1 * Math.sin(t * 60), ['a', 'a', 'e', 'a'], 1.4, 0.4);
    B.screamLow = this.makeVoice(1.9, 210, t => 0.75 + t * 0.45, ['a', 'o', 'a'], 1.2, 0.35);
    B.cry = [0, 1].map(() => this.makeVoice(rand(1.0, 1.5), rand(440, 520), t => 1 + 0.25 * Math.sin(Math.PI * t) - 0.2 * t, ['e', 'a', 'a', 'h'], 0.25, 0.1));
    B.whisper = [0, 1, 2, 3].map(() => this.synth(rand(0.9, 1.6), (d, sr, len) => {
      const table = [[700, 1800], [350, 2300], [500, 900], [300, 2600], [600, 1400]];
      const seq = Array.from({ length: 8 }, () => table[Math.floor(Math.random() * table.length)]);
      const fs = [{ y1: 0, y2: 0 }, { y1: 0, y2: 0 }];
      for (let i = 0; i < len; i++) {
        const t = i / len; const si = Math.min(seq.length - 1, Math.floor(t * seq.length));
        const n = Math.random() * 2 - 1; let out = 0;
        for (let k = 0; k < 2; k++) {
          const fc = seq[si][k]; const r = Math.exp(-Math.PI * 180 / sr);
          const y = n * (1 - r) + 2 * r * Math.cos(2 * Math.PI * fc / sr) * fs[k].y1 - r * r * fs[k].y2;
          fs[k].y2 = fs[k].y1; fs[k].y1 = y; out += y;
        }
        const syll = Math.abs(Math.sin(t * Math.PI * seq.length)) ** 0.6;
        const s = (n * 0.15 + out) * syll * Math.sin(Math.PI * t);
        d[i] = Math.random() < 0.0006 ? s * 3 : s;
      }
    }));
    B.bones = this.synth(0.5, (d, sr, len) => {
      const hits = Array.from({ length: 7 }, () => rand(0, 0.4));
      for (let i = 0; i < len; i++) { const t = i / sr; let s = 0; for (const h of hits) if (t > h) { const u = t - h; s += (Math.random() * 2 - 1) * Math.exp(-u * 300) + Math.sin(2 * Math.PI * 900 * u) * Math.exp(-u * 150) * 0.5; } d[i] = s; }
    });
    B.claw = [0, 1, 2, 3].map(() => this.synth(0.09, (d, sr, len) => {
      const f = rand(1800, 3200);
      for (let i = 0; i < len; i++) { const t = i / sr; d[i] = (Math.random() * 2 - 1) * Math.exp(-t * 260) + Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 120) * 0.6 + Math.sin(2 * Math.PI * 140 * t) * Math.exp(-t * 60) * 0.5; }
    }));
    B.slither = this.synth(2.5, (d, sr, len) => {
      let lp = 0;
      for (let i = 0; i < len; i++) { const t = i / sr; const n = Math.random() * 2 - 1; lp = lp * 0.55 + n * 0.45; d[i] = (n - lp) * (0.55 + 0.45 * Math.sin(2 * Math.PI * 1.6 * t) ** 2); }
    });
    B.hiss = this.synth(1.6, (d, sr, len) => {
      let lp = 0;
      for (let i = 0; i < len; i++) { const t = i / len; const n = Math.random() * 2 - 1; lp = lp * 0.3 + n * 0.7; d[i] = (n - lp * 0.5) * Math.min(1, t * 8) * Math.pow(1 - t, 1.2); }
    });
    B.drag = this.synth(1.4, (d, sr, len) => {
      let lp = 0;
      for (let i = 0; i < len; i++) { const t = i / len; const n = Math.random() * 2 - 1; lp = lp * 0.92 + n * 0.08; d[i] = lp * Math.sin(Math.PI * t) * (0.6 + 0.4 * Math.sin(t * 30)); }
    });
    B.stinger = this.synth(3.2, (d, sr, len) => {
      const fs = [98, 103.8, 138.6, 146.8, 277, 293.7, 587, 622];
      let lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / sr; let s = 0;
        for (const f of fs) s += Math.sign(Math.sin(2 * Math.PI * f * t * (1 + 0.003 * Math.sin(t * 11)))) * 0.12;
        const n = Math.random() * 2 - 1; lp = lp * 0.9 + n * 0.1;
        const env = Math.min(1, t * 60) * Math.exp(-t * 1.1);
        d[i] = Math.tanh((s + lp * 2 + Math.sin(2 * Math.PI * 38 * t) * 1.5 * Math.exp(-t * 3)) * env * 1.5);
      }
    });
    B.jumpscare = this.synth(2.6, (d, sr, len) => {
      const fs = [110, 116.5, 155.6, 233, 246.9, 466, 494, 932, 988, 1397];
      for (let i = 0; i < len; i++) {
        const t = i / sr; let s = 0;
        for (const f of fs) { const ff = f * (1 + t * 0.35); s += Math.sin(2 * Math.PI * ff * t + Math.sin(2 * Math.PI * 7 * t) * 3) * 0.2; }
        const n = (Math.random() * 2 - 1);
        d[i] = Math.tanh((s + n * 0.9) * 3) * Math.min(1, t * 200) * Math.exp(-t * 0.9);
      }
    });
    B.flashlight = this.synth(0.08, (d, sr, len) => { for (let i = 0; i < len; i++) { const t = i / sr; d[i] = (Math.random() * 2 - 1) * Math.exp(-t * 250) + Math.sin(2 * Math.PI * 2600 * t) * Math.exp(-t * 200) * 0.7 + (t > 0.03 ? Math.sin(2 * Math.PI * 1900 * (t - 0.03)) * Math.exp(-(t - 0.03) * 250) * 0.5 : 0); } });
    B.inhale = this.synth(0.9, (d, sr, len) => { let lp = 0; for (let i = 0; i < len; i++) { const t = i / len; const n = Math.random() * 2 - 1; lp = lp * 0.5 + n * 0.5; d[i] = (n - lp) * Math.sin(Math.PI * t) ** 2; } });
    B.exhale = this.synth(1.1, (d, sr, len) => { let lp = 0; for (let i = 0; i < len; i++) { const t = i / len; const n = Math.random() * 2 - 1; lp = lp * 0.8 + n * 0.2; d[i] = lp * Math.sin(Math.PI * Math.min(1, t * 1.4)) ** 1.5; } });
    B.heart = this.synth(0.5, (d, sr, len) => {
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        const beat = (u) => u > 0 ? Math.sin(2 * Math.PI * (55 - u * 60) * u) * Math.exp(-u * 22) : 0;
        d[i] = beat(t) + 0.75 * beat(t - 0.22);
      }
    });
    B.drip = [0, 1, 2].map(() => this.synth(0.25, (d, sr, len) => { const f = rand(900, 1600); for (let i = 0; i < len; i++) { const t = i / sr; d[i] = Math.sin(2 * Math.PI * f * (1 + t * 3) * t) * Math.exp(-t * 30); } }));
    B.knock = this.synth(1.6, (d, sr, len) => {
      const hits = [0, 0.38, 0.76];
      for (let i = 0; i < len; i++) { const t = i / sr; let s = 0; for (const h of hits) if (t > h) { const u = t - h; s += Math.sin(2 * Math.PI * 120 * u) * Math.exp(-u * 35) + (Math.random() * 2 - 1) * Math.exp(-u * 120) * 0.5; } d[i] = s; }
    });
    B.glass = this.synth(1.5, (d, sr, len) => {
      const fs = Array.from({ length: 14 }, () => [rand(2000, 7000), rand(0, 0.3)]);
      for (let i = 0; i < len; i++) { const t = i / sr; let s = (Math.random() * 2 - 1) * Math.exp(-t * 25) * 0.6; for (const [f, o] of fs) if (t > o) s += Math.sin(2 * Math.PI * f * (t - o)) * Math.exp(-(t - o) * 9) * 0.2; d[i] = s; }
    });
    B.cloth = this.synth(0.5, (d, sr, len) => { let lp = 0; for (let i = 0; i < len; i++) { const t = i / len; const n = Math.random() * 2 - 1; lp = lp * 0.85 + n * 0.15; d[i] = lp * Math.sin(Math.PI * t); } });
    B.pianoNotes = {};
    for (const [n, f] of Object.entries({ A2: 110, D3: 146.83, Eb3: 155.56, A3: 220, Bb3: 233.08, E4: 329.63, F4: 349.23 })) B.pianoNotes[n] = this.makePiano(f, 4);
    // music box tines for the lullaby (A minor)
    const noteF = n => 440 * Math.pow(2, (n - 69) / 12);
    B.tines = {};
    for (const m of [64, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84]) B.tines[m] = this.makeTine(noteF(m + 12), 2.2);
  }

  // ---------- playback ----------
  now() { return this.ctx ? this.ctx.currentTime : 0; }

  // Plays a buffer. opts: {pos, gain, rate, reverb, bus, loop, detune, lowpass, when}
  play(buf, opts = {}) {
    if (!this.ready || !buf) return null;
    if (Array.isArray(buf)) buf = buf[Math.floor(Math.random() * buf.length)];
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = !!opts.loop;
    src.playbackRate.value = opts.rate || 1;
    if (opts.detune) src.detune.value = opts.detune;
    const g = ctx.createGain(); g.gain.value = opts.gain ?? 1;
    let node = src;
    let filter = null;
    if (opts.lowpass || opts.pos) {
      filter = ctx.createBiquadFilter(); filter.type = 'lowpass';
      filter.frequency.value = opts.lowpass || 20000; node.connect(filter); node = filter;
    }
    let panner = null;
    if (opts.pos) {
      panner = ctx.createPanner();
      panner.panningModel = 'HRTF'; panner.distanceModel = 'inverse';
      panner.refDistance = opts.ref || 1.4; panner.rolloffFactor = opts.rolloff || 1.3; panner.maxDistance = 60;
      this.setPannerPos(panner, opts.pos);
      node.connect(panner); node = panner;
      if (this.occlusion) {
        const occ = this.occlusion(opts.pos.x, opts.pos.y, opts.pos.z);
        filter.frequency.value = Math.min(opts.lowpass || 20000, occ > 0 ? 2200 / occ : 20000);
        g.gain.value *= occ > 0 ? Math.max(0.35, 1 - occ * 0.22) : 1;
      }
    }
    node.connect(g);
    g.connect(opts.bus === 'amb' ? this.amb : this.sfx);
    if (opts.reverb !== 0) {
      const rs = ctx.createGain(); rs.gain.value = opts.reverb ?? 0.35; g.connect(rs); rs.connect(this.reverbSend);
    }
    src.start(opts.when ? ctx.currentTime + opts.when : ctx.currentTime);
    const voice = { src, g, panner, filter, stop: (fade = 0.05) => { try { g.gain.setTargetAtTime(0, ctx.currentTime, fade); src.stop(ctx.currentTime + fade * 6); } catch (e) { /* already stopped */ } } };
    if (opts.loop) this.voices.add(voice);
    src.onended = () => this.voices.delete(voice);
    return voice;
  }

  setPannerPos(p, pos) {
    if (p.positionX) { const t = this.ctx.currentTime; p.positionX.setTargetAtTime(pos.x, t, 0.03); p.positionY.setTargetAtTime(pos.y, t, 0.03); p.positionZ.setTargetAtTime(pos.z, t, 0.03); }
    else p.setPosition(pos.x, pos.y, pos.z);
  }

  updateVoicePos(voice, pos) {
    if (!voice || !voice.panner) return;
    this.setPannerPos(voice.panner, pos);
    if (this.occlusion && voice.filter) {
      const occ = this.occlusion(pos.x, pos.y, pos.z);
      voice.filter.frequency.setTargetAtTime(occ > 0 ? 2200 / occ : 18000, this.ctx.currentTime, 0.1);
    }
  }

  setListener(pos, fwd, up) {
    if (!this.ready) return;
    this.listenerPos = pos;
    const L = this.ctx.listener; const t = this.ctx.currentTime;
    if (L.positionX) {
      L.positionX.setTargetAtTime(pos.x, t, 0.02); L.positionY.setTargetAtTime(pos.y, t, 0.02); L.positionZ.setTargetAtTime(pos.z, t, 0.02);
      L.forwardX.setTargetAtTime(fwd.x, t, 0.02); L.forwardY.setTargetAtTime(fwd.y, t, 0.02); L.forwardZ.setTargetAtTime(fwd.z, t, 0.02);
      L.upX.setTargetAtTime(up.x, t, 0.02); L.upY.setTargetAtTime(up.y, t, 0.02); L.upZ.setTargetAtTime(up.z, t, 0.02);
    } else { L.setPosition(pos.x, pos.y, pos.z); L.setOrientation(fwd.x, fwd.y, fwd.z, up.x, up.y, up.z); }
  }

  // ---------- ambience ----------
  loopNoise(buf, filterType, freq, q, gain, bus = 'amb') {
    const ctx = this.ctx;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    src.playbackRate.value = rand(0.95, 1.05);
    const f = ctx.createBiquadFilter(); f.type = filterType; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = gain;
    src.connect(f); f.connect(g); g.connect(bus === 'amb' ? this.amb : this.sfx);
    src.start(ctx.currentTime + Math.random() * 0.1);
    return { src, f, g };
  }

  startAmbience() {
    const ctx = this.ctx;
    // House room tone: low rumble + beating drones.
    this.roomTone = this.loopNoise(this.brown, 'lowpass', 160, 0.5, 0.22);
    this.drones = [];
    for (const [f, gv] of [[55, 0.05], [58.27, 0.04], [82.4, 0.018], [110.8, 0.01]]) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = gv; o.connect(g); g.connect(this.amb); o.start();
      this.drones.push({ o, g, base: gv });
    }
    // Wind
    this.wind = this.loopNoise(this.pink, 'bandpass', 380, 0.9, 0.12);
    this.wind2 = this.loopNoise(this.pink, 'bandpass', 900, 3.5, 0.03);
    // Rain: separate outdoor (bright) and indoor (dull roof patter) layers.
    this.rainOut = this.loopNoise(this.noise, 'highpass', 900, 0.4, 0.0);
    this.rainIn = this.loopNoise(this.pink, 'lowpass', 1300, 0.6, 0.14);
    this.patter = this.loopNoise(this.buffers.patter, 'highpass', 900, 0.5, 0.1);
    // Tension: detuned saw pad that rises with fear.
    this.tension = [];
    const tg = ctx.createGain(); tg.gain.value = 0; const tf = ctx.createBiquadFilter(); tf.type = 'lowpass'; tf.frequency.value = 600; tf.Q.value = 4;
    tf.connect(tg); tg.connect(this.amb); const trs = ctx.createGain(); trs.gain.value = 0.5; tg.connect(trs); trs.connect(this.reverbSend);
    for (const f of [73.4, 77.8, 110, 116.5, 155.6, 164.8]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = rand(-12, 12);
      const lfo = ctx.createOscillator(); lfo.frequency.value = rand(0.05, 0.2); const lg = ctx.createGain(); lg.gain.value = 8;
      lfo.connect(lg); lg.connect(o.detune); lfo.start();
      o.connect(tf); o.start();
    }
    this.tensionGain = tg; this.tensionFilter = tf;
    // High string cluster used during chases.
    const cg = ctx.createGain(); cg.gain.value = 0; cg.connect(this.amb);
    for (const f of [1760, 1864.7, 1975.5, 2093]) {
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
      const trem = ctx.createOscillator(); trem.frequency.value = rand(9, 13); const tgn = ctx.createGain(); tgn.gain.value = 0.5;
      const og = ctx.createGain(); og.gain.value = 0.5; trem.connect(tgn); tgn.connect(og.gain); trem.start();
      o.connect(og); og.connect(cg); o.start();
    }
    this.chaseGain = cg;
    this.nextHeart = 0; this.nextWindGust = 0; this.nextDrip = 2; this.nextCreak = 6;
  }

  // Called every frame with world state for ambience mixing.
  update(dt, state) {
    if (!this.ready) return;
    const t = this.ctx.currentTime;
    const fear = Math.max(0, Math.min(1, state.fear));
    this.fear = fear;
    this.tensionGain.gain.setTargetAtTime(0.004 + fear * 0.05, t, 0.6);
    this.tensionFilter.frequency.setTargetAtTime(300 + fear * 1600, t, 0.5);
    this.chaseGain.gain.setTargetAtTime(state.chase ? 0.018 : 0, t, state.chase ? 0.3 : 1.5);
    const outside = state.outside ? 1 : 0;
    this.rainOut.g.gain.setTargetAtTime(0.03 + outside * 0.22, t, 0.4);
    this.rainIn.g.gain.setTargetAtTime(0.12 - outside * 0.05, t, 0.4);
    this.patter.g.gain.setTargetAtTime(0.09 + outside * 0.25, t, 0.4);
    this.patter.f.frequency.setTargetAtTime(outside ? 700 : 1600, t, 0.4);
    this.hideFilter.frequency.setTargetAtTime(this.muffled ? 900 : 20000, t, 0.15);
    // Wind gusts
    this.nextWindGust -= dt;
    if (this.nextWindGust <= 0) {
      this.nextWindGust = rand(3, 9);
      const g = rand(0.06, 0.22) * (0.5 + outside);
      this.wind.g.gain.setTargetAtTime(g, t, rand(0.8, 2.2));
      this.wind.f.frequency.setTargetAtTime(rand(250, 650), t, 1.5);
      this.wind2.g.gain.setTargetAtTime(rand(0.005, 0.05), t, 1.2);
      this.wind2.f.frequency.setTargetAtTime(rand(600, 1400), t, 1.1);
    }
    // Heartbeat speeds up with fear
    if (fear > 0.25) {
      this.nextHeart -= dt;
      if (this.nextHeart <= 0) {
        this.nextHeart = 1.1 - fear * 0.65;
        this.play(this.buffers.heart, { gain: 0.25 + fear * 0.6, reverb: 0 });
      }
    }
    // Drips and random house creaks
    this.nextDrip -= dt;
    if (this.nextDrip <= 0) {
      this.nextDrip = rand(2, 7);
      const p = state.randomPoint && state.randomPoint();
      if (p) this.play(this.buffers.drip, { pos: p, gain: 0.25, rate: rand(0.8, 1.2) });
    }
    this.nextCreak -= dt;
    if (this.nextCreak <= 0) {
      this.nextCreak = rand(7, 18);
      const p = state.randomPoint && state.randomPoint();
      if (p) this.play(Math.random() < 0.5 ? this.buffers.creakFloor : this.buffers.creakShort, { pos: p, gain: rand(0.25, 0.6), rate: rand(0.7, 1.1), reverb: 0.5 });
    }
  }

  // ---------- recorded footsteps (CC0 recordings in assets/sounds) ----------
  // Files are fetched while the game loads and decoded once audio starts.
  preloadSamples(list) {
    this.sampleData = Promise.all(list.map(async ([key, url]) => {
      try { const r = await fetch(url); if (!r.ok) return null; return [key, await r.arrayBuffer()]; } catch { return null; }
    }));
    if (this.ctx) this.decodeSamples();
  }
  async decodeSamples() {
    if (!this.sampleData || this.samplesDecoding) return;
    this.samplesDecoding = true;
    const data = (await this.sampleData).filter(Boolean);
    const out = {};
    for (const [key, ab] of data) {
      try {
        const buf = await new Promise((res, rej) => this.ctx.decodeAudioData(ab.slice(0), res, rej));
        // even out loudness between recordings
        const d = buf.getChannelData(0); let sum = 0, peak = 0;
        for (let i = 0; i < d.length; i++) { sum += d[i] * d[i]; peak = Math.max(peak, Math.abs(d[i])); }
        const rms = Math.sqrt(sum / d.length) || 1e-3;
        buf.level = Math.min(4, 0.9 / Math.max(peak, rms * 4));
        (out[key] = out[key] || []).push(buf);
      } catch { /* this browser can't decode Ogg: synthesized steps are used instead */ }
    }
    this.samples = out;
  }
  // One footstep on a surface: wood, carpet, tile, concrete, porch or stairs.
  // style: 'walk' | 'run' | 'crouch'. side: -1 left foot, 1 right foot.
  footstep(surface, style, pos, right, side) {
    if (!this.ready) return;
    const S = this.samples || {};
    let list;
    if (surface === 'carpet' || surface === 'carpet2') list = S.carpet;
    else if (surface === 'tile' || surface === 'concrete') list = S.concrete;
    else if (surface === 'stairs') list = (S.heavy || []).concat(S.wood || []);
    else list = (S.boot || []).concat(S.wood || []);
    const B = this.buffers;
    const fallback = surface === 'tile' || surface === 'concrete' ? B.stepTile : surface.startsWith('carpet') ? B.stepSoft : B.stepWood;
    // never repeat the same take twice in a row
    let buf;
    if (list && list.length) {
      this.lastStep = this.lastStep || {};
      let i = Math.floor(Math.random() * list.length);
      if (list.length > 1 && i === this.lastStep[surface]) i = (i + 1) % list.length;
      this.lastStep[surface] = i; buf = list[i];
    } else buf = fallback[Math.floor(Math.random() * fallback.length)];
    const level = buf.level || 1;
    const base = style === 'run' ? 0.95 : style === 'crouch' ? 0.2 : 0.5;
    const gain = base * level * (0.85 + Math.random() * 0.3);
    const rate = (style === 'run' ? 1.04 : style === 'crouch' ? 0.9 : 0.97) + (Math.random() - 0.5) * 0.08 + side * 0.012;
    const lowpass = style === 'crouch' ? 1600 : style === 'walk' ? 9000 : undefined;
    // feet land a little left and right of the body
    const p = { x: pos.x + right.x * 0.12 * side, y: pos.y + 0.05, z: pos.z + right.z * 0.12 * side };
    this.play(buf, { pos: p, gain, rate, reverb: surface.startsWith('carpet') ? 0.12 : 0.28, ref: 3, lowpass });
    // running: clothing rustle and a heel scuff
    if (style === 'run') {
      this.play(B.cloth, { gain: 0.12, rate: 1.4 + Math.random() * 0.3, reverb: 0 });
      if (Math.random() < 0.35) this.play(B.drag, { pos: p, gain: 0.12, rate: 2.2, reverb: 0.1 });
    }
  }

  thunder(delay, strength = 1, close = false) {
    if (!this.ready) return;
    if (close) this.play(this.buffers.crack, { gain: 1.1, when: Math.max(0, delay - 0.05), reverb: 0.5, rate: rand(0.9, 1.1), bus: 'amb' });
    this.play(this.buffers.thunder, { gain: 0.6 + strength * 0.7, when: delay, reverb: 0.35, rate: rand(0.75, 1.05), bus: 'amb' });
  }

  // Lullaby on the music box. Returns a handle with stop().
  lullaby(opts = {}) {
    if (!this.ready) return { stop() {} };
    // Original melody in A minor. [midi, beats]
    const mel = [[76, 1], [72, 1], [69, 2], [71, 1], [72, 1], [74, 2], [76, 1], [77, 1], [76, 1], [74, 1], [72, 3], [0, 1],
      [69, 1], [72, 1], [76, 2], [74, 1], [72, 1], [71, 2], [72, 1], [71, 1], [69, 1], [67, 1], [69, 3], [0, 1],
      [81, 1], [79, 1], [77, 2], [76, 1], [74, 1], [72, 2], [74, 1], [76, 1], [72, 1], [71, 1], [69, 4]];
    const tempo = opts.tempo || 0.42;
    let time = 0; const voices = [];
    const loops = opts.loops || 1;
    for (let l = 0; l < loops; l++) {
      mel.forEach(([n, beats], i) => {
        if (n && this.buffers.tines[n]) {
          // slow drift like a winding-down spring
          const drift = 1 - (l * mel.length + i) * (opts.windDown || 0) * 0.0015;
          voices.push(this.play(this.buffers.tines[n], { pos: opts.pos, gain: (opts.gain || 0.5) * rand(0.8, 1), when: time, rate: drift, reverb: 0.6, ref: 1 }));
          if (i % 4 === 0) {
            const bass = n - 12 >= 64 ? n - 12 : n;
            if (this.buffers.tines[bass]) voices.push(this.play(this.buffers.tines[bass], { pos: opts.pos, gain: (opts.gain || 0.5) * 0.35, when: time, rate: drift * 0.5, reverb: 0.6 }));
          }
        }
        time += beats * tempo;
      });
    }
    return { duration: time, stop: () => voices.forEach(v => v && v.stop(0.2)) };
  }

  voiceLine(kind, pos) {
    // Distorted, formant-filtered voice for the phone and the creature.
    if (kind === 'phone') {
      this.play(this.buffers.static, { gain: 0.25, pos, lowpass: 3000 });
      [0, 1.3, 2.9].forEach(w => this.play(this.buffers.whisper, { gain: 0.9, pos, when: w, lowpass: 2800, rate: 0.8 }));
      this.play(this.buffers.cry, { gain: 0.35, pos, when: 4.3, rate: 0.7, lowpass: 2500 });
    }
  }
}
