// HUNTED: game bootstrap, player, interactions, story scripting and rendering.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import { World, H } from './world.js';
import { furnish } from './props.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Mother } from './monster.js';
import { AudioEngine } from './audio.js';
import { NOTES, NOTE_ORDER, ITEMS, OBJECTIVES, RADIO, ENDINGS } from './story.js';
import * as TX from './textures.js';

const $ = (id) => document.getElementById(id);
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* storage unavailable */ } },
};
const SAVE_KEY = 'hunted-save-v1', SETTINGS_KEY = 'hunted-settings-v1';
// A phone or tablet: the main pointer is a finger. Touchscreen laptops have a
// mouse or trackpad as their main pointer, so they get mouse controls.
const isTouch = matchMedia('(pointer: coarse)').matches;

// ---------------------------------------------------------------- settings
const settings = Object.assign({ sens: 1, vol: 0.9, bright: 1, fov: 72, quality: isTouch ? 'low' : 'high', invert: false, guide: 'always' }, store.get(SETTINGS_KEY) || {});

// ---------------------------------------------------------------- renderer
const canvas = $('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.NoToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // the post pass does tone mapping + gamma

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010102);
scene.fog = new THREE.FogExp2(0x020203, 0.055);
const camera = new THREE.PerspectiveCamera(settings.fov, innerWidth / innerHeight, 0.04, 90);
camera.rotation.order = 'YXZ';
scene.add(camera);

