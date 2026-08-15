/**
 * Dati del negozio in un solo punto: header, footer, pagine e testi legali
 * leggono da qui, così un cambio (indirizzo, orari, telefono) si fa una volta.
 */

export const site = {
  name: 'TuttoQua',
  tagline: 'Tutto quello che cerchi, Tutto Qua.',
  // Logo: URL originale, da mantenere.
  logo:
    'https://media.base44.com/images/public/user_69edf90df19892081f8b0e25/04718a322_logo_tuttoqua_page-0001.jpg',

  city: 'Termoli (CB)',
  address: 'indirizzo in via di definizione',
  hours: 'Lun–Sab · 9:30–13 / 16:30–20',
  phone: '380 376 6521',
  phoneHref: 'tel:+393803766521',
  email: 'info@tuttoqua.it',
  franchisingEmail: 'franchising@tuttoqua.it',
  privacyEmail: 'privacy@tuttoqua.it',
  vat: 'P.IVA in via di attribuzione',

  mapsSearchUrl: 'https://www.google.com/maps/search/Termoli+CB',
  mapsEmbedUrl: 'https://www.google.com/maps?q=Termoli%20CB&z=14&output=embed',

  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },

  images: {
    hero:
      'https://media.base44.com/images/public/6a745399ac335c82532a8d85/9756fbe8a_generated_image.png',
    store:
      'https://media.base44.com/images/public/user_69edf90df19892081f8b0e25/969598e6f_WhatsAppImage2026-08-05at165810.jpg',
    staff:
      'https://media.base44.com/images/public/user_69edf90df19892081f8b0e25/a5c98a440_WhatsAppImage2026-08-05at165811.jpg',
  },
} as const;

export const routes = {
  home: '/',
  concept: '/concept',
  store: '/store',
  franchising: '/franchising',
  work: '/lavora-con-noi',
  contacts: '/contatti',
  privacy: '/privacy-policy',
  cookies: '/cookie-policy',
  admin: '/admin',
  adminLogin: '/admin/login',
} as const;

export const mainNav = [
  { to: routes.concept, label: 'Concept' },
  { to: routes.store, label: 'Lo store' },
  { to: routes.franchising, label: 'Franchising' },
  { to: routes.work, label: 'Lavora con noi' },
  { to: routes.contacts, label: 'Contatti' },
] as const;
