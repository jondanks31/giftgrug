// ===========================================
// HARDCODED PRODUCTS
// "Grug Saved This For Man" - Featured affiliate products
// ===========================================

import { type CategoryId } from './grug-dictionary';

export interface Product {
  id: string;
  grugName: string;
  realName: string;
  category: CategoryId;
  priceRange: 'few' | 'some' | 'many' | 'big-pile' | 'whole-cave';
  price: number; // Approximate price in USD
  amazonAsin?: string;
  amazonUrl: string;
  imageUrl: string;
  grugSays: string;
  isGrugPick: boolean;
  tags: string[];
}

// Amazon Associate ID - used in all URLs
const ASSOCIATE_ID = 'giftgrug-21';

// Helper to create Amazon URL
function amazonUrl(asin: string): string {
  return `https://www.amazon.co.uk/dp/${asin}?tag=${ASSOCIATE_ID}`;
}

// Helper to create Amazon search URL
function amazonSearchUrl(query: string): string {
  return `https://www.amazon.co.uk/s?k=${encodeURIComponent(query)}&tag=${ASSOCIATE_ID}`;
}

export const featuredProducts: Product[] = [
  // Shiny Rocks on String (Necklaces)
  {
    id: 'necklace-001',
    grugName: 'Very Shiny Rock on Gold String',
    realName: 'Gold Heart Pendant Necklace',
    category: 'shiny-rocks-string',
    priceRange: 'many',
    price: 79,
    amazonUrl: amazonSearchUrl('gold heart pendant necklace women'),
    imageUrl: '/products/necklace-placeholder.jpg',
    grugSays: 'Womanfolk see this, make happy water come from eyes. Good water.',
    isGrugPick: true,
    tags: ['romantic', 'classic', 'anniversary'],
  },
  {
    id: 'necklace-002',
    grugName: 'Many Tiny Rocks on Silver String',
    realName: 'Sterling Silver Diamond Tennis Necklace',
    category: 'shiny-rocks-string',
    priceRange: 'big-pile',
    price: 199,
    amazonUrl: amazonSearchUrl('sterling silver diamond tennis necklace'),
    imageUrl: '/products/necklace-placeholder.jpg',
    grugSays: 'This one cost many mammoth. But womanfolk VERY happy.',
    isGrugPick: true,
    tags: ['luxury', 'special', 'anniversary'],
  },

  // Magic Smell Water (Perfume)
  {
    id: 'perfume-001',
    grugName: 'Flower Smell in Fancy Rock',
    realName: 'Chanel No. 5 Eau de Parfum',
    category: 'magic-smell-water',
    priceRange: 'big-pile',
    price: 150,
    amazonUrl: amazonSearchUrl('chanel no 5 perfume'),
    imageUrl: '/products/perfume-placeholder.jpg',
    grugSays: 'Grug not understand why water cost so much. But womanfolk love.',
    isGrugPick: true,
    tags: ['classic', 'luxury', 'birthday'],
  },
  {
    id: 'perfume-002',
    grugName: 'Sweet Cloud Smell Water',
    realName: 'Ariana Grande Cloud Perfume',
    category: 'magic-smell-water',
    priceRange: 'some',
    price: 45,
    amazonUrl: amazonSearchUrl('ariana grande cloud perfume'),
    imageUrl: '/products/perfume-placeholder.jpg',
    grugSays: 'Young womanfolk like this one. Smell like sky treats.',
    isGrugPick: false,
    tags: ['trendy', 'young', 'sweet'],
  },

  // Soft Fuzzy Wraps
  {
    id: 'robe-001',
    grugName: 'Very Soft Cave Wrap',
    realName: 'Luxury Plush Fleece Bathrobe',
    category: 'soft-fuzzy-wraps',
    priceRange: 'some',
    price: 49,
    amazonUrl: amazonSearchUrl('luxury plush fleece bathrobe women'),
    imageUrl: '/products/robe-placeholder.jpg',
    grugSays: 'Womanfolk wear this, never want leave cave. Very cozy.',
    isGrugPick: true,
    tags: ['cozy', 'comfort', 'winter'],
  },
  {
    id: 'blanket-001',
    grugName: 'Giant Soft Flat Fur',
    realName: 'Weighted Blanket Queen Size',
    category: 'soft-fuzzy-wraps',
    priceRange: 'many',
    price: 79,
    amazonUrl: amazonSearchUrl('weighted blanket queen size'),
    imageUrl: '/products/blanket-placeholder.jpg',
    grugSays: 'Heavy like mammoth hug. Womanfolk sleep good.',
    isGrugPick: true,
    tags: ['sleep', 'comfort', 'anxiety'],
  },

  // Fire Smell Sticks (Candles)
  {
    id: 'candle-001',
    grugName: 'Many Fire Smell Sticks in Box',
    realName: 'Yankee Candle Gift Set',
    category: 'fire-smell-sticks',
    priceRange: 'some',
    price: 35,
    amazonUrl: amazonSearchUrl('yankee candle gift set'),
    imageUrl: '/products/candle-placeholder.jpg',
    grugSays: 'Set cave on fire but GOOD fire. Smell nice.',
    isGrugPick: true,
    tags: ['home', 'gift-set', 'safe'],
  },

  // Glowy Rectangles
  {
    id: 'kindle-001',
    grugName: 'Magic Flat Rock with Words',
    realName: 'Kindle Paperwhite',
    category: 'glowy-rectangles',
    priceRange: 'big-pile',
    price: 139,
    amazonUrl: amazonSearchUrl('kindle paperwhite'),
    imageUrl: '/products/kindle-placeholder.jpg',
    grugSays: 'Hold ALL dead trees in one small rock. Magic.',
    isGrugPick: true,
    tags: ['reading', 'tech', 'practical'],
  },

  // Noise Makers
  {
    id: 'airpods-001',
    grugName: 'Tiny Ear Rocks with Sounds',
    realName: 'Apple AirPods Pro',
    category: 'noise-makers',
    priceRange: 'big-pile',
    price: 249,
    amazonUrl: amazonSearchUrl('apple airpods pro'),
    imageUrl: '/products/airpods-placeholder.jpg',
    grugSays: 'Put in ear, world go quiet. Womanfolk love peace.',
    isGrugPick: true,
    tags: ['tech', 'music', 'premium'],
  },

  // Hot Leaf Water
  {
    id: 'coffee-001',
    grugName: 'Magic Brown Water Maker',
    realName: 'Nespresso Vertuo Coffee Machine',
    category: 'hot-leaf-water',
    priceRange: 'big-pile',
    price: 179,
    amazonUrl: amazonSearchUrl('nespresso vertuo coffee machine'),
    imageUrl: '/products/coffee-placeholder.jpg',
    grugSays: 'Push button, get wake-up juice. Womanfolk need before talk.',
    isGrugPick: true,
    tags: ['kitchen', 'practical', 'morning'],
  },

  // Bag for Carry Things
  {
    id: 'bag-001',
    grugName: 'Fancy Carry Pouch',
    realName: 'Michael Kors Crossbody Bag',
    category: 'bag-carry-things',
    priceRange: 'big-pile',
    price: 198,
    amazonUrl: amazonSearchUrl('michael kors crossbody bag'),
    imageUrl: '/products/bag-placeholder.jpg',
    grugSays: 'Womanfolk put whole life in here. Very important.',
    isGrugPick: true,
    tags: ['fashion', 'practical', 'everyday'],
  },

  // Flower Water (Skincare)
  {
    id: 'skincare-001',
    grugName: 'Face Water in Many Bottles',
    realName: 'The Ordinary Skincare Set',
    category: 'flower-water',
    priceRange: 'some',
    price: 45,
    amazonUrl: amazonSearchUrl('the ordinary skincare set'),
    imageUrl: '/products/skincare-placeholder.jpg',
    grugSays: 'Rub on face many times. Grug not understand but womanfolk glow.',
    isGrugPick: true,
    tags: ['skincare', 'beauty', 'practical'],
  },
];

