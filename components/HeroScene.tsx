'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Paleta del manual de marca
const MORADO = '#8E2AFD';
const AZUL = '#2776FF';
const CIAN = '#00DEFD';

const NOISE = /* glsl */ `
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float ridged(vec2 p){
  float sum=0.0, amp=0.55, freq=1.0;
  for(int i=0;i<5;i++){
    float n=1.0-abs(snoise(p*freq));
    sum+=n*n*amp;
    freq*=2.03; amp*=0.5;
  }
  return sum;
}
`;

const terrainVert = /* glsl */ `
uniform float uTime;
uniform float uPointSize;
varying float vH;
varying float vDepth;
${NOISE}
void main(){
  vec3 p = position;
  vec2 q = vec2(p.x, p.y + uTime*6.0) * 0.022;
  float h = ridged(q);
  float valley = smoothstep(3.0, 30.0, abs(p.x));
  h = h * 17.0 * (0.12 + valley) - 2.0;
  p.z = h;
  vH = clamp(h/16.0, 0.0, 1.0);
  vec4 mv = modelViewMatrix * vec4(p,1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPointSize * (60.0 / vDepth);
}
`;

const terrainFrag = /* glsl */ `
uniform float uAlpha;
uniform float uIsPoint;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
varying float vH;
varying float vDepth;
void main(){
  vec3 col = mix(uC1, uC2, smoothstep(0.0,0.45,vH));
  col = mix(col, uC3, smoothstep(0.45,0.95,vH));
  col += vec3(1.0) * smoothstep(0.85,1.0,vH) * 0.55;   // nieve en las cumbres
  float fog = 1.0 - smoothstep(30.0, 150.0, vDepth);
  float nearFade = smoothstep(4.0, 16.0, vDepth);
  float a = uAlpha * fog * nearFade * (0.35 + vH);
  if(uIsPoint > 0.5){
    float d = length(gl_PointCoord - 0.5);
    if(d > 0.5) discard;
    a *= smoothstep(0.5, 0.0, d);
  }
  gl_FragColor = vec4(col, a);
}
`;

