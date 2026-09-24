// Furniture and set dressing for every room. Static pieces are merged per
// material to keep draw calls low; interactive pieces stay separate meshes.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { H } from './world.js';
import * as TX from './textures.js';

const _m = new THREE.Matrix4(), _l = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();

function draped(w, h, d, seed = 1) {
  const g = new THREE.BoxGeometry(w, h, d, 10, 8, 10);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const t = (y + h / 2) / h; // 0 bottom .. 1 top
    const flare = 1 + (1 - t) * 0.12;
    const round = t > 0.85 ? 1 - (t - 0.85) * 1.2 : 1;
    const n = Math.sin(x * 9 + seed) * Math.cos(z * 7 + seed * 2) * 0.02 + Math.sin(y * 13 + x * 3) * 0.012;
    x *= flare * round; z *= flare * round;
    p.setXYZ(i, x + n, y + (t > 0.97 ? -Math.abs(Math.sin(x * 5)) * 0.03 : 0), z + n);
  }
  g.computeVertexNormals();
  return g;
}

export class Props {
  constructor(world) {
    this.w = world;
    this.M = world.materials;
    this.geo = new Map();
    this.base = new THREE.Matrix4();
    this.level = 0; this.rot = 0; this.ox = 0; this.oz = 0;
    this.dyn = [];
  }
  at(x, z, rot = 0, level = this.level) {
    this.level = level; this.rot = rot; this.ox = x; this.oz = z;
    this.base.makeRotationY(rot).setPosition(x, level * H, z);
    return this;
  }
  local(lx, ly, lz, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    _e.set(rx, ry, rz); _q.setFromEuler(_e);
    _l.compose(_v.set(lx, ly, lz), _q, _s.set(sx, sy, sz));
    return _m.multiplyMatrices(this.base, _l);
  }
  add(geo, mat, lx, ly, lz, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    geo.applyMatrix4(this.local(lx, ly, lz, rx, ry, rz, sx, sy, sz));
    if (!this.geo.has(mat)) this.geo.set(mat, []);
    this.geo.get(mat).push(geo);
    return this;
  }
  box(mat, lx, ly, lz, sx, sy, sz, rx = 0, ry = 0, rz = 0) { return this.add(new THREE.BoxGeometry(sx, sy, sz), mat, lx, ly, lz, rx, ry, rz); }
  cyl(mat, lx, ly, lz, rt, rb, h, seg = 16, rx = 0, ry = 0, rz = 0) { return this.add(new THREE.CylinderGeometry(rt, rb, h, seg), mat, lx, ly, lz, rx, ry, rz); }
  sph(mat, lx, ly, lz, r, sx = 1, sy = 1, sz = 1) { return this.add(new THREE.SphereGeometry(r, 16, 12), mat, lx, ly, lz, 0, 0, 0, sx, sy, sz); }
  plane(mat, lx, ly, lz, w, h, rx = 0, ry = 0, rz = 0) { return this.add(new THREE.PlaneGeometry(w, h), mat, lx, ly, lz, rx, ry, rz); }
  drape(mat, lx, ly, lz, w, h, d, seed = 1) { return this.add(draped(w, h, d, seed), mat, lx, ly, lz); }

  // footprint collider in local space
  solid(lx0, lz0, lx1, lz1, blockNav = true) {
    const pts = [[lx0, lz0], [lx1, lz0], [lx1, lz1], [lx0, lz1]].map(([x, z]) => new THREE.Vector3(x, 0, z).applyMatrix4(this.base));
    const x0 = Math.min(...pts.map(p => p.x)), x1 = Math.max(...pts.map(p => p.x));
    const z0 = Math.min(...pts.map(p => p.z)), z1 = Math.max(...pts.map(p => p.z));
    this.w.addCollider(this.level, x0, z0, x1, z1, { prop: true });
    if (blockNav) {
      for (let z = Math.floor(z0); z <= Math.floor(z1); z++) for (let x = Math.floor(x0); x <= Math.floor(x1); x++) {
        const cx = x + 0.5, cz = z + 0.5;
        // block a cell only when the footprint covers most of it
        const ox = Math.max(0, Math.min(x1, x + 1) - Math.max(x0, x)), oz = Math.max(0, Math.min(z1, z + 1) - Math.max(z0, z));
        if (ox * oz > 0.45 || (cx > x0 && cx < x1 && cz > z0 && cz < z1)) this.w.blockedCells.add(this.w.navKey(this.level, x, z));
      }
    }
    return this;
  }
  // world position of a local point
  wp(lx, ly, lz) { return new THREE.Vector3(lx, ly, lz).applyMatrix4(this.base); }
  // A separate, interactive mesh placed in local space.
  mesh(geo, mat, lx, ly, lz, rx = 0, ry = 0, rz = 0) {
    const m = new THREE.Mesh(geo, typeof mat === 'string' ? this.M[mat] : mat);
    const mat4 = this.local(lx, ly, lz, rx, ry, rz);
    mat4.decompose(m.position, m.quaternion, m.scale);
    m.castShadow = true; m.receiveShadow = true;
    this.w.scene.add(m);
    return m;
  }
  flush() {
    for (const [mat, list] of this.geo) {
      const merged = mergeGeometries(list, false);
      if (!merged) continue;
      const mesh = new THREE.Mesh(merged, this.M[mat]);
      mesh.castShadow = true; mesh.receiveShadow = true;
      this.w.scene.add(mesh);
      this.w.raycastTargets.push(mesh);
      list.forEach(g => g.dispose());
    }
    this.geo.clear();
  }

