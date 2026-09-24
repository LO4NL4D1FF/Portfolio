// Mini-map and full map, drawn on 2D canvases from the same text floor plans
// the house is built from, so they always match the real walls and doors.
//
// The mini-map turns with you (the way you face is always up), like the radar
// in open-world games. It shows the rooms by name, walls, doors (open, closed,
// locked), stairs, hiding places, the route to your goal as a moving gold line,
// the goal itself as a star, and the creature when she is hunting you.
import { MAPS, MW, MH, ROOMS, H, STAIR, OPENINGS, RAILINGS, edgeKey } from './world.js';

const S = 32;       // base canvas pixels per metre
const PAD = 3;      // metres of garden drawn around the house
const COLORS = {
  K: '#2f6168', D: '#6e3a40', T: '#56622f', U: '#58585a', H: '#5c4b37', L: '#3d527a', F: '#7a6336',
  S: '#5c4b37', C: '#3b3b3d', W: '#5e3f6e', P: '#4d3d2c',
  M: '#74405c', B: '#2d6570', N: '#6c5a84', G: '#5c4b37', R: '#3e6650', X: '#5e4a30', V: '#733333',
};
const GOLD = '#ffcf4a', WALL = '#f1e8d4';

export class MiniMap {
  constructor(world, refs) {
    this.world = world; this.refs = refs;
    this.labels = [[], []];
    this.bases = [0, 1].map(f => this.buildBase(f));
    this.hides = (refs.hides || []).map(h => ({ x: h.exit ? h.exit.x : h.pos.x, z: h.exit ? h.exit.z : h.pos.z, f: h.level || 0 }));
    const closet = world.doors.find(d => d.hide);
    if (closet) this.hides.push({ x: 22.5, z: 7.6, f: 0 });
  }

  // Rooms, walls, openings and stairs for one floor, drawn once.
  buildBase(f) {
    const c = document.createElement('canvas');
    c.width = (MW + PAD * 2) * S; c.height = (MH + PAD * 2) * S;
    const g = c.getContext('2d');
    const X = (x) => (x + PAD) * S;
    const cell = (x, z) => (x < 0 || z < 0 || x >= MW || z >= MH) ? '.' : MAPS[f][z][x];
    if (f === 0) { g.fillStyle = '#18231b'; g.fillRect(0, 0, c.width, c.height); }
    // room floors
    const sums = {};
    for (let z = 0; z < MH; z++) for (let x = 0; x < MW; x++) {
      const ch = cell(x, z);
      if (ch === '.') continue;
      if (f === 1 && ch === 'S') { g.fillStyle = '#141414'; g.fillRect(X(x), X(z), S, S); continue; }
      g.fillStyle = COLORS[ch] || '#555';
      g.fillRect(X(x), X(z), S + 0.5, S + 0.5);
      const k = f + ch; (sums[k] = sums[k] || { x: 0, z: 0, n: 0 }); sums[k].x += x + 0.5; sums[k].z += z + 0.5; sums[k].n++;
    }
    // subtle floorboard texture so rooms read as floors, not flat blocks
    g.globalAlpha = 0.08; g.fillStyle = '#000';
    for (let z = 0; z < MH; z++) for (let x = 0; x < MW; x++) if (cell(x, z) !== '.' && (x + z) % 2) g.fillRect(X(x), X(z), S, S);
    g.globalAlpha = 1;
    // stairs: steps and a direction arrow (up to the east on the ground floor)
    g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 2;
    for (let i = 0; i <= STAIR.x1 - STAIR.x0; i++) {
      const x = X(STAIR.x0 + i);
      g.beginPath(); g.moveTo(x, X(STAIR.z0) + 3); g.lineTo(x, X(STAIR.z1) - 3); g.stroke();
    }
    // walls
    const open = new Set(OPENINGS), rails = new Set(RAILINGS);
    const doorEdges = new Set(this.world.doors.filter(d => d.level === f).map(d => edgeKey(f, d.cells[0], d.cells[1])));
    g.lineCap = 'round';
    for (let z = -1; z < MH; z++) for (let x = -1; x < MW; x++) {
      for (const [dx, dz] of [[1, 0], [0, 1]]) {
        const ca = cell(x, z), cb = cell(x + dx, z + dz);
        if (ca === cb) continue;
        const outA = ca === '.' || ca === 'P', outB = cb === '.' || cb === 'P';
        if (outA && outB) continue;
        const key = edgeKey(f, [x, z], [x + dx, z + dz]);
        if (open.has(key) || doorEdges.has(key)) continue;
        const x0 = dx ? x + 1 : x, z0 = dx ? z : z + 1, x1 = dx ? x + 1 : x + 1, z1 = dx ? z + 1 : z + 1;
        if (rails.has(key)) { g.setLineDash([4, 5]); g.strokeStyle = 'rgba(241,232,212,0.6)'; g.lineWidth = 2; }
        else { g.setLineDash([]); g.strokeStyle = WALL; g.lineWidth = (outA || outB) ? 6 : 4; }
        g.beginPath(); g.moveTo(X(x0), X(z0)); g.lineTo(X(x1), X(z1)); g.stroke();
      }
    }
    g.setLineDash([]);
    for (const [k, v] of Object.entries(sums)) {
      if (k[1] === 'S' || k[1] === 'P') continue;
      this.labels[f].push({ name: ROOMS[k].name.replace('Upstairs gallery', 'Gallery'), x: v.x / v.n, z: v.z / v.n });
    }
    return c;
  }

