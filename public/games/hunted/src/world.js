// Hale House: floor plans, geometry, doors, collision, navigation and line of sight.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as TX from './textures.js';

export const H = 3.2;           // storey height
export const WALL_T = 0.16;     // wall thickness
export const STAIR = { x0: 16, x1: 22, z0: 7, z1: 9 };

// One character per 1 m cell. Row = z, column = x.
// Ground floor: K kitchen, D dining, T study, U utility, H hall, L living room,
// F foyer, S stairs, C under-stair closet, W music room, P porch.
const GROUND = [
  'KKKKKKKKDDDDDDDDTTTTTTTT',
  'KKKKKKKKDDDDDDDDTTTTTTTT',
  'KKKKKKKKDDDDDDDDTTTTTTTT',
  'KKKKKKKKDDDDDDDDTTTTTTTT',
  'KKKKKKKKDDDDDDDDTTTTTTTT',
  'UUUHHHHHHHHHHHHHHHHHHHHH',
  'UUUHHHHHHHHHHHHHHHHHHHHH',
  'LLLLLLLLFFFFFFFFSSSSSSCC',
  'LLLLLLLLFFFFFFFFSSSSSSCC',
  'LLLLLLLLFFFFFFFFWWWWWWWW',
  'LLLLLLLLFFFFFFFFWWWWWWWW',
  'LLLLLLLLFFFFFFFFWWWWWWWW',
  'LLLLLLLLFFFFFFFFWWWWWWWW',
  '........PPPPPPPP........',
  '........PPPPPPPP........',
];
// Upper floor: M master bedroom, B bathroom, N nursery, G gallery hall,
// R guest room, X library, V chapel, S stairwell.
const UPPER = [
  'MMMMMMMMMMBBBBNNNNNNNNNN',
  'MMMMMMMMMMBBBBNNNNNNNNNN',
  'MMMMMMMMMMBBBBNNNNNNNNNN',
  'MMMMMMMMMMBBBBNNNNNNNNNN',
  'MMMMMMMMMMBBBBNNNNNNNNNN',
  'GGGGGGGGGGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGGGGGGGGGG',
  'RRRRRRRRXXXXXXXXSSSSSSGG',
  'RRRRRRRRXXXXXXXXSSSSSSGG',
  'RRRRRRRRXXXXXXXXVVVVVVVV',
  'RRRRRRRRXXXXXXXXVVVVVVVV',
  'RRRRRRRRXXXXXXXXVVVVVVVV',
  'RRRRRRRRXXXXXXXXVVVVVVVV',
  '........................',
  '........................',
];
export const MAPS = [GROUND, UPPER];
export const MW = 24, MH = 15;

export const ROOMS = {
  '0K': { name: 'Kitchen', floor: 'tile', wall: 'kitchen', wainscot: false },
  '0D': { name: 'Dining room', floor: 'wood', wall: 'dining', wainscot: true },
  '0T': { name: 'Study', floor: 'wood', wall: 'panel', wainscot: false },
  '0U': { name: 'Utility room', floor: 'concrete', wall: 'dirty', wainscot: false },
  '0H': { name: 'Hall', floor: 'wood', wall: 'hall', wainscot: true },
  '0L': { name: 'Living room', floor: 'wood', wall: 'living', wainscot: true },
  '0F': { name: 'Foyer', floor: 'wood', wall: 'foyer', wainscot: true },
  '0S': { name: 'Stairs', floor: 'wood', wall: 'foyer', wainscot: true },
  '0C': { name: 'Closet', floor: 'wood', wall: 'dirty', wainscot: false },
  '0W': { name: 'Music room', floor: 'wood', wall: 'music', wainscot: true },
  '0P': { name: 'Porch', floor: 'porch', wall: 'brick', wainscot: false, outdoor: true },
  '1M': { name: 'Master bedroom', floor: 'carpet', wall: 'rose', wainscot: true },
  '1B': { name: 'Bathroom', floor: 'tile', wall: 'bath', wainscot: false },
  '1N': { name: 'Nursery', floor: 'wood', wall: 'nursery', wainscot: true },
  '1G': { name: 'Upstairs gallery', floor: 'wood', wall: 'hall', wainscot: true },
  '1R': { name: 'Guest room', floor: 'carpet2', wall: 'guest', wainscot: true },
  '1X': { name: 'Library', floor: 'wood', wall: 'panel', wainscot: false },
  '1V': { name: 'Chapel', floor: 'wood', wall: 'chapel', wainscot: false },
  '1S': { name: 'Stairs', floor: 'wood', wall: 'hall', wainscot: true },
};

// Special edges. Key "f:x,z:x,z" with the two cells sorted.
const E = (f, a, b) => { const [p, q] = [a, b].sort((u, v) => u[0] - v[0] || u[1] - v[1]); return `${f}:${p[0]},${p[1]}:${q[0]},${q[1]}`; };
export const edgeKey = E;

const DOORS = [
  { id: 'front', f: 0, a: [11, 12], b: [11, 13], lock: 'frontKey', open: true, swingTo: 'a', front: true },
  { id: 'living', f: 0, a: [8, 10], b: [7, 10], swingTo: 'b' },
  { id: 'music', f: 0, a: [15, 11], b: [16, 11], swingTo: 'b' },
  { id: 'kitchen', f: 0, a: [5, 5], b: [5, 4], swingTo: 'b' },
  { id: 'study', f: 0, a: [19, 5], b: [19, 4], lock: 'studyKey', swingTo: 'b' },
  { id: 'utility', f: 0, a: [3, 5], b: [2, 5], swingTo: 'b' },
  { id: 'hallLiving', f: 0, a: [4, 6], b: [4, 7], swingTo: 'b' },
  { id: 'kitchenDining', f: 0, a: [7, 2], b: [8, 2], swingTo: 'b', open: true },
  { id: 'closet', f: 0, a: [22, 6], b: [22, 7], swingTo: 'a', hide: true },
  { id: 'master', f: 1, a: [4, 5], b: [4, 4], swingTo: 'b' },
  { id: 'bath', f: 1, a: [11, 5], b: [11, 4], swingTo: 'b' },
  { id: 'nursery', f: 1, a: [18, 5], b: [18, 4], lock: 'nurseryKey', swingTo: 'b' },
  { id: 'guest', f: 1, a: [3, 6], b: [3, 7], swingTo: 'b' },
  { id: 'library', f: 1, a: [11, 6], b: [11, 7], swingTo: 'b', open: true },
  { id: 'chapel', f: 1, a: [22, 8], b: [22, 9], swingTo: 'b' },
];
const OPENINGS = [
  ...[10, 11, 12, 13].map(x => E(0, [x, 6], [x, 7])),       // foyer arch to hall
  ...[11, 12].map(x => E(0, [x, 4], [x, 5])),               // dining arch
  ...[7, 8].map(z => E(0, [15, z], [16, z])),               // foot of stairs
  ...[7, 8].map(z => E(1, [21, z], [22, z])),               // top of stairs
];
const RAILINGS = [
  ...[16, 17, 18, 19, 20, 21].map(x => E(1, [x, 6], [x, 7])),
];

