// Procedural canvas textures: aged wallpaper, plaster, carpet, stains and the
// flashlight cookie. Photographic textures (wood, brick, tiles) are loaded from
// assets/textures and combined with these.
import * as THREE from 'three';

let seed = 1337;
export function srand(s) { seed = s; }
export function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

function canvas(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

// Smooth tileable value noise into an ImageData-like float array.
function noiseField(w, h, scale, octaves = 4) {
  const out = new Float32Array(w * h);
  let amp = 1, total = 0;
  for (let o = 0; o < octaves; o++) {
    const gw = Math.max(2, Math.round(w / scale)), gh = Math.max(2, Math.round(h / scale));
    const grid = new Float32Array(gw * gh).map(() => rnd());
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const gx = x / w * gw, gy = y / h * gh;
      const x0 = Math.floor(gx), y0 = Math.floor(gy);
      const fx = gx - x0, fy = gy - y0;
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const g = (i, j) => grid[((j % gh) * gw) + (i % gw)];
      const v = g(x0, y0) * (1 - sx) * (1 - sy) + g(x0 + 1, y0) * sx * (1 - sy) + g(x0, y0 + 1) * (1 - sx) * sy + g(x0 + 1, y0 + 1) * sx * sy;
      out[y * w + x] += v * amp;
    }
    total += amp; amp *= 0.5; scale /= 2;
  }
  for (let i = 0; i < out.length; i++) out[i] /= total;
  return out;
}

function applyNoise(ctx, w, h, field, strength, tint = [0, 0, 0]) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < w * h; i++) {
    const n = (field[i] - 0.5) * strength;
    d[i * 4] = Math.max(0, Math.min(255, d[i * 4] + n * 255 + tint[0] * n));
    d[i * 4 + 1] = Math.max(0, Math.min(255, d[i * 4 + 1] + n * 255 + tint[1] * n));
    d[i * 4 + 2] = Math.max(0, Math.min(255, d[i * 4 + 2] + n * 255 + tint[2] * n));
  }
  ctx.putImageData(img, 0, 0);
}

function stains(ctx, w, h, count, color, maxR) {
  for (let i = 0; i < count; i++) {
    const x = rnd() * w, y = rnd() * h * 0.9, r = maxR * (0.3 + rnd() * 0.7);
    const g = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
    g.addColorStop(0, color.replace('A', (0.25 + rnd() * 0.2).toFixed(2)));
    g.addColorStop(0.7, color.replace('A', '0.12'));
    g.addColorStop(1, color.replace('A', '0'));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(x, y, r, r * (0.6 + rnd()), rnd() * 3, 0, Math.PI * 2); ctx.fill();
    // water run down
    if (rnd() < 0.5) {
      const lg = ctx.createLinearGradient(x, y, x, y + r * 4);
      lg.addColorStop(0, color.replace('A', '0.18')); lg.addColorStop(1, color.replace('A', '0'));
      ctx.fillStyle = lg; ctx.fillRect(x - r * 0.15, y, r * 0.3, r * 4);
    }
  }
}

