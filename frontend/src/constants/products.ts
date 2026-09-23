import { ProductItem } from '../types';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'celestial-blueprint',
    title: 'De Gepersonaliseerde Sterrenposter',
    tagline: 'Wetenschappelijk Berekende Astronomische Sterrenkaart',
    description:
      'Exact berekend met behulp van NASA JPL efemeriden en Skyfield astronomische algoritmes. Brengt de adembenemende sterrenhemel in beeld boven elke specifieke locatie en elk bijzonder levensmoment.',
    price: '€49,00',
    originalPrice: '€68,00',
    rating: 4.98,
    reviewCount: 3240,
    badge: 'EXCLUSIEVE PILOT EDITIE',
    image: '/textures/star_map_sample.png',
    category: 'celestial',
    available: true,
    material: '300 DPI Archiefwaardig 285 gsm Fine-Art Katoenpapier',
    details: [
      'Wetenschappelijk berekend via officiële NASA JPL & Skyfield data',
      '8.870 zichtbare Hipparcos sterren & 88 officiële sterrenbeelden',
      'Keuze uit slanke 8 mm lijsten: mat zwart, natuurlijk eiken of galerij wit',
      'Optioneel passe-partout museumkader en hart- of cirkelvorm',
      'Directe live preview in hoge resolutie',
      'Gratis en verzekerde verzending binnen Nederland en België (PostNL / Bpost)',
    ],
  },
];