export class World {
  constructor(scene, loader) {
    this.scene = scene;
    this.loader = loader;
    this.colliders = [[], []];    // AABBs per level: {x0,z0,x1,z1,door?}
    this.walls2D = [[], []];      // for line of sight (walls only, plus closed doors dynamically)
    this.doors = [];
    this.doorByEdge = new Map();
    this.interactables = [];
    this.raycastTargets = [];
    this.lights = [];
    this.windows = [];
    this.hideSpots = [];
    this.blockedCells = new Set();
    this.batches = new Map();
    this.materials = {};
  }

  cell(f, x, z) {
    if (x < 0 || z < 0 || x >= MW || z >= MH) return '.';
    return MAPS[f][z][x];
  }
  roomKey(f, x, z) { const c = this.cell(f, x, z); return c === '.' ? null : f + c; }
  roomAt(pos) {
    const lv = this.levelOf(pos.y);
    const x = Math.floor(pos.x), z = Math.floor(pos.z);
    const k = this.roomKey(lv, x, z);
    return k ? ROOMS[k] : null;
  }
  levelOf(y) { return y > H * 0.5 ? 1 : 0; }
  inStairs(x, z) { return x >= STAIR.x0 && x < STAIR.x1 && z >= STAIR.z0 && z < STAIR.z1; }
  stairY(x) { return Math.max(0, Math.min(1, (x - STAIR.x0) / (STAIR.x1 - STAIR.x0))) * H; }
  floorY(x, z, level) {
    if (this.inStairs(x, z)) return this.stairY(x);
    return level * H;
  }