  // ---------- furniture library (local origin at floor centre, facing +z) ----------
  table(w, d, h = 0.76, mat = 'darkWood') {
    this.box(mat, 0, h - 0.025, 0, w, 0.05, d);
    this.box(mat, 0, h - 0.1, 0, w - 0.1, 0.1, d - 0.1);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) this.box(mat, sx * (w / 2 - 0.07), (h - 0.05) / 2, sz * (d / 2 - 0.07), 0.07, h - 0.05, 0.07);
    return this.solid(-w / 2, -d / 2, w / 2, d / 2);
  }
  chair(mat = 'darkWood', seat = 'fabricRed', collide = true) {
    this.box(mat, 0, 0.45, 0, 0.46, 0.05, 0.46);
    this.box(seat, 0, 0.485, 0.01, 0.42, 0.04, 0.4);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) this.box(mat, sx * 0.2, 0.22, sz * 0.2, 0.04, 0.45, 0.04);
    for (const sx of [-1, 1]) this.box(mat, sx * 0.2, 0.75, -0.21, 0.04, 0.6, 0.04);
    this.box(mat, 0, 0.98, -0.21, 0.44, 0.1, 0.03);
    this.box(mat, 0, 0.75, -0.21, 0.08, 0.45, 0.02);
    if (collide) this.solid(-0.24, -0.24, 0.24, 0.24, false);
    return this;
  }
  sofa(w = 2.0, fabric = 'fabricGreen') {
    this.box(fabric, 0, 0.25, 0, w, 0.3, 0.9);
    this.box(fabric, 0, 0.45, 0.05, w - 0.3, 0.14, 0.75);
    this.box(fabric, 0, 0.72, -0.36, w, 0.55, 0.2);
    for (const s of [-1, 1]) this.box(fabric, s * (w / 2 - 0.1), 0.55, 0, 0.2, 0.35, 0.9);
    for (let i = 0; i < 3; i++) this.box(fabric, -w / 3 + i * w / 3, 0.62, -0.2, w / 3 - 0.08, 0.35, 0.12, -0.2);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) this.cyl('darkWood', sx * (w / 2 - 0.1), 0.05, sz * 0.35, 0.03, 0.02, 0.1, 8);
    return this.solid(-w / 2, -0.45, w / 2, 0.45);
  }
  armchair(fabric = 'fabricRed') {
    this.box(fabric, 0, 0.28, 0, 0.85, 0.3, 0.85);
    this.box(fabric, 0, 0.47, 0.05, 0.6, 0.1, 0.7);
    this.box(fabric, 0, 0.8, -0.35, 0.85, 0.75, 0.18);
    for (const s of [-1, 1]) this.box(fabric, s * 0.36, 0.58, 0, 0.14, 0.32, 0.85);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) this.cyl('darkWood', sx * 0.35, 0.06, sz * 0.35, 0.03, 0.02, 0.12, 8);
    return this.solid(-0.43, -0.43, 0.43, 0.43, false);
  }
  bookshelf(w = 1.8, h = 2.4, d = 0.38) {
    this.box('darkWood', 0, h / 2, -d / 2 + 0.01, w, h, 0.02);
    for (const s of [-1, 1]) this.box('darkWood', s * (w / 2 - 0.02), h / 2, 0, 0.04, h, d);
    const shelves = Math.floor(h / 0.4);
    for (let i = 0; i <= shelves; i++) this.box('darkWood', 0, 0.05 + i * (h - 0.1) / shelves, 0, w, 0.03, d);
    for (let i = 0; i < shelves; i++) {
      const y = 0.07 + i * (h - 0.1) / shelves, sh = (h - 0.1) / shelves - 0.06;
      this.plane('books', 0, y + sh / 2, d / 2 - 0.1, w - 0.1, sh);
      this.box('books', 0, y + sh / 2, -0.02, w - 0.1, sh, 0.24);
    }
    this.box('darkWood', 0, h + 0.04, 0, w + 0.06, 0.08, d + 0.04);
    return this.solid(-w / 2, -d / 2, w / 2, d / 2);
  }
  bed(w = 1.6, l = 2.1, linen = 'linen') {
    this.box('darkWood', 0, 0.3, 0, w, 0.2, l);
    this.box(linen, 0, 0.5, 0.05, w - 0.06, 0.22, l - 0.1);
    this.drape(linen, 0, 0.58, 0.25, w + 0.05, 0.12, l - 0.5, 3);
    for (const s of [-1, 1]) this.box('linen', s * w / 4, 0.68, -l / 2 + 0.3, w / 2 - 0.1, 0.14, 0.4);
    this.box('darkWood', 0, 0.75, -l / 2 - 0.03, w + 0.1, 1.5, 0.08);
    this.box('darkWood', 0, 0.35, l / 2 + 0.03, w + 0.1, 0.7, 0.06);
    for (const s of [-1, 1]) { this.cyl('darkWood', s * (w / 2 + 0.03), 0.8, -l / 2 - 0.03, 0.05, 0.05, 1.6, 10); this.sph('darkWood', s * (w / 2 + 0.03), 1.63, -l / 2 - 0.03, 0.07); }
    return this.solid(-w / 2 - 0.05, -l / 2 - 0.07, w / 2 + 0.05, l / 2 + 0.06);
  }
  nightstand() {
    this.box('darkWood', 0, 0.3, 0, 0.45, 0.6, 0.4);
    this.box('darkWood', 0, 0.61, 0, 0.5, 0.03, 0.45);
    this.box('brass', 0, 0.42, 0.205, 0.08, 0.015, 0.015);
    return this.solid(-0.25, -0.22, 0.25, 0.22, false);
  }
  dresser(w = 1.3) {
    this.box('darkWood', 0, 0.45, 0, w, 0.9, 0.5);
    this.box('darkWood', 0, 0.92, 0, w + 0.06, 0.04, 0.54);
    for (let i = 0; i < 3; i++) { this.box('darkWood', 0, 0.18 + i * 0.27, 0.255, w - 0.1, 0.22, 0.02); this.box('brass', -w / 4, 0.18 + i * 0.27, 0.27, 0.1, 0.02, 0.02); this.box('brass', w / 4, 0.18 + i * 0.27, 0.27, 0.1, 0.02, 0.02); }
    return this.solid(-w / 2, -0.27, w / 2, 0.27);
  }
  wardrobe() {
    this.box('darkWood', 0, 1.05, 0, 1.2, 2.1, 0.6);
    this.box('darkWood', 0, 2.14, 0, 1.28, 0.08, 0.66);
    this.box('darkWood', -0.3, 1.05, 0.305, 0.57, 1.95, 0.02);
    this.box('darkWood', 0.3, 1.05, 0.305, 0.57, 1.95, 0.02);
    for (let i = 0; i < 6; i++) this.box('black', 0.3, 1.5 + i * 0.05, 0.318, 0.4, 0.012, 0.01); // slats
    this.box('brass', -0.03, 1.05, 0.33, 0.02, 0.12, 0.02); this.box('brass', 0.03, 1.05, 0.33, 0.02, 0.12, 0.02);
    return this.solid(-0.62, -0.32, 0.62, 0.32);
  }
  fireplace() {
    this.box('w_brick', 0, 0.65, 0, 1.9, 1.3, 0.5);
    this.box('black', 0, 0.45, 0.2, 1.0, 0.8, 0.2);
    this.box('darkWood', 0, 1.35, 0.05, 2.1, 0.08, 0.62);
    this.box('w_brick', 0, 2.25, -0.05, 1.3, 1.9, 0.4);
    this.box('iron', 0, 0.12, 0.35, 0.8, 0.02, 0.3);
    for (let i = 0; i < 3; i++) this.cyl('darkWood', -0.2 + i * 0.2, 0.16, 0.2, 0.05, 0.05, 0.5, 8, 0, 0, Math.PI / 2);
    return this.solid(-0.95, -0.25, 0.95, 0.4);
  }
  piano() {
    this.box('black', 0, 0.65, 0, 1.5, 1.3, 0.6);
    this.box('black', 0, 0.72, 0.4, 1.5, 0.08, 0.3);
    this.box('porcelain', 0, 0.77, 0.43, 1.3, 0.02, 0.17);
    for (let i = 0; i < 36; i++) this.box('black', -0.63 + i * 0.037, 0.795, 0.4, 0.015, 0.02, 0.1);
    this.box('black', 0, 1.1, 0.3, 1.3, 0.4, 0.02);
    for (const s of [-1, 1]) this.box('black', s * 0.7, 0.35, 0.4, 0.06, 0.7, 0.3);
    this.box('brass', -0.3, 0.05, 0.3, 0.04, 0.02, 0.06); this.box('brass', 0.3, 0.05, 0.3, 0.04, 0.02, 0.06);
    return this.solid(-0.75, -0.3, 0.75, 0.55);
  }
  clock() {
    this.box('redWood', 0, 1.0, 0, 0.5, 2.0, 0.32);
    this.box('redWood', 0, 2.1, 0, 0.56, 0.3, 0.36);
    this.cyl('paintedWhite', 0, 1.78, 0.17, 0.17, 0.17, 0.02, 24, Math.PI / 2);
    this.box('black', 0, 1.1, 0.165, 0.3, 0.9, 0.01);
    return this.solid(-0.26, -0.17, 0.26, 0.17);
  }
  rug(w, d, mat = 'carpet') { return this.box(mat, 0, 0.006, 0, w, 0.012, d); }
  frame(mat, w, h, y = 1.7) {
    this.box('brass', 0, y, 0.02, w + 0.12, h + 0.12, 0.04);
    this.plane(mat, 0, y, 0.045, w, h);
    return this;
  }
  candle(lx, ly, lz, h = 0.18) {
    this.cyl('candle', lx, ly + h / 2, lz, 0.022, 0.025, h, 10);
    return this;
  }
  counter(w) {
    this.box('lightWood', 0, 0.44, 0, w, 0.88, 0.6);
    this.box('concrete', 0, 0.9, 0.02, w + 0.02, 0.04, 0.64);
    for (let i = 0; i < Math.floor(w / 0.6); i++) this.box('lightWood', -w / 2 + 0.3 + i * 0.6, 0.45, 0.305, 0.56, 0.78, 0.02);
    return this.solid(-w / 2, -0.32, w / 2, 0.32);
  }
  crib() {
    this.box('paintedWhite', 0, 0.35, 0, 1.3, 0.05, 0.7);
    this.box('linen', 0, 0.42, 0, 1.25, 0.1, 0.65);
    for (let i = 0; i <= 14; i++) for (const s of [-1, 1]) this.box('paintedWhite', -0.63 + i * 0.09, 0.62, s * 0.34, 0.025, 0.6, 0.025);
    for (const s of [-1, 1]) { this.box('paintedWhite', 0, 0.93, s * 0.34, 1.32, 0.04, 0.05); this.box('paintedWhite', s * 0.65, 0.5, 0, 0.05, 1.0, 0.72); }
    return this.solid(-0.68, -0.38, 0.68, 0.38);
  }
}