let rt = null;
const post = new THREE.ShaderMaterial({
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uFear: { value: 0 }, uDamage: { value: 0 }, uExposure: { value: 1 },
    uAberr: { value: 0.3 }, uRed: { value: 0 },
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse; uniform float uTime, uFear, uDamage, uExposure, uAberr, uRed;
    vec3 aces(vec3 x){ const float a=2.51, b=0.03, c=2.43, d=0.59, e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec2 uv = vUv; vec2 c = uv - 0.5;
      float wob = uFear * 0.0015 * sin(uTime * 7.0 + uv.y * 30.0);
      uv.x += wob;
      float ab = uAberr * (0.0015 + dot(c, c) * 0.018) * (1.0 + uFear * 2.0);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + c * ab * 4.0).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - c * ab * 4.0).b;
      col *= uExposure;
      col = aces(col);
      float l = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(l), col, 0.82 - uFear * 0.35);
      col *= vec3(0.97, 1.0, 1.05);
      float v = smoothstep(0.9, 0.18, length(c) * (1.0 + uFear * 0.5));
      col *= mix(0.25, 1.0, v);
      col = mix(col, vec3(0.3, 0.0, 0.0), clamp(uDamage * (1.0 - v), 0.0, 1.0) * 0.7);
      col = mix(col, vec3(0.5, 0.02, 0.02) * (0.6 + l), uRed);
      float g = hash(uv * vec2(1731.0, 977.0) + fract(uTime * 13.0) * 91.0) - 0.5;
      col += g * (0.03 + uFear * 0.045);
      float scan = sin(uv.y * 900.0 + uTime * 30.0) * 0.008 * uFear;
      col += scan;
      col = pow(max(col, 0.0), vec3(1.0 / 2.2));
      gl_FragColor = vec4(col, 1.0);
    }`,
  depthTest: false, depthWrite: false,
});
const postScene = new THREE.Scene();
const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
{
  const tri = new THREE.BufferGeometry();
  tri.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  tri.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
  const m = new THREE.Mesh(tri, post); m.frustumCulled = false; postScene.add(m);
}

// ---------------------------------------------------------------- lights
const hemi = new THREE.HemisphereLight(0x5a6890, 0x1e1812, 0.45);
scene.add(hemi);
const moon = new THREE.DirectionalLight(0x9ab4e0, 0.7);
moon.position.set(4, 13, 30); moon.target.position.set(12, 0, 6);
scene.add(moon); scene.add(moon.target);
Object.assign(moon.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 60 });
moon.shadow.bias = -0.0006; moon.shadow.normalBias = 0.02;
moon.shadow.autoUpdate = false; // refreshed a few times a second in render()

const FLASH = 160;
const flashlight = new THREE.SpotLight(0xfff1dc, FLASH, 30, 0.52, 0.5, 1.35);
flashlight.map = TX.flashlightCookie();
flashlight.castShadow = true;
flashlight.shadow.bias = -0.0006; flashlight.shadow.normalBias = 0.015; flashlight.shadow.camera.near = 0.1;
flashlight.position.set(0.22, -0.2, 0.05);
camera.add(flashlight);
const flashTarget = new THREE.Object3D(); flashTarget.position.set(0, 0, -6); camera.add(flashTarget);
flashlight.target = flashTarget;
const spill = new THREE.PointLight(0xffe8d0, 0, 5, 2);
spill.position.set(0, 0, -0.5); camera.add(spill);

function applyQuality() {
  const q = settings.quality;
  const pr = q === 'high' ? Math.min(devicePixelRatio, 1.5) : q === 'medium' ? Math.min(devicePixelRatio, 1) : Math.min(devicePixelRatio, 0.8);
  renderer.setPixelRatio(pr);
  renderer.setSize(innerWidth, innerHeight, false);
  moon.castShadow = q !== 'low';
  moon.shadow.mapSize.set(q === 'high' ? 2048 : 1024, q === 'high' ? 2048 : 1024);
  flashlight.shadow.mapSize.set(q === 'high' ? 1024 : 512, q === 'high' ? 1024 : 512);
  for (const l of [moon, flashlight]) if (l.shadow.map) { l.shadow.map.dispose(); l.shadow.map = null; }
  if (rt) rt.dispose();
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: q === 'high' ? 4 : 0 });
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
}
addEventListener('resize', applyQuality);

// ---------------------------------------------------------------- game state
const audio = new AudioEngine();
let world, refs, mother, kowalski;
let lastT = performance.now();
let time = 0;
const G = {
  mode: 'title',          // title | play | dying | ending
  paused: false, ui: null, // ui: null | 'note' | 'keypad' | 'inventory'
  flags: {}, inv: new Set(), notes: new Set(), taken: new Set(),
  battery: 1, spares: 0, stamina: 1, deaths: 0, playTime: 0,
  objective: '', fear: 0, damage: 0, sawHide: false,
};
const player = {
  pos: new THREE.Vector3(11.5, 0, 14.5), vel: new THREE.Vector3(), yaw: 0, pitch: 0, level: 0,
  crouch: 0, crouching: false, sprinting: false, flashlightOn: true, hidden: null,
  head: new THREE.Vector3(), bob: 0, stepDist: 0, lit: false,
  lightPointedAt(p) {
    if (!this.flashlightOn || G.battery <= 0) return false;
    const d = new THREE.Vector3().subVectors(p, camera.position); d.y += 1.2; d.normalize();
    const f = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    return d.dot(f) > 0.9;
  },
};

// Game-time timers: they stop while the game is paused.
const timers = [];
function later(sec, fn) { timers.push({ t: sec, fn }); }
function runTimers(dt) { for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= dt; if (timers[i].t <= 0) { const f = timers[i].fn; timers.splice(i, 1); f(); } } }

// ---------------------------------------------------------------- UI helpers
let subQueue = [], subTimer = 0, toastTimer = 0, objTimer = 0;
function say(lines) { for (const l of lines) subQueue.push(l); }
function toast(text, secs = 3.5) { $('toast').textContent = text; $('toast').classList.add('show'); toastTimer = secs; }
function setObjective(key) {
  const text = OBJECTIVES[key] || key;
  if (G.objective === text) return;
  G.objective = text;
  $('objective-text').textContent = text;
  $('objective').classList.add('show');
  objTimer = 8;
  $('objective').classList.add('fresh');
}
function updateUI(dt) {
  if (subTimer > 0) subTimer -= dt;
  if (subTimer <= 0) {
    if (subQueue.length) {
      const [who, text] = subQueue.shift();
      const cls = who === 'VOICE' ? 'voice' : who === 'HARRY' ? 'harry' : '';
      $('subtitles').innerHTML = `<b class="${cls}">${who === 'VOICE' ? '???' : who}</b>${text}`;
      subTimer = Math.max(2.6, text.length * 0.065);
      if (who === 'HQ') { audio.play(audio.buffers.squelch, { gain: 0.35, reverb: 0 }); audio.play(audio.buffers.static, { gain: 0.08, reverb: 0, rate: 1.2 }); }
      if (who === 'VOICE') { audio.play(audio.buffers.whisper, { gain: 0.8, rate: 0.75, pos: refs && refs.phone ? refs.phone.position : undefined }); }
    } else $('subtitles').innerHTML = '';
  }
  if (toastTimer > 0) { toastTimer -= dt; if (toastTimer <= 0) $('toast').classList.remove('show'); }
  if (objTimer > 0) { objTimer -= dt; if (objTimer <= 0) $('objective').classList.remove('fresh'); }
  $('battery-bar').style.width = `${Math.round(G.battery * 100)}%`;
  $('battery-bar').style.background = G.battery < 0.15 ? '#a33' : '';
  $('battery-spares').textContent = G.spares ? `+${G.spares}` : '';
  $('stamina-bar').style.width = `${Math.round(G.stamina * 100)}%`;
  $('hint-q').classList.toggle('hidden', !G.inv.has('musicBox'));
}
function showScreen(id) {
  for (const s of ['title', 'howto', 'settings', 'pause', 'death', 'ending', 'clicktoplay']) $(s).classList.toggle('hidden', s !== id);
}
function fade(to, secs = 1.2) { $('fade').style.transition = `opacity ${secs}s`; $('fade').style.opacity = to; }

// ---------------------------------------------------------------- loading
const loadbar = $('loadbar').firstElementChild;
let loadProgress = 0;
function progress(p) { loadProgress = Math.max(loadProgress, p); loadbar.style.width = `${Math.round(loadProgress * 100)}%`; }

async function load() {
  applyQuality();
  const gltf = new GLTFLoader();
  const loadModel = async (url, share) => {
    if (!url.endsWith('.json')) return new Promise((res, rej) => gltf.load(url, res, (e) => { if (e.total) progress(share * e.loaded / e.total); }, rej));
    // Self-contained glTF JSON (used where .glb files can't be served). Rebuild
    // a GLB in memory so nothing is fetched through data: URLs, which strict
    // content security policies block.
    const j = await (await fetch(url)).json();
    progress(share);
    const b64 = j.buffers[0].uri.slice(j.buffers[0].uri.indexOf(',') + 1);
    const raw = atob(b64); const bin = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bin[i] = raw.charCodeAt(i);
    delete j.buffers[0].uri;
    const pad4 = (n) => (n + 3) & ~3;
    const jsonBytes = new TextEncoder().encode(JSON.stringify(j));
    const jl = pad4(jsonBytes.length), bl = pad4(bin.length);
    const glb = new Uint8Array(12 + 8 + jl + 8 + bl);
    const dv = new DataView(glb.buffer);
    dv.setUint32(0, 0x46546C67, true); dv.setUint32(4, 2, true); dv.setUint32(8, glb.length, true);
    dv.setUint32(12, jl, true); dv.setUint32(16, 0x4E4F534A, true);
    glb.fill(0x20, 20, 20 + jl); glb.set(jsonBytes, 20);
    dv.setUint32(20 + jl, bl, true); dv.setUint32(24 + jl, 0x004E4942, true);
    glb.set(bin, 28 + jl);
    return new Promise((res, rej) => {
      // decode embedded images through <img> (blob: images are allowed) instead of fetch()
      const cib = window.createImageBitmap;
      try { window.createImageBitmap = undefined; gltf.parse(glb.buffer, '', res, rej); } finally { window.createImageBitmap = cib; }
    });
  };
  // real footstep recordings (CC0, see README); fetched now, decoded when audio starts
  const steps = [];
  for (let i = 0; i < 5; i++) for (const k of ['wood', 'carpet', 'concrete']) steps.push([k, `assets/sounds/step_${k}_${i}.ogg`]);
  for (let i = 0; i < 10; i++) steps.push(['boot', `assets/sounds/step_boot_0${i}.ogg`]);
  for (let i = 1; i <= 3; i++) steps.push(['heavy', `assets/sounds/step_heavy_${i}.ogg`]);
  audio.preloadSamples(steps);
  world = new World(scene);
  progress(0.05);
  await world.loadMaterials();
  progress(0.2);
  world.build();
  refs = furnish(world);
  world.buildNav();
  progress(0.35);
  const [michelle, soldier] = await Promise.all([loadModel('assets/models/Michelle.glb', 0.8), loadModel('assets/models/Soldier.glb', 0.9)]);
  progress(0.92);
  mother = new Mother(scene, world, audio, michelle, soldier, cloneSkinned);
  makeKowalski(soldier);
  setupRain();
  setupDust();
  setupInteractions();
  audio.occlusion = (x, y, z) => world.wallsBetween(camera.position, { x, y, z }, 4);
  mother.onChaseStart = onChaseStart;
  mother.onChaseEnd = () => { G.chase = false; };
  mother.onDoor = (door, slam) => audio.play(slam ? audio.buffers.slam : audio.buffers.creakDoor, { pos: world.doorCenter(door), gain: slam ? 1 : 0.7 });
  // warm up shaders
  renderer.compile(scene, camera);
  progress(1);
  const btn = $('btn-new'); btn.disabled = false; btn.textContent = 'New game';
  if (store.get(SAVE_KEY)) $('btn-continue').classList.remove('hidden');
  fade(0, 2.5);
}

function makeKowalski(soldier) {
  const k = cloneSkinned(soldier.scene);
  k.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(k);
  const s = 1.8 / (box.max.y - box.min.y);
  k.scale.multiplyScalar(s);
  const mixer = new THREE.AnimationMixer(k);
  mixer.clipAction(soldier.animations.find(a => a.name === 'Idle')).play();
  mixer.update(0.4);
  const bones = {};
  k.traverse(o => { if (o.isBone) bones[o.name.replace('mixamorig', '')] = o; if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
  const rot = (b, x, y, z) => { if (bones[b]) bones[b].rotation.x += x, bones[b].rotation.y += y, bones[b].rotation.z += z; };
  rot('LeftArm', 0.2, 0, 0.9); rot('RightArm', -0.3, 0.4, -0.5); rot('RightForeArm', 0, 0, -1.2);
  rot('LeftUpLeg', 0, 0, -0.25); rot('RightLeg', -0.9, 0, 0); rot('Head', 0.2, 0.9, 0.2); rot('Spine1', 0, 0.2, 0);
  const holder = new THREE.Group();
  k.rotation.x = -Math.PI / 2;
  k.position.set(0, 0.14, 0.9);
  holder.add(k);
  holder.position.copy(refs.kowalskiPos); holder.rotation.y = 0.5;
  scene.add(holder);
  kowalski = holder;
}

// ---------------------------------------------------------------- atmosphere
let rain, dust;
function setupRain() {
  // Streaks fall all around the house (not inside it) so rain is visible
  // through every window and from the porch.
  const N = 7000; const pos = new Float32Array(N * 6);
  let i = 0;
  while (i < N) {
    const x = -14 + Math.random() * 52, z = -14 + Math.random() * 56, y = Math.random() * 12;
    if (x > -0.3 && x < 24.3 && z > -0.3 && z < 13.3) continue;
    const len = 0.35 + Math.random() * 0.35;
    pos.set([x, y, z, x + 0.06, y - len, z + 0.02], i * 6); i++;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uFlash: { value: 0 } },
    transparent: true, depthWrite: false,
    vertexShader: `uniform float uTime; varying vec3 vP;
      void main(){ vec3 p = position; float top = 12.0; float fall = mod(p.y - uTime * 11.0 + position.x * 0.37, top) - 0.4; p.x += (top - fall) * 0.06; p.y = fall; vP = p;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
    fragmentShader: `uniform float uFlash; varying vec3 vP;
      void main(){ if (vP.x > 7.8 && vP.x < 16.2 && vP.z < 15.2 && vP.y < 3.2) discard; if (vP.y < -0.35) discard;
        gl_FragColor = vec4(vec3(0.62, 0.68, 0.8) * (0.55 + uFlash * 3.0), 0.32 + uFlash * 0.4); }`,
  });
  rain = new THREE.LineSegments(g, m); rain.frustumCulled = false; scene.add(rain);
  // splashes on the ground and the porch steps
  const S = 1600; const sp = new Float32Array(S * 3); const ph = new Float32Array(S);
  for (let k = 0; k < S; k++) {
    let x, z; do { x = -6 + Math.random() * 36; z = -4 + Math.random() * 34; } while (x > -0.3 && x < 24.3 && z > -0.3 && z < 15.2);
    sp.set([x, -0.33, z], k * 3); ph[k] = Math.random();
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); sg.setAttribute('phase', new THREE.BufferAttribute(ph, 1));
  const sm = new THREE.ShaderMaterial({
    uniforms: { uTime: rain.material.uniforms.uTime, uFlash: rain.material.uniforms.uFlash },
    transparent: true, depthWrite: false,
    vertexShader: `uniform float uTime; attribute float phase; varying float vA;
      void main(){ float t = fract(uTime * 2.3 + phase * 7.0); vA = (1.0 - t) * step(0.0, 0.25 - t) * 4.0; vec4 mv = modelViewMatrix * vec4(position + vec3(0.0, t * 0.08, 0.0), 1.0); gl_PointSize = max(1.0, 30.0 / -mv.z) * (0.5 + t); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uFlash; varying float vA; void main(){ vec2 c = gl_PointCoord - 0.5; if (dot(c, c) > 0.25) discard; gl_FragColor = vec4(vec3(0.7, 0.75, 0.85) * (0.5 + uFlash * 3.0), vA * 0.45); }`,
  });
  const splashes = new THREE.Points(sg, sm); splashes.frustumCulled = false; scene.add(splashes);
}
function setupDust() {
  const N = 500; const p = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) p[i] = Math.random() * 8 - 4;
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const m = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uCam: { value: new THREE.Vector3() }, uDir: { value: new THREE.Vector3() }, uOn: { value: 1 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float uTime; uniform vec3 uCam; varying float vB; uniform vec3 uDir; uniform float uOn;
      void main(){
        vec3 p = position + vec3(sin(uTime * 0.2 + position.y) * 0.3, sin(uTime * 0.13 + position.x) * 0.2, cos(uTime * 0.17 + position.z) * 0.3);
        p = uCam + mod(p - uCam + 4.0, 8.0) - 4.0;
        vec3 d = p - uCam; float dist = length(d);
        float cone = smoothstep(0.88, 0.97, dot(normalize(d), uDir));
        vB = cone * uOn * smoothstep(7.0, 1.0, dist) * smoothstep(0.2, 0.6, dist);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = 1.6;
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vB; void main(){ vec2 c = gl_PointCoord - 0.5; if (dot(c, c) > 0.25) discard; gl_FragColor = vec4(vec3(1.0, 0.95, 0.85) * vB * 0.18, 1.0); }`,
  });
  dust = new THREE.Points(g, m); dust.frustumCulled = false; scene.add(dust);
}

let nextLightning = 5, lightningT = -1, bolt = null, strikeDist = 1;
const skyColor = new THREE.Color(0x010102), skyFlash = new THREE.Color(0x8a96c0), fogColor = new THREE.Color(0x020203);
// A jagged, branching bolt built from thin tubes, placed in the sky around the house.
function makeBolt() {
  if (bolt) { scene.remove(bolt); bolt.geometry.dispose(); }
  const a = Math.random() * Math.PI * 2, r = 22 + Math.random() * 30;
  const base = new THREE.Vector3(12 + Math.cos(a) * r, -0.3, 7 + Math.sin(a) * r);
  const geos = [];
  const branch = (from, dir, len, radius, depth) => {
    let p = from.clone();
    const steps = Math.max(3, Math.floor(len / 1.6));
    for (let k = 0; k < steps; k++) {
      const next = p.clone().add(new THREE.Vector3(dir.x + (Math.random() - 0.5) * 1.8, dir.y, dir.z + (Math.random() - 0.5) * 1.8).multiplyScalar(len / steps));
      const d = next.clone().sub(p); const l = d.length();
      const c = new THREE.CylinderGeometry(radius, radius, l, 5, 1, true);
      c.translate(0, l / 2, 0);
      c.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()));
      c.translate(p.x, p.y, p.z);
      geos.push(c);
      if (depth < 2 && Math.random() < 0.28) branch(next, new THREE.Vector3((Math.random() - 0.5) * 1.2, -0.7, (Math.random() - 0.5) * 1.2), len * 0.35, radius * 0.5, depth + 1);
      p = next;
      if (p.y <= base.y) break;
    }
  };
  const top = base.clone().setY(42);
  branch(top, new THREE.Vector3(0, -1, 0), 42.5, 0.22, 0);
  const g = mergeGeometries(geos.map(x => x.index ? x.toNonIndexed() : x));
  bolt = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xe8ecff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  bolt.frustumCulled = false;
  scene.add(bolt);
  strikeDist = r;
  // light comes from the bolt's side of the house
  moon.position.set(12 + Math.cos(a) * 20, 18, 7 + Math.sin(a) * 20);
}
function lightning() {
  lightningT = 0;
  makeBolt();
  const delay = strikeDist / 343 * 12; // stylised: thunder follows closer strikes faster
  audio.thunder(Math.min(2.6, delay), strikeDist < 30 ? 1 : 0.6, strikeDist < 30);
  const out = player.pos.z > 12.9 || G.mode === 'title';
  const fl = $('flash'); fl.style.background = '#dfe6ff'; fl.style.transition = 'none'; fl.style.opacity = out ? 0.28 : 0.07;
  requestAnimationFrame(() => { fl.style.transition = 'opacity 0.5s'; fl.style.opacity = 0; });
}
function updateLightning(dt) {
  nextLightning -= dt;
  if (nextLightning <= 0) { nextLightning = 7 + Math.random() * 16; lightning(); if (Math.random() < 0.3) later(0.9 + Math.random(), lightning); }
  let f = 0;
  if (lightningT >= 0) {
    lightningT += dt;
    const t = lightningT;
    f = (t < 0.07 ? 1 : 0) + (t > 0.13 && t < 0.2 ? 0.6 : 0) + (t > 0.3 && t < 0.55 ? 0.95 * (1 - (t - 0.3) / 0.25) : 0);
    if (t > 0.7) { lightningT = -1; moon.position.set(4, 13, 30); }
  }
  if (bolt) { bolt.visible = f > 0.05; bolt.material.opacity = Math.min(1, f * 1.4); }
  moon.intensity = 0.7 + f * 28;
  hemi.intensity = ((G.flags.power ? 0.9 : 0.45) + f * 2.2) * settings.bright;
  scene.background.copy(skyColor).lerp(skyFlash, f * 0.8);
  scene.fog.color.copy(fogColor).lerp(skyFlash, f * 0.25);
  if (world && world.materials.glass) {
    world.materials.glass.emissiveIntensity = 1 + f * 30;
    if (world.materials.glass.map) world.materials.glass.map.offset.y += dt * 0.06;
  }
  if (rain) rain.material.uniforms.uFlash.value = f;
}

// ---------------------------------------------------------------- lights & power
const POWER_BOOST = 3;
function setPower(on, instant = false) {
  G.flags.power = on;
  for (const L of world.lights) {
    if (!L.power) continue;
    L.on = on;
    if (!L.dist0) L.dist0 = L.light.distance;
    L.light.distance = L.dist0 * (on ? 1.5 : 1);
    if (on && !instant) { L.bootT = Math.random() * 1.2; L.booting = true; }
  }
}
function updateLights(dt) {
  const mp = mother && mother.root.visible ? mother.pos : null;
  let lit = false;
  for (const L of world.lights) {
    // mains lights are bright enough to explore by once the power is back
    let target = L.on ? L.base * (L.power ? POWER_BOOST : 1) : 0;
    if (L.booting) { L.bootT -= dt; target = L.bootT > 0 ? 0 : (Math.random() < 0.5 ? target : target * 0.1); if (L.bootT < -0.6) L.booting = false; }
    if (L.flicker && L.on && Math.random() < L.flicker * (L.power ? 0.08 : 0.2)) target *= 0.3 + Math.random() * 0.5;
    if (L.candle && L.on) target *= 0.75 + Math.sin(time * 13 + L.base) * 0.1 + Math.random() * 0.15;
    if (mp && L.on && L.light.position.distanceTo(mp) < 6 && Math.random() < 0.35) target *= Math.random() * 0.4;
    if (G.blackout > 0) target *= 0.02;
    L.light.intensity = target;
    L.bulb.material.emissiveIntensity = target > 0 ? 3 + target : 0;
    if (target > 0.5 && player.head.distanceTo(L.light.position) < Math.max(2.5, (L.dist0 || L.light.distance) * 0.35) && L.light.position.y - player.pos.y < 3.3 && L.light.position.y > player.pos.y) lit = true;
  }
  player.lit = lit;
}

// ---------------------------------------------------------------- interactions
const interactables = []; const hitMeshes = []; const meshToEntry = new Map();
function addInteract(objs, label, act, range = 2.3) {
  const e = { objs: [].concat(objs), label, act, range };
  interactables.push(e);
  for (const o of e.objs) o.traverse(m => { if (m.isMesh) { hitMeshes.push(m); meshToEntry.set(m, e); } });
  return e;
}
function proxy(x, y, z, sx, sy, sz) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), new THREE.MeshBasicMaterial({ visible: false }));
  m.position.set(x, y, z); scene.add(m); return m;
}
const pickups = {};

function setupInteractions() {
  // doors
  for (const d of world.doors) {
    addInteract(d.pivot, () => {
      if (d.id === 'front' && G.flags.entered) return G.inv.has('frontKey') ? 'Unlock the front door and leave' : 'Front door';
      if (d.locked) return G.inv.has(d.key) ? `Unlock with the ${ITEMS[d.key].name.toLowerCase()}` : 'Locked';
      return d.target > 0.5 ? 'Close door' : 'Open door';
    }, () => useDoor(d), 2.6);
  }
  // documents
  for (const [id, mesh] of Object.entries(refs.notes)) {
    if (!mesh) continue;
    const m = mesh;
    m.scale.setScalar(1.25);
    addInteract(m, () => (m.visible ? 'Read' : null), () => openNote(id));
  }
  // pickups
  const addPickup = (id, item, mesh, label) => {
    pickups[id] = { item, mesh };
    // generous invisible hit area so small objects are easy to pick up
    const grab = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.3), new THREE.MeshBasicMaterial({ visible: false }));
    grab.position.y = 0.05; grab.scale.divideScalar(mesh.scale.x || 1);
    mesh.add(grab);
    const e = addInteract(mesh, () => (mesh.visible && !G.taken.has(id) ? label : null), () => take(id));
    e.pickup = true;
  };
  addPickup('fuse', 'fuse', refs.fuse, 'Take the fuse');
  addPickup('studyKey', 'studyKey', refs.studyKey, 'Take the study key');
  addPickup('nurseryKey', 'nurseryKey', refs.nurseryKey, 'Take the nursery key');
  addPickup('musicBox', 'musicBox', refs.musicBox, 'Take the music box');
  addPickup('frontKey', 'frontKey', refs.frontKey, 'Take the front door key');
  refs.batteries.forEach((b, i) => addPickup('battery' + i, 'battery', b, 'Take batteries'));
  // containers
  addInteract(refs.drawer, () => (G.flags.drawer ? null : 'Open the drawer'), () => {
    G.flags.drawer = true; applyContainers(); audio.play(audio.buffers.creakShort, { pos: refs.drawer.position, gain: 0.6, rate: 1.4 });
  });
  addInteract(refs.jewelBox, () => (G.flags.jewel ? null : 'Open the jewellery box'), () => {
    G.flags.jewel = true; applyContainers(); audio.play(audio.buffers.creakShort, { pos: refs.jewelBox.position, gain: 0.4, rate: 2 });
    const l = audio.lullaby({ pos: refs.jewelBox.position, gain: 0.25, tempo: 0.5 }); setTimeout(() => l.stop(), 3500);
  });
  addInteract(refs.fuseBox, () => (G.flags.power ? null : G.inv.has('fuse') ? 'Put the fuse in' : 'Fuse box'), () => {
    if (G.flags.power) return;
    if (!G.inv.has('fuse')) { toast('One of the fuse sockets is empty.'); if (!G.flags.power) setObjective('power'); return; }
    G.inv.delete('fuse');
    powerOn();
  });
  addInteract([refs.phone], () => (G.flags.ringing ? 'Answer the phone' : 'Telephone'), () => {
    if (G.flags.ringing) answerPhone();
    else toast('The line is dead. It smells of perfume.');
  });
  addInteract(refs.safe, () => (G.flags.safeOpen ? null : 'Use the keypad'), () => openKeypad());
  addInteract(proxy(refs.pianoPos.x - 0.2, 0.9, refs.pianoPos.z, 0.6, 0.6, 1.5), () => 'Press a key', () => {
    const notes = Object.values(audio.buffers.pianoNotes);
    audio.play(notes[Math.floor(Math.random() * notes.length)], { pos: refs.pianoPos, gain: 1.1 });
    noise(refs.pianoPos, 14);
    if (!G.flags.pianoWarn) { G.flags.pianoWarn = true; setTimeout(() => say([['HARRY', 'Stupid. Everything in the house heard that.']]), 1200); }
  });
  addInteract(refs.mirror, () => 'Look in the mirror', () => mirrorScare(true));
  addInteract(proxy(refs.kowalskiPos.x, H + 0.2, refs.kowalskiPos.z, 0.8, 0.4, 0.8), () => 'Examine the body', () => {
    toast('Agent Daniel Kowalski. Eleven days. His hands are still in fists.');
    if (!G.flags.kowalski) { G.flags.kowalski = true; say(RADIO.kowalski); if (!G.inv.has('studyKey')) setObjective('Take the study key from Kowalski'); }
  });
  addInteract(proxy(refs.thomasPos.x, refs.thomasPos.y - 0.4, refs.thomasPos.z, 0.8, 1.6, 0.8), () => 'Lift the sheet', () => {
    toast('You can\'t make yourself do it. The sheet is moving, very slightly, as if something under it is still breathing.', 5);
    audio.play(audio.buffers.inhale, { gain: 0.5, reverb: 0 });
  });
  addInteract(refs.tv, () => 'Examine the television', () => toast(G.flags.power ? 'Static. Under the hiss, if you listen, a woman is humming.' : 'An old television. Unplugged, you think.'));
  addInteract(proxy(refs.clockPos.x, 1.1, refs.clockPos.z, 0.4, 2.1, 0.6), () => 'Examine the clock', () => toast('The hands point to three o\'clock. It still ticks.'));
  refs.hides.forEach((h, i) => {
    const px = proxy(h.pos.x, h.pos.y - 0.4, h.pos.z, 1.2, 2.0, 0.7);
    h.proxy = px; h.id = i;
    addInteract(px, () => (player.hidden ? null : 'Hide in the wardrobe'), () => enterHide(h), 2.2);
  });
}

function applyContainers() {
  // drawer slides out to reveal the fuse
  refs.drawer.position.z = G.flags.drawer ? 0.94 : 0.64;
  refs.fuse.position.z = G.flags.drawer ? 0.78 : 0.5;
  refs.fuse.visible = !!G.flags.drawer && !G.taken.has('fuse');
  refs.jewelLid.rotation.x = G.flags.jewel ? -1.4 : 0;
  refs.jewelLid.position.set(0, G.flags.jewel ? 0.15 : 0.105, G.flags.jewel ? -0.08 : 0);
  refs.nurseryKey.visible = !!G.flags.jewel && !G.taken.has('nurseryKey');
  refs.safeDoor.position.x = G.flags.safeOpen ? -0.4 : 0;
  refs.safeDoor.rotation.y = G.flags.safeOpen ? -1.9 : 0;
  refs.frontKey.visible = !!G.flags.safeOpen && !G.taken.has('frontKey');
  refs.notes.confession.visible = !!G.flags.safeOpen;
  refs.mirrorText.material.opacity = G.flags.mirror ? 1 : 0;
}

function take(id) {
  const p = pickups[id];
  if (!p || G.taken.has(id)) return;
  G.taken.add(id);
  p.mesh.visible = false;
  if (p.item === 'battery') { G.spares++; toast('Batteries. [R] to swap them in.'); audio.play(audio.buffers.cloth, { gain: 0.5, reverb: 0 }); return; }
  G.inv.add(p.item);
  audio.play(p.item.endsWith('Key') ? audio.buffers.keys : audio.buffers.cloth, { gain: 0.6, reverb: 0.1 });
  toast(`${ITEMS[p.item].name}: ${ITEMS[p.item].desc}`, 4.5);
  if (id === 'fuse') { setObjective('fuseFound'); checkpoint(); }
  if (id === 'studyKey') { G.flags.kowalski = true; setObjective('study'); checkpoint(); }
  if (id === 'nurseryKey') { setObjective('nurseryOpen'); checkpoint(); }
  if (id === 'musicBox') { setTimeout(() => toast('Press Q to wind the music box. She stops to listen.', 5), 4600); checkpoint(); }
  if (id === 'frontKey') startFinale();
}

function useDoor(d) {
  if (d.id === 'front' && G.flags.entered) {
    if (G.inv.has('frontKey')) { escape(); return; }
    audio.play(audio.buffers.rattle, { pos: world.doorCenter(d), gain: 1 });
    noise(world.doorCenter(d), 6);
    toast('It won\'t open. The lock isn\'t even turned: something is holding it.');
    return;
  }
  if (d.locked) {
    if (G.inv.has(d.key)) {
      d.locked = false; world.refreshNav();
      audio.play(audio.buffers.keys, { pos: world.doorCenter(d), gain: 0.7 });
      audio.play(audio.buffers.latch, { pos: world.doorCenter(d), gain: 0.8, when: 0.35 });
      if (d.id === 'study') { G.flags.studyOpen = true; setObjective(G.notes.has('thomas') ? 'safe' : 'Search Thomas Hale\'s study'); }
      if (d.id === 'nursery') G.flags.nurseryOpen = true;
      setTimeout(() => { d.target = 1.45; audio.play(audio.buffers.creakDoor, { pos: world.doorCenter(d), gain: 0.8 }); }, 500);
      checkpoint();
    } else {
      audio.play(audio.buffers.rattle, { pos: world.doorCenter(d), gain: 0.8 });
      noise(world.doorCenter(d), 5);
      const hint = { study: 'Locked. A brass lock marked "T.H."', nursery: 'Locked. There are small scratches around the keyhole, like fingernails.', closet: 'Locked.' }[d.id] || 'Locked.';
      toast(hint);
    }
    return;
  }
  const opening = d.target < 0.5;
  d.target = opening ? 1.45 : 0;
  const c = world.doorCenter(d);
  if (opening) audio.play(audio.buffers.creakDoor, { pos: c, gain: player.crouching ? 0.35 : 0.7, rate: 0.9 + Math.random() * 0.2 });
  else { audio.play(audio.buffers.latch, { pos: c, gain: 0.7, when: 0.45 }); audio.play(audio.buffers.stepWood, { pos: c, gain: 0.5, when: 0.45 }); }
  noise(c, player.crouching ? 2.5 : 5);
}

// ---------------------------------------------------------------- notes, inventory, keypad
function openNote(id) {
  const n = NOTES[id];
  if (!n) return;
  G.ui = 'note';
  $('note-title').textContent = n.title;
  $('note-body').textContent = n.body;
  $('note-paper').className = n.kind;
  $('note-paper').scrollTop = 0;
  $('note').classList.remove('hidden');
  audio.play(audio.buffers.paper, { gain: 0.6, reverb: 0 });
  const first = !G.notes.has(id);
  G.notes.add(id);
  if (first) onNoteRead(id);
  releasePointer();
}
function closeNote() {
  $('note').classList.add('hidden'); G.ui = null;
  audio.play(audio.buffers.paper, { gain: 0.3, reverb: 0, rate: 1.3 });
  capturePointer();
}
function onNoteRead(id) {
  if (id === 'grocery' && !G.inv.has('fuse') && !G.flags.power) setObjective('The spare fuse is in the kitchen drawer under the knives');
  if (id === 'thomas' && !G.flags.safeOpen) setObjective('Open the safe: the day Cheryl "came back". Eleanor wrote everything down');
  if (id === 'diary' && G.notes.has('thomas') && !G.flags.safeOpen) setTimeout(() => say([['HARRY', 'November fourth. Zero four, one one.']]), 800);
  if (id === 'diary' && !G.inv.has('nurseryKey') && !G.flags.jewel) setTimeout(() => toast('The jewellery box is on the dresser.'), 1500);
  if (id === 'kowalski' && !G.inv.has('studyKey')) setObjective('Take the study key from Kowalski');
}
function toggleInventory() {
  if (G.ui === 'inventory') { $('inventory').classList.add('hidden'); G.ui = null; capturePointer(); return; }
  if (G.ui) return;
  G.ui = 'inventory';
  const items = [...G.inv].map(k => `<li>${ITEMS[k].name}<small>${ITEMS[k].desc}</small></li>`);
  if (G.spares) items.push(`<li>Batteries × ${G.spares}<small>${ITEMS.battery.desc}</small></li>`);
  $('inv-items').innerHTML = (G.objective ? `<li><small>Objective</small>${G.objective}</li>` : '') + (items.join('') || '<li class="dim">Nothing</li>');
  const docs = NOTE_ORDER.filter(n => G.notes.has(n));
  $('inv-docs').innerHTML = docs.map(n => `<li class="doc" data-n="${n}">${NOTES[n].title}</li>`).join('') || '<li class="dim">None yet</li>';
  $('doc-count').textContent = `${docs.length} / ${NOTE_ORDER.length}`;
  $('inventory').classList.remove('hidden');
  releasePointer();
}
$('inv-docs').addEventListener('click', (e) => {
  const li = e.target.closest('li.doc'); if (!li) return;
  $('inventory').classList.add('hidden'); G.ui = null; openNote(li.dataset.n);
});

let code = '';
function openKeypad() {
  if (G.flags.safeOpen) return;
  G.ui = 'keypad'; code = ''; renderCode();
  $('keypad').classList.remove('hidden');
  releasePointer();
}
$('keypad-close').addEventListener('click', () => closeKeypad());
function closeKeypad() { $('keypad').classList.add('hidden'); G.ui = null; capturePointer(); }
function renderCode(bad = false) { $('keypad-display').textContent = (code + '____').slice(0, 4); $('keypad-display').classList.toggle('bad', bad); }
function pressKey(k) {
  if (G.ui !== 'keypad') return;
  if (k === 'C') { code = ''; renderCode(); audio.play(audio.buffers.click, { gain: 0.5, reverb: 0 }); return; }
  if (k === 'OK' || code.length >= 4) return;
  code += k; audio.play(audio.buffers.beep, { gain: 0.3, reverb: 0, rate: 1 + Number(k) * 0.03 }); renderCode();
  if (code.length === 4) {
    setTimeout(() => {
      if (code === '0411') {
        audio.play(audio.buffers.clunk, { pos: refs.safe.position, gain: 0.9 });
        G.flags.safeOpen = true; applyContainers(); closeKeypad();
        toast('The safe swings open.');
        setObjective('Take the front door key');
        checkpoint();
      } else {
        audio.play(audio.buffers.denied, { gain: 0.4, reverb: 0 }); renderCode(true); noise(refs.safe.position, 4);
        setTimeout(() => { code = ''; renderCode(); }, 700);
        if (code === '2109') setTimeout(() => toast('Not her birthday. The day she came BACK.'), 800);
      }
    }, 250);
  }
}
{
  const keys = $('keypad').querySelector('.keys');
  for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK']) {
    const b = document.createElement('button'); b.textContent = k; b.onclick = () => pressKey(k); keys.appendChild(b);
  }
}

// ---------------------------------------------------------------- hiding
function enterHide(h) {
  if (player.hidden) return;
  player.hidden = h;
  player.hideYaw = Math.atan2(-(h.look.x - h.pos.x), -(h.look.z - h.pos.z));
  player.yaw = player.hideYaw; player.pitch = -0.05;
  G.sawHide = mother.state === 'chase' && mother.seesPlayer && mother.pos.distanceTo(player.pos) < 9;
  if (mother.state === 'chase' && !G.sawHide) { mother.state = 'search'; mother.goal = h.exit.clone(); mother.path = null; mother.searchTimer = 0; G.chase = false; }
  if (G.sawHide) { mother.state = 'scripted'; mother.scriptSpeed = 2.2; mother.path = world.findPath(mother.pos, h.exit); mother.pathI = 1; }
  $('slats').classList.remove('hidden');
  audio.muffled = 1;
  audio.play(audio.buffers.creakDoor, { gain: 0.5, reverb: 0, rate: 1.3 });
  audio.play(audio.buffers.cloth, { gain: 0.6, reverb: 0 });
}
function exitHide() {
  const h = player.hidden; if (!h) return;
  player.hidden = null;
  player.pos.set(h.exit.x, h.exit.y, h.exit.z);
  $('slats').classList.add('hidden');
  audio.muffled = 0;
  audio.play(audio.buffers.creakDoor, { gain: 0.6, rate: 1.2 });
  noise(player.pos, 3);
}

// ---------------------------------------------------------------- scripted events
function noise(pos, radius) { if (mother && G.flags.hunt) mother.hear(pos.clone ? pos.clone() : new THREE.Vector3(pos.x, pos.y, pos.z), radius); }

function powerOn() {
  audio.play(audio.buffers.clunk, { pos: refs.fuseBox.position, gain: 1 });
  audio.play(audio.buffers.zap, { pos: refs.fuseBox.position, gain: 0.7, when: 0.2 });
  G.humVoice = audio.play(audio.buffers.hum, { pos: refs.fuseBox.position, gain: 0.25, loop: true });
  setPower(true);
  G.tvVoice = audio.play(audio.buffers.static, { pos: refs.tvPos, gain: 0.18, loop: true, lowpass: 5000 });
  setTvOn(true);
  say(RADIO.power);
  setObjective('Look around. Something changed');
  checkpoint();
  later(6, () => { if (G.mode === 'play') startRinging(); });
}
let tvCanvas, tvCtx, tvTex;
function setTvOn(on) {
  if (!tvCanvas) {
    tvCanvas = document.createElement('canvas'); tvCanvas.width = 80; tvCanvas.height = 60; tvCtx = tvCanvas.getContext('2d');
    tvTex = new THREE.CanvasTexture(tvCanvas); tvTex.colorSpace = THREE.SRGBColorSpace; tvTex.magFilter = THREE.NearestFilter;
  }
  refs.tv.material.map = on ? tvTex : null; refs.tv.material.color.set(on ? 0xffffff : 0x000000); refs.tv.material.needsUpdate = true;
  G.tvOn = on;
}
function updateFuseLed() { if (refs && refs.fuseLed) refs.fuseLed.visible = !G.flags.power && Math.sin(time * 6) > 0; }
function updateTv() {
  if (!G.tvOn || !tvCtx) return;
  const img = tvCtx.createImageData(80, 60);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 200 | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  tvCtx.putImageData(img, 0, 0);
  // a face in the static, now and then
  if (Math.sin(time * 0.7) > 0.97) { tvCtx.fillStyle = 'rgba(0,0,0,0.6)'; tvCtx.beginPath(); tvCtx.ellipse(40, 28, 14, 18, 0, 0, 7); tvCtx.fill(); tvCtx.fillStyle = '#fff'; for (const x of [34, 46]) { tvCtx.beginPath(); tvCtx.arc(x, 25, 2, 0, 7); tvCtx.fill(); } }
  tvTex.needsUpdate = true;
}
let ringTimer = 0;
function startRinging() { if (G.flags.phoneAnswered) return; G.flags.ringing = true; ringTimer = 0; G.ringFor = 0; setObjective('phone'); }
function updateRinging(dt) {
  if (!G.flags.ringing) return;
  ringTimer -= dt; G.ringFor += dt;
  if (ringTimer <= 0) { ringTimer = 4; audio.play(audio.buffers.ring, { pos: refs.phone.position, gain: 0.9, ref: 2 }); refs.handset.position.y = 0.115; }
  refs.handset.position.y = 0.11 + (ringTimer > 2 ? Math.random() * 0.006 : 0);
  if (G.ringFor > 45) { G.flags.ringing = false; startHunt(); }
}
function answerPhone() {
  G.flags.ringing = false; G.flags.phoneAnswered = true;
  refs.handset.visible = false;
  audio.play(audio.buffers.click, { gain: 0.6, reverb: 0 });
  audio.voiceLine('phone', refs.phone.position);
  say(RADIO.phoneAnswer);
  later(7.2, () => {
    refs.handset.visible = true;
    G.blackout = 2.2;
    audio.play(audio.buffers.zap, { gain: 0.6 });
    audio.play(audio.buffers.stinger, { gain: 0.8, reverb: 0.5 });
    startHunt(true);
  });
}
function startHunt(glimpse = false) {
  if (G.flags.hunt) return;
  G.flags.hunt = true;
  // She crosses the upstairs landing, visible from the foyer, then starts hunting.
  const from = new THREE.Vector3(22.5, H, 7.5);
  mother.spawn(from, 'scripted', Math.PI);
  mother.scriptSpeed = 1.3;
  mother.path = world.findPath(from, new THREE.Vector3(20.5, H, 11.5)); mother.pathI = 1;
  later(glimpse ? 7 : 3, () => { if (mother.state === 'scripted' && !G.sawHide) { mother.state = 'roam'; mother.path = null; } });
  later(2.5, () => { say(RADIO.afterPhone); setObjective(G.inv.has('studyKey') ? 'study' : 'survive'); });
  checkpoint();
}
function onChaseStart() {
  G.chase = true;
  audio.play(audio.buffers.scream, { pos: mother.headPos(), gain: 1.2, rate: 0.9 + Math.random() * 0.2 });
  audio.play(audio.buffers.hiss, { pos: mother.headPos(), gain: 0.8, when: 0.9 });
  audio.play(audio.buffers.stinger, { gain: 0.7, reverb: 0.4 });
  if (!G.flags.firstChase) { G.flags.firstChase = true; setTimeout(() => toast('RUN. Break line of sight. Hide.', 3), 300); }
}
function mirrorScare(looked) {
  if (G.flags.mirror || !G.flags.power) { if (looked) toast(G.flags.mirror ? 'WHERE IS SHE. Written from the other side of the glass.' : 'Your own face, grey in the dark. You look tired.'); return; }
  G.flags.mirror = true;
  applyContainers();
  audio.play(audio.buffers.stinger, { gain: 0.9 });
  audio.play(audio.buffers.whisper, { pos: refs.mirrorPos, gain: 1 });
  G.blackout = 0.6;
  say(RADIO.mirror);
}
function startFinale() {
  G.flags.finale = true;
  setObjective('escape');
  say(RADIO.safe);
  audio.play(audio.buffers.scream, { gain: 0.9, pos: new THREE.Vector3(12, H, 6) });
  G.blackout = 1.2;
  mother.aggression = 1.1;
  if (!G.flags.hunt) G.flags.hunt = true;
  // she comes for you from the hall
  const spot = new THREE.Vector3(9.5, 0, 6);
  mother.spawn(spot, 'search', 0);
  mother.goal = player.pos.clone(); mother.path = null;
  checkpoint();
}
function escape() {
  if (G.mode !== 'play') return;
  G.mode = 'ending';
  const d = world.door('front'); d.locked = false; d.target = 1.45;
  audio.play(audio.buffers.keys, { gain: 0.7 }); audio.play(audio.buffers.creakDoor, { gain: 0.9, when: 0.4 });
  mother.hide();
  fade(1, 2.5);
  const truth = NOTE_ORDER.every(n => G.notes.has(n));
  const E = truth ? ENDINGS.truth : ENDINGS.escape;
  setTimeout(() => {
    releasePointer();
    $('hud').classList.add('hidden');
    $('ending-title').textContent = E.title;
    $('ending-body').textContent = E.body;
    const m = Math.floor(G.playTime / 60), s = Math.floor(G.playTime % 60);
    $('ending-stats').textContent = `Time ${m}:${String(s).padStart(2, '0')} · Documents ${G.notes.size}/${NOTE_ORDER.length} · Deaths ${G.deaths}` + (truth ? '' : ' · Find every document for the true ending');
    showScreen('ending');
    store.del(SAVE_KEY);
    if (truth) setTimeout(() => audio.lullaby({ gain: 0.35, tempo: 0.55 }), 3000);
  }, 2600);
}

// Phase-one scares and triggers checked every frame.
function updateScript(dt) {
  const F = G.flags;
  const room = world.roomAt(player.pos);
  const rname = room && room.name;
  if (!F.entered && player.pos.z < 11.7 && player.level === 0) {
    F.entered = true;
    const d = world.door('front'); d.target = 0; d.slam = true; d.locked = true;
    audio.play(audio.buffers.slam, { pos: world.doorCenter(d), gain: 1.3 });
    audio.play(audio.buffers.stinger, { gain: 0.5, when: 0.1 });
    lightning();
    setTimeout(() => say(RADIO.locked), 1500);
    setObjective('explore');
    checkpoint();
  }
  if (F.entered && !F.power && !F.cry && G.playTime > 70) { F.cry = true; audio.play(audio.buffers.cry, { pos: new THREE.Vector3(19, H + 1, 2), gain: 0.6, rate: 0.9 }); }
  if (F.entered && !F.knocks && G.playTime > 40) { F.knocks = true; audio.play(audio.buffers.knock, { pos: new THREE.Vector3(5, H + 1.5, 2), gain: 0.9 }); }
  if (rname === 'Music room' && !F.pianoScare) {
    F.pianoScare = true;
    setTimeout(() => audio.play(audio.buffers.pianoNotes.Eb3, { pos: refs.pianoPos, gain: 1 }), 900);
    setTimeout(() => audio.play(audio.buffers.pianoNotes.A2, { pos: refs.pianoPos, gain: 0.8 }), 1700);
  }
  if (rname === 'Nursery' && !F.nurseryScare) {
    F.nurseryScare = true;
    G.rock = 1;
    const l = audio.lullaby({ pos: refs.musicBoxPos, gain: 0.4, tempo: 0.52, windDown: 3 });
    setTimeout(() => l.stop(), 9000);
    audio.play(audio.buffers.cry, { pos: refs.musicBoxPos, gain: 0.3, rate: 0.8, when: 6 });
  }
  if (rname === 'Bathroom' && F.power && !F.mirror && refs.mirrorPos.distanceTo(camera.position) < 2.6) {
    const d = new THREE.Vector3().subVectors(refs.mirrorPos, camera.position).normalize();
    const f = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    if (d.dot(f) > 0.85) mirrorScare(false);
  }
  if (rname === 'Guest room' && !F.kowalskiSeen && player.pos.distanceTo(refs.kowalskiPos) < 4) { F.kowalskiSeen = true; audio.play(audio.buffers.stinger, { gain: 0.45 }); }
  if (rname === 'Chapel' && !F.chapel) { F.chapel = true; audio.play(audio.buffers.whisper, { pos: refs.thomasPos, gain: 0.7 }); }
  // animate the nursery
  if (G.rock > 0) { G.rock = Math.max(0.15, G.rock - dt * 0.03); }
  refs.rocker.rotation.x = Math.sin(time * 1.6) * 0.12 * (G.rock || 0.1);
  refs.mobile.rotation.y += dt * 0.3 * (G.rock ? 1 : 0.2);
  if (G.blackout > 0) G.blackout -= dt;
}

// ---------------------------------------------------------------- save / load
function snapshot() {
  return {
    flags: { ...G.flags, ringing: false }, inv: [...G.inv], notes: [...G.notes], taken: [...G.taken],
    battery: G.battery, spares: G.spares, deaths: G.deaths, playTime: G.playTime, objective: G.objective,
    doors: Object.fromEntries(world.doors.map(d => [d.id, { locked: d.locked, open: d.target > 0.5 }])),
    player: { x: player.pos.x, y: player.pos.y, z: player.pos.z, yaw: player.yaw, level: player.level },
    aggression: mother.aggression,
  };
}
let lastCheckpoint = null;
function checkpoint() {
  if (player.hidden) return;
  lastCheckpoint = snapshot();
  store.set(SAVE_KEY, lastCheckpoint);
}
function defaultState() {
  return {
    flags: {}, inv: [], notes: [], taken: [], battery: 1, spares: 0, deaths: 0, playTime: 0, objective: '',
    doors: null, player: { x: 11.5, y: 0, z: 14.6, yaw: 0, level: 0 }, aggression: 1,
  };
}
function applyState(s) {
  G.flags = { ...s.flags }; G.inv = new Set(s.inv); G.notes = new Set(s.notes); G.taken = new Set(s.taken);
  G.battery = s.battery; G.spares = s.spares; G.deaths = s.deaths; G.playTime = s.playTime; G.stamina = 1;
  G.objective = ''; G.chase = false; G.sawHide = false; G.blackout = 0; G.damage = 0;
  for (const d of world.doors) {
    const st = s.doors && s.doors[d.id];
    if (st) { d.locked = st.locked; d.angle = d.target = st.open ? 1.45 : 0; }
    else { d.locked = !!d.def.lock && !d.def.open; d.angle = d.target = d.def.open ? 1.45 : 0; }
    d.slam = false; world.applyDoor(d);
  }
  world.refreshNav();
  for (const [id, p] of Object.entries(pickups)) p.mesh.visible = !G.taken.has(id);
  applyContainers();
  setPower(!!G.flags.power, true);
  if (G.humVoice) { G.humVoice.stop(); G.humVoice = null; }
  if (G.tvVoice) { G.tvVoice.stop(); G.tvVoice = null; }
  setTvOn(!!G.flags.power);
  if (G.flags.power && audio.ready) {
    G.humVoice = audio.play(audio.buffers.hum, { pos: refs.fuseBox.position, gain: 0.25, loop: true });
    G.tvVoice = audio.play(audio.buffers.static, { pos: refs.tvPos, gain: 0.18, loop: true, lowpass: 5000 });
  }
  timers.length = 0;
  if (G.flags.power && !G.flags.phoneAnswered && !G.flags.hunt) later(3, () => { if (G.mode === 'play') startRinging(); });
  player.pos.set(s.player.x, s.player.y, s.player.z); player.yaw = s.player.yaw; player.pitch = 0; player.level = s.player.level;
  player.vel.set(0, 0, 0); player.hidden = null; $('slats').classList.add('hidden'); audio.muffled = 0;
  mother.hide();
  mother.aggression = s.aggression || 1;
  if (G.flags.hunt) spawnFar();
  if (s.objective) { G.objective = ''; setObjective(s.objective); }
}
function spawnFar() {
  const nodes = [...world.nav.values()].filter(n => n.n.size > 0 && !world.blockedCells.has(n.key) && n.f !== -1);
  nodes.sort(() => Math.random() - 0.5);
  const p = player.pos;
  const n = nodes.find(k => Math.hypot(k.x + 0.5 - p.x, k.z + 0.5 - p.z) + Math.abs(k.y - p.y) * 4 > 13) || nodes[0];
  mother.spawn(new THREE.Vector3(n.x + 0.5, n.y, n.z + 0.5), 'roam', Math.random() * 6);
  mother.graceT = 4;
}


// ---------------------------------------------------------------- guidance
// Works out the next thing to do and points to it along the real route
// through the house (doors, stairs), with a marker over the object itself.
function guideTarget() {
  const F = G.flags, inv = G.inv;
  const door = (id) => world.doorCenter(world.door(id));
  if (!F.entered) return { pos: refs.frontDoorPos, label: 'Front door' };
  if (!F.power) {
    if (!inv.has('fuse')) {
      if (!F.drawer) return { pos: refs.drawer.position, label: 'Kitchen: the drawer under the knives' };
      return { pos: refs.fuse.position, label: 'Kitchen: the spare fuse' };
    }
    return { pos: refs.fuseBox.position, label: 'Utility room: fuse box' };
  }
  if (!F.hunt) return { pos: refs.phone.position, label: F.ringing ? 'Foyer: the ringing telephone' : 'Foyer: the telephone' };
  if (!inv.has('studyKey')) return { pos: refs.studyKey.position, label: 'Upstairs guest room: Agent Kowalski' };
  const study = world.door('study');
  if (study.locked) return { pos: door('study'), label: 'Study door, east end of the hall' };
  if (!G.notes.has('thomas')) return { pos: refs.notes.thomas.position, label: 'Study: Thomas Hale\'s journal' };
  if (!F.safeOpen && !G.notes.has('diary')) return { pos: refs.notes.diary.position, label: 'Master bedroom upstairs: Eleanor\'s diary' };
  if (!F.safeOpen) return { pos: refs.safe.position, label: 'Study: the wall safe (code from the diary)' };
  if (!inv.has('frontKey')) return { pos: refs.frontKey.position, label: 'Study: the front door key in the safe' };
  return { pos: refs.frontDoorPos, label: 'Front door: GET OUT' };
}
let guideMarker = null, guideT = 0, guideWay = null, hintUntil = 0;
function showHint() {
  if (settings.guide === 'off') { toast('Guidance is off. Turn it on in Settings.'); return; }
  hintUntil = G.playTime + 10;
  audio.play(audio.buffers.click, { gain: 0.3, reverb: 0 });
}
function updateGuide(dt) {
  const el = $('guide');
  const on = settings.guide === 'always' || (settings.guide === 'key' && G.playTime < hintUntil);
  if (!guideMarker) {
    guideMarker = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), new THREE.MeshBasicMaterial({ color: 0xffe2a8, transparent: true, opacity: 0.85, depthTest: false }));
    guideMarker.renderOrder = 10; scene.add(guideMarker);
  }
  if (!on || player.hidden || G.mode !== 'play') { el.classList.add('hidden'); guideMarker.visible = false; return; }
  const t = guideTarget();
  guideT -= dt;
  if (guideT <= 0) {
    guideT = 0.4;
    // steer toward the farthest point along the route that is actually in view
    const path = world.findPath(player.pos, t.pos);
    guideWay = null;
    if (path && path.length > 1) {
      let pick = null;
      for (let i = 1; i < Math.min(path.length, 12); i++) {
        const n = path[i];
        const p = new THREE.Vector3(n.x + 0.5, n.y + 1.2, n.z + 0.5);
        if (!world.lineOfSight(camera.position, p)) break;
        pick = p;
      }
      guideWay = pick || new THREE.Vector3(path[1].x + 0.5, path[1].y + 1.2, path[1].z + 0.5);
      guideWay.dist = path.length;
    }
    const tv = world.wallsBetween(camera.position, t.pos, 1) === 0 && Math.abs(t.pos.y - camera.position.y) < 2.2;
    if (tv && camera.position.distanceTo(t.pos) < 4) guideWay = null; // it's right there: point at it
  }
  const aim = guideWay || t.pos;
  const dx = aim.x - camera.position.x, dz = aim.z - camera.position.z;
  let rel = Math.atan2(-dx, -dz) - player.yaw;
  while (rel > Math.PI) rel -= 2 * Math.PI; while (rel < -Math.PI) rel += 2 * Math.PI;
  const dist = guideWay ? guideWay.dist : Math.round(Math.hypot(t.pos.x - player.pos.x, t.pos.z - player.pos.z));
  const dy = t.pos.y - player.pos.y;
  const floorNote = dy > 2 ? ' · upstairs' : dy < -1.5 ? ' · downstairs' : '';
  $('guide-arrow').style.transform = `rotate(${-rel}rad)`;
  const close = !guideWay && camera.position.distanceTo(t.pos) < 4;
  $('guide-text').textContent = close ? `${t.label} · here, look for the light` : `${t.label} · ${dist} m${floorNote}`;
  el.classList.remove('hidden');
  // marker over the object when it's close and in view
  const near = camera.position.distanceTo(t.pos) < 9 && world.wallsBetween(camera.position, t.pos, 1) === 0;
  guideMarker.visible = near;
  guideMarker.position.set(t.pos.x, t.pos.y + 0.28 + Math.sin(time * 3) * 0.04, t.pos.z);
  guideMarker.rotation.y += dt * 2;
  guideMarker.material.opacity = 0.55 + Math.sin(time * 4) * 0.3;
}

// ---------------------------------------------------------------- death
function kill() {
  if (G.mode !== 'play') return;
  G.mode = 'dying';
  G.deaths++;
  if (player.hidden) { player.hidden = null; $('slats').classList.add('hidden'); audio.muffled = 0; }
  mother.state = 'kill';
  G.killT = 0;
  audio.play(audio.buffers.jumpscare, { gain: 1.2, reverb: 0.3 });
  audio.play(audio.buffers.scream, { gain: 1.3, rate: 1.05 });
  audio.play(audio.buffers.screamLow, { gain: 1.0, rate: 0.9, when: 0.05 });
  $('flash').style.transition = 'none'; $('flash').style.opacity = 0.18; $('flash').style.background = '#400';
  requestAnimationFrame(() => { $('flash').style.transition = 'opacity 0.6s'; $('flash').style.opacity = 0; });
}
function updateDying(dt) {
  G.killT += dt;
  // snap the view to her face
  const head = mother.headPos();
  const toHead = new THREE.Vector3().subVectors(head, camera.position);
  const wantYaw = Math.atan2(-toHead.x, -toHead.z);
  const wantPitch = Math.atan2(toHead.y, Math.hypot(toHead.x, toHead.z));
  let dy = wantYaw - player.yaw; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
  player.yaw += dy * Math.min(1, dt * 14); player.pitch += (wantPitch - player.pitch) * Math.min(1, dt * 14);
  // she lunges in
  const dir = new THREE.Vector3(Math.sin(mother.yaw), 0, Math.cos(mother.yaw));
  const want = camera.position.clone().addScaledVector(dir, -1.2);
  mother.pos.x += (want.x - mother.pos.x) * Math.min(1, dt * 6); mother.pos.z += (want.z - mother.pos.z) * Math.min(1, dt * 6);
  const faceYaw = Math.atan2(camera.position.x - mother.pos.x, camera.position.z - mother.pos.z);
  mother.yaw = faceYaw;
  G.damage = Math.min(0.45, G.killT * 0.6);
  mother.rig.position.y = -0.42; // she drops her face to yours
  flashlight.intensity = FLASH * (0.18 + Math.random() * 0.12); spill.intensity = 0.3;
  camera.position.x += (Math.random() - 0.5) * 0.04; camera.position.y += (Math.random() - 0.5) * 0.04;
  if (G.killT > 1.6 && !G.deathShown) {
    G.deathShown = true;
    fade(1, 0.4);
    setTimeout(() => {
      releasePointer();
      $('hud').classList.add('hidden');
      const tips = ['She hears running. Walk when you can, crouch when she is near.', 'Your flashlight gives you away. Turn it off (F) when she is close.', 'Hide in a wardrobe, but only once she has lost sight of you.', 'The music box (Q) makes her stop and listen.', 'Doors slow her down less than you think. Break line of sight instead.'];
      $('death-tip').textContent = tips[G.deaths % tips.length];
      showScreen('death');
    }, 600);
  }
}
function retry() {
  showScreen(null);
  G.deathShown = false;
  const s = lastCheckpoint || store.get(SAVE_KEY) || defaultState();
  const deaths = G.deaths;
  applyState(s);
  G.deaths = deaths;
  G.mode = 'play';
  G.damage = 0;
  $('hud').classList.remove('hidden');
  fade(0, 1.5);
  capturePointer();
}

// ---------------------------------------------------------------- input
const keys = new Set();
const touch = { mx: 0, mz: 0, run: false, crouch: false };
let pointerLocked = false;
// The mouse turns the view through pointer lock. Browsers refuse a lock that
// isn't started by a click, or one asked for within about a second of leaving
// it with Esc; then the game shows "Click to continue" and the next click locks.
// Only sandboxed frames that never allow it switch to drag-to-look: hold a
// mouse button and move to look, click to use.
const inFrame = (() => { try { return window.self !== window.top; } catch { return true; } })();
let lockBroken = !canvas.requestPointerLock;
let lockFails = 0;
function lockUnavailable() {
  if (lockBroken) return;
  lockBroken = true;
  if (!$('clicktoplay').classList.contains('hidden')) showScreen(null);
  if (G.mode === 'play') toast('Drag with the mouse to look around. Click to use things.', 6);
}
let lastLockGesture = false;
function lockFailed() {
  if (pointerLocked || lockBroken) return;
  // a frame that refuses even a real click, twice, will never allow it
  if (inFrame && lastLockGesture && ++lockFails >= 2) { lockUnavailable(); return; }
  if (G.mode === 'play' && !G.ui && !G.paused) showScreen('clicktoplay');
}
document.addEventListener('pointerlockerror', lockFailed);
function capturePointer() {
  if (isTouch || lockBroken || G.mode !== 'play' || G.ui || G.paused || document.pointerLockElement === canvas) return;
  lastLockGesture = navigator.userActivation ? navigator.userActivation.isActive : true;
  try {
    const p = canvas.requestPointerLock();
    if (p && p.catch) p.catch(() => {});
  } catch { lockFailed(); }
  // if the browser quietly ignored the request, ask for a click
  setTimeout(() => { if (!pointerLocked && !lockBroken && G.mode === 'play' && !G.ui && !G.paused) showScreen('clicktoplay'); }, 400);
}
function releasePointer() { if (document.pointerLockElement) document.exitPointerLock(); }
document.addEventListener('pointerlockchange', () => {
  pointerLocked = document.pointerLockElement === canvas;
  if (pointerLocked) { lockFails = 0; if (!$('clicktoplay').classList.contains('hidden')) showScreen(null); }
  if (!pointerLocked && G.mode === 'play' && !G.ui && !G.paused) pause(true);
});
canvas.addEventListener('click', () => {
  if (G.mode !== 'play' || G.paused || G.ui || isTouch) return;
  if (pointerLocked) interact();
  else if (!lockBroken) capturePointer();
});
// drag-to-look when the mouse can't be captured
let drag = null;
canvas.addEventListener('mousedown', (e) => { if (!pointerLocked && lockBroken && !isTouch) drag = { moved: 0 }; e.preventDefault(); });
addEventListener('mouseup', () => {
  if (drag && drag.moved < 6 && G.mode === 'play' && !G.paused && !G.ui) interact();
  drag = null;
});
document.addEventListener('mousemove', (e) => {
  if (!drag || G.mode !== 'play' || G.ui || G.paused) return;
  drag.moved += Math.abs(e.movementX) + Math.abs(e.movementY);
  look(e.movementX * 1.3, e.movementY * 1.3);
});
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
$('clicktoplay').addEventListener('click', () => { showScreen(null); capturePointer(); });
document.addEventListener('mousemove', (e) => {
  if (!pointerLocked || G.mode !== 'play' || G.ui) return;
  look(e.movementX, e.movementY);
});
function look(dx, dy) {
  const s = 0.0022 * settings.sens;
  player.yaw -= dx * s;
  player.pitch -= dy * s * (settings.invert ? -1 : 1);
  player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch));
  if (player.hidden) {
    let d = player.yaw - player.hideYaw; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    player.yaw = player.hideYaw + Math.max(-0.6, Math.min(0.6, d));
    player.pitch = Math.max(-0.35, Math.min(0.3, player.pitch));
  }
}
addEventListener('keydown', (e) => {
  if (e.code === 'Tab') e.preventDefault();
  if (G.ui === 'keypad') {
    if (/^Digit\d$|^Numpad\d$/.test(e.code)) pressKey(e.code.slice(-1));
    else if (e.code === 'Backspace') { code = code.slice(0, -1); renderCode(); }
    else if (e.code === 'Escape' || e.code === 'KeyE') closeKeypad();
    return;
  }
  if (G.ui === 'note') { if (['Escape', 'KeyE', 'Space', 'Enter'].includes(e.code)) closeNote(); return; }
  if (G.ui === 'inventory') { if (['Escape', 'Tab', 'KeyI'].includes(e.code)) toggleInventory(); return; }
  if (G.mode !== 'play') return;
  if (e.code === 'Escape') { if (!pointerLocked && performance.now() - (G.pausedAt || 0) > 400) pause(!G.paused); return; }
  if (G.paused) return;
  keys.add(e.code);
  if (e.repeat) return;
  if (e.code === 'KeyE') interact();
  if (e.code === 'KeyF') toggleFlashlight();
  if (e.code === 'KeyR') swapBattery();
  if (e.code === 'KeyQ') useMusicBox();
  if (e.code === 'KeyH') showHint();
  if (e.code === 'Tab' || e.code === 'KeyI') toggleInventory();
  if (e.code === 'KeyC' || e.code === 'ControlLeft') player.crouchToggle = !player.crouchToggle;
});
addEventListener('keyup', (e) => keys.delete(e.code));
addEventListener('blur', () => keys.clear());
$('note').addEventListener('click', () => { if (G.ui === 'note') closeNote(); });

function toggleFlashlight() {
  if (G.battery <= 0) { toast(G.spares ? 'Dead. [R] to swap batteries.' : 'The batteries are dead.'); player.flashlightOn = false; return; }
  player.flashlightOn = !player.flashlightOn;
  audio.play(audio.buffers.flashlight, { gain: 0.5, reverb: 0 });
}
function swapBattery() {
  if (!G.spares) { toast('No spare batteries.'); return; }
  if (G.battery > 0.9) return;
  G.spares--; G.battery = 1; player.flashlightOn = true;
  audio.play(audio.buffers.click, { gain: 0.6, reverb: 0 }); audio.play(audio.buffers.flashlight, { gain: 0.5, reverb: 0, when: 0.4 });
  toast('Fresh batteries.');
}
function useMusicBox() {
  if (!G.inv.has('musicBox')) return;
  if (G.boxCooldown > 0) { toast('The spring is still unwinding.'); return; }
  G.boxCooldown = 22;
  const l = audio.lullaby({ pos: camera.position.clone(), gain: 0.55, tempo: 0.45 });
  setTimeout(() => l.stop(), 10000);
  if (mother && mother.root.visible && mother.pos.distanceTo(player.pos) < 22) {
    mother.listen(10);
    if (G.chase) { G.chase = false; }
    setTimeout(() => audio.play(audio.buffers.whisper, { pos: mother.headPos(), gain: 0.8, rate: 0.8 }), 1200);
  }
  toast('You wind the music box. The tune spills into the dark.');
}

// interaction raycast
const raycaster = new THREE.Raycaster();
let focus = null;
function updateFocus() {
  focus = null;
  if (player.hidden) { $('prompt').innerHTML = '<kbd>E</kbd>Leave the wardrobe'; $('crosshair').classList.add('active'); return; }
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  raycaster.far = 3;
  const hits = raycaster.intersectObjects(hitMeshes, false);
  let firstDist = Infinity;
  for (const h of hits) {
    const e = meshToEntry.get(h.object);
    if (!e || h.distance > e.range) continue;
    if (h.object.visible === false && !(h.object.material && h.object.material.visible === false)) continue;
    let vis = true; h.object.traverseAncestors(a => { if (a.visible === false) vis = false; });
    if (!vis) continue;
    // pull the test point back toward the eye so a door or wall-mounted object
    // doesn't count as blocking itself
    const probe = h.point.clone().addScaledVector(raycaster.ray.direction, -0.15);
    if (world.wallsBetween(camera.position, probe, 1) > 0) continue;
    const label = e.label();
    if (!label) continue;
    // a pickup just behind something examinable still wins
    if (!focus) { focus = e; firstDist = h.distance; if (e.pickup) break; continue; }
    if (e.pickup && h.distance < firstDist + 0.6) { focus = e; break; }
    if (h.distance > firstDist + 0.6) break;
  }
  if (!focus) focus = nearbyInteractable();
  $('prompt').innerHTML = focus ? `<kbd>${isTouch ? 'USE' : 'E'}</kbd>${focus.label()}` : '';
  $('crosshair').classList.toggle('active', !!focus);
}
// When the crosshair isn't exactly on anything, pick the closest usable thing
// right in front of the player (within arm's reach), so small objects and
// phone players don't need pixel-perfect aim.
const _wp = new THREE.Vector3(), _look = new THREE.Vector3();
function nearbyInteractable() {
  camera.getWorldDirection(_look); _look.y = 0; _look.normalize();
  let best = null, bestScore = Infinity;
  for (const e of interactables) {
    const o = e.objs[0];
    let vis = o.visible; o.traverseAncestors(a => { if (!a.visible) vis = false; });
    if (!vis) continue;
    o.getWorldPosition(_wp);
    const dy = _wp.y - player.pos.y;
    if (dy < -0.3 || dy > 2.3) continue;
    const dx = _wp.x - camera.position.x, dz = _wp.z - camera.position.z;
    const d = Math.hypot(dx, dz);
    if (d > 1.7) continue;
    const facing = (dx * _look.x + dz * _look.z) / Math.max(d, 0.01);
    if (facing < (d < 1 ? 0.3 : 0.55)) continue;
    if (world.wallsBetween(camera.position, _wp, 1) > 0) continue;
    const label = e.label();
    if (!label) continue;
    const score = d * (2 - facing) - (e.pickup ? 0.3 : 0);
    if (score < bestScore) { bestScore = score; best = e; }
  }
  return best;
}
function interact() {
  if (G.mode !== 'play' || G.paused) return;
  if (player.hidden) { exitHide(); return; }
  updateFocus(); // always act on what is under the crosshair right now
  if (focus) focus.act();
}

// touch controls
if (isTouch) {
  const stick = $('stick'), knob = $('stick-knob');
  const buzz = (ms) => { try { navigator.vibrate && navigator.vibrate(ms); } catch { /* not supported */ } };
  let sid = null, cx = 0, cy = 0, reach = 50;
  stick.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    sid = e.pointerId; const r = stick.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; reach = r.width * 0.38;
    try { stick.setPointerCapture(sid); } catch { /* synthetic events have no capture */ }
    stick.classList.add('active'); buzz(8);
  });
  stick.addEventListener('pointermove', (e) => {
    if (e.pointerId !== sid) return;
    let dx = e.clientX - cx, dy = e.clientY - cy; const l = Math.hypot(dx, dy);
    if (l > reach) { dx = dx / l * reach; dy = dy / l * reach; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    touch.mx = dx / reach; touch.mz = dy / reach;
  });
  const end = (e) => { if (e && e.pointerId !== sid) return; sid = null; knob.style.transform = ''; touch.mx = touch.mz = 0; stick.classList.remove('active'); };
  stick.addEventListener('pointerup', end); stick.addEventListener('pointercancel', end);
  let lid = null, lx = 0, ly = 0;
  canvas.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'touch') return; lid = e.pointerId; lx = e.clientX; ly = e.clientY; });
  canvas.addEventListener('pointermove', (e) => { if (e.pointerId !== lid || G.ui) return; look((e.clientX - lx) * 1.6, (e.clientY - ly) * 1.6); lx = e.clientX; ly = e.clientY; });
  canvas.addEventListener('pointerup', (e) => { if (e.pointerId === lid) lid = null; });
  canvas.style.touchAction = 'none';
  for (const b of document.querySelectorAll('#touch .tb')) {
    const release = () => b.classList.remove('pressed');
    b.addEventListener('pointerup', release); b.addEventListener('pointercancel', release); b.addEventListener('pointerleave', release);
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      b.classList.add('pressed'); buzz(12);
      const t = b.dataset.t;
      if (G.ui === 'note') { closeNote(); return; }
      if (t === 'use') interact();
      if (t === 'light') toggleFlashlight();
      if (t === 'run') touch.run = !touch.run;
      if (t === 'crouch') { player.crouchToggle = !player.crouchToggle; if (player.crouchToggle) touch.run = false; }
      if (t === 'inv') toggleInventory();
      if (t === 'box') useMusicBox();
      if (t === 'pause') pause(true);
      if (t === 'hint') showHint();
      syncTouch();
    });
  }
}
// Keep the round buttons showing the real state: lit when on, USE pulses
// when something can be used, the music box dims until you own it.
function syncTouch() {
  if (!isTouch) return;
  // panels (notes, keypad, pause, death) sit above the game: hide the controls under them
  $('touch').classList.toggle('covered', !!(G.ui === 'note' || G.ui === 'keypad' || G.paused || G.mode !== 'play'));
  const q = (t) => document.querySelector(`#touch [data-t="${t}"]`);
  q('light').classList.toggle('on', player.flashlightOn && G.battery > 0);
  q('run').classList.toggle('on', !!touch.run);
  q('crouch').classList.toggle('on', !!player.crouchToggle);
  q('use').classList.toggle('ready', !!focus || !!player.hidden);
  q('box').classList.toggle('off', !G.inv.has('musicBox'));
  q('hint').classList.toggle('on', settings.guide === 'key' && G.playTime < hintUntil);
}

// ---------------------------------------------------------------- player update
const _fwd = new THREE.Vector3(), _right = new THREE.Vector3();
function updatePlayer(dt) {
  if (player.hidden) {
    const h = player.hidden;
    camera.position.set(h.pos.x, h.pos.y + Math.sin(time * 1.3) * 0.004, h.pos.z);
    camera.rotation.set(player.pitch, player.yaw, 0);
    player.head.copy(camera.position);
    G.stamina = Math.min(1, G.stamina + dt * 0.2);
    return;
  }
  let mx = 0, mz = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) mz -= 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) mz += 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) mx -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) mx += 1;
  mx += touch.mx; mz += touch.mz;
  const ml = Math.hypot(mx, mz); if (ml > 1) { mx /= ml; mz /= ml; }
  const moving = ml > 0.1;
  player.crouching = !!player.crouchToggle;
  const wantRun = (keys.has('ShiftLeft') || keys.has('ShiftRight') || touch.run) && moving && !player.crouching && mz < 0.3;
  if (wantRun && G.stamina > 0.02 && !G.winded) { player.sprinting = true; G.stamina = Math.max(0, G.stamina - dt * 0.16); if (G.stamina <= 0.02) { G.winded = true; audio.play(audio.buffers.exhale, { gain: 0.6, reverb: 0 }); } }
  else { player.sprinting = false; G.stamina = Math.min(1, G.stamina + dt * (moving ? 0.07 : 0.14)); if (G.stamina > 0.35) G.winded = false; }
  const speed = player.crouching ? 1.1 : player.sprinting ? 4.3 : 2.0;
  _fwd.set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
  _right.set(Math.cos(player.yaw), 0, -Math.sin(player.yaw));
  const want = new THREE.Vector3().addScaledVector(_fwd, -mz).addScaledVector(_right, mx).multiplyScalar(speed);
  player.vel.lerp(want, Math.min(1, dt * (moving ? 10 : 12)));
  let nx = player.pos.x + player.vel.x * dt, nz = player.pos.z + player.vel.z * dt;
  const onStairs = world.inStairs(nx, nz) || world.inStairs(player.pos.x, player.pos.z);
  const colLevel = onStairs ? world.levelOf(player.pos.y) : player.level;
  const bumpBefore = [nx, nz];
  [nx, nz] = world.collide(nx, nz, 0.3, colLevel);
  if (G.flags && !G.flags.entered && nz > 15 && Math.abs(bumpBefore[1] - nz) > 0.001 && !G.leaveMsg) { G.leaveMsg = true; toast('Kowalski is still in there.'); setTimeout(() => (G.leaveMsg = false), 4000); }
  player.pos.x = nx; player.pos.z = nz;
  if (world.inStairs(player.pos.x, player.pos.z)) player.level = world.levelOf(player.pos.y);
  const targetY = world.floorY(nx, nz, player.level);
  player.pos.y += (targetY - player.pos.y) * Math.min(1, dt * 18);
  player.level = world.inStairs(nx, nz) ? world.levelOf(player.pos.y) : world.levelOf(player.pos.y + 0.3);
  // crouch and head bob
  player.crouch += ((player.crouching ? 1 : 0) - player.crouch) * Math.min(1, dt * 8);
  const hs = Math.hypot(player.vel.x, player.vel.z);
  player.bob += dt * hs * (player.sprinting ? 2.2 : 2.6);
  const bobAmp = Math.min(1, hs / 2) * (player.sprinting ? 0.06 : 0.035) * (1 - player.crouch * 0.5);
  const eye = 1.66 - player.crouch * 0.6 + Math.sin(player.bob * 2) * bobAmp;
  camera.position.set(player.pos.x + Math.cos(player.bob) * bobAmp * 0.5 * _right.x, player.pos.y + eye, player.pos.z + Math.cos(player.bob) * bobAmp * 0.5 * _right.z);
  const breath = Math.sin(time * (1.1 + (1 - G.stamina) * 2)) * 0.004 * (1 + (1 - G.stamina) * 3);
  camera.rotation.set(player.pitch + breath, player.yaw, Math.sin(player.bob) * bobAmp * 0.15);
  player.head.copy(camera.position);
  // footsteps
  player.stepDist += hs * dt;
  const stride = player.sprinting ? 0.95 : player.crouching ? 0.55 : 0.72;
  if (player.stepDist > stride) {
    player.stepDist = 0;
    const room = world.roomAt(player.pos);
    const floor = room ? room.floor : 'wood';
    const g = player.crouching ? 0.12 : player.sprinting ? 0.75 : 0.35;
    player.foot = -(player.foot || 1);
    const surface = world.inStairs(player.pos.x, player.pos.z) ? 'stairs' : floor;
    audio.footstep(surface, player.sprinting ? 'run' : player.crouching ? 'crouch' : 'walk', player.pos, _right, player.foot);
    const creak = floor === 'wood' && Math.random() < (player.sprinting ? 0.2 : 0.07);
    if (creak) audio.play(audio.buffers.creakFloor, { gain: g * 0.9, rate: 0.8 + Math.random() * 0.4, pos: player.pos.clone(), ref: 3 });
    noise(player.pos, player.crouching ? 0.6 : player.sprinting ? 13 : creak ? 5 : 2.6);
  }
  if (player.sprinting && Math.random() < dt * 0.8) audio.play(G.stamina < 0.4 ? audio.buffers.exhale : audio.buffers.inhale, { gain: 0.15 + (1 - G.stamina) * 0.3, reverb: 0 });
}

