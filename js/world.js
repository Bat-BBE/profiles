// BATERDENE.EXE — 3D ертөнц (Three.js)
// Ертөнц -Z тэнхлэгийн дагуу байрлана; scroll нь камерыг нэг хэсгээс нөгөө рүү нисгэнэ.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const C = {
  cyan: new THREE.Color("#9fe8ff"),
  violet: new THREE.Color("#a99bff"),
  pink: new THREE.Color("#ff9ad5"),
  amber: new THREE.Color("#ffd38a"),
  green: new THREE.Color("#8fffc1"),
  blue: new THREE.Color("#8cc4ff"),
};

// World anchor points (camera position + look target) per section.
const POS = {
  core: new THREE.Vector3(0, 0, 0),
  mind: new THREE.Vector3(0, 0, -36),
  ring: new THREE.Vector3(0, 0, -72),
  quiet: new THREE.Vector3(0, 0.6, -112),
  values: new THREE.Vector3(0, 0, -140),
  record: new THREE.Vector3(-6, 0, -170),
  planet: new THREE.Vector3(11, 6, -200),
  vault: new THREE.Vector3(0, 0, -236),
  gate: new THREE.Vector3(0, 0, -276),
};
// Desktop: objects sit opposite the text column. Portrait: objects sit in the top half.
const ANCHORS = [
  { pos: [-3.2, 0.2, 8], look: [-3.4, 0, 0], lookPortrait: [0, -3.4, 0], posPortrait: [0, 0.3, 9], kPortrait: 1.65 },
  { pos: [7.6, 2, 9], look: [3.6, 0.2, -1], lookPortrait: [0, -2.6, 0], kPortrait: 1.2 },
  { pos: [-7, 4, -17], look: [-6, 0, -36], lookPortrait: [0, -3.4, -36], posPortrait: [-3, 3, -24], kPortrait: 1.05 },
  { pos: [0, 1.4, -58.5], look: [0, -0.2, -72], lookPortrait: [0, -1.4, -72], kPortrait: 1.05 },
  { pos: [0, -0.4, -96], look: [0, -1.6, -114], lookPortrait: [0, -1.6, -114], kPortrait: 1 },
  { pos: [3, 1.5, -124], look: [4.5, 0, -140], lookPortrait: [0, -3.4, -138], kPortrait: 1.15 },
  { pos: [1, 1, -156], look: [-10, 0, -170], lookPortrait: [-6, -3.6, -170] },
  { pos: [2, 0.5, -178], look: [17, 6, -200], lookPortrait: [11, 1, -200] },
  { pos: [0, 0.4, -225], look: [2.6, 0, -236], lookPortrait: [0, -2.6, -236] },
  { pos: [0, 0, -262], look: [-4.2, 0, -276], lookPortrait: [0, -4.5, -276] },
];