// A lamp with a visible bulb. Its PointLight is not added to the scene: the
// game lights the scene with a small fixed pool of real lights and hands them
// to whichever lamps matter most near the camera each frame (see main.js).
function lamp(world, x, y, z, color, intensity, dist, opts = {}) {
  const l = new THREE.PointLight(color, 0, dist, 2);
  l.position.set(x, y, z);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(opts.r || 0.05, 10, 8), world.materials.bulb.clone());
  bulb.position.set(x, y, z);
  world.scene.add(bulb);
  const rec = { light: l, bulb, base: intensity, power: opts.power !== false, flicker: opts.flicker || 0, on: !!opts.on, candle: !!opts.candle };
  world.lights.push(rec);
  return rec;
}

function chandelier(p, world, x, z, level, y = 2.55) {
  p.at(x, z, 0, level);
  p.cyl('brass', 0, y + 0.3, 0, 0.012, 0.012, H - y - 0.3, 6);
  p.sph('brass', 0, y, 0, 0.12, 1, 0.7, 1);
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2;
    p.cyl('brass', Math.cos(a) * 0.25, y + 0.02, Math.sin(a) * 0.25, 0.01, 0.01, 0.5, 6, 0, -a, Math.PI / 2);
    p.cyl('brass', Math.cos(a) * 0.45, y + 0.05, Math.sin(a) * 0.45, 0.04, 0.03, 0.05, 10);
    p.cyl('candle', Math.cos(a) * 0.45, y + 0.13, Math.sin(a) * 0.45, 0.015, 0.015, 0.12, 8);
  }
  return lamp(world, x, level * H + y + 0.15, z, 0xffc88a, 9, 11, { r: 0.07 });
}

function sconce(p, world, x, z, level, rot, y = 1.95) {
  p.at(x, z, rot, level);
  p.box('brass', 0, y - 0.1, 0.03, 0.08, 0.16, 0.04);
  p.cyl('brass', 0, y - 0.05, 0.12, 0.012, 0.012, 0.18, 6, Math.PI / 2);
  p.cyl('paintedWhite', 0, y + 0.06, 0.2, 0.08, 0.05, 0.14, 12, 0, 0, 0);
  const wp = p.wp(0, y + 0.05, 0.2);
  return lamp(world, wp.x, wp.y, wp.z, 0xffb070, 2.2, 6, { r: 0.03, flicker: 0.05 });
}

