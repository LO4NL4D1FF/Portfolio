// "The Mother": what the rite made of Eleanor Hale. A grey human torso with
// four arms and a face full of spider eyes, grown out of a spider's body on
// six jointed legs, dragging a long serpent's tail. The human half is a
// realistic skinned model (Mixamo rig) animated with retargeted clips; the
// spider legs use procedural two-bone IK with a tripod gait; the tail follows
// the path she actually walked. Behaviour is a hearing/sight hunting AI on the
// house navigation grid.
import * as THREE from 'three';
import { H } from './world.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as TX from './textures.js';

const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _q = new THREE.Quaternion(), _e = new THREE.Euler();
const UP = new THREE.Vector3(0, 1, 0);

const L1 = 0.85, L2 = 1.15;               // femur / tibia
const LEG_ROOTS = [0.32, 0.02, -0.28];    // z of hip joints on the thorax
const LEG_REST = [[0.95, 0.85], [1.05, 0.05], [0.95, -0.75]]; // [x, z] of resting feet

function boneMap(root) {
  const b = {};
  root.traverse(o => { if (o.isBone) b[o.name.replace('mixamorig', '').replace(':', '')] = o; });
  return b;
}

// Attach an object to a bone at a world-space point, cancelling the bone's scale.
function attachAt(bone, obj, worldPoint) {
  bone.updateWorldMatrix(true, false);
  const local = bone.worldToLocal(worldPoint.clone());
  const ws = bone.getWorldScale(new THREE.Vector3());
  obj.position.copy(local);
  obj.scale.set(1 / ws.x, 1 / ws.y, 1 / ws.z);
  const wq = bone.getWorldQuaternion(new THREE.Quaternion()).invert();
  obj.quaternion.copy(wq);
  bone.add(obj);
}

export class Mother {
  constructor(scene, world, audio, michelle, soldier, cloneFn) {
    this.scene = scene; this.world = world; this.audio = audio;
    this.root = new THREE.Group();
    this.root.visible = false;
    scene.add(this.root);
    this.rig = new THREE.Group();          // bobs with the gait
    this.root.add(this.rig);

    this.makeMaterials();

    // ---- human half (two torsos -> four arms)
    const human = michelle.scene;
    human.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(human);
    const s = 1.95 / (box.max.y - box.min.y);
    human.scale.multiplyScalar(s);
    human.position.set(0, -box.min.y * s + 0.22, 0.3);
    human.updateMatrixWorld(true);
    const lower = cloneFn(human);
    lower.scale.multiplyScalar(0.9);
    lower.position.set(0, human.position.y - 0.42, 0.36);
    this.rig.add(human); this.rig.add(lower);
    this.human = human; this.lower = lower;
    for (const m of [human, lower]) m.traverse(o => {
      if (o.isMesh || o.isSkinnedMesh) {
        o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
        o.material = this.corrupt(o.material);
      }
    });
    this.b1 = boneMap(human); this.b2 = boneMap(lower);
    // no human legs: they collapse into the spider body. The lower torso has no head.
    for (const b of [this.b1, this.b2]) for (const n of ['LeftUpLeg', 'RightUpLeg']) if (b[n]) b[n].scale.setScalar(0.001);
    if (this.b2.Neck) this.b2.Neck.scale.setScalar(0.001);

    // Procedural animation: every frame the bones are reset to their rest pose,
    // then aimed at target directions (works regardless of the rig's bone axes).
    for (const b of [this.b1, this.b2]) for (const bone of Object.values(b)) bone.userData.rest = bone.quaternion.clone();
    void soldier;

    this.addFace();
    this.buildSpider();
    this.buildTail();

    this.state = 'dormant';
    this.pos = new THREE.Vector3(); this.yaw = 0; this.vel = new THREE.Vector3();
    this.path = null; this.pathI = 0; this.repath = 0;
    this.speed = 0;
    this.lastSeen = null; this.lostTimer = 0; this.searchTimer = 0;
    this.groanTimer = 5; this.twitch = 0; this.twitchT = 2;
    this.aggression = 1; this.listenTimer = 0; this.senseTimer = 0;
  }

