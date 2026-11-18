// Beneficios en lenguaje simple: lo que el cliente gana, no la tecnología que usamos.
const BENEFITS = [
  'Más ventas',
  'Más clientes',
  'Aparecé en Google',
  'Vendé las 24 horas',
  'Atención automática por WhatsApp',
  'Menos tareas repetitivas',
  'Cobrá online con Mercado Pago',
  'Todo tu negocio en un solo lugar',
  'Números claros para decidir mejor',
  'Más tiempo para lo importante',
];

export default function Marquee() {
  const items = [...BENEFITS, ...BENEFITS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}