// Returns named references for the game logic.
export function furnish(world) {
  const p = new Props(world);
  const M = world.materials;
  const refs = { notes: {}, batteries: [], hides: [], lights: {}, decals: [] };
  const R = Math.PI;

  // ===================== GROUND FLOOR =====================
  // --- Foyer (x 8-16, z 7-13)
  p.at(12, 10, 0, 0).rug(3.2, 4.2, 'carpet');
  refs.lights.foyer = chandelier(p, world, 12, 10, 0);
  p.at(9.0, 8.1, 0, 0).table(1.1, 0.45, 0.8, 'redWood');
  p.at(15.55, 11.6, -R / 2, 0).clock();
  refs.clockPos = new THREE.Vector3(15.5, 1.5, 11.6);
  p.at(8.35, 11.8, R / 2, 0).box('brass', 0, 0.9, 0, 0.05, 1.8, 0.05).sph('brass', 0, 1.8, 0, 0.05).box('fabricBeige', 0, 1.45, 0.12, 0.35, 0.6, 0.15);
  p.at(12, 7.18, 0, 0).frame('portrait', 0.8, 1.05, 1.75);
  p.at(8.05, 9.3, R / 2, 0).frame('fruit', 0.9, 0.7, 1.7);
  // phone on the side table
  const phone = new THREE.Group();
  const pbase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.24), M.black); pbase.position.y = 0.04; phone.add(pbase);
  const pdial = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 20), M.paintedWhite); pdial.position.set(0, 0.085, 0.03); phone.add(pdial);
  const handset = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.2, 4, 8), M.black); handset.rotation.z = Math.PI / 2; handset.position.set(0, 0.11, -0.05); phone.add(handset);
  phone.position.set(9.3, 0.8, 8.1); world.scene.add(phone);
  phone.traverse(o => { if (o.isMesh) o.castShadow = true; });
  refs.phone = phone; refs.handset = handset;
  refs.notes.dossier = paperOn(world, 8.8, 0.805, 8.1, 0.3);
  refs.frontDoorPos = new THREE.Vector3(11.5, 1.1, 13);

  // --- Living room (x 0-8, z 7-13)
  p.at(0.3, 10, R / 2, 0).fireplace();
  p.at(0.1, 10, R / 2, 0).frame('portrait2', 0.7, 0.9, 2.35);
  p.at(3.6, 10, -R / 2, 0).sofa(2.2, 'fabricGreen');
  p.at(2.0, 10, 0, 0).table(0.6, 1.1, 0.42);
  p.at(3.9, 10, 0, 0).rug(4, 3, 'carpet');
  p.at(1.6, 8.0, R * 0.8, 0).armchair('fabricRed');
  p.at(1.6, 12.0, R * 0.2, 0).armchair('fabricRed');
  p.at(4.5, 12.75, R, 0).bookshelf(2.2, 2.3);
  p.at(7.6, 12.2, -R / 2, 0).drape('linen', 0, 0.55, 0, 0.9, 1.1, 0.7, 5).solid(-0.45, -0.4, 0.45, 0.4);
  // old CRT television
  p.at(6.8, 7.45, 0, 0).box('redWood', 0, 0.3, 0, 0.8, 0.6, 0.5).box('black', 0, 0.85, 0, 0.66, 0.52, 0.5).solid(-0.4, -0.25, 0.4, 0.25);
  const tvScreen = p.mesh(new THREE.PlaneGeometry(0.5, 0.38), new THREE.MeshBasicMaterial({ color: 0x000000 }), 0, 0.86, 0.255);
  refs.tv = tvScreen; refs.tvPos = p.wp(0, 0.86, 0.4);
  sconce(p, world, 0.08, 8.2, 0, R / 2);

  // --- Kitchen (x 0-8, z 0-5)
  p.at(2.6, 0.32, 0, 0).counter(5);
  p.at(0.32, 2.6, R / 2, 0).counter(2.4);
  p.at(5.9, 0.35, 0, 0).box('enamel', 0, 0.45, 0, 0.8, 0.9, 0.65).box('iron', 0, 0.92, 0, 0.76, 0.03, 0.6).solid(-0.4, -0.33, 0.4, 0.33);
  for (const [dx, dz] of [[-0.18, -0.12], [0.18, -0.12], [-0.18, 0.14], [0.18, 0.14]]) p.at(5.9, 0.35, 0, 0).cyl('iron', dx, 0.945, dz, 0.09, 0.09, 0.02, 16);
  p.at(5.9, 0.35, 0, 0).cyl('iron', -0.15, 1.02, 0.12, 0.12, 0.1, 0.14, 16).cyl('iron', 0.15, 0.99, -0.1, 0.13, 0.13, 0.08, 16);
  p.at(7.4, 0.4, 0, 0).box('enamel', 0, 0.9, 0, 0.75, 1.8, 0.7).box('chrome', 0.3, 1.1, 0.36, 0.03, 0.4, 0.03).solid(-0.38, -0.36, 0.38, 0.36);
  p.at(2.8, 0.32, 0, 0).box('porcelain', 0, 0.86, 0.02, 0.8, 0.1, 0.5).cyl('chrome', 0, 1.05, -0.18, 0.015, 0.015, 0.3, 8);
  p.at(3.7, 3.0, 0, 0).table(1.4, 0.9, 0.76, 'lightWood');
  p.at(3.2, 3.8, R, 0).chair('lightWood', 'lightWood');
  p.at(4.3, 2.2, 0.3, 0).chair('lightWood', 'lightWood');
  p.at(2.5, 3.2, R / 2 + 0.9, 0).chair('lightWood', 'lightWood', false);
  // hanging pans
  for (let i = 0; i < 4; i++) p.at(1.2 + i * 0.4, 0.1, 0, 0).cyl('iron', 0, 1.7, 0.04, 0.1 + i * 0.015, 0.09, 0.05, 14, Math.PI / 2);
  refs.notes.grocery = paperOn(world, 1.6, 0.925, 0.35, 0.6);
  // the drawer with the fuse: a front panel with a handle and a tray that slides out
  const drawer = new THREE.Group();
  const df = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.03), M.lightWood); df.castShadow = true; drawer.add(df);
  const dh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.022, 0.03), M.brass); dh.position.set(0, 0, 0.03); drawer.add(dh);
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.012, 0.32), M.lightWood); tray.position.set(0, -0.07, -0.17); drawer.add(tray);
  for (const sx of [-1, 1]) { const side = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.12, 0.32), M.lightWood); side.position.set(sx * 0.23, -0.02, -0.17); drawer.add(side); }
  const dHit = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.5), new THREE.MeshBasicMaterial({ visible: false })); dHit.position.z = -0.05; drawer.add(dHit);
  drawer.position.set(4.35, 0.75, 0.64); world.scene.add(drawer);
  refs.drawer = drawer;
  refs.fuse = itemMesh(world, 'fuse', 4.35, 0.69, 0.5);
  refs.fuse.scale.setScalar(1.8);
  refs.fuse.visible = false;
  refs.lights.kitchen = lamp(world, 3.7, 2.9, 2.6, 0xfff0d8, 7, 9, { r: 0.08, flicker: 0.02 });
  p.at(3.7, 2.6, 0, 0).cyl('paintedWhite', 0, 3.05, 0, 0.01, 0.01, 0.3, 6).cyl('enamel', 0, 2.9, 0, 0.08, 0.28, 0.16, 18);
  decal(world, 'blood', 5.2, 0.01, 3.4, 1.0, 0);
  decal(world, 'bloodDrag', 6.2, 0.011, 4.1, 1.6, 0.4);

  // --- Dining room (x 8-16, z 0-5)
  p.at(12, 2.3, 0, 0).rug(5.4, 3, 'carpet2');
  p.at(12, 2.3, 0, 0).table(3.6, 1.1, 0.78, 'redWood');
  for (let i = 0; i < 4; i++) { p.at(10.65 + i * 0.9, 1.45, 0, 0).chair('redWood', 'fabricRed'); p.at(10.65 + i * 0.9, 3.15, R, 0).chair('redWood', 'fabricRed'); }
  p.at(9.3, 2.3, R / 2, 0).chair('redWood', 'fabricRed');
  p.at(14.7, 2.3, -R / 2 + 0.5, 0).chair('redWood', 'fabricRed', false);
  // place settings and candelabra
  for (let i = 0; i < 4; i++) for (const s of [-1, 1]) p.at(10.65 + i * 0.9, 2.3 + s * 0.4, 0, 0).cyl('porcelain', 0, 0.79, 0, 0.12, 0.1, 0.015, 20);
  p.at(12, 2.3, 0, 0).cyl('brass', 0, 0.9, 0, 0.02, 0.07, 0.25, 10).cyl('brass', 0, 1.02, 0, 0.2, 0.2, 0.02, 12).candle(-0.18, 1.03, 0).candle(0.18, 1.03, 0).candle(0, 1.03, 0);
  p.at(12, 0.28, 0, 0).dresser(2.2);
  p.at(12, 0.02, 0, 0).frame('portrait', 1.0, 1.3, 1.95);
  chandelier(p, world, 12, 2.3, 0).base = 6;

  // --- Study (x 16-24, z 0-5)
  p.at(20, 2.2, 0, 0).rug(3.6, 2.6, 'carpet');
  p.at(20, 1.6, 0, 0).table(1.6, 0.8, 0.78, 'redWood');
  p.at(20, 1.6, 0, 0).box('redWood', -0.55, 0.38, 0, 0.45, 0.72, 0.7).box('redWood', 0.55, 0.38, 0, 0.45, 0.72, 0.7);
  p.at(20, 0.9, 0, 0).chair('redWood', 'fabricRed', false);
  p.at(23.75, 2.5, -R / 2, 0).bookshelf(3.2, 2.6);
  p.at(16.25, 2.0, R / 2, 0).bookshelf(2.4, 2.6);
  p.at(17.4, 4.2, R * 0.75, 0).armchair('fabricGreen');
  p.at(20.5, 1.45, 0, 0).cyl('brass', 0, 0.8, 0, 0.08, 0.1, 0.02, 12).cyl('brass', 0, 1.0, 0, 0.012, 0.012, 0.4, 6).cyl('fabricGreen', 0, 1.22, 0, 0.07, 0.15, 0.14, 16);
  refs.lights.study = lamp(world, 20.5, 1.2, 1.45, 0xffd8a0, 2.5, 5, { r: 0.03 });
  refs.notes.thomas = paperOn(world, 19.7, 0.805, 1.7, 0.2);
  p.at(22.6, 4.5, 0, 0).cyl('darkWood', 0, 0.35, 0, 0.03, 0.12, 0.7, 10).sph('lightWood', 0, 0.95, 0, 0.24);
  // wall safe on the north wall
  p.at(18, 0.08, 0, 0).frame('portrait2', 0.6, 0.8, 1.9);
  const safe = new THREE.Group();
  const sbody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.05), M.iron); safe.add(sbody);
  const sdoor = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.04), M.metalGrey); sdoor.position.set(0, 0, 0.03); safe.add(sdoor);
  const sdial = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 20), M.chrome); sdial.rotation.x = Math.PI / 2; sdial.position.set(0.08, 0.05, 0.06); safe.add(sdial);
  const spad = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.02), M.black); spad.position.set(-0.1, 0.02, 0.06); safe.add(spad);
  safe.position.set(21.6, 1.45, 0.11); world.scene.add(safe);
  refs.safe = safe; refs.safeDoor = sdoor;
  refs.frontKey = itemMesh(world, 'frontKey', 21.6, 1.36, 0.05); refs.frontKey.visible = false;
  refs.notes.confession = paperOn(world, 21.55, 1.26, 0.06, 0); refs.notes.confession.visible = false;

  // --- Utility room (x 0-3, z 5-7): kept clear so the fuse box on the west wall is easy to reach
  p.at(1.9, 6.78, Math.PI, 0).box('metalGrey', 0, 0.9, 0, 1.2, 0.04, 0.4).box('metalGrey', 0, 1.5, 0, 1.2, 0.04, 0.4).box('metalGrey', 0, 0.3, 0, 1.2, 0.04, 0.4)
    .box('iron', -0.58, 0.9, 0, 0.03, 1.8, 0.4).box('iron', 0.58, 0.9, 0, 0.03, 1.8, 0.4).box('fabricBeige', -0.3, 1.05, 0, 0.3, 0.26, 0.3).cyl('enamel', 0.3, 1.64, 0, 0.1, 0.1, 0.24, 12).solid(-0.6, -0.22, 0.6, 0.22, false);
  p.at(0.42, 6.6, R / 2, 0).cyl('enamel', 0, 0.8, 0, 0.28, 0.28, 1.6, 20).solid(-0.3, -0.3, 0.3, 0.3, false);
  // the fuse box: a big grey panel with a blinking red light and a label
  const fuseBox = new THREE.Group();
  const fb = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.72, 0.52), M.metalGrey); fuseBox.add(fb);
  const fbd = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.64, 0.46), M.iron); fbd.position.x = 0.06; fuseBox.add(fbd);
  for (let i = 0; i < 4; i++) { const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12), i === 2 ? M.black : M.porcelain); sock.rotation.z = Math.PI / 2; sock.position.set(0.075, 0.12 - i * 0.1, -0.08); fuseBox.add(sock); }
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff2a1a })); led.position.set(0.075, 0.26, 0.16); fuseBox.add(led);
  const lc = document.createElement('canvas'); lc.width = 256; lc.height = 64; const lx = lc.getContext('2d');
  lx.fillStyle = '#e8dcc0'; lx.fillRect(0, 0, 256, 64); lx.fillStyle = '#1a1208'; lx.font = 'bold 40px sans-serif'; lx.textAlign = 'center'; lx.textBaseline = 'middle'; lx.fillText('FUSES', 128, 34);
  const lt = new THREE.CanvasTexture(lc); lt.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.075), new THREE.MeshStandardMaterial({ map: lt, roughness: 0.8 }));
  label.rotation.y = Math.PI / 2; label.position.set(0.072, 0.42, 0); fuseBox.add(label);
  // generous invisible hit area in front of the panel
  const fbHit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.0, 0.8), new THREE.MeshBasicMaterial({ visible: false })); fbHit.position.x = 0.2; fuseBox.add(fbHit);
  fuseBox.position.set(0.14, 1.45, 5.75); world.scene.add(fuseBox);
  refs.fuseBox = fuseBox; refs.fuseLed = led;
  refs.lights.utility = lamp(world, 1.5, 3.0, 6, 0xfff4e0, 3, 5, { r: 0.05, flicker: 0.12 });

  // --- Hall (x 3-24, z 5-7)
  for (let x = 4; x < 23; x += 4.5) p.at(x + 1.5, 6, 0, 0).rug(3.6, 1.1, 'carpet');
  p.at(7.5, 5.22, 0, 0).table(0.9, 0.34, 0.8, 'redWood');
  p.at(7.5, 5.22, 0, 0).cyl('porcelain', 0, 0.92, 0, 0.07, 0.05, 0.25, 12);
  p.at(15, 5.2, 0, 0).frame('portrait2', 0.5, 0.7, 1.7);
  p.at(9.5, 6.82, R, 0).frame('fruit', 0.7, 0.55, 1.7);
  p.at(17.5, 6.82, R, 0).frame('portrait', 0.6, 0.8, 1.7);
  refs.lights.hallW = sconce(p, world, 6, 6.84, 0, R);
  refs.lights.hallE = sconce(p, world, 20.5, 6.84, 0, R);
  refs.notes.battery1 = null;

  // --- Under-stair closet (x 22-24, z 7-9)
  p.at(23.4, 8.6, 0, 0).box('lightWood', 0, 0.2, 0, 0.5, 0.4, 0.4).cyl('lightWood', 0, 0.9, 0, 0.015, 0.015, 1.4, 6, 0.25).solid(-0.25, -0.2, 0.25, 0.2, false);
  refs.batteries.push(itemMesh(world, 'battery', 22.4, 0.02, 8.5));

  // --- Music room (x 16-24, z 9-13)
  p.at(23.6, 11, -R / 2, 0).piano();
  p.at(23.0, 11, -R / 2, 0).box('black', 0, 0.45, 0, 0.9, 0.06, 0.35).box('black', -0.4, 0.22, 0, 0.04, 0.44, 0.3).box('black', 0.4, 0.22, 0, 0.04, 0.44, 0.3).solid(-0.45, -0.18, 0.45, 0.18, false);
  refs.notes.lullaby = paperOn(world, 23.3, 1.22, 11, Math.PI / 2, -1.2);
  refs.pianoPos = new THREE.Vector3(23.6, 1, 11);
  p.at(18, 12.2, 0, 0).drape('linen', 0, 0.5, 0, 0.9, 1.0, 0.9, 7).solid(-0.45, -0.45, 0.45, 0.45);
  p.at(19.5, 12.3, 0, 0).drape('linen', 0, 0.45, 0, 1.8, 0.9, 0.8, 9).solid(-0.9, -0.4, 0.9, 0.4);
  p.at(17.2, 10, R * 0.25, 0).armchair('fabricGreen');
  // gramophone
  p.at(20.5, 9.35, 0, 0).table(0.6, 0.5, 0.75, 'redWood').box('redWood', 0, 0.85, 0, 0.4, 0.18, 0.4).cyl('brass', 0, 1.1, 0.1, 0.02, 0.02, 0.4, 8, 0.6).cyl('brass', 0, 1.35, 0.3, 0.26, 0.01, 0.4, 20, 1.2);
  refs.lights.music = sconce(p, world, 16.1, 10.3, 0, R / 2);
  p.at(20, 11, 0, 0).rug(3, 2.4, 'carpet2');
  p.at(21.5, 9.9, 0, 0).chair('darkWood', 'fabricBeige').box('fabricBeige', 0, 0.75, -0.18, 0.5, 0.7, 0.1);

  // --- Porch
  p.at(9, 13.8, 0, 0).box('darkWood', 0, 0.42, 0, 1.2, 0.05, 0.45).box('darkWood', 0, 0.7, -0.2, 1.2, 0.5, 0.04)
    .box('iron', -0.55, 0.2, 0, 0.04, 0.4, 0.4).box('iron', 0.55, 0.2, 0, 0.04, 0.4, 0.4).solid(-0.6, -0.25, 0.6, 0.25);
  refs.lights.porch = lamp(world, 11.5, 2.7, 13.35, 0xffcf90, 3, 6, { r: 0.06, power: false, flicker: 0.25, on: true });

  // ===================== UPPER FLOOR =====================
  // --- Gallery (x 0-24, z 5-7, landing x 22-24 z 7-9)
  for (let x = 1; x < 22; x += 5) p.at(x + 2, 6, 0, 1).rug(4, 1.1, 'carpet');
  p.at(2, 5.2, 0, 1).frame('portrait', 0.6, 0.8, 1.75);
  p.at(8.5, 5.2, 0, 1).frame('portrait2', 0.55, 0.75, 1.75);
  p.at(15, 5.22, 0, 1).table(0.8, 0.34, 0.8, 'redWood');
  refs.batteries.push(itemMesh(world, 'battery', 15.1, H + 0.8, 5.22));
  p.at(0.3, 6, R / 2, 1).drape('linen', 0, 0.55, 0, 0.8, 1.1, 0.8, 11).solid(-0.4, -0.4, 0.4, 0.4, false);
  refs.lights.gallery = sconce(p, world, 12, 5.16, 1, 0);
  refs.lights.gallery2 = sconce(p, world, 23.84, 7.5, 1, -R / 2);

  // --- Master bedroom (x 0-10, z 0-5)
  p.at(4.8, 1.2, 0, 1).bed(1.7, 2.1);
  p.at(3.5, 0.35, 0, 1).nightstand();
  p.at(6.1, 0.35, 0, 1).nightstand();
  p.at(6.1, 0.35, 0, 1).cyl('brass', 0, 0.63, 0, 0.07, 0.09, 0.02, 12).cyl('brass', 0, 0.8, 0, 0.012, 0.012, 0.35, 6).cyl('fabricRed', 0, 1.0, 0, 0.08, 0.15, 0.16, 16);
  refs.lights.master = lamp(world, 6.1, H + 0.98, 0.35, 0xffb888, 2.5, 5.5, { r: 0.03, flicker: 0.04 });
  refs.notes.diary = paperOn(world, 3.5, H + 0.625, 0.35, 0.3);
  p.at(0.35, 2.4, R / 2, 1).dresser(1.4);
  p.at(0.05, 2.4, R / 2, 1).box('darkWood', 0, 1.55, 0, 0.8, 1.0, 0.04).plane('mirror', 0, 1.55, 0.025, 0.7, 0.9);
  // jewellery box holds the nursery key
  const jbox = new THREE.Group();
  const jb = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.09, 0.16), M.redWood); jb.position.y = 0.045; jbox.add(jb);
  const jl = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.03, 0.17), M.redWood); jl.position.y = 0.105; jbox.add(jl);
  jbox.position.set(0.4, H + 0.94, 2.1); jbox.rotation.y = 0.2; world.scene.add(jbox);
  refs.jewelBox = jbox; refs.jewelLid = jl;
  refs.nurseryKey = itemMesh(world, 'nurseryKey', 0.4, H + 1.0, 2.1); refs.nurseryKey.visible = false;
  p.at(8.9, 0.4, 0, 1).wardrobe();
  refs.hides.push({ pos: p.wp(0, 1.45, 0.36), look: p.wp(0, 1.45, 2), exit: p.wp(0, 0, 1.0), level: 1, name: 'wardrobe' });
  p.at(4.8, 2.9, 0, 1).rug(3, 2, 'carpet2');
  p.at(8.6, 3.8, R * 0.8, 1).armchair('fabricBeige');
  p.at(4.8, 0.03, 0, 1).frame('portrait2', 0.5, 0.65, 2.2);
  decal(world, 'bloodDrag', 2.5, H + 0.012, 3.8, 1.2, 1.2);

  // --- Bathroom (x 10-14, z 0-5)
  p.at(12, 0.55, 0, 1).box('porcelain', 0, 0.3, 0, 1.6, 0.5, 0.72).box('porcelain', 0, 0.55, 0, 1.64, 0.06, 0.76).box('black', 0, 0.57, 0, 1.4, 0.02, 0.55);
  for (const [dx, dz] of [[-0.7, -0.3], [0.7, -0.3], [-0.7, 0.3], [0.7, 0.3]]) p.at(12, 0.55, 0, 1).sph('brass', dx, 0.06, dz, 0.06);
  p.at(12, 0.55, 0, 1).solid(-0.82, -0.38, 0.82, 0.38);
  p.at(13.65, 3.2, -R / 2, 1).box('porcelain', 0, 0.22, 0.1, 0.36, 0.44, 0.5).box('porcelain', 0, 0.62, -0.12, 0.4, 0.4, 0.18).solid(-0.2, -0.22, 0.2, 0.36, false);
  p.at(10.3, 2.4, R / 2, 1).cyl('porcelain', 0, 0.42, 0, 0.1, 0.07, 0.84, 12).box('porcelain', 0, 0.86, 0.05, 0.55, 0.12, 0.42).solid(-0.28, -0.2, 0.28, 0.28, false);
  const mirror = p.mesh(new THREE.PlaneGeometry(0.55, 0.75), M.mirror, 0, 1.55, -0.2);
  p.at(10.3, 2.4, R / 2, 1).box('brass', 0, 1.55, -0.22, 0.62, 0.82, 0.02);
  refs.mirror = mirror; refs.mirrorPos = mirror.position.clone();
  refs.mirrorText = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.3), new THREE.MeshBasicMaterial({ map: TX.textDecal(['WHERE IS', 'SHE'], 'rgba(120,6,6,0.95)', 512, 280, 'bold 90px Georgia'), transparent: true, opacity: 0 }));
  refs.mirrorText.position.copy(mirror.position).add(new THREE.Vector3(0.005, 0.05, 0)); refs.mirrorText.quaternion.copy(mirror.quaternion);
  world.scene.add(refs.mirrorText);
  decal(world, 'blood', 11.6, H + 0.012, 2.5, 0.6, 0);
  refs.lights.bath = lamp(world, 12, H + 2.9, 2.5, 0xe8f0ff, 4, 6, { r: 0.07, flicker: 0.3 });

  // --- Nursery (x 14-24, z 0-5)
  p.at(19, 1.4, 0, 1).rug(3.4, 2.4, 'carpet2');
  p.at(19, 1.0, 0, 1).crib();
  const mobile = new THREE.Group();
  const mArm = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.6, 6), M.brass); mArm.rotation.z = Math.PI / 2; mobile.add(mArm);
  const mArm2 = mArm.clone(); mArm2.rotation.set(0, Math.PI / 2, Math.PI / 2); mobile.add(mArm2);
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2; const s = new THREE.Mesh(i % 2 ? new THREE.SphereGeometry(0.04, 10, 8) : new THREE.OctahedronGeometry(0.05), M.paintedWhite);
    s.position.set(Math.cos(a) * 0.3, -0.25, Math.sin(a) * 0.3); mobile.add(s);
    const str = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.25, 4), M.linen); str.position.set(Math.cos(a) * 0.3, -0.12, Math.sin(a) * 0.3); mobile.add(str);
  }
  mobile.position.set(19, H + 1.6, 1.0); world.scene.add(mobile); refs.mobile = mobile;
  p.at(19, 1.0, 0, 1).cyl('brass', 0, 2.4, 0, 0.004, 0.004, 1.6, 4);
  // rocking chair (animated)
  const rocker = new THREE.Group();
  const rockGeo = [];
  const addR = (g, x, y, z, rx = 0, rz = 0) => { g.rotateX(rx); g.rotateZ(rz); g.translate(x, y, z); rockGeo.push(g); };
  addR(new THREE.BoxGeometry(0.5, 0.04, 0.5), 0, 0.45, 0);
  addR(new THREE.BoxGeometry(0.5, 0.7, 0.03), 0, 0.85, -0.24, -0.15);
  for (const s of [-1, 1]) { addR(new THREE.TorusGeometry(0.6, 0.02, 6, 20, 1.0), s * 0.22, 0.62, 0, 0, 0); rockGeo[rockGeo.length - 1].rotateY(Math.PI / 2); addR(new THREE.BoxGeometry(0.03, 0.45, 0.03), s * 0.22, 0.24, 0.18); addR(new THREE.BoxGeometry(0.03, 0.45, 0.03), s * 0.22, 0.24, -0.18); }
  const rockMesh = new THREE.Mesh(mergeGeometries(rockGeo.map(g => (g.index ? g.toNonIndexed() : g))), M.lightWood);
  rockMesh.castShadow = true; rocker.add(rockMesh);
  rocker.position.set(22.5, H, 3.6); rocker.rotation.y = -2.4; world.scene.add(rocker);
  world.addCollider(1, 22.2, 3.3, 22.8, 3.9, { prop: true });
  refs.rocker = rocker;
  p.at(16, 0.3, 0, 1).dresser(1.2);
  refs.musicBox = itemMesh(world, 'musicBox', 16, H + 0.94, 0.35);
  refs.musicBoxPos = new THREE.Vector3(16, H + 1, 0.35);
  p.at(19, 0.03, 0, 1).frame('paper', 0.35, 0.45, 1.6);
  refs.notes.birth = paperOn(world, 19, H + 1.6, 0.06, 0, 0, true);
  p.at(15.2, 3.8, 0.5, 1).box('lightWood', 0, 0.4, 0, 0.8, 0.1, 0.2).box('lightWood', 0, 0.62, 0.02, 0.2, 0.35, 0.5).sph('paintedWhite', 0, 0.9, 0.2, 0.12, 0.8, 1, 1.2).solid(-0.4, -0.3, 0.4, 0.3, false);
  for (let i = 0; i < 5; i++) p.at(17 + i * 0.3, 3.5 + (i % 2) * 0.3, i, 1).box(['fabricRed', 'fabricGreen', 'paintedWhite'][i % 3], 0, 0.05, 0, 0.1, 0.1, 0.1);
  p.at(23.4, 0.4, -R / 2, 1).wardrobe();
  refs.lights.nursery = lamp(world, 16.2, H + 1.1, 0.35, 0xffc0d8, 1.2, 4, { r: 0.04, flicker: 0.02 });

  // --- Guest room (x 0-8, z 7-13)
  p.at(1.2, 11, R / 2, 1).bed(1.4, 2.0, 'linen');
  p.at(1.2, 9.6, R / 2, 1).nightstand();
  p.at(7.5, 12.5, -R / 2, 1).wardrobe();
  refs.hides.push({ pos: p.wp(0, 1.45, 0.36), look: p.wp(0, 1.45, 2), exit: p.wp(0, 0, 1.0), level: 1, name: 'wardrobe' });
  p.at(5, 12.7, R, 1).dresser(1.2);
  p.at(3.6, 8.4, 1.9, 1).box('darkWood', 0, 0.1, 0, 0.46, 0.46, 0.05, R / 2).box('darkWood', 0, 0.3, -0.35, 0.44, 0.04, 0.5);
  refs.kowalskiPos = new THREE.Vector3(4.6, H, 10.4);
  decal(world, 'blood', 4.6, H + 0.012, 10.3, 1.8, 0.4);
  decal(world, 'bloodDrag', 3.4, H + 0.013, 9.8, 1.6, 2.4);
  refs.notes.kowalski = paperOn(world, 5.4, H + 0.02, 10.9, 0.8);
  refs.studyKey = itemMesh(world, 'studyKey', 5.1, H + 0.02, 9.95);

  // --- Library (x 8-16, z 7-13)
  p.at(12, 12.75, R, 1).bookshelf(3.8, 2.6);
  p.at(8.25, 10.5, R / 2, 1).bookshelf(3.6, 2.6);
  p.at(15.75, 11.0, -R / 2, 1).bookshelf(3.6, 2.6);
  p.at(12, 10, 0, 1).rug(3.2, 2.4, 'carpet');
  p.at(12, 10, 0, 1).table(1.8, 0.9, 0.78, 'redWood');
  p.at(12, 9.2, 0, 1).chair('redWood', 'fabricGreen');
  p.at(11.5, 10.2, 0, 1).candle(0, 0.8, 0).candle(0.1, 0.8, 0.05, 0.12);
  refs.lights.library = lamp(world, 11.5, H + 1.05, 10.2, 0xff9a40, 1.4, 5, { r: 0.012, candle: true, flicker: 0.35, power: false, on: true });
  refs.notes.research = paperOn(world, 12.3, H + 0.805, 9.95, 2.8);
  for (let i = 0; i < 6; i++) p.at(13 + (i % 3) * 0.3, 8.2 + Math.floor(i / 3) * 0.4, i * 0.7, 1).box('books', 0, 0.03 + (i % 2) * 0.06, 0, 0.25, 0.06, 0.18);
  refs.batteries.push(itemMesh(world, 'battery', 12.9, H + 0.8, 10.2));

  // --- Chapel (x 16-24, z 9-13)
  const circle = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.18, 64), new THREE.MeshStandardMaterial({ color: 0x5a0a0a, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -4 }));
  circle.rotation.x = -Math.PI / 2; circle.position.set(20, H + 0.011, 11); world.scene.add(circle);
  const circle2 = new THREE.Mesh(new THREE.RingGeometry(0.75, 0.8, 5), circle.material); circle2.rotation.x = -Math.PI / 2; circle2.position.copy(circle.position); world.scene.add(circle2);
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2;
    p.at(20 + Math.cos(a) * 1.35, 11 + Math.sin(a) * 1.35, 0, 1).candle(0, 0, 0, 0.1 + (i % 3) * 0.06);
  }
  refs.lights.chapelA = lamp(world, 19, H + 0.3, 11.8, 0xff8a30, 1.6, 5, { r: 0.01, candle: true, flicker: 0.4, power: false, on: true });
  refs.lights.chapelB = lamp(world, 21.2, H + 0.3, 10.2, 0xff8a30, 1.4, 5, { r: 0.01, candle: true, flicker: 0.4, power: false, on: true });
  p.at(20, 12.6, R, 1).box('darkWood', 0, 0.5, 0, 1.6, 1.0, 0.6).box('linen', 0, 1.01, 0, 1.64, 0.02, 0.64).solid(-0.8, -0.3, 0.8, 0.3);
  p.at(20, 12.6, R, 1).candle(-0.5, 1.02, 0, 0.3).candle(0.5, 1.02, 0, 0.25).cyl('brass', 0, 1.3, 0.1, 0.02, 0.02, 0.6, 6).box('brass', 0, 1.45, 0.1, 0.3, 0.03, 0.03);
  // sheet-covered figure in a chair: what is left of Thomas
  p.at(20, 11.1, R, 1).drape('linen', 0, 0.7, 0, 0.6, 1.4, 0.55, 13).sph('linen', 0, 1.45, 0, 0.13, 1, 1.15, 1).solid(-0.35, -0.35, 0.35, 0.35);
  refs.thomasPos = new THREE.Vector3(20, H + 1.2, 11.1);
  refs.notes.chapel = paperOn(world, 19.2, H + 0.012, 10.3, 0.5);
  p.at(16.2, 11, R / 2, 1).frame('portrait2', 0.6, 0.8, 1.8);
  decal(world, 'blood', 21.3, H + 0.012, 11.8, 0.8, 0.2);

  p.flush();
  // Mark cells blocked by the stairs well etc. after furnishing.
  return refs;
}