  makeMaterials() {
    const ch = TX.chitin(), lg = TX.chitin(true), sc = TX.snakeScales(), fl = TX.flesh();
    this.matChitin = new THREE.MeshStandardMaterial({ map: ch.map, bumpMap: ch.bump, bumpScale: 4, roughness: 0.62, metalness: 0.05, color: 0xb0a090 });
    this.matLeg = new THREE.MeshStandardMaterial({ map: lg.map, bumpMap: lg.bump, bumpScale: 4, roughness: 0.66, metalness: 0.05, color: 0xb8a898 });
    this.matScales = new THREE.MeshStandardMaterial({ map: sc.map, bumpMap: sc.bump, bumpScale: 2.5, roughness: 0.28, metalness: 0.1 });
    this.matFlesh = new THREE.MeshStandardMaterial({ map: fl.map, bumpMap: fl.bump, bumpScale: 3, roughness: 0.3, color: 0xb09090 });
    this.matEye = new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 0.02, metalness: 0.6 });
    this.matFang = new THREE.MeshStandardMaterial({ color: 0xb8a878, roughness: 0.35 });
  }

  corrupt(mat) {
    const m = mat.clone();
    m.roughness = 0.5; m.metalness = 0;
    if (m.color) m.color.setRGB(0.85, 0.85, 0.88);
    m.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
        float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
        vec3 dead = vec3(lum) * vec3(0.74, 0.78, 0.76);
        diffuseColor.rgb = mix(dead, diffuseColor.rgb, 0.08) * 0.78;
        // veins and rot
        float v1 = abs(sin(vViewPosition.x * 23.0 + sin(vViewPosition.y * 17.0) * 2.0));
        float veins = smoothstep(0.985, 1.0, v1);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.08, 0.05, 0.08), veins * 0.35);
        float n = sin(vViewPosition.x * 9.0) * sin(vViewPosition.y * 11.0 + vViewPosition.z * 7.0);
        diffuseColor.rgb *= 0.82 + 0.18 * n;`);
    };
    m.customProgramCacheKey = () => 'mother-skin';
    return m;
  }

  // A cluster of glossy black spider eyes across the forehead and fangs at the mouth.
  addFace() {
    const head = this.b1.Head;
    if (!head) return;
    this.human.updateMatrixWorld(true);
    const hw = head.getWorldPosition(new THREE.Vector3());
    const top = this.b1.HeadTop_End ? this.b1.HeadTop_End.getWorldPosition(new THREE.Vector3()) : hw.clone().add(new THREE.Vector3(0, 0.2, 0));
    const headLen = top.distanceTo(hw);
    const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(this.root.getWorldQuaternion(new THREE.Quaternion()));
    const face = new THREE.Group();
    const eyes = [[0, 0.62, 0.028], [-0.035, 0.6, 0.02], [0.035, 0.6, 0.02], [-0.06, 0.53, 0.016], [0.06, 0.53, 0.016], [-0.022, 0.5, 0.013], [0.022, 0.5, 0.013], [0, 0.7, 0.015]];
    const faceFront = headLen * 0.52;
    for (const [x, y, r] of eyes) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), this.matEye);
      e.position.set(x, y * headLen, faceFront - 0.015 + r * 0.4);
      e.scale.z = 0.7;
      face.add(e);
    }
    for (const sx of [-1, 1]) {
      const fang = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.09, 8), this.matFang);
      fang.position.set(sx * 0.022, headLen * 0.12, faceFront - 0.005);
      fang.rotation.set(Math.PI + 0.35, 0, sx * 0.25);
      face.add(fang);
      const mand = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), this.matChitin);
      mand.position.set(sx * 0.03, headLen * 0.2, faceFront - 0.02); mand.scale.set(0.8, 1.2, 0.8);
      face.add(mand);
    }
    const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), new THREE.MeshStandardMaterial({ color: 0x100204, roughness: 0.2 }));
    mouth.position.set(0, headLen * 0.2, faceFront - 0.012); mouth.scale.set(1.3, 0.6, 0.5);
    face.add(mouth);
    // Build the face in model space, then attach it to the head bone.
    const worldPoint = hw.clone();
    const holder = new THREE.Group();
    holder.add(face);
    // orient face so +z is the character's forward and +y up
    attachAt(head, holder, worldPoint);
    holder.quaternion.multiply(this.root.getWorldQuaternion(new THREE.Quaternion()));
    this.face = face;
    void fwd;
  }

  buildSpider() {
    const R = this.rig;
    const bumpy = (r, sx, sy, sz, amt, seed) => {
      const g = new THREE.SphereGeometry(r, 32, 24);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        _v.fromBufferAttribute(p, i);
        const n = Math.sin(_v.x * 17 + seed) * Math.sin(_v.y * 13 + seed * 2) * Math.sin(_v.z * 11 + seed * 3);
        _v.multiplyScalar(1 + n * amt);
        p.setXYZ(i, _v.x * sx, _v.y * sy, _v.z * sz);
      }
      g.computeVertexNormals();
      return g;
    };
    const thorax = new THREE.Mesh(bumpy(0.33, 1.1, 0.75, 1.15, 0.08, 1), this.matChitin);
    thorax.position.set(0, 0.86, 0.02);
    const join = new THREE.Mesh(bumpy(0.24, 1.0, 0.8, 0.9, 0.16, 4), this.matFlesh);
    join.position.set(0, 1.02, 0.24);
    const abdomen = new THREE.Mesh(bumpy(0.46, 1.0, 0.82, 1.35, 0.12, 7), this.matChitin);
    abdomen.position.set(0, 0.98, -0.78);
    // a sick fleshy sac on the abdomen and bristling spines
    const sac = new THREE.Mesh(bumpy(0.24, 1.2, 0.8, 1.0, 0.2, 9), this.matFlesh);
    sac.position.set(0.16, 1.22, -0.72);
    R.add(thorax, join, abdomen, sac);
    const spikes = [];
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2, b = Math.random() * 1.2;
      const sp = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.12 + Math.random() * 0.12, 5));
      const dir = new THREE.Vector3(Math.cos(a) * Math.sin(b), Math.cos(b), Math.sin(a) * Math.sin(b) * 1.3).normalize();
      sp.position.set(dir.x * 0.46, 0.98 + dir.y * 0.38, -0.78 + dir.z * 0.62);
      sp.quaternion.setFromUnitVectors(UP, dir);
      sp.updateMatrix(); spikes.push(sp.geometry.applyMatrix4(sp.matrix));
    }
    R.add(new THREE.Mesh(mergeGeometries(spikes), this.matChitin));
    for (const m of [thorax, join, abdomen, sac]) { m.castShadow = true; m.receiveShadow = true; }
    this.abdomen = abdomen;

    // legs are simulated in world space
    const unit = new THREE.CylinderGeometry(1, 1, 1, 8); unit.translate(0, 0.5, 0);
    const claw = new THREE.ConeGeometry(0.035, 0.22, 6); claw.translate(0, -0.11, 0);
    this.legs = [];
    for (let i = 0; i < 6; i++) {
      const side = i < 3 ? -1 : 1, idx = i % 3;
      const femur = new THREE.Mesh(unit, this.matLeg), tibia = new THREE.Mesh(unit, this.matLeg);
      const knee = new THREE.Mesh(new THREE.DodecahedronGeometry(0.075, 1), this.matLeg);
      const foot = new THREE.Mesh(claw, this.matLeg);
      for (const m of [femur, tibia, knee, foot]) { m.castShadow = true; this.scene.add(m); m.visible = false; }
      this.legs.push({
        side, idx, group: (idx + (side > 0 ? 1 : 0)) % 2,
        root: new THREE.Vector3(side * 0.3, 0.86, LEG_ROOTS[idx]),
        rest: new THREE.Vector3(side * LEG_REST[idx][0], 0, LEG_REST[idx][1]),
        foot: new THREE.Vector3(), from: new THREE.Vector3(), to: new THREE.Vector3(), t: -1,
        femur, tibia, knee, clawMesh: foot,
      });
    }
  }

  buildTail() {
    this.tailN = 30; this.tailSpacing = 0.12;
    this.tail = [];
    const g = new THREE.SphereGeometry(1, 14, 10);
    this.tailMesh = new THREE.InstancedMesh(g, this.matScales, this.tailN);
    this.tailMesh.castShadow = true; this.tailMesh.receiveShadow = true; this.tailMesh.visible = false; this.tailMesh.frustumCulled = false;
    this.scene.add(this.tailMesh);
    for (let i = 0; i < this.tailN; i++) this.tail.push(new THREE.Object3D());
    this.trail = [];
  }

  setVisible(v) {
    this.root.visible = v;
    for (const l of this.legs) for (const m of [l.femur, l.tibia, l.knee, l.clawMesh]) m.visible = v;
    this.tailMesh.visible = v;
  }

  spawn(pos, state = 'roam', yaw = this.yaw) {
    this.pos.copy(pos); this.yaw = yaw;
    this.setVisible(true);
    this.state = state;
    this.path = null; this.lostTimer = 0;
    this.root.position.copy(this.pos); this.root.rotation.y = this.yaw;
    this.root.updateMatrixWorld(true);
    // plant the feet and lay the tail out straight behind
    for (const l of this.legs) { l.foot.copy(this.footTarget(l)); l.t = -1; }
    this.trail = [];
    const back = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const anchor = this.tailAnchor();
    for (let i = 0; i < 60; i++) this.trail.push(anchor.clone().addScaledVector(back, i * 0.08).setY(this.pos.y));
    this.updateLegs(0, 0);
    this.updateTail(0, 0);
  }
  hide() {
    this.setVisible(false); this.state = 'dormant';
    if (this.breath) { this.breath.stop(0.3); this.breath = null; }
    if (this.slither) { this.slither.stop(0.3); this.slither = null; }
  }

  hear(pos, radius) {
    if (this.state === 'dormant' || this.state === 'chase' || this.state === 'scripted' || this.state === 'listen' || this.state === 'kill') return;
    const d = this.pos.distanceTo(pos);
    const walls = this.world.wallsBetween(this.pos, pos, 4);
    const eff = radius / (1 + walls * 0.5);
    if (d < eff) {
      this.state = 'investigate';
      this.goal = pos.clone();
      this.path = null; this.repath = 0;
      this.searchTimer = 0;
    }
  }

  listen(seconds) {
    if (this.state === 'dormant' || this.state === 'kill') return;
    this.state = 'listen'; this.listenTimer = seconds; this.path = null;
  }

  canSee(player) {
    if (player.hidden) return false;
    const eye = _v.copy(this.pos); eye.y += 1.8;
    const d = eye.distanceTo(player.head);
    if (!this.world.lineOfSight(eye, player.head)) return false;
    if (d < 1.8) return true;
    const dir = _v2.set(player.head.x - this.pos.x, 0, player.head.z - this.pos.z).normalize();
    const inFov = dir.x * Math.sin(this.yaw) + dir.z * Math.cos(this.yaw) > 0.1 || this.state === 'chase';
    if (!inFov) return false;
    let range = 7;
    if (player.flashlightOn) range = player.lightPointedAt(this.pos) ? 20 : 13;
    if (player.crouching) range *= 0.55;
    if (player.lit) range = Math.max(range, 12);
    return d < range * this.aggression;
  }

  update(dt, player, time) {
    if (this.state === 'dormant') return;
    const W = this.world;

    // --- perception
    this.senseTimer -= dt;
    if (this.senseTimer <= 0 && this.state !== 'scripted' && this.state !== 'listen' && this.state !== 'kill') {
      this.senseTimer = 0.15;
      const sees = this.canSee(player);
      this.seesPlayer = sees;
      if (sees) {
        this.lastSeen = player.pos.clone();
        this.lostTimer = 0;
        if (this.state !== 'chase') {
          this.state = 'chase'; this.path = null; this.repath = 0;
          this.onChaseStart && this.onChaseStart();
        }
      }
    }
    if (this.state === 'chase' && !this.seesPlayer) {
      this.lostTimer += dt;
      if (this.lostTimer > 4.5) {
        this.state = 'search'; this.goal = this.lastSeen ? this.lastSeen.clone() : player.pos.clone();
        this.path = null; this.searchTimer = 0;
        this.onChaseEnd && this.onChaseEnd();
      }
    }

    // --- decide goal and speed
    let speed = 0;
    switch (this.state) {
      case 'roam':
        speed = 1.15 * this.aggression;
        if (!this.path || this.pathI >= this.path.length) {
          this.idleTimer = (this.idleTimer || 0) + dt;
          speed = 0;
          if (this.idleTimer > 2.5) {
            this.idleTimer = 0;
            // wander, drifting toward the player's part of the house
            const pl = W.levelOf(player.pos.y);
            let n = W.randomNode(Math.random() < 0.75 ? pl : undefined);
            if (Math.random() < 0.35) {
              const pn = W.nodeAt(player.pos);
              if (pn) { const near = [...W.nav.values()].filter(k => k.f === pn.f && Math.abs(k.x - pn.x) + Math.abs(k.z - pn.z) < 7 && k.n.size); if (near.length) n = near[Math.floor(Math.random() * near.length)]; }
            }
            if (n) { this.path = W.findPath(this.pos, new THREE.Vector3(n.x + 0.5, n.y, n.z + 0.5)); this.pathI = 1; }
          }
        }
        break;
      case 'investigate':
      case 'search':
        speed = (this.state === 'investigate' ? 2.0 : 1.6) * this.aggression;
        if (!this.path) { this.path = W.findPath(this.pos, this.goal); this.pathI = 1; if (!this.path) this.state = 'roam'; }
        if (this.path && this.pathI >= this.path.length) {
          speed = 0; this.searchTimer += dt;
          this.yaw += Math.sin(time * 1.3) * dt * 1.2;
          if (this.searchTimer > 4) { this.state = 'roam'; this.path = null; }
        }
        break;
      case 'chase':
        speed = 3.2 * this.aggression;
        this.repath -= dt;
        if (this.repath <= 0 || !this.path) {
          this.repath = 0.35;
          this.path = W.findPath(this.pos, this.lastSeen || player.pos); this.pathI = 1;
        }
        break;
      case 'listen':
        this.listenTimer -= dt;
        if (this.listenTimer <= 0) { this.state = 'roam'; this.path = null; }
        break;
      case 'scripted':
        speed = this.scriptSpeed || 0;
        break;
    }

    // --- follow the path
    let moving = false;
    const prevX = this.pos.x, prevZ = this.pos.z;
    if (speed > 0 && this.path && this.pathI < this.path.length) {
      const node = this.path[this.pathI];
      const tx = node.x + 0.5, tz = node.z + 0.5;
      const dx = tx - this.pos.x, dz = tz - this.pos.z; const dist = Math.hypot(dx, dz);
      const prev = this.path[this.pathI - 1];
      if (prev) {
        const door = W.linkDoor(prev.key, node.key);
        if (door && door.angle < 0.9 && this.pos.distanceTo(W.doorCenter(door)) < 1.8) {
          door.target = 1.45; door.slam = this.state === 'chase';
          this.onDoor && this.onDoor(door, door.slam);
        }
      }
      if (dist < 0.25) this.pathI++;
      else {
        const step = Math.min(dist, speed * dt);
        let nx = this.pos.x + dx / dist * step, nz = this.pos.z + dz / dist * step;
        [nx, nz] = this.collideWalls(nx, nz, 0.36, W.levelOf(this.pos.y + 0.2));
        this.pos.x = nx; this.pos.z = nz;
        this.turnTo(Math.atan2(dx, dz), dt, 5);
        moving = true;
      }
    }
    if (this.state === 'chase' && this.seesPlayer) {
      const d = Math.hypot(player.pos.x - this.pos.x, player.pos.z - this.pos.z);
      if (d < 3) {
        const desired = Math.atan2(player.pos.x - this.pos.x, player.pos.z - this.pos.z);
        this.turnTo(desired, dt, 8);
        if (d > 0.5) {
          const st = Math.min(d - 0.5, speed * dt * 0.8);
          [this.pos.x, this.pos.z] = this.collideWalls(this.pos.x + Math.sin(desired) * st, this.pos.z + Math.cos(desired) * st, 0.36, W.levelOf(this.pos.y + 0.2));
          moving = true;
        }
      }
    }
    const lvNow = W.levelOf(this.pos.y + 0.2);
    const nextNode = this.path && this.path[this.pathI];
    const targetY = W.inStairs(this.pos.x, this.pos.z) ? W.stairY(this.pos.x) : (nextNode && nextNode.f !== -1 ? nextNode.f * H : lvNow * H);
    this.pos.y += (targetY - this.pos.y) * Math.min(1, dt * 10);

    this.vel.set((this.pos.x - prevX) / Math.max(dt, 1e-4), 0, (this.pos.z - prevZ) / Math.max(dt, 1e-4));
    this.speed += ((moving ? speed : 0) - this.speed) * Math.min(1, dt * 5);
    this.root.position.copy(this.pos);
    this.root.rotation.y = this.yaw;
    this.rig.position.y = Math.sin(time * (2 + this.speed * 3)) * 0.025 * (0.3 + this.speed);
    this.rig.rotation.z = Math.sin(time * (1 + this.speed * 2)) * 0.03;
    this.root.updateMatrixWorld(true);

    // --- human half animation
    this.deform(dt, time);

    this.updateLegs(dt, time);
    this.updateTail(dt, time, moving);
    this.sounds(dt, moving);
  }

  turnTo(desired, dt, rate) {
    let dy = desired - this.yaw; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
    this.yaw += dy * Math.min(1, dt * rate);
  }

  collideWalls(x, z, r, level) {
    for (const c of this.world.colliders[level]) {
      if (c.disabled || c.prop) continue;
      const nx = Math.max(c.x0, Math.min(x, c.x1)), nz = Math.max(c.z0, Math.min(z, c.z1));
      const dx = x - nx, dz = z - nz; const d2 = dx * dx + dz * dz;
      if (d2 < r * r && d2 > 1e-8) { const d = Math.sqrt(d2); x = nx + dx / d * r; z = nz + dz / d * r; }
    }
    return [x, z];
  }

  // ---------- spider legs ----------
  footTarget(l) {
    const p = l.rest.clone().applyMatrix4(this.root.matrixWorld);
    p.addScaledVector(this.vel, 0.28);
    const lv = this.world.levelOf(this.pos.y + 0.2);
    [p.x, p.z] = this.world.collide(p.x, p.z, 0.1, lv, true);
    p.y = this.world.floorY(p.x, p.z, lv);
    return p;
  }

  updateLegs(dt, time) {
    const stepping = [0, 0];
    for (const l of this.legs) if (l.t >= 0) stepping[l.group]++;
    const stepDur = this.state === 'chase' ? 0.11 : 0.19;
    for (const l of this.legs) {
      const want = this.footTarget(l);
      if (l.t < 0) {
        const other = 1 - l.group;
        const far = l.foot.distanceTo(want);
        if ((far > 0.42 || (far > 0.12 && this.speed < 0.1 && Math.random() < 0.02)) && stepping[other] === 0) {
          l.from.copy(l.foot); l.to.copy(want); l.t = 0; stepping[l.group]++;
        }
      } else {
        l.to.lerp(want, 0.3);
        l.t += dt / stepDur;
        if (l.t >= 1) {
          l.t = -1; l.foot.copy(l.to);
          if (this.audio.ready && this.root.visible) this.audio.play(this.audio.buffers.claw, { pos: l.foot, gain: this.state === 'chase' ? 0.9 : 0.55, rate: 0.85 + Math.random() * 0.3, reverb: 0.2 });
        } else {
          const t = l.t;
          l.foot.lerpVectors(l.from, l.to, t);
          l.foot.y += Math.sin(Math.PI * t) * 0.28;
        }
      }
      this.solveLeg(l, time);
    }
  }

  solveLeg(l, time) {
    const hip = l.root.clone(); hip.y += this.rig.position.y; hip.applyMatrix4(this.root.matrixWorld);
    const foot = l.foot.clone(); foot.y += 0.2; // claw tip reaches the floor
    const toFoot = foot.clone().sub(hip);
    let d = toFoot.length();
    d = Math.min(Math.max(d, 0.25), L1 + L2 - 0.02);
    const dir = toFoot.normalize();
    // pole: outwards and up, so knees rise above the body like a spider's
    const out = new THREE.Vector3(l.side, 0, 0).applyQuaternion(this.root.quaternion);
    const pole = out.multiplyScalar(0.6).add(new THREE.Vector3(0, 1.3 + Math.sin(time * 2 + l.idx) * 0.05, 0));
    const perp = pole.sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
    const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    const knee = hip.clone().addScaledVector(dir, a).addScaledVector(perp, h);
    const end = hip.clone().addScaledVector(dir, d);
    this.segment(l.femur, hip, knee, 0.075, 0.05);
    this.segment(l.tibia, knee, end, 0.05, 0.022);
    l.knee.position.copy(knee);
    l.clawMesh.position.copy(end);
    l.clawMesh.quaternion.setFromUnitVectors(UP, end.clone().sub(knee).normalize().negate());
  }

  segment(mesh, a, b, r0, r1) {
    const dir = _v.subVectors(b, a); const len = dir.length();
    mesh.position.copy(a);
    mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
    mesh.scale.set((r0 + r1) / 2, len, (r0 + r1) / 2);
  }

  // ---------- serpent tail ----------
  tailAnchor() { return new THREE.Vector3(0, 0.75, -1.28).applyMatrix4(this.root.matrixWorld); }

  updateTail(dt, time, moving) {
    const anchor = this.tailAnchor();
    const floor = this.pos.y;
    if (!this.trail.length || anchor.distanceTo(this.trail[0]) > 0.06) {
      this.trail.unshift(anchor.clone().setY(floor));
      if (this.trail.length > 90) this.trail.pop();
    }
    // walk along the trail by arc length
    let seg = 0, acc = 0;
    const pts = [anchor.clone().setY(floor), ...this.trail];
    const wig = moving ? 1 : 0.35;
    for (let i = 0; i < this.tailN; i++) {
      const want = i * this.tailSpacing;
      while (seg < pts.length - 2 && acc + pts[seg].distanceTo(pts[seg + 1]) < want) { acc += pts[seg].distanceTo(pts[seg + 1]); seg++; }
      const a = pts[seg], b = pts[Math.min(seg + 1, pts.length - 1)];
      const segLen = Math.max(1e-4, a.distanceTo(b));
      const t = Math.min(1, (want - acc) / segLen);
      const p = _v.lerpVectors(a, b, t);
      const tan = _v2.subVectors(b, a).normalize();
      const side = new THREE.Vector3(-tan.z, 0, tan.x);
      const k = i / this.tailN;
      const r = 0.17 * (1 - k) + 0.025;
      p.addScaledVector(side, Math.sin(time * 5 - i * 0.55) * 0.13 * k * wig);
      // the first segments rise to meet the abdomen
      const rise = Math.max(0, 1 - i / 5);
      p.y = p.y + r * 0.8 + rise * (anchor.y - floor - r);
      const m = this.tail[i];
      m.position.copy(p);
      m.scale.set(r, r * 0.78, this.tailSpacing * 0.95);
      m.lookAt(p.x - tan.x, p.y - tan.y, p.z - tan.z);
      m.updateMatrix();
      this.tailMesh.setMatrixAt(i, m.matrix);
    }
    this.tailMesh.instanceMatrix.needsUpdate = true;
  }

  // ---------- human half ----------
  aim(bone, child, dir) {
    if (!bone || !child) return;
    const bp = bone.getWorldPosition(_v), cp = child.getWorldPosition(_v2);
    const cur = cp.sub(bp).normalize();
    const want = dir.clone().normalize().transformDirection(this.root.matrixWorld);
    const q = new THREE.Quaternion().setFromUnitVectors(cur, want);
    const bw = bone.getWorldQuaternion(new THREE.Quaternion());
    const pw = bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
    bone.quaternion.copy(pw.multiply(q).multiply(bw));
    bone.updateMatrixWorld(true);
  }

  deform(dt, time) {
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    for (const b of [this.b1, this.b2]) for (const bone of Object.values(b)) if (bone.userData.rest) bone.quaternion.copy(bone.userData.rest);
    this.human.updateMatrixWorld(true); this.lower.updateMatrixWorld(true);
    const B = this.b1, C = this.b2;
    const sp = this.speed;
    this.reach = (this.reach || 0) + (((this.state === 'chase' || this.state === 'kill') ? 1 : 0) - (this.reach || 0)) * Math.min(1, dt * 4);
    const r = this.reach;
    // twitching
    this.twitchT -= dt;
    if (this.twitchT <= 0) {
      this.twitchT = 0.4 + Math.random() * 2.2;
      this.twitch = 1;
      this.twitchAxis = [(Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 1.2];
      if (this.root.visible && this.audio.ready && Math.random() < 0.5) this.audio.play(this.audio.buffers.bones, { pos: this.headPos(), gain: 0.35 });
    }
    this.twitch = Math.max(0, this.twitch - dt * 6);
    const tw = this.twitch, ax = this.twitchAxis || [0, 0, 0];
    // upper torso: hunched and swaying
    const sway = Math.sin(time * (0.8 + sp)) * 0.12;
    this.aim(B.Spine, B.Spine1, V(sway * 0.5, 1, 0.15 + r * 0.2));
    this.aim(B.Spine2, B.Neck, V(sway, 1, 0.45 + r * 0.3));
    this.aim(B.Neck, B.Head, V(sway * 0.5, 0.7, 0.9));
    this.aim(B.Head, B.HeadTop_End, V(0.5 + ax[0] * tw + Math.sin(time * 0.7) * 0.15, 1, 0.25 + ax[2] * tw));
    // four arms
    const arm = (bones, side, upper, fore, ph) => {
      const L = side > 0 ? 'Left' : 'Right';
      const up = upper.clone(), fo = fore.clone();
      up.x *= side; fo.x *= side;
      up.y += Math.sin(time * 2.1 + ph) * 0.15; fo.y += Math.sin(time * 3.3 + ph) * 0.25; fo.x += Math.cos(time * 2.7 + ph) * 0.2 * side;
      this.aim(bones[L + 'Arm'], bones[L + 'ForeArm'], up);
      this.aim(bones[L + 'ForeArm'], bones[L + 'Hand'], fo);
      this.aim(bones[L + 'Hand'], bones[L + 'HandMiddle1'], fo.clone().add(V(0, -0.5 - Math.sin(time * 5 + ph) * 0.3, 0)));
    };
    for (const side of [1, -1]) {
      const ph = side > 0 ? 0 : 2.2;
      arm(B, side, V(0.5 - r * 0.2, -0.45 + r * 0.55, 0.45 + r * 0.6), V(0.1, -0.35 + r * 0.4, 1), ph);
    }
    // the second torso bends forward; its arms claw at the floor like extra legs
    this.aim(C.Spine2, C.Neck, V(0, 0.55, 1));
    for (const side of [1, -1]) {
      const ph = side > 0 ? 1.1 : 3.4;
      arm(C, side, V(0.85, -0.35 + r * 0.3, 0.45 + r * 0.4), V(0.25, -0.85 + r * 0.6, 0.6 + r * 0.5), ph);
    }
    for (const bones of [B, C]) for (const L of ['Left', 'Right']) {
      if (bones[L + 'ForeArm']) bones[L + 'ForeArm'].scale.set(1, 1.3, 1);
      if (bones[L + 'Arm']) bones[L + 'Arm'].scale.set(1, 1.15, 1);
      if (bones[L + 'Hand']) bones[L + 'Hand'].scale.set(1, 1.2, 1);
    }
    if (B.Neck) B.Neck.scale.set(1, 1.35, 1);
  }

  headPos() {
    const b = this.b1.Head;
    if (b) return b.getWorldPosition(new THREE.Vector3());
    return this.pos.clone().setY(this.pos.y + 1.9);
  }

  sounds(dt, moving) {
    const A = this.audio;
    if (!A.ready) return;
    const hp = this.headPos();
    if (!this.breath) this.breath = A.play(A.buffers.breath, { pos: hp, loop: true, gain: 0.9, rate: 0.8, ref: 1.2, rolloff: 1.6 });
    else { A.updateVoicePos(this.breath, hp); this.breath.src.playbackRate.value = this.state === 'chase' ? 1.25 : 0.8; }
    const tailPos = this.tail[12].position;
    if (!this.slither) this.slither = A.play(A.buffers.slither, { pos: tailPos, loop: true, gain: 0, ref: 1, rolloff: 1.5 });
    else {
      A.updateVoicePos(this.slither, tailPos);
      this.slither.g.gain.setTargetAtTime(moving ? Math.min(0.9, 0.25 + this.speed * 0.2) : 0.04, A.ctx.currentTime, 0.2);
    }
    this.groanTimer -= dt;
    if (this.groanTimer <= 0) {
      this.groanTimer = 5 + Math.random() * 9;
      if (this.state !== 'kill') {
        const r = Math.random();
        A.play(r < 0.25 ? A.buffers.whisper : r < 0.45 ? A.buffers.hiss : A.buffers.groan, { pos: hp, gain: 0.9, rate: 0.8 + Math.random() * 0.25 });
      }
    }
  }
}