function updateFlashlight(dt) {
  if (player.flashlightOn && G.battery > 0) G.battery = Math.max(0, G.battery - dt / 330);
  if (G.battery <= 0 && player.flashlightOn) { player.flashlightOn = false; audio.play(audio.buffers.flashlight, { gain: 0.4, reverb: 0 }); toast(G.spares ? 'The flashlight died. [R] to swap batteries.' : 'The flashlight died.'); }
  let I = player.flashlightOn ? FLASH : 0;
  if (G.battery < 0.15) I *= 0.4 + G.battery * 4 * (Math.random() < 0.08 ? 0.2 : 1);
  const md = mother && mother.root.visible ? mother.pos.distanceTo(player.pos) : 99;
  if (md < 8 && Math.random() < 0.25) I *= Math.random() * 0.5;
  if (G.blackout > 0 && Math.random() < 0.7) I *= 0.1;
  flashlight.intensity = I;
  spill.intensity = I > 0 ? 0.8 : 0;
  // lag the beam slightly behind the view, like a hand-held torch
  G.fx = (G.fx || 0) + (Math.sin(time * 0.9) * 0.04 - (G.fx || 0)) * dt * 2;
  flashTarget.position.set(G.fx + Math.sin(time * 1.3) * 0.03, Math.cos(time * 1.1) * 0.03 - 0.2, -6);
}

