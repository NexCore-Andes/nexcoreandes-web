// Editá esta lista para sumar, quitar o cambiar servicios.
// Se actualizan solos el explorador y los botones del formulario de contacto.

export type IconKey = 'target' | 'web' | 'shop' | 'code' | 'auto' | 'ai' | 'layers';

export type Service = {
  id: string;
  icon: IconKey;
  title: string;
  /** Frase corta: para qué le sirve al cliente */
  tag: string;
  desc: string;
  feat: string[];
};

export const SERVICES: Service[] = [
  { id: 'landing', icon: 'target', title: 'Landing Page', tag: 'ideal para campañas y anuncios',
    desc: 'Una página enfocada en un solo objetivo: que quien llega te escriba, compre o deje sus datos. Perfecta para promocionar un producto, servicio o campaña.',
    feat: ['Diseñada para convertir visitas en clientes', 'Botón directo a WhatsApp', 'Lista en pocos días', 'Se ve perfecta en celular'] },
  { id: 'web', icon: 'web', title: 'Webs Empresariales', tag: 'tu negocio, profesional en internet',
    desc: 'El sitio completo de tu empresa: quiénes son, qué ofrecen y cómo contactarlos. Genera confianza y te ayuda a aparecer cuando te buscan en Google.',
    feat: ['Imagen profesional y confiable', 'Preparada para aparecer en Google', 'Formularios y contacto directo', 'Fácil de actualizar'] },
  { id: 'shop', icon: 'shop', title: 'Tiendas online', tag: 'vendé las 24 horas',
    desc: 'Tu propia tienda en internet con catálogo, carrito y cobros con Mercado Pago. Tus clientes compran cuando quieren y vos recibís los pedidos ordenados.',
    feat: ['Catálogo digital de productos', 'Cobros con Mercado Pago', 'Gestión de pedidos', 'Carrito de compras simple'] },
  { id: 'software', icon: 'code', title: 'Software a medida', tag: 'todo tu negocio en un solo lugar',
    desc: 'Un sistema hecho para cómo trabaja tu empresa: stock, ventas, facturación, turnos, proveedores y documentación. Menos planillas, más control.',
    feat: ['Stock y ventas al día', 'Facturación y turnos', 'Proveedores y documentación', 'Administración desde cualquier lugar'] },
  { id: 'auto', icon: 'auto', title: 'Automatizaciones', tag: 'menos tareas repetitivas',
    desc: 'Hacemos que las tareas que hoy te llevan horas se hagan solas: mensajes automáticos, carga de datos, avisos y reportes. Vos te enfocás en vender.',
    feat: ['Mensajes y avisos automáticos', 'Datos que se cargan solos', 'Menos errores humanos', 'Más tiempo para tu negocio'] },
  { id: 'ai', icon: 'ai', title: 'Inteligencia artificial', tag: 'atención y respuestas al instante',
    desc: 'Asistentes que responden a tus clientes a cualquier hora, ayudan a tu equipo y encuentran información en tus documentos en segundos.',
    feat: ['Chatbots que atienden 24/7', 'Asistentes para tu equipo', 'Respuestas desde tus documentos', 'Procesos inteligentes'] },
  { id: 'integ', icon: 'layers', title: 'Integraciones', tag: 'tus herramientas trabajando juntas',
    desc: 'Conectamos WhatsApp, tu tienda online, tu sistema de gestión, tus cobros y más, para que la información pase de uno a otro sin copiar y pegar.',
    feat: ['WhatsApp conectado a tu negocio', 'Tienda, cobros y gestión sincronizados', 'Compatible con CRM, ERP y SAP', 'Información siempre actualizada'] },
];