function paperOn(world, x, y, z, rotY = 0, tilt = 0, wall = false) {
  const g = new THREE.PlaneGeometry(0.21, 0.29);
  const m = new THREE.Mesh(g, world.materials.paper);
  if (wall) { m.position.set(x, y, z + 0.03); }
  else { m.rotation.x = -Math.PI / 2 + tilt; m.rotation.z = rotY; m.position.set(x, y + 0.004, z); }
  m.receiveShadow = true;
  world.scene.add(m);
  return m;
}

function decal(world, mat, x, y, z, size, rot) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), world.materials[mat]);
  m.rotation.x = -Math.PI / 2; m.rotation.z = rot; m.position.set(x, y, z);
  m.receiveShadow = true;
  world.scene.add(m);
  return m;
}

// Small pickup meshes.
export function itemMesh(world, kind, x, y, z) {
  const M = world.materials; const g = new THREE.Group();
  if (kind === 'fuse') {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.07, 12), M.porcelain); b.rotation.z = Math.PI / 2; g.add(b);
    for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.012, 12), M.brass); c.rotation.z = Math.PI / 2; c.position.x = s * 0.04; g.add(c); }
    g.position.y = 0.02;
  } else if (kind === 'battery') {
    for (const s of [-1, 1]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0x1a4a1a, roughness: 0.4, metalness: 0.3 }));
      b.rotation.z = Math.PI / 2; b.position.set(0, 0.016, s * 0.02); g.add(b);
    }
  } else if (kind === 'musicBox') {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.09, 0.13), M.redWood); b.position.y = 0.045; g.add(b);
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.13), M.redWood); l.position.set(0, 0.1, -0.05); l.rotation.x = -1.2; l.position.z = -0.1; g.add(l);
    const bal = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.07, 10), M.paintedWhite); bal.position.set(0, 0.125, 0); g.add(bal);
    const hd = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), M.paintedWhite); hd.position.set(0, 0.17, 0); g.add(hd);
    const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.05, 6), M.brass); crank.rotation.z = Math.PI / 2; crank.position.set(0.11, 0.05, 0); g.add(crank);
  } else {
    // keys
    const col = kind === 'nurseryKey' ? M.chrome : M.brass;
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.005, 6, 16), col); bow.rotation.x = Math.PI / 2; bow.position.set(-0.04, 0.006, 0); g.add(bow);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.08, 6), col); shaft.rotation.z = Math.PI / 2; shaft.position.set(0.02, 0.006, 0); g.add(shaft);
    const bit = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.004, 0.02), col); bit.position.set(0.05, 0.006, 0.01); g.add(bit);
    if (kind === 'nurseryKey') { const rib = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.003, 0.05), new THREE.MeshStandardMaterial({ color: 0xd87090 })); rib.position.set(-0.06, 0.004, 0.02); rib.rotation.y = 0.4; g.add(rib); }
    if (kind === 'studyKey' || kind === 'frontKey') { const tag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.003, 0.025), M.paper); tag.position.set(-0.075, 0.003, 0.01); g.add(tag); }
    g.scale.setScalar(1.3);
  }
  g.position.set(x, y, z);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  g.userData.item = kind;
  world.scene.add(g);
  return g;
}