// ---------------------------------------------------------------- main loop
function frame() {
  requestAnimationFrame(frame);
  const nowT = performance.now(); const dt = Math.min(0.05, (nowT - lastT) / 1000); lastT = nowT;
  if (!world) return;
  update(dt);
  render();
}
function update(dt) {
  if (!G.paused) time += dt;
  const U = post.uniforms;
  if (G.mode === 'title') {
    // slow cinematic drift in front of the house
    const t = time * 0.05;
    camera.position.set(12 + Math.sin(t) * 3, 1.7, 21 + Math.cos(t * 0.7) * 1.5);
    camera.lookAt(12, 2.8, 6);
    flashlight.intensity = 0; spill.intensity = 0;
    updateLightning(dt); updateLights(dt);
  } else if (!G.paused) {
    if (G.mode === 'play') {
      G.playTime += dt;
      runTimers(dt);
      updatePlayer(dt);
      G.frameN = (G.frameN || 0) + 1;
      if (G.ui !== 'keypad' && G.ui !== 'note' && G.frameN % 2 === 0) updateFocus();
      updateScript(dt);
      updateRinging(dt);
      if (G.boxCooldown > 0) G.boxCooldown -= dt;
      if (mother.graceT > 0) { mother.graceT -= dt; }
      mother.update(dt, player, time);
      // capture
      if (mother.root.visible && mother.state !== 'dormant' && mother.state !== 'listen' && !(mother.graceT > 0)) {
        const d = Math.hypot(mother.pos.x - player.pos.x, mother.pos.z - player.pos.z);
        const sameLevel = Math.abs(mother.pos.y - player.pos.y) < 1.4;
        if (!player.hidden && sameLevel && d < 1.05 && (mother.state === 'chase' || mother.seesPlayer || d < 0.8)) kill();
        if (player.hidden && G.sawHide && mother.pos.distanceTo(player.hidden.exit) < 1.3) kill();
      }
      updateFlashlight(dt);
    } else if (G.mode === 'dying') {
      mother.update(dt, player, time);
      updateDying(dt);
    }
    world.updateDoors(dt);
    updateLightning(dt);
    updateLights(dt);
    updateTv();
    updateFuseLed();
    // fear: proximity + chase
    const md = mother && mother.root.visible ? mother.pos.distanceTo(player.pos) : 99;
    const targetFear = mother && mother.root.visible ? Math.max(G.chase ? 0.9 : 0, Math.max(0, 1 - md / 12) * (mother.seesPlayer ? 1 : 0.7)) : 0;
    G.fear += (targetFear - G.fear) * Math.min(1, dt * (targetFear > G.fear ? 3 : 0.5));
    // clock ticking in the foyer
    G.tickT = (G.tickT || 0) - dt;
    if (G.tickT <= 0 && refs) { G.tickT = 1; G.tock = !G.tock; if (camera.position.distanceTo(refs.clockPos) < 14) audio.play(G.tock ? audio.buffers.tock : audio.buffers.tick, { pos: refs.clockPos, gain: 0.35, reverb: 0.3 }); }
    const room = world.roomAt(player.pos);
    audio.update(dt, {
      fear: G.fear, chase: G.chase, outside: G.mode === 'title' || (room && room.outdoor) || player.pos.z > 12.9,
      randomPoint: () => new THREE.Vector3(player.pos.x + (Math.random() - 0.5) * 16, player.pos.y + 1 + Math.random() * 2, player.pos.z + (Math.random() - 0.5) * 16),
    });
    updateUI(dt);
    if (G.mode === 'play') updateGuide(dt);
    syncTouch();
  }
}
function render() {
  const U = post.uniforms;
  // listener follows the camera
  const f = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion), up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  audio.setListener(camera.position, f, up);
  // shaders
  if (rain) rain.material.uniforms.uTime.value = time;
  if (dust) { const u = dust.material.uniforms; u.uTime.value = time; u.uCam.value.copy(camera.position); u.uDir.value.copy(f); u.uOn.value = flashlight.intensity / FLASH; }
  scene.fog.density = G.mode === 'title' ? 0.03 : (player.pos.z > 12.9 ? 0.04 : 0.055);
  U.uTime.value = time; U.uFear.value = G.fear; U.uDamage.value = G.damage; U.uExposure.value = settings.bright * 1.3;
  U.uRed.value = G.mode === 'dying' ? Math.min(0.22, Math.max(0, G.killT - 0.9) * 0.3) : 0;
  G.shadowT = (G.shadowT || 0) + 1;
  if (G.shadowT % 6 === 0 || lightningT >= 0) moon.shadow.needsUpdate = true;
  renderer.setRenderTarget(rt);
  renderer.render(scene, camera);
  U.tDiffuse.value = rt.texture;
  renderer.setRenderTarget(null);
  renderer.render(postScene, postCam);
}