export default function HeroScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      canvas.style.display = 'none';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 400);
    const camBase = new THREE.Vector3(0, 7, 38);
    camera.position.copy(camBase);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => { disposables.push(o); return o; };

    /* ---------- cordillera ---------- */
    const uTime = { value: 0 };
    const colors = { uC1: { value: new THREE.Color(MORADO) }, uC2: { value: new THREE.Color(AZUL) }, uC3: { value: new THREE.Color(CIAN) } };
    const terrainGeo = track(new THREE.PlaneGeometry(220, 220, 170, 170));
    const makeMat = (alpha: number, isPoint: boolean) => track(new THREE.ShaderMaterial({
      uniforms: { uTime, uAlpha: { value: alpha }, uIsPoint: { value: isPoint ? 1 : 0 }, uPointSize: { value: 2.2 }, ...colors },
      vertexShader: terrainVert, fragmentShader: terrainFrag,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, wireframe: !isPoint,
    }));
    const terrain = new THREE.Group();
    terrain.add(new THREE.Mesh(terrainGeo, makeMat(0.22, false)));
    terrain.add(new THREE.Points(terrainGeo, makeMat(1, true)));
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.z = -60;
    scene.add(terrain);

    /* ---------- núcleo ---------- */
    const core = new THREE.Group();
    const gradientColors = (geo: THREE.BufferGeometry) => {
      const pos = geo.attributes.position;
      const out: number[] = [];
      const a = new THREE.Color(MORADO), b = new THREE.Color(AZUL), c = new THREE.Color(CIAN);
      geo.computeBoundingBox();
      const { min, max } = geo.boundingBox!;
      for (let i = 0; i < pos.count; i++) {
        const t = (pos.getY(i) - min.y) / (max.y - min.y || 1);
        const col = t < 0.5 ? a.clone().lerp(b, t * 2) : b.clone().lerp(c, (t - 0.5) * 2);
        out.push(col.r, col.g, col.b);
      }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(out, 3));
      return track(geo);
    };
    const lineMat = track(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
    const outer = new THREE.LineSegments(gradientColors(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(6, 1))), lineMat);
    const inner = new THREE.LineSegments(gradientColors(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(3, 0))), lineMat);
    core.add(outer, inner);

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 128;
    const g = glowCanvas.getContext('2d')!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.2, 'rgba(0,222,253,.75)');
    grd.addColorStop(0.5, 'rgba(39,118,255,.22)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    const glowTex = track(new THREE.CanvasTexture(glowCanvas));
    const spriteMat = () => track(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
    const glow = new THREE.Sprite(spriteMat());
    glow.scale.set(13, 13, 1);
    core.add(glow);

    const ring1 = new THREE.Mesh(track(new THREE.RingGeometry(9.5, 9.6, 128)),
      track(new THREE.MeshBasicMaterial({ color: CIAN, transparent: true, opacity: 0.35, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })));
    const ring2 = new THREE.Mesh(track(new THREE.RingGeometry(12, 12.08, 128)),
      track(new THREE.MeshBasicMaterial({ color: MORADO, transparent: true, opacity: 0.35, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })));
    ring1.rotation.x = 1.2; ring2.rotation.x = 1.4; ring2.rotation.y = 0.5;
    core.add(ring1, ring2);

    const sats = [0, 1, 2].map((i) => {
      const s = new THREE.Sprite(spriteMat());
      s.scale.set(2.2, 2.2, 1);
      core.add(s);
      return { s, ring: i === 1 ? ring2 : ring1, r: i === 1 ? 12 : 9.55, speed: 0.6 + i * 0.25, off: i * 2.1 };
    });
    scene.add(core);

    /* ---------- estrellas ---------- */
    const starCount = 1400;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 400;
      starPos[i * 3 + 1] = 10 + Math.random() * 120;
      starPos[i * 3 + 2] = -60 - Math.random() * 180;
    }
    const starsGeo = track(new THREE.BufferGeometry());
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starsGeo, track(new THREE.PointsMaterial({ color: 0xdce8fa, size: 0.5, transparent: true, opacity: 0.7, depthWrite: false })));
    scene.add(stars);

    /* ---------- interacción ---------- */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / innerHeight) * 2 - 1;
    };
    let scrollP = 0;
    const onScroll = () => { scrollP = Math.min(scrollY / innerHeight, 1.2); };
    let isMobile = false;
    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      isMobile = w < 780;
      camera.fov = isMobile ? 75 : 60;
      camera.updateProjectionMatrix();
      core.position.set(isMobile ? 8 : 20, isMobile ? 30 : 17, -55);
      core.scale.setScalar(isMobile ? 0.8 : 1);
    };
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', resize);
    resize(); onScroll();

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    const clock = new THREE.Clock();
    const lookAt = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    let t = 0, raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) { clock.getDelta(); return; }
      const dt = Math.min(clock.getDelta(), 0.05);
      t += dt * (reduced ? 0.15 : 1);
      uTime.value = t;

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.set(camBase.x + mouse.x * 4, camBase.y - mouse.y * 1.5 + scrollP * 6, camBase.z - scrollP * 10);
      lookAt.set(mouse.x * 2, (isMobile ? 5 : 11) - scrollP * 8, -60);
      camera.lookAt(lookAt);

      outer.rotation.y = t * 0.25; outer.rotation.x = t * 0.12;
      inner.rotation.y = -t * 0.5; inner.rotation.z = t * 0.3;
      glow.material.opacity = 0.75 + Math.sin(t * 2.4) * 0.2;
      ring1.rotation.z = t * 0.2;
      ring2.rotation.z = -t * 0.15;
      for (const { s, ring, r, speed, off } of sats) {
        const a = t * speed + off;
        s.position.copy(tmp.set(Math.cos(a) * r, Math.sin(a) * r, 0).applyEuler(ring.rotation));
      }
      stars.rotation.y = t * 0.004;
      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener('pointermove', onMove);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', resize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="hero3d" aria-hidden="true" />;
}
