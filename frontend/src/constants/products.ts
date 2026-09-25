import { ProductItem } from '../types';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'celestial-blueprint',
    title: 'De Gepersonaliseerde Sterrenposter',
    tagline: 'Wetenschappelijk Berekende Astronomische Sterrenkaart',
    description:
      'Exact berekend met behulp van NASA JPL efemeriden en Skyfield astronomische algoritmes. Brengt de adembenemende sterrenhemel in beeld boven elke specifieke locatie en elk bijzonder levensmoment.',
    price: 'vanaf €19,00',
    originalPrice: '€29,00',
    rating: 4.98,
    reviewCount: 3240,
    badge: 'MUSEUMKWALITEIT',
    image: '/textures/star_map_sample.png',
    category: 'celestial',
    available: true,
    material: 'Classic Matte 200 gsm Fine-Art Papier & Ambachtelijke Houten Lijsten',
    details: [
      'Wetenschappelijk berekend via officiële NASA JPL & Skyfield data',
      '8.870 zichtbare Hipparcos sterren & 88 officiële sterrenbeelden',
      'Keuze uit digitaal bestand, classic matte print of houten kwaliteitslijsten (zwart, licht naturel, wit)',
      'Optioneel passe-partout museumkader en hart- of cirkelvorm',
      'Directe live preview in hoge resolutie',
      'Gratis en verzekerde verzending binnen Nederland en België (PostNL / Bpost)',
    ],
  },
];