// Panic mode products - last minute gifts
export const panicProducts: Product[] = [
  {
    id: 'giftcard-amazon',
    grugName: 'Magic Trade Paper',
    realName: 'Amazon Gift Card',
    category: 'glowy-rectangles',
    priceRange: 'many',
    price: 50,
    amazonUrl: amazonSearchUrl('amazon gift card'),
    imageUrl: '/products/giftcard-placeholder.jpg',
    grugSays: 'Womanfolk pick own thing. Sometimes best way.',
    isGrugPick: true,
    tags: ['gift-card', 'safe', 'last-minute'],
  },
  {
    id: 'flowers-001',
    grugName: 'Dead Plants That Pretty',
    realName: 'Preserved Rose Box',
    category: 'fire-smell-sticks',
    priceRange: 'some',
    price: 40,
    amazonUrl: amazonSearchUrl('preserved rose gift box'),
    imageUrl: '/products/flowers-placeholder.jpg',
    grugSays: 'Plant already dead but stay pretty. Not like real flower.',
    isGrugPick: true,
    tags: ['romantic', 'last-minute', 'safe'],
  },
  {
    id: 'chocolate-001',
    grugName: 'Sweet Brown Rocks',
    realName: 'Godiva Chocolate Gift Box',
    category: 'hot-leaf-water',
    priceRange: 'some',
    price: 35,
    amazonUrl: amazonSearchUrl('godiva chocolate gift box'),
    imageUrl: '/products/chocolate-placeholder.jpg',
    grugSays: 'Everyone like sweet rocks. Safe choice.',
    isGrugPick: true,
    tags: ['chocolate', 'safe', 'last-minute'],
  },
  {
    id: 'spa-001',
    grugName: 'Relax Water Things Box',
    realName: 'Spa Gift Basket Set',
    category: 'flower-water',
    priceRange: 'some',
    price: 39,
    amazonUrl: amazonSearchUrl('spa gift basket women'),
    imageUrl: '/products/spa-placeholder.jpg',
    grugSays: 'Bath stuff in basket. Womanfolk like relax.',
    isGrugPick: true,
    tags: ['spa', 'relaxation', 'last-minute'],
  },
];

// Get products by category
export function getProductsByCategory(categoryId: CategoryId): Product[] {
  return featuredProducts.filter((p) => p.category === categoryId);
}

// Get all featured products (Grug Picks)
export function getGrugPicks(): Product[] {
  return featuredProducts.filter((p) => p.isGrugPick);
}

// Get products by price range
export function getProductsByPriceRange(
  range: Product['priceRange']
): Product[] {
  return featuredProducts.filter((p) => p.priceRange === range);
}

// Search products by tags or name
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return featuredProducts.filter(
    (p) =>
      p.grugName.toLowerCase().includes(lowerQuery) ||
      p.realName.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

// Filter products by price range (min/max)
export function filterByPriceRange(
  products: Product[],
  minPrice: number,
  maxPrice: number | null
): Product[] {
  return products.filter((p) => {
    if (p.price < minPrice) return false;
    if (maxPrice !== null && p.price > maxPrice) return false;
    return true;
  });
}
