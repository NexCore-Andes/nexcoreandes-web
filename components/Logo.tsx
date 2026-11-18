import Image from 'next/image';

/** Logo principal (wordmark blanco) en PNG transparente. Mínimo 190 px de ancho según el manual. */
export function Logo({ width = 200, priority = false }: { width?: number; priority?: boolean }) {
  return (
    <Image
      src="/brand/logo-nexcore-andes.png"
      alt="NexCore Andes"
      width={width}
      height={Math.round((width * 567) / 2058)}
      priority={priority}
      className="logo"
    />
  );
}

/** Isotipo en PNG transparente. Mínimo 32 px según el manual. */
export function Isotipo({ width = 120, className = '', priority = false }: { width?: number; className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/isotipo.png"
      alt=""
      width={width}
      height={Math.round((width * 687) / 1024)}
      priority={priority}
      className={className}
    />
  );
}