// ---------------------------------------------------------------- menus
function startGame(state) {
  audio.init();
  audio.setVolume('master', settings.vol);
  showScreen(null);
  fade(1, 0.01);
  $('hud').classList.remove('hidden');
  if (isTouch) $('touch').classList.remove('hidden');
  G.mode = 'play'; G.paused = false; G.ui = null;
  G.deathShown = false;
  applyState(state);
  lastCheckpoint = state.flags && Object.keys(state.flags).length ? state : null;
  setTimeout(() => fade(0, 2.5), 200);
  if (!state.flags.entered) {
    setObjective('enter');
    setTimeout(() => say(RADIO.intro), 1800);
  }
  if (isTouch) { try { document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {}); } catch { /* optional */ } }
  capturePointer();
}
function pause(on) {
  if (G.mode !== 'play') return;
  G.paused = on;
  syncTouch();
  if (on) G.pausedAt = performance.now();
  if (on) { releasePointer(); showScreen('pause'); if (audio.ctx) audio.ctx.suspend(); }
  else { showScreen(null); if (audio.ctx) audio.ctx.resume(); if (!isTouch && !lockBroken) showScreen('clicktoplay'); }
}
function quitToTitle() {
  G.mode = 'title'; G.paused = false; G.ui = null;
  if (audio.ctx) audio.ctx.resume();
  mother.hide();
  $('hud').classList.add('hidden'); $('touch').classList.add('hidden');
  for (const id of ['note', 'keypad', 'inventory']) $(id).classList.add('hidden');
  $('slats').classList.add('hidden'); audio.muffled = 0; player.hidden = null;
  releasePointer();
  showScreen('title');
  $('btn-continue').classList.toggle('hidden', !store.get(SAVE_KEY));
}
let returnTo = 'title';
$('btn-new').onclick = () => { store.del(SAVE_KEY); startGame(defaultState()); };
$('btn-continue').onclick = () => { const s = store.get(SAVE_KEY); startGame(s || defaultState()); };
$('btn-settings').onclick = () => { returnTo = 'title'; showScreen('settings'); };
$('btn-howto').onclick = () => { returnTo = 'title'; showScreen('howto'); };
$('btn-resume').onclick = () => pause(false);
$('btn-pause-settings').onclick = () => { returnTo = 'pause'; showScreen('settings'); };
$('btn-pause-howto').onclick = () => { returnTo = 'pause'; showScreen('howto'); };
$('btn-quit').onclick = quitToTitle;
$('btn-retry').onclick = retry;
$('btn-death-quit').onclick = quitToTitle;
$('btn-end-title').onclick = () => { quitToTitle(); };
for (const b of document.querySelectorAll('.back')) b.onclick = () => showScreen(returnTo);