  // Draws one floor into ctx. `view` gives the world point at the centre, the
  // rotation (radians), the scale (screen px per metre) and the target size.
  drawFloor(ctx, f, view, info) {
    const { cx, cz, rot, scale, w, h } = view;
    const k = scale / S;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rot);
    ctx.scale(k, k);
    ctx.translate(-(cx + PAD) * S, -(cz + PAD) * S);
    ctx.drawImage(this.bases[f], 0, 0);
    ctx.restore();
    const cos = Math.cos(rot), sin = Math.sin(rot);
    const toScreen = (x, z) => {
      const dx = (x - cx) * scale, dz = (z - cz) * scale;
      return [w / 2 + dx * cos - dz * sin, h / 2 + dx * sin + dz * cos];
    };
    // doors, live: open = a gap, closed = amber bar, locked = red bar and padlock
    for (const d of this.world.doors) {
      if (d.level !== f) continue;
      const a = d.axis === 'x' ? toScreen(d.c, d.s0 + 0.08) : toScreen(d.s0 + 0.08, d.c);
      const b = d.axis === 'x' ? toScreen(d.c, d.s1 - 0.08) : toScreen(d.s1 - 0.08, d.c);
      const isOpen = d.angle > 0.25;
      ctx.lineCap = 'round';
      if (isOpen) {
        ctx.strokeStyle = 'rgba(140,230,140,0.55)'; ctx.lineWidth = Math.max(1.5, scale * 0.06);
        ctx.setLineDash([2, 3]);
      } else {
        ctx.strokeStyle = d.locked ? '#ff5a4d' : '#e0a458'; ctx.lineWidth = Math.max(3, scale * 0.16);
        ctx.setLineDash([]);
      }
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.setLineDash([]);
      if (d.locked && !d.hide) padlock(ctx, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.max(7, scale * 0.35));
    }
    // stairs label, always upright
    const st = toScreen((STAIR.x0 + STAIR.x1) / 2, (STAIR.z0 + STAIR.z1) / 2);
    const su = toScreen(STAIR.x1, (STAIR.z0 + STAIR.z1) / 2), sd = toScreen(STAIR.x0, (STAIR.z0 + STAIR.z1) / 2);
    const [from, to] = f === 0 ? [sd, su] : [su, sd];
    arrow(ctx, from, to, 'rgba(255,255,255,0.75)', Math.max(2, scale * 0.08));
    pill(ctx, st[0], st[1] - Math.max(9, scale * 0.45), f === 0 ? 'STAIRS UP' : 'STAIRS DOWN', Math.max(8, Math.min(12, scale * 0.42)), '#fff', 'rgba(0,0,0,0.6)');
    // hiding places
    for (const hd of this.hides) {
      if (hd.f !== f) continue;
      const [x, y] = toScreen(hd.x, hd.z);
      hideIcon(ctx, x, y, Math.max(6, scale * 0.3));
    }
    // room names, upright
    const fs = Math.max(8, Math.min(14, scale * 0.5));
    ctx.font = `600 ${fs}px Inter, system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const l of this.labels[f]) {
      const [x, y] = toScreen(l.x, l.z);
      if (x < -40 || y < -20 || x > w + 40 || y > h + 20) continue;
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.strokeText(l.name, x, y);
      ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillText(l.name, x, y);
    }
    // route to the goal: a gold line with dashes flowing toward it
    if (info.path && info.path.length > 1) {
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const pts = info.path.filter(n => n.f === f || n.f === -1).map(n => toScreen(n.x + 0.5, n.z + 0.5));
      if (info.fromHere && f === info.level) pts.unshift(toScreen(info.px, info.pz));
      if (pts.length > 1) {
        ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = Math.max(5, scale * 0.3);
        ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
        ctx.strokeStyle = GOLD; ctx.lineWidth = Math.max(3, scale * 0.17);
        ctx.setLineDash([Math.max(6, scale * 0.4), Math.max(5, scale * 0.3)]);
        ctx.lineDashOffset = -info.t * 30;
        ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
      }
      ctx.restore();
    }
    return toScreen;
  }
}

// ---------------------------------------------------------------- icons
export function star(ctx, x, y, r, t) {
  const pulse = 1 + Math.sin(t * 5) * 0.12;
  ctx.save();
  ctx.strokeStyle = `rgba(255,207,74,${0.5 + Math.sin(t * 5) * 0.3})`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, r * (1.5 + (t * 1.2 % 1) * 0.9), 0, Math.PI * 2); ctx.stroke();
  ctx.translate(x, y); ctx.scale(pulse, pulse);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  ctx.closePath();
  ctx.fillStyle = GOLD; ctx.strokeStyle = '#3a2800'; ctx.lineWidth = 2;
  ctx.fill(); ctx.stroke();
  ctx.restore();
}
export function playerIcon(ctx, x, y, r, rot, torch) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (torch) {
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 5);
    g.addColorStop(0, 'rgba(255,240,200,0.35)'); g.addColorStop(1, 'rgba(255,240,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * 5, -Math.PI / 2 - 0.45, -Math.PI / 2 + 0.45); ctx.closePath(); ctx.fill();
  }
  ctx.beginPath(); ctx.moveTo(0, -r * 1.25); ctx.lineTo(r * 0.9, r * 0.9); ctx.lineTo(0, r * 0.45); ctx.lineTo(-r * 0.9, r * 0.9); ctx.closePath();
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#0a0a0a'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  ctx.stroke(); ctx.fill();
  ctx.restore();
}
export function monsterIcon(ctx, x, y, r, t) {
  ctx.save();
  ctx.fillStyle = `rgba(255,40,40,${0.25 + (Math.sin(t * 8) + 1) * 0.15})`;
  ctx.beginPath(); ctx.arc(x, y, r * 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff2a2a'; ctx.strokeStyle = '#200'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = `800 ${r * 1.5}px Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('!', x, y + 0.5);
  ctx.restore();
}
function padlock(ctx, x, y, r) {
  ctx.save();
  ctx.fillStyle = '#ff5a4d'; ctx.strokeStyle = '#1a0000'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y - r * 0.35, r * 0.42, Math.PI, 0); ctx.lineWidth = r * 0.22; ctx.strokeStyle = '#ff5a4d'; ctx.stroke();
  ctx.fillRect(x - r * 0.6, y - r * 0.3, r * 1.2, r * 0.95);
  ctx.fillStyle = '#1a0000'; ctx.fillRect(x - r * 0.1, y, r * 0.2, r * 0.35);
  ctx.restore();
}
function hideIcon(ctx, x, y, r) {
  ctx.save();
  ctx.fillStyle = 'rgba(90,170,255,0.9)'; ctx.strokeStyle = '#001428'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(x - r * 0.7, y - r, r * 1.4, r * 2, r * 0.25); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#001428'; ctx.beginPath(); ctx.moveTo(x, y - r * 0.8); ctx.lineTo(x, y + r * 0.8); ctx.stroke();
  ctx.restore();
}
function arrow(ctx, a, b, color, width) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); if (l < 4) return;
  const ux = dx / l, uy = dy / l, hs = Math.min(l * 0.3, width * 4);
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a[0] + ux * l * 0.15, a[1] + uy * l * 0.15); ctx.lineTo(b[0] - ux * (l * 0.15 + hs), b[1] - uy * (l * 0.15 + hs)); ctx.stroke();
  const tx = b[0] - ux * l * 0.15, ty = b[1] - uy * l * 0.15;
  ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx - ux * hs - uy * hs * 0.6, ty - uy * hs + ux * hs * 0.6); ctx.lineTo(tx - ux * hs + uy * hs * 0.6, ty - uy * hs - ux * hs * 0.6); ctx.closePath(); ctx.fill();
  ctx.restore();
}
export function pill(ctx, x, y, text, size, fg, bg) {
  ctx.save();
  ctx.font = `700 ${size}px Inter, system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + size * 1.1, h = size * 1.6;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
  ctx.fillStyle = fg; ctx.fillText(text, x, y + 0.5);
  ctx.restore();
  return w;
}
export { H };