function toTex(c, repeat = [1, 1], srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Damask wallpaper with ageing. Returns {map, bump}.
export function wallpaper(base, ink, opts = {}) {
  srand(opts.seed || 7);
  const W = 512, H = 512;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = base; ctx.fillRect(0, 0, W, H);
  // vertical stripes
  ctx.globalAlpha = 0.18; ctx.fillStyle = ink;
  for (let x = 0; x < W; x += 64) { ctx.fillRect(x, 0, 3, H); ctx.fillRect(x + 7, 0, 1, H); }
  ctx.globalAlpha = 0.55;
  // damask ornament
  const orn = (cx, cy, s) => {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    ctx.beginPath();
    for (const m of [1, -1]) {
      ctx.moveTo(0, -60);
      ctx.bezierCurveTo(m * 30, -50, m * 40, -20, m * 18, 0);
      ctx.bezierCurveTo(m * 45, 10, m * 40, 45, m * 8, 60);
      ctx.bezierCurveTo(m * 20, 30, m * 10, 20, 0, 22);
    }
    ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -8, 6, 14, 0, 0, Math.PI * 2); ctx.fill();
    for (const m of [1, -1]) {
      ctx.beginPath(); ctx.ellipse(m * 28, -34, 4, 9, m * 0.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(m * 30, 30, 5, 10, -m * 0.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  };
  ctx.fillStyle = ink;
  for (let y = 0; y <= H; y += 128) for (let x = 0; x <= W; x += 128) { orn(x, y, 0.8); orn(x + 64, y + 64, 0.45); }
  ctx.globalAlpha = 1;
  // ageing
  applyNoise(ctx, W, H, noiseField(W, H, 64, 5), 0.28);
  stains(ctx, W, H, opts.stains ?? 5, 'rgba(70,50,20,A)', 90);
  // dirt gradient at the bottom
  const g = ctx.createLinearGradient(0, H * 0.6, 0, H);
  g.addColorStop(0, 'rgba(30,20,10,0)'); g.addColorStop(1, 'rgba(30,20,10,0.35)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // bump derived from luminance
  const [bc, bctx] = canvas(W, H);
  bctx.filter = 'grayscale(1) contrast(1.4)'; bctx.drawImage(c, 0, 0);
  // peeling seams
  bctx.filter = 'none';
  bctx.fillStyle = 'rgba(0,0,0,0.6)';
  for (let x = 0; x < W; x += 256) bctx.fillRect(x, 0, 2, H);
  return { map: toTex(c), bump: toTex(bc, [1, 1], false) };
}

export function plaster(tone = 200, seedv = 3) {
  srand(seedv);
  const W = 512, H = 512;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = `rgb(${tone},${tone - 6},${tone - 16})`; ctx.fillRect(0, 0, W, H);
  applyNoise(ctx, W, H, noiseField(W, H, 128, 6), 0.35);
  stains(ctx, W, H, 6, 'rgba(90,70,40,A)', 110);
  // cracks
  ctx.strokeStyle = 'rgba(40,30,20,0.6)'; ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    let x = rnd() * W, y = rnd() * H; ctx.beginPath(); ctx.moveTo(x, y);
    for (let k = 0; k < 20; k++) { x += (rnd() - 0.5) * 30; y += (rnd() - 0.5) * 30; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  const [bc, bctx] = canvas(W, H);
  bctx.filter = 'grayscale(1) contrast(2)'; bctx.drawImage(c, 0, 0);
  return { map: toTex(c), bump: toTex(bc, [1, 1], false) };
}

export function carpet(base = [92, 18, 22], seedv = 11) {
  srand(seedv);
  const W = 512, H = 512;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = `rgb(${base.join(',')})`; ctx.fillRect(0, 0, W, H);
  // Persian style border pattern
  ctx.strokeStyle = 'rgba(200,160,90,0.35)'; ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.lineWidth = 2; ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.fillStyle = 'rgba(20,20,50,0.5)';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    ctx.beginPath(); ctx.ellipse(W / 2 + Math.cos(a) * 120, H / 2 + Math.sin(a) * 120, 30, 12, a, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = 'rgba(210,170,100,0.3)';
  ctx.beginPath(); ctx.ellipse(W / 2, H / 2, 70, 70, 0, 0, Math.PI * 2); ctx.fill();
  applyNoise(ctx, W, H, noiseField(W, H, 4, 2), 0.25);
  applyNoise(ctx, W, H, noiseField(W, H, 128, 3), 0.25);
  stains(ctx, W, H, 4, 'rgba(20,10,5,A)', 60);
  const [bc, bctx] = canvas(W, H);
  bctx.filter = 'grayscale(1) contrast(1.5)'; bctx.drawImage(c, 0, 0);
  return { map: toTex(c), bump: toTex(bc, [1, 1], false) };
}

export function woodPanel(seedv = 5) {
  srand(seedv);
  const W = 256, H = 256;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#3a2416'; ctx.fillRect(0, 0, W, H);
  for (let y = 0; y < H; y++) {
    const v = Math.sin(y * 0.35 + Math.sin(y * 0.05) * 4) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(20,10,4,${0.15 + v * 0.2})`; ctx.fillRect(0, y, W, 1);
  }
  applyNoise(ctx, W, H, noiseField(W, H, 32, 4), 0.2);
  // raised panels
  ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 4;
  ctx.strokeRect(16, 20, W - 32, H - 40);
  ctx.strokeStyle = 'rgba(255,220,180,0.08)'; ctx.lineWidth = 2;
  ctx.strokeRect(22, 26, W - 44, H - 52);
  const [bc, bctx] = canvas(W, H);
  bctx.fillStyle = '#808080'; bctx.fillRect(0, 0, W, H);
  bctx.strokeStyle = '#000'; bctx.lineWidth = 6; bctx.strokeRect(16, 20, W - 32, H - 40);
  bctx.strokeStyle = '#fff'; bctx.lineWidth = 3; bctx.strokeRect(24, 28, W - 48, H - 56);
  return { map: toTex(c), bump: toTex(bc, [1, 1], false) };
}

export function flashlightCookie() {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,250,235,1)');
  g.addColorStop(0.18, 'rgba(255,245,225,0.95)');
  g.addColorStop(0.24, 'rgba(210,200,180,0.6)');
  g.addColorStop(0.3, 'rgba(255,250,235,0.75)');
  g.addColorStop(0.55, 'rgba(160,150,130,0.35)');
  g.addColorStop(0.85, 'rgba(60,55,45,0.1)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  // lens imperfections
  srand(99);
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(0,0,0,${0.03 + rnd() * 0.06})`;
    ctx.beginPath(); ctx.arc(S / 2 + (rnd() - 0.5) * 120, S / 2 + (rnd() - 0.5) * 120, 3 + rnd() * 14, 0, Math.PI * 2); ctx.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function bloodDecal(seedv = 1, drag = false) {
  srand(seedv);
  const S = 256;
  const [c, ctx] = canvas(S, S);
  ctx.clearRect(0, 0, S, S);
  const col = (a) => `rgba(${60 + rnd() * 30},${4 + rnd() * 6},${4 + rnd() * 5},${a})`;
  if (drag) {
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = col(0.5 + rnd() * 0.3); ctx.lineWidth = 6 + rnd() * 18; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(20 + rnd() * 30, S / 2 + (rnd() - 0.5) * 60);
      ctx.bezierCurveTo(S * 0.4, S / 2 + (rnd() - 0.5) * 80, S * 0.6, S / 2 + (rnd() - 0.5) * 80, S - 20, S / 2 + (rnd() - 0.5) * 40);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = col(0.9);
    ctx.beginPath(); ctx.arc(S / 2, S / 2, 60, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2, r = 50 + rnd() * 70;
      ctx.fillStyle = col(0.6 + rnd() * 0.4);
      ctx.beginPath(); ctx.arc(S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r, 3 + rnd() * 16, 0, Math.PI * 2); ctx.fill();
    }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function textDecal(lines, color = 'rgba(110,8,8,0.9)', w = 512, h = 256, font = 'bold 70px Georgia') {
  const [c, ctx] = canvas(w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = color; ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => {
    const y = h / 2 + (i - (lines.length - 1) / 2) * (h / (lines.length + 0.5));
    for (let k = 0; k < 3; k++) ctx.fillText(l, w / 2 + (Math.random() - 0.5) * 4, y + (Math.random() - 0.5) * 4);
    // drips
    for (let d = 0; d < 8; d++) { const x = w / 2 + (Math.random() - 0.5) * w * 0.7; ctx.fillRect(x, y + 20, 3, 20 + Math.random() * 60); }
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function bookSpines(seedv = 21) {
  srand(seedv);
  const W = 512, H = 256;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#120a06'; ctx.fillRect(0, 0, W, H);
  let x = 0;
  const cols = ['#4a1a14', '#1d2b1a', '#2a2238', '#5a4020', '#3a0f0f', '#1b2430', '#51391f', '#2e2e2a', '#6b5a3a'];
  while (x < W) {
    const bw = 10 + rnd() * 18, bh = H * (0.72 + rnd() * 0.26);
    ctx.fillStyle = cols[Math.floor(rnd() * cols.length)];
    ctx.fillRect(x, H - bh, bw - 1, bh);
    ctx.fillStyle = 'rgba(210,170,90,0.55)';
    ctx.fillRect(x + 1, H - bh + 14, bw - 3, 2); ctx.fillRect(x + 1, H - 18, bw - 3, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x + bw - 3, H - bh, 2, bh);
    x += bw;
  }
  applyNoise(ctx, W, H, noiseField(W, H, 32, 3), 0.25);
  return toTex(c);
}

// A family portrait painted "in oils" with faces scratched out.
export function portrait(kind = 'family') {
  srand(kind === 'family' ? 41 : 77);
  const W = 384, H = 512;
  const [c, ctx] = canvas(W, H);
  const bg = ctx.createRadialGradient(W / 2, H * 0.35, 20, W / 2, H / 2, H * 0.7);
  bg.addColorStop(0, '#5a4630'); bg.addColorStop(1, '#140d08');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const person = (x, y, s, dress, skin) => {
    ctx.fillStyle = dress;
    ctx.beginPath(); ctx.moveTo(x - 70 * s, H); ctx.quadraticCurveTo(x - 60 * s, y + 70 * s, x, y + 60 * s); ctx.quadraticCurveTo(x + 60 * s, y + 70 * s, x + 70 * s, H); ctx.fill();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(x, y, 30 * s, 38 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1d120a'; ctx.beginPath(); ctx.ellipse(x, y - 18 * s, 34 * s, 26 * s, 0, Math.PI, Math.PI * 2); ctx.fill();
    // scratched out face
    ctx.strokeStyle = 'rgba(230,220,200,0.85)'; ctx.lineWidth = 2;
    for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.moveTo(x + (rnd() - 0.5) * 60 * s, y + (rnd() - 0.5) * 70 * s); ctx.lineTo(x + (rnd() - 0.5) * 60 * s, y + (rnd() - 0.5) * 70 * s); ctx.stroke(); }
  };
  if (kind === 'family') {
    person(W * 0.3, H * 0.36, 1.1, '#1e2230', '#c8a888');
    person(W * 0.68, H * 0.4, 1.0, '#4a1c1c', '#d8b898');
    ctx.fillStyle = '#e8e0d0'; ctx.beginPath(); ctx.ellipse(W * 0.62, H * 0.66, 34, 26, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e0c0a8'; ctx.beginPath(); ctx.arc(W * 0.6, H * 0.62, 14, 0, Math.PI * 2); ctx.fill();
  } else {
    person(W * 0.5, H * 0.38, 1.3, '#2a1a24', '#d0b0a0');
  }
  applyNoise(ctx, W, H, noiseField(W, H, 8, 3), 0.18);
  // craquelure
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 0.6;
  for (let i = 0; i < 90; i++) { let x = rnd() * W, y = rnd() * H; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (rnd() - 0.5) * 30; y += (rnd() - 0.5) * 30; ctx.lineTo(x, y); } ctx.stroke(); }
  return toTex(c);
}

export function rainGlass() {
  const W = 256, H = 512;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#0c1522'; ctx.fillRect(0, 0, W, H);
  srand(5);
  for (let i = 0; i < 160; i++) {
    const x = rnd() * W, y = rnd() * H, r = 1 + rnd() * 3;
    ctx.fillStyle = `rgba(150,180,210,${0.15 + rnd() * 0.3})`;
    ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.3, 0, 0, Math.PI * 2); ctx.fill();
    if (rnd() < 0.3) { ctx.fillStyle = 'rgba(150,180,210,0.12)'; ctx.fillRect(x - 0.5, y, 1, 20 + rnd() * 60); }
  }
  return toTex(c);
}

export function sheetCloth() {
  srand(12);
  const W = 256, H = 256;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#b8b0a2'; ctx.fillRect(0, 0, W, H);
  applyNoise(ctx, W, H, noiseField(W, H, 64, 5), 0.3);
  stains(ctx, W, H, 4, 'rgba(90,70,40,A)', 50);
  return toTex(c);
}

export function paperTex(seedv = 3) {
  srand(seedv);
  const W = 128, H = 128;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#d9cfb4'; ctx.fillRect(0, 0, W, H);
  applyNoise(ctx, W, H, noiseField(W, H, 32, 3), 0.25);
  ctx.fillStyle = 'rgba(40,30,20,0.5)';
  for (let y = 20; y < H - 10; y += 8) ctx.fillRect(14, y, W - 28 - rnd() * 30, 1.5);
  return toTex(c);
}

// Overlapping scales for the creature's serpent half.
export function snakeScales() {
  srand(31);
  const W = 256, H = 256;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#1c2016'; ctx.fillRect(0, 0, W, H);
  const rows = 16, cols = 8;
  for (let r = 0; r <= rows; r++) for (let q = 0; q <= cols; q++) {
    const x = (q + (r % 2) * 0.5) * (W / cols), y = r * (H / rows);
    const g = ctx.createRadialGradient(x, y - 4, 1, x, y, W / cols * 0.62);
    const t = rnd();
    g.addColorStop(0, `rgb(${70 + t * 30},${74 + t * 26},${50 + t * 16})`);
    g.addColorStop(0.75, `rgb(${34 + t * 10},${38 + t * 10},${26})`);
    g.addColorStop(1, 'rgb(10,12,8)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(x, y, W / cols * 0.55, H / rows * 0.95, 0, 0, Math.PI * 2); ctx.fill();
  }
  // mottled bands
  for (let i = 0; i < 7; i++) { ctx.fillStyle = `rgba(0,0,0,${0.2 + rnd() * 0.25})`; ctx.beginPath(); ctx.ellipse(rnd() * W, rnd() * H, 20 + rnd() * 30, 10 + rnd() * 18, rnd() * 3, 0, Math.PI * 2); ctx.fill(); }
  const [bc, bctx] = canvas(W, H);
  bctx.filter = 'grayscale(1) contrast(1.6)'; bctx.drawImage(c, 0, 0);
  return { map: toTex(c, [1, 4]), bump: toTex(bc, [1, 4], false) };
}

// Bristly chitin for the spider half, and veined flesh where the halves join.
export function chitin(banded = false) {
  srand(banded ? 38 : 37);
  const W = 256, H = 256;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#2a1d14'; ctx.fillRect(0, 0, W, H);
  applyNoise(ctx, W, H, noiseField(W, H, 48, 5), 0.45);
  if (banded) {
    // tarantula-like pale bands at the joints
    for (let y = 0; y < H; y += 64) { const g = ctx.createLinearGradient(0, y, 0, y + 22); g.addColorStop(0, 'rgba(150,120,90,0)'); g.addColorStop(0.5, 'rgba(150,120,90,0.55)'); g.addColorStop(1, 'rgba(150,120,90,0)'); ctx.fillStyle = g; ctx.fillRect(0, y, W, 22); }
  } else {
    // mottled markings like a skull on the abdomen
    for (let i = 0; i < 18; i++) { ctx.fillStyle = `rgba(${120 + rnd() * 50},${90 + rnd() * 30},${60},${0.15 + rnd() * 0.25})`; ctx.beginPath(); ctx.ellipse(rnd() * W, rnd() * H, 6 + rnd() * 22, 4 + rnd() * 14, rnd() * 3, 0, Math.PI * 2); ctx.fill(); }
  }
  // bristles
  ctx.lineWidth = 1;
  for (let i = 0; i < 1600; i++) {
    const x = rnd() * W, y = rnd() * H; const l = 3 + rnd() * 8;
    ctx.strokeStyle = rnd() < 0.5 ? 'rgba(170,140,110,0.45)' : 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (rnd() - 0.5) * 3, y + l); ctx.stroke();
  }
  const [bc, bctx] = canvas(W, H);
  bctx.filter = 'grayscale(1) contrast(2.2)'; bctx.drawImage(c, 0, 0);
  return { map: toTex(c, banded ? [1, 3] : [2, 2]), bump: toTex(bc, banded ? [1, 3] : [2, 2], false) };
}

export function flesh() {
  srand(43);
  const W = 256, H = 256;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#6a3a34'; ctx.fillRect(0, 0, W, H);
  applyNoise(ctx, W, H, noiseField(W, H, 64, 5), 0.4);
  ctx.strokeStyle = 'rgba(40,10,30,0.7)';
  for (let i = 0; i < 30; i++) {
    let x = rnd() * W, y = rnd() * H; ctx.lineWidth = 1 + rnd() * 2; ctx.beginPath(); ctx.moveTo(x, y);
    for (let k = 0; k < 10; k++) { x += (rnd() - 0.5) * 40; y += (rnd() - 0.5) * 40; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  stains(ctx, W, H, 8, 'rgba(90,10,10,A)', 40);
  const [bc, bctx] = canvas(W, H);
  bctx.filter = 'grayscale(1) contrast(1.8)'; bctx.drawImage(c, 0, 0);
  return { map: toTex(c), bump: toTex(bc, [1, 1], false) };
}
