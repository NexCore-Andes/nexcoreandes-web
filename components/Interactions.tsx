'use client';

import { useEffect } from 'react';

/** Efectos globales: aparición al hacer scroll, inclinación 3D y botones magnéticos. */
export default function Interactions() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cleanups: (() => void)[] = [];

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        const sibs = Array.from(el.parentElement?.querySelectorAll(':scope > .reveal') ?? []);
        el.style.transitionDelay = `${Math.min(Math.max(sibs.indexOf(el), 0), 5) * 80}ms`;
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    if (fine && !reduced) {
      document.querySelectorAll<HTMLElement>('.tilt').forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        };
        const leave = () => {
          el.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)';
          el.style.transform = '';
          window.setTimeout(() => { el.style.transition = ''; }, 600);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
      });

      document.querySelectorAll<HTMLElement>('.magnetic').forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
        };
        const leave = () => { el.style.transform = ''; };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
      });
    }
    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