export function createWorld(canvas, opts) {
  const { projects, interests, traits, values, roadmap, mobile, reduced, photos = [] } = opts;
  const cb = { onCoreTap() {}, onCardTap() {}, onTraitTap() {}, onInterestTap() {}, onValueTap() {}, onPhotoTap() {}, onHover() {}, ...opts.callbacks };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: "high-performance" });
  } catch (e) {
    return null;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.6 : 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x04050a, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x04050a, 0.022);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
  camera.position.set(0, 0.3, 30);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), mobile ? 0.9 : 0.85, 0.6, 0.28);
  composer.addPass(bloom);
  // "4D" lens: touch shock-waves bend space, speed splits light into colour
  const lens = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uVel: { value: 0 },
      uAspect: { value: 1 },
      uRip: { value: [new THREE.Vector3(0.5, 0.5, 9), new THREE.Vector3(0.5, 0.5, 9), new THREE.Vector3(0.5, 0.5, 9)] },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse; uniform float uVel, uAspect; uniform vec3 uRip[3]; varying vec2 vUv;
      void main(){
        vec2 uv = vUv; float glow = 0.;
        for (int i = 0; i < 3; i++) {
          float rt = uRip[i].z;
          if (rt < 1.6) {
            vec2 d = uv - uRip[i].xy; d.x *= uAspect;
            float r = length(d);
            float ring = exp(-pow((r - rt * .75) * 14., 2.)) * (1. - rt / 1.6);
            vec2 dir = normalize(d + 1e-5); dir.x /= uAspect;
            uv -= dir * ring * .05;
            glow += ring;
          }
        }
        vec2 c = uv - .5;
        float amt = .0015 + uVel * .011 + glow * .01;
        vec3 col = vec3(texture2D(tDiffuse, uv - c * amt).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv + c * amt).b);
        col += glow * vec3(.35, .6, .8) * .6;
        gl_FragColor = vec4(col, 1.);
      }`,
  });
  composer.addPass(lens);
  composer.addPass(new OutputPass());
  let ripIdx = 0;

  const uni = {
    uTime: { value: 0 },
    uVel: { value: 0 },
    uUnlock: { value: 0 },
  };
  const clickables = [];
  const labelSprites = [];
  let labelK = 1;

  /* ---------------- STARFIELD ---------------- */
  const STAR_N = mobile ? 2600 : 7000;
  const starGeo = new THREE.BufferGeometry();
  {
    const pos = new Float32Array(STAR_N * 3);
    const col = new Float32Array(STAR_N * 3);
    const size = new Float32Array(STAR_N);
    const seed = new Float32Array(STAR_N);
    const pal = [C.cyan, C.violet, C.pink, new THREE.Color("#ffffff"), new THREE.Color("#ffffff"), C.blue];
    for (let i = 0; i < STAR_N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = 30 - Math.random() * 360;
      const c = pal[(Math.random() * pal.length) | 0];
      col.set([c.r, c.g, c.b], i * 3);
      size[i] = Math.random() < 0.04 ? 3 + Math.random() * 3 : 0.6 + Math.random() * 1.6;
      seed[i] = Math.random();
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    starGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  }
  const starMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      ...uni,
      uPR: { value: dpr * (mobile ? 1.35 : 1) },
      uMouse: { value: new THREE.Vector2(9, 9) },
      uAspect: { value: 1 },
      uDrift: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aColor; attribute float aSize; attribute float aSeed;
      uniform float uTime, uPR, uVel, uAspect, uDrift, uUnlock; uniform vec2 uMouse;
      varying vec3 vColor; varying float vA;
      void main(){
        vec3 p = position;
        p.y = mod(p.y + uDrift * (0.4 + aSeed) + 40., 80.) - 40.;
        p.x += sin(uTime * .15 + aSeed * 30.) * .4;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        vec4 clip = projectionMatrix * mv;
        vec2 ndc = clip.xy / clip.w;
        vec2 d = ndc - uMouse; d.x *= uAspect;
        float dist = length(d);
        vec2 push = normalize(d + 1e-5) * smoothstep(.32, 0., dist) * .09;
        push.x /= uAspect;
        clip.xy += push * clip.w;
        gl_Position = clip;
        float tw = .55 + .45 * sin(uTime * (1. + aSeed * 3.) + aSeed * 50.);
        vA = tw * smoothstep(.3, 4., -mv.z) * (1. + smoothstep(.2, 0., dist) * 1.5);
        vColor = mix(aColor, vec3(1., .8, .45), uUnlock * step(.5, aSeed));
        gl_PointSize = clamp(aSize * uPR * (70. / -mv.z) * (1. + uVel * .6), 0., 30.);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor; varying float vA;
      void main(){
        float d = length(gl_PointCoord - .5);
        float a = smoothstep(.5, 0., d); a *= a;
        gl_FragColor = vec4(vColor * 1.4, a * vA);
      }`,
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.frustumCulled = false;
  scene.add(stars);

  /* ---------------- HYPERSPACE STREAKS (appear only while travelling) ---------------- */
  const STREAK_N = mobile ? 420 : 700;
  const streakMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { ...uni, uFlow: { value: 0 }, uWarp: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute float aEnd; attribute vec3 aColor; uniform float uFlow, uWarp; varying vec3 vC; varying float vA;
      void main(){
        vec3 p = position;
        p.z = mod(p.z + uFlow, 80.) - 84.;
        p.z += aEnd * (uWarp * 14. + .05);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        vC = aColor;
        vA = clamp(uWarp * .75, 0., .65) * smoothstep(-84., -60., p.z) * smoothstep(0., -10., p.z) * mix(.15, 1., aEnd);
      }`,
    fragmentShader: `varying vec3 vC; varying float vA; void main(){ gl_FragColor = vec4(vC * 1.6, vA); }`,
  });
  const streaks = new THREE.LineSegments(
    (() => {
      const g = new THREE.BufferGeometry();
      const pos = new Float32Array(STREAK_N * 6);
      const end = new Float32Array(STREAK_N * 2);
      const col = new Float32Array(STREAK_N * 6);
      const pal = [C.cyan, C.violet, new THREE.Color("#ffffff"), C.blue, C.pink];
      for (let i = 0; i < STREAK_N; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 2.5 + Math.pow(Math.random(), 0.6) * 26;
        const x = Math.cos(a) * r,
          y = Math.sin(a) * r * 0.7,
          z = -Math.random() * 80;
        pos.set([x, y, z, x, y, z], i * 6);
        end.set([0, 1], i * 2);
        const c = pal[(Math.random() * pal.length) | 0];
        col.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
      }
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      g.setAttribute("aEnd", new THREE.BufferAttribute(end, 1));
      g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
      return g;
    })(),
    streakMat
  );
  streaks.frustumCulled = false;
  scene.add(streaks);

  /* ---------------- NEBULA BACKDROP ---------------- */
  const nebula = new THREE.Mesh(
    new THREE.SphereGeometry(200, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { ...uni, uProg: { value: 0 } },
      vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: /* glsl */ `
        uniform float uTime, uUnlock, uProg; varying vec3 vP;
        ${NOISE}
        void main(){
          float n = snoise(vP * 2.2 + vec3(0., 0., uTime * .015)) * .5 + .5;
          float n2 = snoise(vP * 5.0 - uTime * .01) * .5 + .5;
          vec3 a = mix(vec3(.02,.03,.09), vec3(.10,.04,.16), n);
          a += vec3(.0,.06,.09) * pow(n2, 3.) ;
          // the colour of the universe changes as the story moves forward
          vec3 tint = mix(vec3(.75, .95, 1.3), vec3(1.2, .8, 1.15), smoothstep(.1, .5, uProg));
          tint = mix(tint, vec3(1.45, 1.05, .65), smoothstep(.6, .78, uProg) * (1. - smoothstep(.86, .98, uProg)));
          a *= tint;
          a = mix(a, a * vec3(1.6, 1.1, .5), uUnlock);
          gl_FragColor = vec4(a * .6, 1.);
        }`,
    })
  );
  nebula.renderOrder = -1;
  scene.add(nebula);

  /* ---------------- CORE (hero object) ---------------- */
  const core = new THREE.Group();
  scene.add(core);
  const coreUni = { ...uni, uBurst: { value: 0 }, uHover: { value: 0 } };
  const coreMat = new THREE.ShaderMaterial({
    uniforms: coreUni,
    vertexShader: /* glsl */ `
      uniform float uTime, uBurst, uHover;
      varying vec3 vN; varying vec3 vView; varying float vD;
      ${NOISE}
      void main(){
        vec3 p = position;
        float n = snoise(p * .9 + uTime * .22);
        float n2 = snoise(p * 2.6 - uTime * .35) * .35;
        float d = (n + n2) * (.16 + uHover * .14 + uBurst * 1.1);
        p += normal * d;
        vD = d;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        vView = -mv.xyz;
        vN = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime, uUnlock, uBurst;
      varying vec3 vN; varying vec3 vView; varying float vD;
      void main(){
        vec3 n = normalize(vN); vec3 v = normalize(vView);
        float f = pow(1. - max(dot(n, v), 0.), 3.);
        float t = vD * 2.2 + f * 1.1 + uTime * .06;
        vec3 irid = .5 + .5 * cos(6.2831 * (vec3(.0, .33, .67) + t));
        vec3 cyan = vec3(.37,.95,1.), vio = vec3(.55,.48,1.), gold = vec3(1.,.72,.3);
        vec3 base = mix(cyan, vio, smoothstep(-.25, .3, vD));
        base = mix(base, gold, uUnlock);
        irid = mix(irid, gold, uUnlock * .6);
        vec3 col = vec3(.008, .01, .03) + base * .08;
        col += f * mix(base, irid, .5) * .9;
        col += pow(max(vD, 0.), 2.) * base * 2.;
        col += uBurst * irid * .8;
        gl_FragColor = vec4(col, 1.);
      }`,
  });
  const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, mobile ? 28 : 60), coreMat);
  coreMesh.userData.kind = "core";
  core.add(coreMesh);
  clickables.push(coreMesh);

  const inner = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.75, 1)),
    new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending })
  );
  core.add(inner);

  const ringMats = [];
  [
    [2.5, 0.006, 1.2, 0.3, C.cyan],
    [3.1, 0.004, -0.5, 0.9, C.violet],
    [3.8, 0.003, 0.3, -0.6, C.pink],
  ].forEach(([r, t, rx, rz, col], i) => {
    const m = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    ringMats.push(m);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, t * 4, 6, 160), m);
    ring.rotation.set(rx, 0, rz);
    ring.userData.spin = (i % 2 ? -1 : 1) * (0.08 + i * 0.05);
    core.add(ring);
    // satellite bead
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: col }));
    bead.position.x = r;
    ring.add(bead);
  });

  // constellation around core
  {
    const pts = [];
    for (let i = 0; i < (mobile ? 60 : 110); i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(4.5 + Math.random() * 3.5);
      pts.push(v);
    }
    const seg = [];
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++)
        if (pts[i].distanceTo(pts[j]) < 2.3) seg.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    const lines = new THREE.LineSegments(
      g,
      new THREE.LineBasicMaterial({ color: C.violet, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    core.add(lines);
    const pg = new THREE.BufferGeometry().setFromPoints(pts);
    const dots = new THREE.Points(pg, new THREE.PointsMaterial({ color: C.cyan, size: 0.07, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
    core.add(dots);
    core.userData.constellation = lines;
  }

  // five traits orbiting the core (tap -> description)
  const traitSprites = traits.map((tr, i) => {
    const sp = makeLabel(tr.k, tr.t, [C.cyan, C.violet, C.pink, C.amber, C.green][i]);
    sp.userData.kind = "trait";
    sp.userData.index = i;
    sp.userData.a = (i / traits.length) * Math.PI * 2;
    sp.userData.y = [0.9, -1.1, 1.7, -0.3, 0.2][i];
    sp.userData.pulse = 0;
    scene.add(sp);
    clickables.push(sp);
    return sp;
  });

  // burst particles (core tap)
  const BURST_N = mobile ? 500 : 1200;
  const burstGeo = new THREE.BufferGeometry();
  {
    const dir = new Float32Array(BURST_N * 3);
    const sp = new Float32Array(BURST_N);
    for (let i = 0; i < BURST_N; i++) {
      const v = new THREE.Vector3().randomDirection();
      dir.set([v.x, v.y, v.z], i * 3);
      sp[i] = 0.4 + Math.random();
    }
    burstGeo.setAttribute("position", new THREE.BufferAttribute(dir, 3));
    burstGeo.setAttribute("aSpeed", new THREE.BufferAttribute(sp, 1));
  }
  const burstMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uT: { value: 99 }, uPR: { value: dpr } },
    vertexShader: `
      attribute float aSpeed; uniform float uT, uPR; varying float vA; varying float vS;
      void main(){
        float e = 1. - pow(1. - clamp(uT / 1.6, 0., 1.), 3.);
        vec3 p = position * (1.5 + aSpeed * e * 9.);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        vA = (1. - clamp(uT / 1.8, 0., 1.)); vS = aSpeed;
        gl_PointSize = (2. + aSpeed * 3.) * uPR * (20. / -mv.z);
      }`,
    fragmentShader: `
      varying float vA; varying float vS;
      void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, 0., d);
        vec3 c = mix(vec3(.37,.95,1.), vec3(1.,.37,.82), vS - .4);
        gl_FragColor = vec4(c * 1.6, a * vA); }`,
  });
  const burst = new THREE.Points(burstGeo, burstMat);
  burst.frustumCulled = false;
  core.add(burst);

  /* ---------------- INNER WORLD — planets ---------------- */
  const planetMat = (color, uniq = {}) =>
    new THREE.ShaderMaterial({
      uniforms: { ...uni, uColor: { value: color.clone() }, ...uniq },
      vertexShader: `varying vec3 vN; varying vec3 vView; varying vec3 vP;
        void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position,1.); vView = -mv.xyz;
        vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor; uniform float uTime; varying vec3 vN; varying vec3 vView; varying vec3 vP;
        ${NOISE}
        void main(){
          vec3 n = normalize(vN); vec3 v = normalize(vView);
          float f = pow(1. - max(dot(n, v), 0.), 2.6);
          float bands = snoise(vec3(vP.x * .6, vP.y * 3.2, vP.z * .6) + uTime * .04) * .5 + .5;
          float light = clamp(dot(n, normalize(vec3(.6,.5,.6))), 0., 1.);
          vec3 col = uColor * (.05 + .22 * bands) * (.35 + light);
          col += f * uColor * 1.1;
          gl_FragColor = vec4(col, 1.);
        }`,
    });

  const mind = new THREE.Group();
  mind.position.copy(POS.mind);
  scene.add(mind);
  const planets = [];
  {
    const sun = new THREE.Mesh(new THREE.SphereGeometry(1.1, 48, 32), planetMat(C.violet));
    mind.add(sun);
    const halo = glowSprite(C.violet, 6);
    mind.add(halo);
    interests.forEach((it, i) => {
      const col = new THREE.Color(it.color);
      const r = 0.35 + (i % 3) * 0.12;
      const p = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), planetMat(col));
      const orbitR = 2.4 + i * 0.75;
      const tilt = (Math.random() - 0.5) * 0.8;
      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(orbitR, 0.006, 4, 128),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending })
      );
      orbit.rotation.x = Math.PI / 2 + tilt;
      mind.add(orbit);
      if (i % 2 === 0) {
        const pr = new THREE.Mesh(
          new THREE.RingGeometry(r * 1.4, r * 1.9, 48),
          new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
        );
        pr.rotation.x = 1.2;
        p.add(pr);
      }
      p.add(glowSprite(col, r * 5));
      mind.add(p);
      const lab = makeLabel(it.title, "", col, 0.8);
      lab.position.y = r + 0.6;
      p.add(lab);
      const hit = new THREE.Mesh(new THREE.SphereGeometry(Math.max(0.9, r * 2), 12, 8), new THREE.MeshBasicMaterial({ visible: false }));
      hit.userData = { kind: "interest", index: i };
      p.add(hit);
      clickables.push(hit);
      planets.push({ pulse: 0, label: lab, mesh: p, orbitR, tilt, speed: 0.25 / (1 + i * 0.4), phase: i * 1.7 });
    });
  }

  /* ---------------- CREATIONS — project ring ---------------- */
  const ringGroup = new THREE.Group();
  ringGroup.position.copy(POS.ring);
  scene.add(ringGroup);
  const RING_R = mobile ? 3.6 : 4.6;
  const cards = [];
  const cardW = 2.1,
    cardH = 2.8;
  const roundedPlane = (w, h, r) => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const g = new THREE.ShapeGeometry(s, 8);
    // UVs 0..1
    const p = g.attributes.position;
    const uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) {
      uv[i * 2] = p.getX(i) / w + 0.5;
      uv[i * 2 + 1] = p.getY(i) / h + 0.5;
    }
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return g;
  };
  const cardGeo = roundedPlane(cardW, cardH, 0.16);
  const frameGeo = roundedPlane(cardW + 0.06, cardH + 0.06, 0.19);
  projects.forEach((p, i) => {
    const col = new THREE.Color(p.color);
    const pivot = new THREE.Group();
    const tex = makeCardTexture(p);
    const mat = new THREE.MeshBasicMaterial({ map: tex, color: 0xa4a4b0, transparent: true, side: THREE.DoubleSide, fog: false });
    const mesh = new THREE.Mesh(cardGeo, mat);
    mesh.userData = { kind: "card", index: i };
    const frame = new THREE.Mesh(frameGeo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    frame.position.z = -0.01;
    const glow = glowSprite(col, 5.2, 0.35);
    glow.position.z = -0.3;
    pivot.add(glow, frame, mesh);
    ringGroup.add(pivot);
    clickables.push(mesh);
    cards.push({ pivot, mesh, mat, frame, tex, glow, hover: 0 });
  });
  const ringFloor = new THREE.Mesh(
    new THREE.RingGeometry(RING_R - 0.02, RING_R + 0.02, 128),
    new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.4, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
  );
  ringFloor.rotation.x = -Math.PI / 2;
  ringFloor.position.y = -cardH / 2 - 0.35;
  ringGroup.add(ringFloor);
  const ringCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), new THREE.MeshBasicMaterial({ color: C.pink, wireframe: true }));
  ringGroup.add(ringCore, glowSprite(C.pink, 3, 0.6));

  /* ---------------- shared flowing-light material ---------------- */
  const flowMat = (c1, c2, uniq = {}) =>
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { ...uni, uC1: { value: c1 }, uC2: { value: c2 }, uDash: { value: 0 }, ...uniq },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: `uniform float uTime, uDash; uniform vec3 uC1, uC2; varying vec2 vUv;
        void main(){
          float pulse = pow(fract(vUv.x * 4. - uTime * .25), 10.) * 2.;
          float dash = mix(1., step(.5, fract(vUv.x * 60.)), uDash);
          vec3 c = mix(uC1, uC2, vUv.x);
          gl_FragColor = vec4(c * (.3 + pulse), (.4 + pulse) * dash);
        }`,
    });

  /* ---------------- QUIET WORLD — a calm sea of points + one lantern ---------------- */
  const quiet = new THREE.Group();
  scene.add(quiet);
  const seaMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { ...uni, uPR: { value: dpr } },
    vertexShader: /* glsl */ `
      uniform float uTime, uPR; varying float vA;
      void main(){
        vec3 p = position;
        float w = sin(p.x * .25 + uTime * .5) * .35 + sin(p.z * .3 + uTime * .35) * .35 + sin((p.x + p.z) * .12 - uTime * .25) * .5;
        p.y += w;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        vA = smoothstep(60., 6., -mv.z) * (.45 + w * .35);
        gl_PointSize = uPR * (40. / -mv.z) * 1.6;
      }`,
    fragmentShader: `uniform float uUnlock; varying float vA;
      void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .1, d);
        vec3 c = mix(vec3(.55,.75,1.), vec3(1.,.8,.5), uUnlock);
        gl_FragColor = vec4(c, a * vA); }`,
  });
  {
    const nx = mobile ? 70 : 120,
      nz = mobile ? 45 : 70;
    const a = new Float32Array(nx * nz * 3);
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < nz; j++) {
        const k = (i * nz + j) * 3;
        a[k] = (i / (nx - 1) - 0.5) * 70;
        a[k + 1] = -2.6;
        a[k + 2] = -92 - (j / (nz - 1)) * 48;
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    const sea = new THREE.Points(g, seaMat);
    sea.frustumCulled = false;
    quiet.add(sea);
  }
  const lantern = new THREE.Group();
  lantern.position.copy(POS.quiet);
  lantern.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), new THREE.MeshBasicMaterial({ color: 0xfff4e0 })));
  lantern.add(glowSprite(C.amber, 3.2, 0.55), glowSprite(C.blue, 9, 0.18));
  quiet.add(lantern);

  // memories: personal photos drifting above the quiet sea like polaroids
  const memFrames = [];
  const FRAME_SPOTS = [
    [-4.6, 2.4, -119, 0.18],
    [4.8, 3.1, -122, -0.2],
    [0.4, 4.6, -128, 0.05],
  ];
  photos.slice(0, 3).forEach((ph, i) => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 612;
    const g = c.getContext("2d");
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const draw = (img) => {
      g.fillStyle = "#efece6";
      g.fillRect(0, 0, 512, 612);
      g.fillStyle = "#0a0d1e";
      g.fillRect(24, 24, 464, 464);
      if (img) {
        const sz = Math.min(img.width, img.height);
        const [px, py] = (ph.pos || "50% 50%").split(" ").map((v) => parseFloat(v) / 100);
        g.drawImage(img, (img.width - sz) * px, (img.height - sz) * py, sz, sz, 24, 24, 464, 464);
      }
      g.fillStyle = "#3a3f55";
      g.font = "600 30px 'JetBrains Mono', monospace";
      g.textAlign = "center";
      g.fillText(ph.tag, 256, 560);
      tex.needsUpdate = true;
    };
    draw(null);
    const img = new Image();
    img.onload = () => draw(img);
    img.src = ph.src;
    document.fonts && document.fonts.ready.then(() => img.complete && img.naturalWidth && draw(img));
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 2.03),
      new THREE.MeshBasicMaterial({ map: tex, color: 0xd6d6de, side: THREE.DoubleSide, fog: false })
    );
    const [x, y, z, rz] = FRAME_SPOTS[i];
    mesh.position.set(x, y, z);
    mesh.userData = { kind: "photo", index: i, base: new THREE.Vector3(x, y, z), rz, pulse: 0, ph: i * 2.1 };
    const halo = glowSprite(C.amber, 4.5, 0.18);
    halo.position.z = -0.05;
    mesh.add(halo);
    quiet.add(mesh);
    clickables.push(mesh);
    memFrames.push(mesh);
  });

  /* ---------------- WHAT MATTERS — six values on a light helix ---------------- */
  const valuesGroup = new THREE.Group();
  scene.add(valuesGroup);
  const valueLabels = [];
  const valueNodes = [];
  {
    const pts = [];
    const n = values.length;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const a = t * Math.PI * 2.6;
      pts.push(new THREE.Vector3(Math.cos(a) * 3, Math.sin(a) * 2 - 0.2, POS.values.z + 8 - t * 20));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    valuesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 200, 0.03, 6), flowMat(C.cyan, C.violet)));
    pts.forEach((p, i) => {
      const col = [C.cyan, C.green, C.pink, C.amber, C.violet, C.blue][i % 6];
      const node = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 1), new THREE.MeshBasicMaterial({ color: col, wireframe: true }));
      node.position.copy(p);
      node.userData.spin = true;
      node.userData.pulse = 0;
      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 8), new THREE.MeshBasicMaterial({ visible: false }));
      hit.userData = { kind: "value", index: i };
      node.add(hit);
      clickables.push(hit);
      valueNodes.push(node);
      node.add(new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })));
      node.add(glowSprite(col, 2, 0.55));
      const lab = makeLabel(values[i].k, values[i].t, col, 0.85);
      lab.position.copy(p).add(new THREE.Vector3(0, 0.62, 0));
      valuesGroup.add(lab);
      valueLabels.push(lab);
      valuesGroup.add(node);
    });
  }

  /* ---------------- THE RECORD — a slow data crystal ---------------- */
  const crystal = new THREE.Group();
  crystal.position.copy(POS.record);
  scene.add(crystal);
  const crystalParts = [];
  const plates = [];
  {
    const shell = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.2, 0)),
      new THREE.LineBasicMaterial({ color: C.blue, transparent: true, opacity: 0.7 })
    );
    const innerC = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.1, 0)),
      new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.9 })
    );
    crystal.add(shell, innerC, glowSprite(C.blue, 7, 0.35));
    crystalParts.push(shell, innerC);
    // the documents, orbiting as small glowing plates
    for (let i = 0; i < 5; i++) {
      const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(0.45, 0.6),
        new THREE.MeshBasicMaterial({ color: [C.cyan, C.violet, C.amber, C.pink, C.green][i], transparent: true, opacity: 0.55, side: THREE.DoubleSide })
      );
      plate.userData = { a: (i / 5) * Math.PI * 2, r: 3.2, y: i % 2 ? 0.6 : -0.5 };
      scene.add(plate);
      plates.push(plate);
    }
  }

  /* ---------------- FUTURE SELF — planet + roadmap path ---------------- */
  const future = new THREE.Group();
  scene.add(future);
  const planetGroup = new THREE.Group();
  planetGroup.position.copy(POS.planet);
  future.add(planetGroup);
  {
    const big = new THREE.Mesh(new THREE.SphereGeometry(7, 64, 48), planetMat(C.amber));
    planetGroup.add(big);
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(7.9, 64, 48),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: { uColor: { value: C.amber } },
        vertexShader: `varying vec3 vN; varying vec3 vView; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vView=-mv.xyz; vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*mv; }`,
        fragmentShader: `uniform vec3 uColor; varying vec3 vN; varying vec3 vView;
          void main(){ float f = pow(max(dot(normalize(vN), normalize(vView)), 0.), 3.); gl_FragColor = vec4(uColor * 1.2, f * .5); }`,
      })
    );
    planetGroup.add(atmo);
    const pring = new THREE.Mesh(
      new THREE.RingGeometry(9, 14, 128, 1),
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: C.amber } },
        vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `uniform vec3 uColor; varying vec3 vP;
          void main(){ float r = length(vP.xy); float s = .5+.5*sin(r*9.); float e = smoothstep(9.,10.,r)*smoothstep(14.,12.,r);
          gl_FragColor = vec4(uColor * (.5 + s), e * s * .32); }`,
      })
    );
    pring.rotation.x = 1.25;
    pring.rotation.y = 0.3;
    planetGroup.add(pring);

    const start = new THREE.Vector3(1, -1.5, -182);
    const end = POS.planet.clone().add(new THREE.Vector3(-7, -3, 6));
    const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(-3, 3, 0));
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const doneCount = roadmap.filter((r) => r.done).length;
    const splitT = (doneCount - 0.5) / (roadmap.length - 1);
    // achieved part (solid cyan) and planned part (dashed amber)
    const ptsA = curve.getPoints(80).slice(0, Math.round(80 * splitT) + 1);
    const ptsB = curve.getPoints(80).slice(Math.round(80 * splitT));
    future.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsA), 80, 0.04, 6), flowMat(C.cyan, C.violet)));
    const planned = flowMat(C.violet, C.amber);
    planned.uniforms.uDash.value = 1;
    future.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsB), 80, 0.04, 6), planned));
    roadmap.forEach((r, i) => {
      const p = curve.getPoint(i / (roadmap.length - 1));
      const col = r.done ? C.cyan : C.amber;
      const node = r.done
        ? new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({ color: col }))
        : new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), new THREE.MeshBasicMaterial({ color: col, wireframe: true }));
      node.position.copy(p);
      node.userData.spin = !r.done;
      node.add(glowSprite(col, r.done ? 1.8 : 2.4, r.done ? 0.8 : 0.5));
      future.add(node);
    });
  }

  /* ---------------- UNKNOWN — monolith ---------------- */
  const vault = new THREE.Group();
  vault.position.copy(POS.vault);
  scene.add(vault);
  const halves = [];
  const edgeMats = [];
  [-1, 1].forEach((s) => {
    const g = new THREE.BoxGeometry(1.1, 4.2, 0.5);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x050409 }));
    const em = new THREE.LineBasicMaterial({ color: C.pink, transparent: true, opacity: 0.9 });
    edgeMats.push(em);
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), em));
    m.position.x = s * 0.55;
    m.userData.side = s;
    vault.add(m);
    halves.push(m);
  });
  const vaultLight = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 4), new THREE.MeshBasicMaterial({ color: C.amber, transparent: true, opacity: 0 }));
  vault.add(vaultLight);
  const vaultGlow = glowSprite(C.amber, 10, 0);
  vault.add(vaultGlow);
  const glyphs = new THREE.Points(
    (() => {
      const g = new THREE.BufferGeometry();
      const a = [];
      for (let i = 0; i < 240; i++) {
        const t = (i / 240) * Math.PI * 2;
        const r = 3 + Math.random() * 0.6;
        a.push(Math.cos(t) * r, (Math.random() - 0.5) * 0.4, Math.sin(t) * r);
      }
      g.setAttribute("position", new THREE.Float32BufferAttribute(a, 3));
      return g;
    })(),
    new THREE.PointsMaterial({ color: C.pink, size: 0.06, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
  );
  glyphs.rotation.x = 0.25;
  vault.add(glyphs);

  /* ---------------- THE GATE — portal ---------------- */
  const gate = new THREE.Group();
  gate.position.copy(POS.gate);
  scene.add(gate);
  const portalMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { ...uni, uC1: { value: C.cyan.clone() }, uC2: { value: C.pink.clone() } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime, uUnlock; uniform vec3 uC1, uC2; varying vec2 vUv;
      ${NOISE}
      void main(){
        vec2 p = vUv - .5; float r = length(p) * 2.; float a = atan(p.y, p.x);
        float sw = sin(a * 5. + r * 12. - uTime * 2.2) * .5 + .5;
        float n = snoise(vec3(p * 3., uTime * .25)) * .5 + .5;
        vec3 c2 = mix(uC2, vec3(1., .75, .3), uUnlock);
        vec3 col = mix(uC1, c2, sw) * (1. - r) * (.35 + .5 * n) + pow(1. - r, 6.) * vec3(1.) * .55;
        gl_FragColor = vec4(col, smoothstep(1., .82, r) * (.55 + .45 * (1. - r)));
      }`,
  });
  gate.add(new THREE.Mesh(new THREE.CircleGeometry(4, 96), portalMat));
  const gateRings = [];
  [4.05, 4.5, 5.2].forEach((r, i) => {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(r, i === 0 ? 0.07 : 0.015, 8, 160),
      new THREE.MeshBasicMaterial({ color: [C.cyan, C.violet, C.pink][i], transparent: true, opacity: i === 0 ? 1 : 0.6 })
    );
    gate.add(m);
    gateRings.push(m);
  });
  gate.add(glowSprite(C.violet, 22, 0.5));

  /* ---------------- helpers ---------------- */
  function glowSprite(color, scale, opacity = 0.5) {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glowTex(), color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    s.scale.setScalar(scale);
    return s;
  }
  function glowTex() {
    if (glowTex.t) return glowTex.t;
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.2, "rgba(255,255,255,.45)");
    gr.addColorStop(0.5, "rgba(255,255,255,.1)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    glowTex.t = new THREE.CanvasTexture(c);
    return glowTex.t;
  }

  // text label sprite: mono key + optional local word under it
  function makeLabel(key, sub, color, scale = 1) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: false });
    const sp = new THREE.Sprite(mat);
    const h = 0.42 * scale;
    sp.scale.set(h * 4, h, 1);
    sp.userData.h = h;
    labelSprites.push(sp);
    const item = { key, sub, color: "#" + color.getHexString() };
    item.draw = () => {
      const g = c.getContext("2d");
      g.clearRect(0, 0, 512, 128);
      g.textAlign = "center";
      g.shadowColor = item.color;
      g.shadowBlur = 18;
      g.fillStyle = "#f2f5ff";
      g.font = "600 46px 'JetBrains Mono', monospace";
      g.fillText(item.key, 256, item.sub ? 58 : 78);
      if (item.sub) {
        g.shadowBlur = 0;
        g.fillStyle = item.color;
        g.font = "500 34px 'Manrope', sans-serif";
        g.fillText(item.sub, 256, 108);
      }
      tex.needsUpdate = true;
    };
    item.draw();
    document.fonts && document.fonts.ready.then(item.draw);
    sp.userData.label = item;
    return sp;
  }
  function relabel(sprite, key, sub) {
    const it = sprite.userData.label;
    it.key = key;
    it.sub = sub;
    it.draw();
  }

  function makeCardTexture(p) {
    const W = 512,
      H = 683;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const draw = (img) => {
      g.clearRect(0, 0, W, H);
      g.fillStyle = "#0a0d1e";
      g.fillRect(0, 0, W, H);
      const ih = 360;
      if (img) {
        if (p.logo) {
          g.fillStyle = "#f4f6ff";
          g.fillRect(0, 0, W, ih);
          const s = Math.min((W * 0.6) / img.width, (ih * 0.6) / img.height);
          g.drawImage(img, (W - img.width * s) / 2, (ih - img.height * s) / 2, img.width * s, img.height * s);
        } else {
          const s = Math.max(W / img.width, ih / img.height);
          g.drawImage(img, (W - img.width * s) / 2, (ih - img.height * s) / 2, img.width * s, img.height * s);
        }
      }
      const gr = g.createLinearGradient(0, ih - 140, 0, ih + 4);
      gr.addColorStop(0, "rgba(10,13,30,0)");
      gr.addColorStop(1, "rgba(10,13,30,1)");
      g.fillStyle = gr;
      g.fillRect(0, ih - 140, W, 144);
      // scanlines
      g.fillStyle = "rgba(0,0,0,.12)";
      for (let y = 0; y < ih; y += 4) g.fillRect(0, y, W, 1);
      g.fillStyle = p.color;
      g.font = "600 22px 'JetBrains Mono', monospace";
      g.fillText(p.code + "  //  " + p.tag.toUpperCase(), 32, ih + 40);
      g.fillStyle = "#eef2ff";
      g.font = "700 38px 'Unbounded', sans-serif";
      wrap(g, p.short, 32, ih + 98, W - 64, 46, 2);
      g.font = "400 22px 'Manrope', sans-serif";
      g.fillStyle = "#8b93b5";
      wrap(g, p.badges.join("  ·  "), 32, ih + 200, W - 64, 30, 2);
      g.fillStyle = p.color;
      g.font = "600 20px 'JetBrains Mono', monospace";
      g.fillText("[ ХҮРЭХ → ]", 32, H - 34);
      tex.needsUpdate = true;
    };
    draw(null);
    const img = new Image();
    img.onload = () => draw(img);
    img.src = p.img;
    document.fonts && document.fonts.ready.then(() => draw(img.complete && img.naturalWidth ? img : null));
    return tex;
  }
  function wrap(g, text, x, y, maxW, lh, maxLines) {
    const words = text.split(" ");
    let line = "",
      n = 0;
    for (const w of words) {
      const t = line ? line + " " + w : w;
      if (g.measureText(t).width > maxW && line) {
        g.fillText(line, x, y + n * lh);
        line = w;
        if (++n >= maxLines) return;
      } else line = t;
    }
    g.fillText(line, x, y + n * lh);
  }

  /* ---------------- camera path ---------------- */
  let portrait = false;
  let posCurve, lookCurve;
  function buildCurves() {
    const k = portrait ? Math.min(1.45, Math.max(1.1, 0.72 / camera.aspect)) : 1;
    const ps = [],
      ls = [];
    ANCHORS.forEach((a) => {
      const look = new THREE.Vector3(...(portrait && a.lookPortrait ? a.lookPortrait : a.look));
      const pos = new THREE.Vector3(...(portrait && a.posPortrait ? a.posPortrait : a.pos));
      // scale the camera distance around the object itself (look x/z, original height)
      const lookBase = new THREE.Vector3(look.x, a.look[1], look.z);
      pos.sub(lookBase).multiplyScalar(portrait && a.kPortrait ? a.kPortrait : k).add(lookBase);
      ps.push(pos);
      ls.push(look);
    });
    posCurve = new THREE.CatmullRomCurve3(ps, false, "centripetal");
    lookCurve = new THREE.CatmullRomCurve3(ls, false, "centripetal");
  }

  function resize() {
    const w = window.innerWidth,
      h = window.innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w / 2, h / 2);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 68 : 55;
    camera.updateProjectionMatrix();
    starMat.uniforms.uAspect.value = w / h;
    lens.uniforms.uAspect.value = w / h;
    portrait = w / h < 0.9;
    labelK = portrait ? 1.7 : 1;
    labelSprites.forEach((sp) => sp.scale.set(sp.userData.h * 4 * labelK, sp.userData.h * labelK, 1));
    buildCurves();
  }
  resize();
  window.addEventListener("resize", resize);

  /* ---------------- interaction ---------------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  const mouseTarget = new THREE.Vector2(0, 0);
  const mouseSmooth = new THREE.Vector2(0, 0);
  let hovered = null;
  let down = null;
  let ringRot = 0,
    ringVel = 0,
    dragging = false;

  function pick(x, y) {
    ndc.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(clickables, false);
    const shown = (o) => {
      for (; o; o = o.parent) if (!o.visible) return false;
      return true;
    };
    for (const h of hits) {
      if (h.distance > 34) break;
      if (shown(h.object)) return h.object;
    }
    return null;
  }
  canvas.addEventListener("pointermove", (e) => {
    mouseTarget.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    starMat.uniforms.uMouse.value.set(mouseTarget.x, mouseTarget.y);
    if (down) {
      const dx = e.clientX - down.lx;
      down.lx = e.clientX;
      if (Math.abs(e.clientX - down.x) > 8) dragging = true;
      if (dragging) ringVel += dx * 0.0035;
    }
    if (e.pointerType === "mouse") {
      const o = pick(e.clientX, e.clientY);
      if (o !== hovered) {
        hovered = o;
        cb.onHover(!!o);
      }
    }
  });
  canvas.addEventListener("pointerdown", (e) => {
    if (!reduced) {
      lens.uniforms.uRip.value[ripIdx++ % 3].set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight, 0);
    }
    down = { x: e.clientX, y: e.clientY, lx: e.clientX, t: performance.now() };
    dragging = false;
    starMat.uniforms.uMouse.value.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  });
  window.addEventListener("pointerup", (e) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const quick = performance.now() - down.t < 500;
    if (e.target === canvas && moved < 10 && quick) {
      const o = pick(e.clientX, e.clientY);
      if (o?.userData.kind === "core") cb.onCoreTap();
      if (o?.userData.kind === "card") cb.onCardTap(o.userData.index);
      if (o?.userData.kind === "trait") cb.onTraitTap(o.userData.index);
      if (o?.userData.kind === "interest") cb.onInterestTap(o.userData.index);
      if (o?.userData.kind === "value") cb.onValueTap(o.userData.index);
      if (o?.userData.kind === "photo") cb.onPhotoTap(o.userData.index);
    }
    down = null;
    dragging = false;
    if (e.pointerType !== "mouse") starMat.uniforms.uMouse.value.set(9, 9);
  });
  canvas.addEventListener("pointerleave", () => {
    starMat.uniforms.uMouse.value.set(9, 9);
    if (hovered) cb.onHover((hovered = null));
  });

  // gyro parallax (mobile "4D")
  const tilt = new THREE.Vector2();
  function onOrient(e) {
    if (e.gamma == null) return;
    tilt.set(THREE.MathUtils.clamp(e.gamma / 30, -1, 1), THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1));
  }
  window.addEventListener("deviceorientation", onOrient);

  /* ---------------- state ---------------- */
  let progress = 0,
    progressTarget = 0,
    velocity = 0,
    burstT = 99,
    unlockTarget = 0,
    intro = 0,
    started = false;
  const look = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const clock = new THREE.Clock();

  // adaptive quality
  let frames = 0,
    acc = 0,
    downgraded = false;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    uni.uTime.value = t;

    if (started) intro = Math.min(1, intro + dt * 0.45);
    const ie = 1 - Math.pow(1 - intro, 3);

    // scroll-driven camera
    progress += (progressTarget - progress) * Math.min(1, dt * (reduced ? 10 : 3.2));
    const pt = THREE.MathUtils.clamp(progress / (ANCHORS.length - 1), 0, 1);
    posCurve.getPoint(pt, camera.position);
    lookCurve.getPoint(pt, look);
    // intro dolly from deep space
    camera.position.z += (1 - ie) * 26;
    camera.position.y += (1 - ie) * 3;

    mouseSmooth.lerp(new THREE.Vector2(mouseTarget.x + tilt.x, mouseTarget.y - tilt.y), Math.min(1, dt * 2.5));
    const par = reduced ? 0 : 0.7;
    tmp.set(mouseSmooth.x * par, mouseSmooth.y * par * 0.6, 0);
    camera.position.add(tmp);
    camera.lookAt(look);

    velocity += (0 - velocity) * Math.min(1, dt * 3);
    const travel = Math.abs(progressTarget - progress);
    const warp = reduced ? 0 : Math.min(2, Math.max(Math.abs(velocity), travel * 0.8, (1 - ie) * 1.35)) * (mobile ? 1 : 0.8);
    uni.uVel.value = warp;
    streakMat.uniforms.uWarp.value += (warp - streakMat.uniforms.uWarp.value) * Math.min(1, dt * 6);
    streakMat.uniforms.uFlow.value += dt * (4 + warp * 70);
    streaks.position.copy(camera.position);
    streaks.quaternion.copy(camera.quaternion);
    streaks.visible = streakMat.uniforms.uWarp.value > 0.02;
    lens.uniforms.uVel.value = warp;
    lens.uniforms.uRip.value.forEach((r) => (r.z += dt));
    bloom.strength = (mobile ? 0.9 : 0.85) * (downgraded ? 0.8 : 1) + warp * 0.15;
    nebula.material.uniforms.uProg.value = pt;
    const baseFov = camera.aspect < 0.8 ? 68 : 55;
    camera.fov += (baseFov + Math.min(Math.abs(velocity), 2) * 7 + (1 - ie) * 20 - camera.fov) * Math.min(1, dt * 5);
    camera.updateProjectionMatrix();
    starMat.uniforms.uDrift.value += velocity * dt * 2 + dt * 0.08;
    nebula.position.copy(camera.position);

    // core
    const near = Math.max(0, 1 - progress / 1.5);
    core.rotation.y += dt * 0.12;
    core.rotation.x = Math.sin(t * 0.2) * 0.15;
    const hoverCore = hovered?.userData.kind === "core" ? 1 : 0;
    coreUni.uHover.value += (hoverCore - coreUni.uHover.value) * Math.min(1, dt * 4);
    burstT += dt;
    burstMat.uniforms.uT.value = burstT;
    coreUni.uBurst.value = Math.max(0, 1 - burstT / 0.9) * 1.0;
    const s = 1 + coreUni.uHover.value * 0.06 + Math.sin(t * 1.4) * 0.015 + coreUni.uBurst.value * 0.25;
    coreMesh.scale.setScalar(s);
    inner.rotation.x -= dt * 0.6;
    inner.rotation.y += dt * 0.4;
    inner.material.opacity = 0.25 + coreUni.uBurst.value * 0.75;
    core.children.forEach((ch) => {
      if (ch.userData.spin) ch.rotation.y += dt * ch.userData.spin;
    });
    core.userData.constellation.material.opacity = 0.1 + 0.12 * (0.5 + 0.5 * Math.sin(t * 0.8)) * (0.4 + near);

    // traits orbit the core
    const showTraits = progress < 2.2;
    traitSprites.forEach((sp, i) => {
      const d = sp.userData;
      sp.visible = showTraits;
      const a = d.a + t * 0.12;
      const r = 3.6 + Math.sin(t * 0.5 + i) * 0.15;
      sp.position.set(Math.cos(a) * r, d.y + Math.sin(t * 0.7 + i) * 0.12, Math.sin(a) * r);
      d.pulse = Math.max(0, d.pulse - dt * 0.8);
      const k = 1 + d.pulse * 0.5 + (hovered === sp ? 0.15 : 0);
      sp.scale.set(1.68 * k * labelK, 0.42 * k * labelK, 1);
      sp.material.opacity = Math.min(1, ie * 1.2);
    });

    // planets
    planets.forEach((p) => {
      const a = t * p.speed + p.phase;
      p.mesh.position.set(Math.cos(a) * p.orbitR, Math.sin(a) * p.orbitR * Math.sin(-p.tilt), Math.sin(a) * p.orbitR * Math.cos(p.tilt));
      p.mesh.rotation.y += dt * 0.4;
      p.pulse = Math.max(0, p.pulse - dt * 0.7);
      const hv = hovered && hovered.parent === p.mesh ? 0.15 : 0;
      p.mesh.scale.setScalar(1 + p.pulse * 0.6 + hv);
    });

    // project ring
    ringVel *= Math.pow(0.04, dt);
    ringRot += ringVel + (dragging ? 0 : dt * 0.12);
    const N = cards.length;
    cards.forEach((c, i) => {
      const a = (i / N) * Math.PI * 2 + ringRot;
      c.pivot.position.set(Math.sin(a) * RING_R, Math.sin(t * 0.9 + i) * 0.12, Math.cos(a) * RING_R);
      c.pivot.rotation.y = a;
      const front = Math.max(0, Math.cos(a));
      const isHover = hovered === c.mesh ? 1 : 0;
      c.hover += (isHover - c.hover) * Math.min(1, dt * 6);
      c.pivot.scale.setScalar(0.85 + front * 0.2 + c.hover * 0.08);
      c.frame.material.opacity = 0.15 + front * 0.5 + c.hover * 0.35;
      c.glow.material.opacity = 0.05 + front * 0.3 + c.hover * 0.3;
    });
    ringCore.rotation.y += dt * 0.8;
    ringCore.rotation.x += dt * 0.3;

    valuesGroup.children.forEach((n) => {
      if (n.userData.spin) {
        n.rotation.y += dt * (0.6 + n.userData.pulse * 6);
        n.userData.pulse = Math.max(0, n.userData.pulse - dt * 0.7);
        const hv = hovered && hovered.parent === n ? 0.25 : 0;
        n.scale.setScalar(1 + n.userData.pulse * 1.2 + hv);
      }
    });
    crystal.rotation.y += dt * 0.15;
    crystalParts[1].rotation.x -= dt * 0.4;
    plates.forEach((pl) => {
      const d = pl.userData;
      const a = d.a + t * 0.25;
      pl.position.set(POS.record.x + Math.cos(a) * d.r, d.y + Math.sin(t + d.a) * 0.15, POS.record.z + Math.sin(a) * d.r);
      pl.lookAt(camera.position);
      pl.visible = crystal.visible;
    });
    lantern.position.y = POS.quiet.y + Math.sin(t * 0.6) * 0.25;
    memFrames.forEach((f) => {
      const d = f.userData;
      d.pulse = Math.max(0, d.pulse - dt * 0.8);
      const hov = hovered === f ? 1 : 0;
      f.position.set(d.base.x + Math.sin(t * 0.3 + d.ph) * 0.35, d.base.y + Math.sin(t * 0.5 + d.ph) * 0.3, d.base.z);
      // face the viewer gently, keep a hand-placed tilt
      f.lookAt(camera.position);
      f.rotateZ(d.rz + Math.sin(t * 0.4 + d.ph) * 0.05);
      f.scale.setScalar((1 + d.pulse * 0.35 + hov * 0.08) * (portrait ? 1.4 : 1.25));
    });
    // only the current neighbourhood is drawn: cleaner frames, cheaper on phones
    core.visible = progress < 3;
    mind.visible = progress > 0.6 && progress < 3.6;
    quiet.visible = progress > 3.2 && progress < 4.7;
    valuesGroup.visible = progress > 4.2 && progress < 6.5;
    crystal.visible = progress > 5.2 && progress < 6.6;
    vault.visible = progress > 7.2;
    gate.visible = progress > 8.2;
    future.children.forEach((n) => {
      if (n.userData.spin) n.rotation.y += dt * 1.2;
    });
    planetGroup.rotation.y += dt * 0.03;
    future.visible = progress > 6.2;
    ringGroup.visible = progress > 2.2 && progress < 4.4;

    // vault & unlock
    uni.uUnlock.value += (unlockTarget - uni.uUnlock.value) * Math.min(1, dt * 1.5);
    const u = uni.uUnlock.value;
    halves.forEach((h) => (h.position.x = h.userData.side * (0.55 + u * 0.9)));
    vaultLight.material.opacity = u;
    vaultLight.scale.x = 1 + u * 8;
    vaultGlow.material.opacity = u * 0.9;
    edgeMats.forEach((m) => m.color.copy(C.pink).lerp(C.amber, u));
    glyphs.material.color.copy(C.pink).lerp(C.amber, u);
    glyphs.rotation.y += dt * (0.3 + u);
    vault.rotation.y = Math.sin(t * 0.3) * 0.25;
    gateRings.forEach((r, i) => {
      r.rotation.z += dt * (i % 2 ? -0.2 : 0.3);
      r.rotation.x = Math.sin(t * 0.4 + i) * 0.15;
    });
    ringMats[0].color.copy(C.cyan).lerp(C.amber, u);

    composer.render();

    // adaptive quality after warmup
    if (!downgraded && started) {
      frames++;
      acc += dt;
      if (frames === 120) {
        const fps = frames / acc;
        if (fps < 30) {
          downgraded = true;
          renderer.setPixelRatio(1);
          bloom.strength *= 0.8;
          composer.setPixelRatio && composer.setPixelRatio(1);
          resize();
        }
        frames = 0;
        acc = 0;
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return {
    start() {
      started = true;
    },
    setProgress(p) {
      progressTarget = p;
    },
    kick(v) {
      velocity += v;
    },
    burst() {
      burstT = 0;
      velocity += 1.2;
    },
    unlock(instant) {
      unlockTarget = 1;
      if (instant) {
        uni.uUnlock.value = 1;
        return;
      }
      velocity += 3;
      burstT = 0;
    },
    focusTrait(i) {
      if (traitSprites[i]) traitSprites[i].userData.pulse = 1;
    },
    focus(kind, i) {
      if (kind === "trait" && traitSprites[i]) traitSprites[i].userData.pulse = 1;
      if (kind === "interest" && planets[i]) planets[i].pulse = 1;
      if (kind === "value" && valueNodes[i]) valueNodes[i].userData.pulse = 1;
      if (kind === "photo" && memFrames[i]) memFrames[i].userData.pulse = 1;
      velocity += 0.15;
    },
    setLabels({ traits: tr, values: va, interests: ins }) {
      tr?.forEach((x, i) => traitSprites[i] && relabel(traitSprites[i], x.k, x.t));
      va?.forEach((x, i) => valueLabels[i] && relabel(valueLabels[i], x.k, x.t));
      ins?.forEach((x, i) => planets[i] && relabel(planets[i].label, x.title, ""));
    },
    reset() {
      unlockTarget = 0;
      intro = 0;
    },
  };
}
