export const SITE = {
  name: 'NexCore Andes',
  tagline: 'Tecnología que impulsa negocios.',
  whatsapp: '5492604841093',
  whatsappLabel: '260 484-1093',
  instagram: 'nexcoreandes',
  instagramUrl: 'https://www.instagram.com/nexcoreandes',
};

export const waLink = (text?: string) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