  // ---------- materials ----------
  async loadMaterials() {
    const tl = new THREE.TextureLoader();
    const load = (p, srgb = true, rep = [1, 1]) => new Promise(res => tl.load(p, t => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8;
      if (srgb) t.colorSpace = THREE.SRGBColorSpace; res(t);
    }, undefined, () => res(null)));
    const [hwD, hwB, hwR, brD, brB, brR, tiD, tiN, dist, fruit] = await Promise.all([
      load('assets/textures/hardwood2_diffuse.jpg'), load('assets/textures/hardwood2_bump.jpg', false), load('assets/textures/hardwood2_roughness.jpg', false),
      load('assets/textures/brick_diffuse.jpg'), load('assets/textures/brick_bump.jpg', false), load('assets/textures/brick_roughness.jpg', false),
      load('assets/textures/FloorsCheckerboard_S_Diffuse.jpg'), load('assets/textures/FloorsCheckerboard_S_Normal.jpg', false),
      load('assets/textures/disturb.jpg'), load('assets/textures/painting_fruit.jpg'),
    ]);
    this.tex = { hwD, hwB, hwR, brD, brB, brR, tiD, tiN, dist, fruit };
    const M = this.materials;
    const std = (o) => new THREE.MeshStandardMaterial(o);
    M.wood = std({ map: hwD, bumpMap: hwB, bumpScale: 0.6, roughnessMap: hwR, roughness: 0.85, color: 0x9a8070 });
    M.porch = std({ map: hwD, bumpMap: hwB, bumpScale: 1.2, roughnessMap: hwR, roughness: 1, color: 0x6a6a64 });
    M.tile = std({ map: tiD, normalMap: tiN, roughness: 0.35, metalness: 0.0, color: 0xbab4a4 });
    M.concrete = std({ map: dist, color: 0x55524c, roughness: 0.95 });
    const cp = TX.carpet([88, 18, 22], 11); M.carpet = std({ map: cp.map, bumpMap: cp.bump, bumpScale: 0.8, roughness: 1 });
    const cp2 = TX.carpet([34, 40, 58], 17); M.carpet2 = std({ map: cp2.map, bumpMap: cp2.bump, bumpScale: 0.8, roughness: 1 });
    const pl = TX.plaster(190, 3); M.ceiling = std({ map: pl.map, bumpMap: pl.bump, bumpScale: 0.4, roughness: 0.95 });
    const wp = (base, ink, seed, stains = 5) => { const w = TX.wallpaper(base, ink, { seed, stains }); return std({ map: w.map, bumpMap: w.bump, bumpScale: 0.5, roughness: 0.9 }); };
    M.w_foyer = wp('#2c3a2c', '#1a2419', 3);
    M.w_hall = wp('#4a4630', '#2e2b1c', 5);
    M.w_living = wp('#4a1e1e', '#2a0e0e', 7);
    M.w_dining = wp('#1f2a3e', '#121a28', 9);
    M.w_music = wp('#6a5424', '#3e3012', 13);
    M.w_rose = wp('#6e4a48', '#4a2e2c', 15);
    M.w_nursery = wp('#6c7c88', '#e8e4dc', 17, 8);
    M.w_guest = wp('#6a604c', '#433c2c', 19);
    const kp = TX.plaster(170, 21); M.w_kitchen = std({ map: kp.map, bumpMap: kp.bump, bumpScale: 0.5, roughness: 0.9, color: 0xd8d0b8 });
    const dp = TX.plaster(120, 23); M.w_dirty = std({ map: dp.map, bumpMap: dp.bump, bumpScale: 0.8, roughness: 1 });
    const chp = TX.plaster(90, 29); M.w_chapel = std({ map: chp.map, bumpMap: chp.bump, bumpScale: 1, roughness: 1, color: 0x9a8a80 });
    M.w_bath = std({ map: tiD, normalMap: tiN, roughness: 0.3, color: 0x9aa8a8 });
    const wpn = TX.woodPanel(5);
    M.w_panel = std({ map: wpn.map, bumpMap: wpn.bump, bumpScale: 2, roughness: 0.7, color: 0xb09080 });
    M.wainscot = std({ map: wpn.map, bumpMap: wpn.bump, bumpScale: 2, roughness: 0.65 });
    M.w_brick = std({ map: brD, bumpMap: brB, bumpScale: 2, roughnessMap: brR, color: 0x8a7a70 });
    M.trim = std({ map: hwD, color: 0x3a2618, roughness: 0.55 });
    M.darkWood = std({ map: hwD, bumpMap: hwB, bumpScale: 0.4, color: 0x4a3020, roughness: 0.6 });
    M.redWood = std({ map: hwD, bumpMap: hwB, bumpScale: 0.4, color: 0x5a2a1a, roughness: 0.45 });
    M.lightWood = std({ map: hwD, bumpMap: hwB, bumpScale: 0.4, color: 0xa08868, roughness: 0.7 });
    M.paintedWhite = std({ color: 0xcfc8b8, roughness: 0.6, map: dist });
    M.brass = std({ color: 0xb08a40, metalness: 1, roughness: 0.35 });
    M.iron = std({ color: 0x2a2a2a, metalness: 0.9, roughness: 0.55 });
    M.chrome = std({ color: 0xcccccc, metalness: 1, roughness: 0.2 });
    M.porcelain = std({ color: 0xe8e4da, roughness: 0.15 });
    M.fabricRed = std({ color: 0x4a1414, roughness: 1, map: cp.map });
    M.fabricGreen = std({ color: 0x2a3a2a, roughness: 1 });
    M.fabricBeige = std({ color: 0x8a7c66, roughness: 1 });
    M.linen = std({ color: 0xc8c0b0, roughness: 1, map: TX.sheetCloth() });
    M.black = std({ color: 0x080808, roughness: 0.5 });
    M.glass = std({ map: TX.rainGlass(), color: 0x8098b8, roughness: 0.05, metalness: 0.1, emissive: 0x0a1420, emissiveIntensity: 1, transparent: true, opacity: 0.42, depthWrite: false });
    M.mirror = std({ color: 0x8a9090, metalness: 1, roughness: 0.08 });
    M.candle = std({ color: 0xe8dcc0, roughness: 0.6, emissive: 0x201008 });
    M.flame = new THREE.MeshBasicMaterial({ color: 0xffb050 });
    M.bulbOff = std({ color: 0x777066, roughness: 0.3 });
    M.bulb = new THREE.MeshStandardMaterial({ color: 0xfff0d0, emissive: 0xffc070, emissiveIntensity: 0 });
    M.paper = std({ map: TX.paperTex(3), roughness: 0.9 });
    M.fruit = std({ map: fruit, roughness: 0.6 });
    M.portrait = std({ map: TX.portrait('family'), roughness: 0.6 });
    M.portrait2 = std({ map: TX.portrait('single'), roughness: 0.6 });
    M.books = std({ map: TX.bookSpines(21), roughness: 0.8 });
    M.grass = std({ map: dist, color: 0x1a2014, roughness: 1 });
    M.blood = new THREE.MeshStandardMaterial({ map: TX.bloodDecal(1), transparent: true, roughness: 0.2, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
    M.bloodDrag = new THREE.MeshStandardMaterial({ map: TX.bloodDecal(2, true), transparent: true, roughness: 0.25, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
    M.metalGrey = std({ color: 0x5a5a58, metalness: 0.7, roughness: 0.5 });
    M.enamel = std({ color: 0xd8d2c0, roughness: 0.3, metalness: 0.1 });
    // wood textures repeat every ~2 m
    for (const t of [hwD, hwB, hwR]) if (t) t.repeat.set(1, 1);
  }

  wallMat(style) { return this.materials['w_' + style] || this.materials.w_hall; }
  floorMat(kind) { return this.materials[kind] || this.materials.wood; }

  // ---------- batching ----------
  batch(matKey) {
    let b = this.batches.get(matKey);
    if (!b) { b = { pos: [], nor: [], uv: [], idx: [] }; this.batches.set(matKey, b); }
    return b;
  }
  // quad from 4 corners (counter clockwise seen from the normal side), uv per corner
  quad(matKey, p, n, uv) {
    const b = this.batch(matKey);
    const base = b.pos.length / 3;
    for (let i = 0; i < 4; i++) { b.pos.push(p[i][0], p[i][1], p[i][2]); b.nor.push(n[0], n[1], n[2]); b.uv.push(uv[i][0], uv[i][1]); }
    b.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  // Axis aligned wall face. axis 'x': plane at X = c, spanning z [s0,s1]; normal sign ns.
  wallFace(matKey, axis, c, s0, s1, y0, y1, ns, uvScale = 1.2) {
    if (s1 - s0 < 1e-4 || y1 - y0 < 1e-4) return;
    const u0 = s0 / uvScale, u1 = s1 / uvScale, v0 = y0 / uvScale, v1 = y1 / uvScale;
    if (axis === 'x') {
      const n = [ns, 0, 0];
      if (ns > 0) this.quad(matKey, [[c, y0, s1], [c, y0, s0], [c, y1, s0], [c, y1, s1]], n, [[u1, v0], [u0, v0], [u0, v1], [u1, v1]]);
      else this.quad(matKey, [[c, y0, s0], [c, y0, s1], [c, y1, s1], [c, y1, s0]], n, [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]);
    } else {
      const n = [0, 0, ns];
      if (ns > 0) this.quad(matKey, [[s0, y0, c], [s1, y0, c], [s1, y1, c], [s0, y1, c]], n, [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]);
      else this.quad(matKey, [[s1, y0, c], [s0, y0, c], [s0, y1, c], [s1, y1, c]], n, [[u1, v0], [u0, v0], [u0, v1], [u1, v1]]);
    }
  }
  hQuad(matKey, x0, z0, x1, z1, y, up, uvScale = 2) {
    const n = [0, up ? 1 : -1, 0];
    const uv = (x, z) => [x / uvScale, -z / uvScale];
    if (up) this.quad(matKey, [[x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0]], n, [uv(x0, z1), uv(x1, z1), uv(x1, z0), uv(x0, z0)]);
    else this.quad(matKey, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], n, [uv(x0, z0), uv(x1, z0), uv(x1, z1), uv(x0, z1)]);
  }
  box(matKey, cx, cy, cz, sx, sy, sz, uvScale = 1) {
    const x0 = cx - sx / 2, x1 = cx + sx / 2, y0 = cy - sy / 2, y1 = cy + sy / 2, z0 = cz - sz / 2, z1 = cz + sz / 2;
    this.wallFace(matKey, 'x', x0, z0, z1, y0, y1, -1, uvScale);
    this.wallFace(matKey, 'x', x1, z0, z1, y0, y1, 1, uvScale);
    this.wallFace(matKey, 'z', z0, x0, x1, y0, y1, -1, uvScale);
    this.wallFace(matKey, 'z', z1, x0, x1, y0, y1, 1, uvScale);
    this.hQuad(matKey, x0, z0, x1, z1, y1, true, uvScale);
    this.hQuad(matKey, x0, z0, x1, z1, y0, false, uvScale);
  }
  flushBatches() {
    for (const [key, b] of this.batches) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(b.pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(b.nor, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(b.uv, 2));
      g.setIndex(b.idx);
      g.computeBoundingSphere();
      const mat = this.materials[key] || this.wallMat(key.replace('w_', ''));
      const m = new THREE.Mesh(g, mat);
      m.castShadow = true; m.receiveShadow = true;
      m.userData.static = true;
      this.scene.add(m);
      this.raycastTargets.push(m);
    }
    this.batches.clear();
  }

  addCollider(level, x0, z0, x1, z1, extra = {}) {
    const c = { x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1), ...extra };
    this.colliders[level].push(c);
    return c;
  }

  // ---------- build ----------
  build() {
    this.buildFloorsAndCeilings();
    this.buildWalls();
    this.buildStairs();
    this.buildExterior();
    this.flushBatches();
  }

  buildFloorsAndCeilings() {
    for (let f = 0; f < 2; f++) {
      for (let z = 0; z < MH; z++) for (let x = 0; x < MW; x++) {
        const c = this.cell(f, x, z);
        if (c === '.') continue;
        const room = ROOMS[f + c];
        const y = f * H;
        if (c !== 'S') {
          this.hQuad(room.floor, x, z, x + 1, z + 1, y + (f === 1 ? 0.001 : 0), true);
          const ceilY = c === 'P' ? y + 3.0 : y + H - 0.002;
          this.hQuad(c === 'P' ? 'trim' : 'ceiling', x, z, x + 1, z + 1, ceilY, false, 2.5);
        } else if (f === 1) {
          this.hQuad('ceiling', x, z, x + 1, z + 1, 2 * H - 0.002, false, 2.5);
        }
      }
    }
    // roof slab (blocks moonlight from above) and porch roof
    this.box('w_brick', MW / 2, 2 * H + 0.15, 13 / 2, MW + 0.4, 0.3, 13.4);
    this.box('trim', 12, 3.1, 14, 8.4, 0.2, 2.2);
  }

  buildWalls() {
    const doorEdges = new Map(DOORS.map(d => [E(d.f, d.a, d.b), d]));
    const open = new Set(OPENINGS);
    const rails = new Set(RAILINGS);
    const vertices = new Set();
    for (let f = 0; f < 2; f++) {
      const y0 = f * H, y1 = y0 + H;
      for (let z = -1; z < MH; z++) for (let x = -1; x < MW; x++) {
        for (const [dx, dz] of [[1, 0], [0, 1]]) {
          const ax = x, az = z, bx = x + dx, bz = z + dz;
          const ca = this.cell(f, ax, az), cb = this.cell(f, bx, bz);
          if (ca === cb) continue;
          const key = E(f, [ax, az], [bx, bz]);
          if (open.has(key)) {
            // header beam over archways
            const hc = dx ? x + 1 : z + 1, hs = dx ? z + 0.5 : x + 0.5;
            if (dx) this.box('trim', hc, y0 + 2.8, hs, WALL_T + 0.04, 0.8, 1.0);
            else this.box('trim', hs, y0 + 2.8, hc, 1.0, 0.8, WALL_T + 0.04);
            continue;
          }
          const axis = dx ? 'x' : 'z';
          const c = dx ? x + 1 : z + 1;          // plane coordinate
          const s0 = dx ? z : x, s1 = s0 + 1;     // span
          const outA = ca === '.' || ca === 'P', outB = cb === '.' || cb === 'P';
          if (outA && outB) {
            // porch perimeter: railing
            const frontSteps = axis === 'z' && c === 15 && s0 >= 10 && s0 <= 12;
            if ((ca === 'P' || cb === 'P') && f === 0 && !frontSteps) this.railing(f, axis, c, s0, s1, 0);
            continue;
          }
          if (rails.has(key)) { this.railing(f, axis, c, s0, s1, y0); continue; }
          const door = doorEdges.get(key);
          const win = !door && f >= 0 && (outA || outB) && this.wantsWindow(f, ax, az, bx, bz, ca, cb);
          const holes = [];
          if (door) holes.push({ s0: s0 + 0.05, s1: s1 - 0.05, y0: y0, y1: y0 + 2.15 });
          if (win) holes.push({ s0: s0 + 0.2, s1: s1 - 0.2, y0: y0 + 0.85, y1: y0 + 2.35 });
          // faces
          const sides = [[ca, ax, az, -1], [cb, bx, bz, 1]];
          for (const [cc, cx, cz, sign] of sides) {
            const pc = c + sign * WALL_T / 2;
            const exterior = cc === '.' || cc === 'P';
            let matKey, wains = false;
            if (exterior) { matKey = 'w_brick'; }
            else { const r = ROOMS[f + cc]; matKey = 'w_' + r.wall; wains = r.wainscot; }
            this.wallWithHoles(matKey, wains, axis, pc, s0 - WALL_T / 2, s1 + WALL_T / 2, y0, y1, sign, holes, exterior);
          }
          // reveal faces inside holes
          for (const h of holes) this.reveal(axis, c, h, f);
          // collision / sight
          const level = f;
          const rect = axis === 'x'
            ? [c - WALL_T / 2, s0, c + WALL_T / 2, s1]
            : [s0, c - WALL_T / 2, s1, c + WALL_T / 2];
          if (door) {
            // wall stubs either side of the doorway
            if (axis === 'x') { this.addCollider(level, rect[0], s0, rect[2], s0 + 0.06); this.addCollider(level, rect[0], s1 - 0.06, rect[2], s1); }
            else { this.addCollider(level, s0, rect[1], s0 + 0.06, rect[3]); this.addCollider(level, s1 - 0.06, rect[1], s1, rect[3]); }
            this.doors.push({ def: door, axis, c, s0, s1, level });
          } else {
            const col = this.addCollider(level, ...rect);
            this.walls2D[level].push(col);
          }
          vertices.add(`${f}:${axis === 'x' ? c : s0},${axis === 'x' ? s0 : c}`);
          vertices.add(`${f}:${axis === 'x' ? c : s1},${axis === 'x' ? s1 : c}`);
          // baseboards / chair rail / crown on room sides
          for (const [cc, , , sign] of sides) {
            if (cc === '.' || cc === 'P') continue;
            const pc = c + sign * (WALL_T / 2 + 0.012);
            const pieces = door ? [[s0, s0 + 0.05], [s1 - 0.05, s1]] : [[s0, s1]];
            for (const [p0, p1] of pieces) {
              this.trimStrip(axis, pc, p0, p1, y0, y0 + 0.16, sign, 0.024);
              if (!door) this.trimStrip(axis, pc, p0, p1, y1 - 0.12, y1, sign, 0.03);
            }
            const r = ROOMS[f + cc];
            if (r.wainscot) {
              const segs = win ? [[s0, s1]] : pieces;
              for (const [p0, p1] of segs) this.trimStrip(axis, pc, p0, p1, y0 + 0.98, y0 + 1.04, sign, 0.03);
            }
          }
          if (win) this.windowAt(f, axis, c, s0, s1, y0, outA ? -1 : 1);
        }
      }
    }
    // corner posts
    for (const v of vertices) {
      const [f, rest] = v.split(':'); const [px, pz] = rest.split(',').map(Number);
      const lv = +f;
      this.box('trim', px, lv * H + H / 2, pz, WALL_T + 0.03, H, WALL_T + 0.03);
    }
    for (const d of this.doors) this.makeDoor(d);
    // all window glass and curtains as two meshes
    const glass = new THREE.Mesh(mergeGeometries(this.glassGeos), this.materials.glass);
    this.scene.add(glass);
    for (const w of this.windows) w.mesh = glass;
    const curtains = new THREE.Mesh(mergeGeometries(this.curtainGeos), this.materials.fabricRed);
    curtains.castShadow = true; curtains.receiveShadow = true;
    this.scene.add(curtains);
    this.glassGeos = this.curtainGeos = null;
  }

  wantsWindow(f, ax, az, bx, bz, ca, cb) {
    const inside = ca === '.' || ca === 'P' ? cb : ca;
    if ('USCP'.includes(inside)) return false;
    const x = Math.max(ax, bx), z = Math.max(az, bz);
    if (f === 0 && inside === 'F') return x === 9 || x === 14; // flank the front door
    return (x * 7 + z * 3 + f) % 3 === 0;
  }

  wallWithHoles(matKey, wains, axis, c, s0, s1, y0, y1, sign, holes, exterior) {
    // Split span into vertical strips around holes, then each strip into y ranges.
    const cuts = [s0, s1];
    for (const h of holes) cuts.push(h.s0, h.s1);
    cuts.sort((a, b) => a - b);
    for (let i = 0; i < cuts.length - 1; i++) {
      const a = cuts[i], b = cuts[i + 1];
      if (b - a < 1e-4) continue;
      const mid = (a + b) / 2;
      let ranges = [[y0, y1]];
      for (const h of holes) if (mid > h.s0 && mid < h.s1) {
        ranges = ranges.flatMap(([r0, r1]) => {
          const out = [];
          if (h.y0 > r0) out.push([r0, Math.min(r1, h.y0)]);
          if (h.y1 < r1) out.push([Math.max(r0, h.y1), r1]);
          return out;
        });
      }
      for (const [r0, r1] of ranges) {
        if (!exterior && wains) {
          const split = y0 + 1.0;
          if (r0 < split) this.wallFace('wainscot', axis, c, a, b, r0, Math.min(r1, split), sign, 1.0);
          if (r1 > split) this.wallFace(matKey, axis, c, a, b, Math.max(r0, split), r1, sign);
        } else this.wallFace(matKey, axis, c, a, b, r0, r1, sign, exterior ? 2.0 : 1.2);
      }
    }
  }

  reveal(axis, c, h, f) {
    const t = WALL_T / 2;
    // side jambs and top
    if (axis === 'x') {
      this.wallFace('trim', 'z', h.s0, c - t, c + t, h.y0, h.y1, 1, 1);
      this.wallFace('trim', 'z', h.s1, c - t, c + t, h.y0, h.y1, -1, 1);
      this.quad('trim', [[c - t, h.y1, h.s0], [c + t, h.y1, h.s0], [c + t, h.y1, h.s1], [c - t, h.y1, h.s1]], [0, -1, 0], [[0, 0], [1, 0], [1, 1], [0, 1]]);
      if (h.y0 > f * H + 0.01) this.quad('trim', [[c - t, h.y0, h.s1], [c + t, h.y0, h.s1], [c + t, h.y0, h.s0], [c - t, h.y0, h.s0]], [0, 1, 0], [[0, 0], [1, 0], [1, 1], [0, 1]]);
    } else {
      this.wallFace('trim', 'x', h.s0, c - t, c + t, h.y0, h.y1, 1, 1);
      this.wallFace('trim', 'x', h.s1, c - t, c + t, h.y0, h.y1, -1, 1);
      this.quad('trim', [[h.s0, h.y1, c - t], [h.s0, h.y1, c + t], [h.s1, h.y1, c + t], [h.s1, h.y1, c - t]], [0, -1, 0], [[0, 0], [1, 0], [1, 1], [0, 1]]);
      if (h.y0 > f * H + 0.01) this.quad('trim', [[h.s1, h.y0, c - t], [h.s1, h.y0, c + t], [h.s0, h.y0, c + t], [h.s0, h.y0, c - t]], [0, 1, 0], [[0, 0], [1, 0], [1, 1], [0, 1]]);
    }
    // casing around the opening, both faces
    for (const sign of [-1, 1]) {
      const pc = c + sign * (t + 0.015);
      const w = 0.07;
      if (axis === 'x') {
        this.box('trim', pc, (h.y0 + h.y1) / 2 + 0.035, h.s0 - w / 2 + 0.01, 0.03, h.y1 - h.y0 + 0.07, w);
        this.box('trim', pc, (h.y0 + h.y1) / 2 + 0.035, h.s1 + w / 2 - 0.01, 0.03, h.y1 - h.y0 + 0.07, w);
        this.box('trim', pc, h.y1 + w / 2, (h.s0 + h.s1) / 2, 0.03, w, h.s1 - h.s0 + 2 * w);
      } else {
        this.box('trim', h.s0 - w / 2 + 0.01, (h.y0 + h.y1) / 2 + 0.035, pc, w, h.y1 - h.y0 + 0.07, 0.03);
        this.box('trim', h.s1 + w / 2 - 0.01, (h.y0 + h.y1) / 2 + 0.035, pc, w, h.y1 - h.y0 + 0.07, 0.03);
        this.box('trim', (h.s0 + h.s1) / 2, h.y1 + w / 2, pc, h.s1 - h.s0 + 2 * w, w, 0.03);
      }
    }
  }

  trimStrip(axis, pc, p0, p1, y0, y1, sign, depth) {
    const cy = (y0 + y1) / 2, sy = y1 - y0;
    if (axis === 'x') this.box('trim', pc, cy, (p0 + p1) / 2, depth, sy, p1 - p0);
    else this.box('trim', (p0 + p1) / 2, cy, pc, p1 - p0, sy, depth);
  }

  railing(f, axis, c, s0, s1, y0) {
    const yb = f * H;
    const n = 6;
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n;
      if (axis === 'x') this.box('trim', c, yb + 0.5, s, 0.04, 1.0, 0.04);
      else this.box('trim', s, yb + 0.5, c, 0.04, 1.0, 0.04);
    }
    if (axis === 'x') { this.box('darkWood', c, yb + 1.02, (s0 + s1) / 2, 0.09, 0.07, s1 - s0 + 0.05); this.box('darkWood', c, yb + 0.06, (s0 + s1) / 2, 0.08, 0.06, s1 - s0); }
    else { this.box('darkWood', (s0 + s1) / 2, yb + 1.02, c, s1 - s0 + 0.05, 0.07, 0.09); this.box('darkWood', (s0 + s1) / 2, yb + 0.06, c, s1 - s0, 0.06, 0.08); }
    const rect = axis === 'x' ? [c - 0.06, s0, c + 0.06, s1] : [s0, c - 0.06, s1, c + 0.06];
    this.addCollider(f, ...rect);
  }

  windowAt(f, axis, c, s0, s1, y0, outSign) {
    const a = s0 + 0.2, b = s1 - 0.2, wy0 = y0 + 0.85, wy1 = y0 + 2.35;
    const g = new THREE.PlaneGeometry(b - a, wy1 - wy0);
    const m = new THREE.Mesh(g, this.materials.glass);
    const cx = axis === 'x' ? c : (a + b) / 2, cz = axis === 'x' ? (a + b) / 2 : c;
    m.position.set(cx, (wy0 + wy1) / 2, cz);
    if (axis === 'x') m.rotation.y = Math.PI / 2;
    m.updateMatrix(); const gg = g.clone().applyMatrix4(m.matrix);
    (this.glassGeos = this.glassGeos || []).push(gg);
    this.windows.push({ x: cx, y: m.position.y, z: cz });
    // muntins
    const mid = (a + b) / 2, my = (wy0 + wy1) / 2;
    if (axis === 'x') {
      this.box('paintedWhite', c, my, mid, 0.05, wy1 - wy0, 0.035);
      this.box('paintedWhite', c, my, mid, 0.05, 0.035, b - a);
      this.box('paintedWhite', c, wy0 + (wy1 - wy0) * 0.66, mid, 0.05, 0.03, b - a);
      this.box('trim', c - outSign * 0.12, wy0 - 0.02, mid, 0.12, 0.04, b - a + 0.14);
    } else {
      this.box('paintedWhite', mid, my, c, 0.035, wy1 - wy0, 0.05);
      this.box('paintedWhite', mid, my, c, b - a, 0.035, 0.05);
      this.box('paintedWhite', mid, wy0 + (wy1 - wy0) * 0.66, c, b - a, 0.03, 0.05);
      this.box('trim', mid, wy0 - 0.02, c - outSign * 0.12, b - a + 0.14, 0.04, 0.12);
    }
    // heavy curtains on the inside
    const cm = this.materials.fabricRed;
    for (const side of [-1, 1]) {
      const cg = new THREE.PlaneGeometry(0.35, wy1 - wy0 + 0.5, 6, 1);
      const pos = cg.attributes.position;
      for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(pos.getX(i) * 40) * 0.025);
      cg.computeVertexNormals();
      const cmesh = new THREE.Mesh(cg, cm);
      const off = -outSign * (WALL_T / 2 + 0.08);
      const along = side < 0 ? a + 0.05 : b - 0.05;
      if (axis === 'x') { cmesh.position.set(c + off, (wy0 + wy1) / 2 + 0.1, along); cmesh.rotation.y = Math.PI / 2; }
      else { cmesh.position.set(along, (wy0 + wy1) / 2 + 0.1, c + off); }
      cmesh.updateMatrix();
      (this.curtainGeos = this.curtainGeos || []).push(cg.clone().applyMatrix4(cmesh.matrix));
    }
  }