// settings bindings
const bind = (id, key, parse = Number, after) => {
  const el = $(id);
  if (el.type === 'checkbox') el.checked = !!settings[key]; else el.value = settings[key];
  el.addEventListener('input', () => {
    settings[key] = el.type === 'checkbox' ? el.checked : parse(el.value);
    store.set(SETTINGS_KEY, settings);
    after && after();
  });
};
bind('set-sens', 'sens');
bind('set-vol', 'vol', Number, () => audio.setVolume('master', settings.vol));
bind('set-bright', 'bright');
bind('set-fov', 'fov', Number, () => { camera.fov = settings.fov; camera.updateProjectionMatrix(); });
bind('set-quality', 'quality', String, applyQuality);
bind('set-invert', 'invert', Boolean);
bind('set-guide', 'guide', String);

// debug hooks for automated testing
window.__hunted = { lightning, guideTarget, get lockBroken() { return lockBroken; }, raycaster, hitMeshes, meshToEntry, step(n, dt = 1 / 30, noRender = false) { for (let i = 0; i < n; i++) update(dt); if (!noRender) render(); }, THREE, scene, G, player, useDoor, pressKey, openKeypad, closeKeypad, closeNote, interact, updateFocus: () => { updateFocus(); return focus && focus.label(); }, enterHide, exitHide, escape, useMusicBox, checkpoint, get mother() { return mother; }, get world() { return world; }, get refs() { return refs; }, startGame, defaultState, take, powerOn, answerPhone, startHunt, openNote, kill, retry, audio, camera, renderer };

load().catch((e) => {
  console.error(e);
  $('btn-new').textContent = 'Failed to load';
  const p = document.createElement('p'); p.className = 'note-small'; p.textContent = 'Something went wrong while loading: ' + e.message + '. Your browser needs WebGL2.';
  $('title').querySelector('.title-inner').appendChild(p);
});
frame();
