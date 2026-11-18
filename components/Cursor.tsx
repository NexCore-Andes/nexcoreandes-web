'use client';

import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const dot = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf = 0;
    const move = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    const over = (e: PointerEvent) => setHover(!!(e.target as Element).closest?.('a,button,input,textarea,.tilt'));
    const loop = () => {
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    loop();
    return () => { removeEventListener('pointermove', move); document.removeEventListener('pointerover', over); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className={`cursor${hover ? ' hover' : ''}`} aria-hidden="true">
      <span className="cursor__dot" ref={dot} />
      <span className="cursor__ring" ref={ring} />
    </div>
  );
}