  makeDoor(d) {
    const def = d.def;
    const width = d.s1 - d.s0 - 0.12, height = 2.12;
    const pivot = new THREE.Group();
    const y0 = d.level * H;
    const geo = new THREE.BoxGeometry(width, height, 0.045);
    geo.translate(width / 2, height / 2, 0);
    const mat = def.front ? this.materials.redWood : this.materials.darkWood;
    const woodGeos = [geo], metalGeos = [], ironGeos = [];
    const put = (list, g, x, y, z) => { g.translate(x, y, z); list.push(g); };
    for (const [py, ph] of [[0.35, 0.55], [1.25, 0.95]]) for (const px of [0.22, width - 0.22]) put(woodGeos, new THREE.BoxGeometry(width / 2 - 0.16, ph, 0.06), px, py + ph / 2, 0);
    for (const zz of [-0.05, 0.05]) {
      put(metalGeos, new THREE.SphereGeometry(0.03, 12, 8), width - 0.08, 1.0, zz);
      put(metalGeos, new THREE.BoxGeometry(0.05, 0.18, 0.01), width - 0.08, 0.97, zz * 0.7);
    }
    if (def.lock) put(ironGeos, new THREE.BoxGeometry(0.02, 0.04, 0.07), width - 0.08, 0.9, 0);
    const leaf = new THREE.Mesh(mergeGeometries(woodGeos.map(g => g.index ? g.toNonIndexed() : g)), mat);
    leaf.castShadow = true; leaf.receiveShadow = true;
    pivot.add(leaf);
    const hw = new THREE.Mesh(mergeGeometries([...metalGeos, ...ironGeos].map(g => g.index ? g.toNonIndexed() : g)), this.materials.brass);
    hw.castShadow = true;
    pivot.add(hw);
    // hinge at s0 end; closed along the edge
    const hs = d.s0 + 0.06;
    if (d.axis === 'x') { pivot.position.set(d.c, y0, hs); pivot.rotation.y = -Math.PI / 2; }
    else { pivot.position.set(hs, y0, d.c); }
    this.scene.add(pivot);
    const cellA = def.a, cellB = def.b;
    // Which way does "open" rotate? Toward cell given by swingTo.
    const target = def.swingTo === 'a' ? cellA : cellB;
    const other = def.swingTo === 'a' ? cellB : cellA;
    const dir = d.axis === 'x' ? Math.sign(target[0] - other[0]) : Math.sign(target[1] - other[1]);
    const door = {
      id: def.id, def, pivot, leaf, axis: d.axis, c: d.c, s0: d.s0, s1: d.s1, level: d.level,
      baseRot: pivot.rotation.y, openSign: d.axis === 'x' ? dir : -dir, angle: def.open ? 1.45 : 0, target: def.open ? 1.45 : 0,
      locked: !!def.lock && !def.open, key: def.lock || null, hide: !!def.hide, cells: [cellA, cellB],
    };
    // closed collider
    const t = 0.05;
    door.collider = d.axis === 'x'
      ? { x0: d.c - t, z0: d.s0, x1: d.c + t, z1: d.s1, door }
      : { x0: d.s0, z0: d.c - t, x1: d.s1, z1: d.c + t, door };
    this.colliders[d.level].push(door.collider);
    leaf.userData.door = door;
    pivot.traverse(o => { if (o.isMesh) { o.userData.door = door; this.raycastTargets.push(o); } });
    this.doorByEdge.set(E(d.level, cellA, cellB), door);
    this.applyDoor(door);
    this.doors[this.doors.indexOf(d)] = door;
    return door;
  }

  applyDoor(door) {
    door.pivot.rotation.y = door.baseRot + door.openSign * door.angle;
    door.collider.disabled = door.angle > 0.25;
  }

  door(id) { return this.doors.find(d => d.id === id); }

  updateDoors(dt) {
    for (const d of this.doors) {
      if (Math.abs(d.angle - d.target) > 0.001) {
        const speed = d.slam ? 9 : 2.6;
        d.angle += Math.sign(d.target - d.angle) * Math.min(Math.abs(d.target - d.angle), speed * dt);
        if (Math.abs(d.angle - d.target) < 0.002) { d.angle = d.target; d.slam = false; }
        this.applyDoor(d);
      }
    }
  }
  doorCenter(d) {
    const m = (d.s0 + d.s1) / 2;
    return d.axis === 'x' ? new THREE.Vector3(d.c, d.level * H + 1.1, m) : new THREE.Vector3(m, d.level * H + 1.1, d.c);
  }

  buildStairs() {
    const steps = 12, run = (STAIR.x1 - STAIR.x0) / steps, rise = H / steps;
    for (let i = 0; i < steps; i++) {
      const x0 = STAIR.x0 + i * run, top = (i + 1) * rise;
      this.box('darkWood', x0 + run / 2, top / 2, (STAIR.z0 + STAIR.z1) / 2, run, top, STAIR.z1 - STAIR.z0 - 0.02);
      // runner carpet and brass rod
      this.box('carpet', x0 + run / 2, top + 0.006, (STAIR.z0 + STAIR.z1) / 2, run, 0.012, 1.1);
      this.box('brass', x0 + 0.02, top + 0.02, (STAIR.z0 + STAIR.z1) / 2, 0.015, 0.015, 1.14);
    }
    // handrail along the gallery side on the stairs (sloped)
    const rail = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(STAIR.x1 - STAIR.x0, H), 0.06, 0.07), this.materials.darkWood);
    rail.position.set((STAIR.x0 + STAIR.x1) / 2, H / 2 + 0.95, STAIR.z0 + 0.12);
    rail.rotation.z = Math.atan2(H, STAIR.x1 - STAIR.x0);
    this.scene.add(rail);
    const newel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.2, 0.14), this.materials.darkWood);
    newel.position.set(STAIR.x0 + 0.1, 0.6, STAIR.z0 + 0.12); newel.castShadow = true; this.scene.add(newel);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), this.materials.darkWood);
    cap.position.set(STAIR.x0 + 0.1, 1.25, STAIR.z0 + 0.12); this.scene.add(cap);
  }

  buildExterior() {
    const M = this.materials;
    // ground
    const g = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), M.grass);
    g.rotation.x = -Math.PI / 2; g.position.set(12, -0.35, 20); g.receiveShadow = true;
    if (M.grass.map) { M.grass.map = M.grass.map.clone(); M.grass.map.repeat.set(30, 30); M.grass.map.needsUpdate = true; }
    this.scene.add(g);
    // porch steps
    for (let i = 0; i < 2; i++) this.box('porch', 11.5, -0.09 - i * 0.12, 15.2 + i * 0.3, 2.2, 0.18, 0.3, 2);
    // porch columns
    for (const x of [8.2, 10.3, 12.7, 15.8]) this.box('paintedWhite', x, 1.5, 14.8, 0.22, 3.0, 0.22);
    // stone path
    for (let i = 0; i < 12; i++) this.box('concrete', 12 + Math.sin(i) * 0.2, -0.33, 16 + i * 0.9, 1.4, 0.05, 0.7, 2);
    // boundary: the porch front is open only at the steps, and you can't leave
    this.addCollider(0, 7.9, 15.05, 16.1, 15.25, { noLeave: true });
    // fence and dead trees in the fog, merged into two meshes
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x0c0a08, roughness: 1 });
    const rng = (sd) => { const x = Math.sin(sd) * 10000; return x - Math.floor(x); };
    const treeGeos = [], fenceGeos = [];
    const place = (geo, list, pos, rot, extra) => { const o = new THREE.Object3D(); o.position.copy(pos); o.rotation.copy(rot); if (extra) extra(o); o.updateMatrix(); geo.applyMatrix4(o.matrix); list.push(geo); };
    for (let i = 0; i < 26; i++) {
      const x = -14 + rng(i * 3.1) * 52, z = 18 + rng(i * 7.7) * 22;
      if (x > 6 && x < 18 && z < 26) continue;
      const tree = new THREE.Group();
      const h = 5 + rng(i) * 6;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, h, 6)); trunk.position.y = h / 2; tree.add(trunk);
      for (let b = 0; b < 6; b++) {
        const bl = 1.5 + rng(i * 13 + b) * 2.5;
        const br = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.08, bl, 4));
        br.position.set(0, h * (0.45 + b * 0.09), 0);
        br.rotation.set(rng(i + b) * 1.4 - 0.7, rng(i * 2 + b) * 6, 0.6 + rng(b * 3 + i) * 0.6);
        br.translateY(bl / 2);
        tree.add(br);
      }
      tree.position.set(x, -0.35, z); tree.rotation.y = rng(i * 5) * 6;
      tree.updateMatrixWorld(true);
      tree.traverse(o => { if (o.isMesh) { const g = o.geometry.toNonIndexed(); g.applyMatrix4(o.matrixWorld); treeGeos.push(g); } });
    }
    const trees = new THREE.Mesh(mergeGeometries(treeGeos), treeMat);
    this.scene.add(trees);
    for (let x = -6; x <= 30; x += 0.25) {
      if (x > 10.5 && x < 13.5) continue;
      place(new THREE.BoxGeometry(0.03, 1.6, 0.03), fenceGeos, new THREE.Vector3(x, 0.45, 27), new THREE.Euler());
    }
    place(new THREE.BoxGeometry(36, 0.04, 0.04), fenceGeos, new THREE.Vector3(12, 1.1, 27), new THREE.Euler());
    this.scene.add(new THREE.Mesh(mergeGeometries(fenceGeos), M.iron));
    // the gate stands open
  }

  // ---------- navigation ----------
  navKey(f, x, z) { return this.cell(f, x, z) === 'S' ? `s:${x}:${z}` : `${f}:${x}:${z}`; }
  buildNav() {
    this.nav = new Map();
    const add = (k, info) => { if (!this.nav.has(k)) this.nav.set(k, { ...info, key: k, n: new Set() }); return this.nav.get(k); };
    for (let f = 0; f < 2; f++) for (let z = 0; z < MH; z++) for (let x = 0; x < MW; x++) {
      const c = this.cell(f, x, z);
      if (c === '.' || c === 'P') continue;
      const k = this.navKey(f, x, z);
      add(k, { f: c === 'S' ? -1 : f, x, z, y: c === 'S' ? this.stairY(x + 0.5) : f * H });
    }
    this.navLinks = [];
    for (let f = 0; f < 2; f++) for (let z = 0; z < MH; z++) for (let x = 0; x < MW; x++) {
      const c = this.cell(f, x, z);
      if (c === '.' || c === 'P') continue;
      for (const [dx, dz] of [[1, 0], [0, 1]]) {
        const bx = x + dx, bz = z + dz; const cb = this.cell(f, bx, bz);
        if (cb === '.' || cb === 'P') continue;
        const key = E(f, [x, z], [bx, bz]);
        const same = c === cb;
        const isOpen = OPENINGS.includes(key);
        const door = this.doorByEdge.get(key);
        if (!same && !isOpen && !door) continue;
        this.navLinks.push({ a: this.navKey(f, x, z), b: this.navKey(f, bx, bz), door });
      }
    }
    this.refreshNav();
  }
  refreshNav() {
    for (const n of this.nav.values()) n.n.clear();
    for (const l of this.navLinks) {
      if (l.door && l.door.locked) continue;
      if (this.blockedCells.has(l.a) || this.blockedCells.has(l.b)) continue;
      this.nav.get(l.a).n.add(l.b); this.nav.get(l.b).n.add(l.a);
    }
  }
  nodeAt(pos) {
    const x = Math.floor(pos.x), z = Math.floor(pos.z);
    const lv = this.levelOf(pos.y);
    let k = this.navKey(this.inStairs(pos.x, pos.z) ? 0 : lv, x, z);
    let n = this.nav.get(k);
    if (n && !this.blockedCells.has(k)) return n;
    // nearest unblocked neighbour
    let best = null, bd = 1e9;
    for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) {
      const kk = this.navKey(lv, x + dx, z + dz); const nn = this.nav.get(kk);
      if (!nn || this.blockedCells.has(kk)) continue;
      const d = dx * dx + dz * dz; if (d < bd) { bd = d; best = nn; }
    }
    return best;
  }
  findPath(from, to) {
    const a = this.nodeAt(from), b = this.nodeAt(to);
    if (!a || !b) return null;
    if (a === b) return [b];
    const open = [a.key]; const came = new Map(); const g = new Map([[a.key, 0]]);
    const h = (n) => Math.abs(n.x - b.x) + Math.abs(n.z - b.z) + Math.abs(n.y - b.y);
    const fScore = new Map([[a.key, h(a)]]);
    const closed = new Set();
    let guard = 0;
    while (open.length && guard++ < 4000) {
      let bi = 0; for (let i = 1; i < open.length; i++) if (fScore.get(open[i]) < fScore.get(open[bi])) bi = i;
      const ck = open.splice(bi, 1)[0];
      if (ck === b.key) {
        const path = [this.nav.get(ck)]; let k = ck;
        while (came.has(k)) { k = came.get(k); path.unshift(this.nav.get(k)); }
        return path;
      }
      closed.add(ck);
      const cur = this.nav.get(ck);
      for (const nk of cur.n) {
        if (closed.has(nk)) continue;
        const tg = g.get(ck) + 1;
        if (tg < (g.get(nk) ?? 1e9)) {
          came.set(nk, ck); g.set(nk, tg); fScore.set(nk, tg + h(this.nav.get(nk)));
          if (!open.includes(nk)) open.push(nk);
        }
      }
    }
    return null;
  }
  linkDoor(aKey, bKey) {
    for (const l of this.navLinks) if (l.door && ((l.a === aKey && l.b === bKey) || (l.a === bKey && l.b === aKey))) return l.door;
    return null;
  }
  randomNode(level) {
    const nodes = [...this.nav.values()].filter(n => (level === undefined || n.f === level) && !this.blockedCells.has(n.key) && n.n.size > 0);
    return nodes[Math.floor(Math.random() * nodes.length)];
  }

  // ---------- sight and collision ----------
  segHitsRect(x0, z0, x1, z1, r) {
    // Liang-Barsky
    let t0 = 0, t1 = 1; const dx = x1 - x0, dz = z1 - z0;
    const p = [-dx, dx, -dz, dz], q = [x0 - r.x0, r.x1 - x0, z0 - r.z0, r.z1 - z0];
    for (let i = 0; i < 4; i++) {
      if (Math.abs(p[i]) < 1e-9) { if (q[i] < 0) return false; }
      else { const t = q[i] / p[i]; if (p[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; } }
    }
    return true;
  }
  // Storey of an arbitrary point (feet, eyes or an object), unlike levelOf which
  // is meant for feet heights.
  levelAt(y) { return Math.max(0, Math.min(1, Math.floor((y + 0.05) / H))); }
  wallsBetween(a, b, max = 4) {
    const la = this.inStairs(a.x, a.z) ? -1 : this.levelAt(a.y), lb = this.inStairs(b.x, b.z) ? -1 : this.levelAt(b.y);
    let count = 0;
    if (la !== lb && la !== -1 && lb !== -1) count += 2;
    const lv = la !== -1 ? la : lb !== -1 ? lb : this.levelOf(a.y);
    for (const r of this.walls2D[lv]) { if (this.segHitsRect(a.x, a.z, b.x, b.z, r)) { count++; if (count >= max) return count; } }
    for (const d of this.doors) if (d.level === lv && d.angle < 0.25 && this.segHitsRect(a.x, a.z, b.x, b.z, d.collider)) { count++; if (count >= max) return count; }
    return count;
  }
  lineOfSight(a, b) {
    if (Math.abs(a.y - b.y) > 2.2) return false;
    return this.wallsBetween(a, b, 1) === 0;
  }

  // Resolve a circle against colliders on a level. Returns corrected x,z.
  collide(x, z, r, level, ignoreNoLeave = false) {
    for (let it = 0; it < 3; it++) {
      for (const c of this.colliders[level]) {
        if (c.disabled) continue;
        if (c.noLeave && ignoreNoLeave) continue;
        const nx = Math.max(c.x0, Math.min(x, c.x1)), nz = Math.max(c.z0, Math.min(z, c.z1));
        const dx = x - nx, dz = z - nz; const d2 = dx * dx + dz * dz;
        if (d2 < r * r) {
          if (d2 > 1e-8) { const d = Math.sqrt(d2); x = nx + dx / d * r; z = nz + dz / d * r; }
          else {
            // centre inside the box: push out along the smallest axis
            const pl = x - c.x0, pr = c.x1 - x, pt = z - c.z0, pb = c.z1 - z; const m = Math.min(pl, pr, pt, pb);
            if (m === pl) x = c.x0 - r; else if (m === pr) x = c.x1 + r; else if (m === pt) z = c.z0 - r; else z = c.z1 + r;
          }
        }
      }
    }
    return [x, z];
  }
}
