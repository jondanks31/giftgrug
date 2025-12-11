// ===========================================
// GRUG SPEAK DICTIONARY
// The single source of truth for all translations
// ===========================================

export type CategoryId =
  | 'shiny-rocks-string'
  | 'shiny-rocks-finger'
  | 'shiny-rocks-arm'
  | 'soft-fuzzy-wraps'
  | 'magic-smell-water'
  | 'face-paint'
  | 'glowy-rectangles'
  | 'noise-makers'
  | 'hot-leaf-water'
  | 'dead-tree-marks'
  | 'soft-foot-wraps'
  | 'flower-water'
  | 'bag-carry-things'
  | 'shiny-time-circle'
  | 'fire-smell-sticks';

export interface Category {
  id: CategoryId;
  grugName: string;
  realName: string;
  description: string;
  emoji: string;
  searchTerms: string[]; // For Amazon/product searches
}

export const categories: Category[] = [
  {
    id: 'shiny-rocks-string',
    grugName: 'Shiny Rocks on String',
    realName: 'Necklaces',
    description: 'Womanfolk hang from neck. Very pretty.',
    emoji: '💎',
    searchTerms: ['necklace', 'pendant', 'chain necklace', 'diamond necklace'],
  },
  {
    id: 'shiny-rocks-finger',
    grugName: 'Shiny Rocks on Finger Thing',
    realName: 'Rings',
    description: 'Go on finger. Make finger fancy.',
    emoji: '💍',
    searchTerms: ['ring', 'diamond ring', 'gold ring', 'silver ring'],
  },
  {
    id: 'shiny-rocks-arm',
    grugName: 'Shiny Rocks on Arm Circle',
    realName: 'Bracelets',
    description: 'Wrap around arm. Jingle jingle.',
    emoji: '📿',
    searchTerms: ['bracelet', 'bangle', 'charm bracelet', 'tennis bracelet'],
  },
  {
    id: 'soft-fuzzy-wraps',
    grugName: 'Soft Fuzzy Wraps',
    realName: 'Cozy Clothing',
    description: 'Keep womanfolk warm. Very soft.',
    emoji: '🧣',
    searchTerms: ['robe', 'blanket', 'cardigan', 'cashmere sweater', 'fuzzy socks'],
  },
  {
    id: 'magic-smell-water',
    grugName: 'Magic Smell Water',
    realName: 'Perfume',
    description: 'Spray on. Smell good. Grug like.',
    emoji: '✨',
    searchTerms: ['perfume', 'fragrance', 'eau de parfum', 'cologne for women'],
  },
  {
    id: 'face-paint',
    grugName: 'Face Paint Things',
    realName: 'Makeup',
    description: 'Colors for face. Make pretty.',
    emoji: '💄',
    searchTerms: ['makeup set', 'lipstick', 'eyeshadow palette', 'makeup gift set'],
  },
  {
    id: 'glowy-rectangles',
    grugName: 'Glowy Rectangle Things',
    realName: 'Electronics',
    description: 'Magic light box. Show pictures.',
    emoji: '📱',
    searchTerms: ['tablet', 'e-reader', 'kindle', 'ipad'],
  },
  {
    id: 'noise-makers',
    grugName: 'Noise Makers for Ears',
    realName: 'Headphones & Audio',
    description: 'Put on ears. Hear music.',
    emoji: '🎧',
    searchTerms: ['headphones', 'airpods', 'wireless earbuds', 'bluetooth speaker'],
  },
  {
    id: 'hot-leaf-water',
    grugName: 'Hot Leaf Water Makers',
    realName: 'Coffee & Tea',
    description: 'Make hot drink. Wake up juice.',
    emoji: '☕',
    searchTerms: ['coffee maker', 'tea set', 'espresso machine', 'mug set'],
  },
  {
    id: 'dead-tree-marks',
    grugName: 'Dead Tree with Marks',
    realName: 'Books & Journals',
    description: 'Flat thing with words. Womanfolk stare at for hours.',
    emoji: '📚',
    searchTerms: ['book', 'journal', 'planner', 'bestseller book'],
  },
  {
    id: 'soft-foot-wraps',
    grugName: 'Soft Foot Wraps',
    realName: 'Slippers & Socks',
    description: 'Keep feet warm. Very cozy.',
    emoji: '🧦',
    searchTerms: ['slippers', 'fuzzy socks', 'ugg slippers', 'cozy socks'],
  },
  {
    id: 'flower-water',
    grugName: 'Flower Water in Bottle',
    realName: 'Skincare & Spa',
    description: 'Rub on face. Face happy.',
    emoji: '🧴',
    searchTerms: ['skincare set', 'face cream', 'spa gift set', 'moisturizer'],
  },
  {
    id: 'bag-carry-things',
    grugName: 'Bag for Carry Things',
    realName: 'Handbags & Purses',
    description: 'Big pouch. Put stuff inside.',
    emoji: '👜',
    searchTerms: ['handbag', 'purse', 'tote bag', 'crossbody bag'],
  },
  {
    id: 'shiny-time-circle',
    grugName: 'Shiny Time Circle',
    realName: 'Watches',
    description: 'Tell when sun go. On arm.',
    emoji: '⌚',
    searchTerms: ['watch', 'women watch', 'smartwatch', 'gold watch'],
  },
  {
    id: 'fire-smell-sticks',
    grugName: 'Fire Smell Sticks',
    realName: 'Candles & Home',
    description: 'Light on fire. Smell good. No burn cave.',
    emoji: '🕯️',
    searchTerms: ['candle', 'candle set', 'diffuser', 'aromatherapy'],
  },
];

// Price ranges in "shiny coins"
export interface PriceRange {
  id: string;
  grugName: string;
  min: number;
  max: number | null;
  coins: number; // 1-5 for visual display
}

export const priceRanges: PriceRange[] = [
  { id: 'few', grugName: 'Few Coins', min: 0, max: 25, coins: 1 },
  { id: 'some', grugName: 'Some Coins', min: 25, max: 50, coins: 2 },
  { id: 'many', grugName: 'Many Coins', min: 50, max: 100, coins: 3 },
  { id: 'big-pile', grugName: 'Big Rock Pile', min: 100, max: 250, coins: 4 },
  { id: 'whole-cave', grugName: 'Whole Cave Worth', min: 250, max: null, coins: 5 },
];

// Recipient types
export interface RecipientType {
  id: string;
  grugName: string;
  realName: string;
}

export const recipientTypes: RecipientType[] = [
  { id: 'wife', grugName: 'Man Womanfolk', realName: 'Wife/Girlfriend' },
  { id: 'mother', grugName: 'Man Maker Womanfolk', realName: 'Mother' },
  { id: 'sister', grugName: 'Man Blood Sister', realName: 'Sister' },
  { id: 'grandmother', grugName: "Man Maker's Maker", realName: 'Grandmother' },
  { id: 'daughter', grugName: 'Man Small Womanfolk', realName: 'Daughter' },
  { id: 'friend', grugName: 'Womanfolk From Other Cave', realName: 'Friend' },
  { id: 'coworker', grugName: 'Hunt Together Womanfolk', realName: 'Coworker' },
];

// Occasion types
export interface OccasionType {
  id: string;
  grugName: string;
  realName: string;
}

export const occasionTypes: OccasionType[] = [
  { id: 'birthday', grugName: 'Special Sun', realName: 'Birthday' },
  { id: 'anniversary', grugName: 'Remember First Hunt Day', realName: 'Anniversary' },
  { id: 'christmas', grugName: 'Cold Time Gift Sun', realName: 'Christmas' },
  { id: 'valentines', grugName: 'Heart Paint Sun', realName: "Valentine's Day" },
  { id: 'mothers-day', grugName: 'Thank Maker Sun', realName: "Mother's Day" },
  { id: 'just-because', grugName: 'Grug In Trouble', realName: 'Just Because / Apology' },
];

// UI Text translations
export const uiText = {
  // Headers
  mainHeading: 'WHAT MAN BUY FOR WOMANFOLK?',
  subHeading: 'Grug help man find shiny things for special womanfolk',
  
  // Search
  searchPlaceholder: 'what womanfolk like?',
  searchButton: 'GRUG FIND THING',
  
  // Price slider
  priceSliderLabel: 'How many shiny coins man have?',
  
  // Categories
  categoriesHeading: 'Or man pick from cave wall:',
  
  // Panic mode
  panicButton: 'MAN FORGOT SPECIAL SUN?!',
  panicHeading: 'GRUG HELP NOW!',
  panicSubheading: 'Quick things. Arrive fast. Womanfolk not know man forget.',
  
  // Results
  resultsHeading: 'GRUG FIND THINGS',
  noResults: 'Grug look everywhere. No find thing. Man try different words?',
  loading: 'Grug hunting...',
  
  // Product
  buyButton: 'MAN TAKE THING',
  saveButton: 'GRUG REMEMBER',
  priceLabel: 'Shiny Coins:',
  
  // Account / Cave
  caveHeading: 'MAN CAVE',
  caveSubheading: 'Grug keep man secrets here',
  addDateButton: 'Add Special Sun',
  savedItemsHeading: 'Things Grug Remember',
  datesHeading: 'Important Suns',
  
  // Auth
  loginButton: 'Man Enter Cave',
  logoutButton: 'Man Leave Cave',
  signupButton: 'Man Make Cave',
  
  // Footer
  footerText: 'Grug help man since beginning of time (2025)',
  
  // Ads / Affiliate disclosure
  affiliateDisclosure: 'Man click thing, thing give Grug shiny coins, Grug thank man, Grug buy Audi RS6',
  grugPickLabel: 'GRUG SAVED THIS FOR MAN',
};

// Grug quotes for various situations
export const grugQuotes = {
  welcome: [
    'Grug see man need help. Grug best at find shiny things.',
    'Man look confused. This normal. Grug here now.',
    'Welcome to Grug cave. Grug help man not sleep on rock tonight.',
  ],
  searching: [
    'Grug look in all caves...',
    'Grug ask other Grugs...',
    'Grug hunt for perfect thing...',
  ],
  found: [
    'GRUG FIND! Man look at these.',
    'These good things. Womanfolk make happy noise.',
    'Grug work hard. Here what Grug find.',
  ],
  panic: [
    'Man forget?! GRUG PANIC TOO! But Grug help.',
    'No worry. Grug see this many times. Grug have plan.',
    'Quick quick! Grug know what do.',
  ],
  empty: [
    'Grug search whole cave. Nothing here.',
    'Man try different words. Grug try again.',
  ],
  saved: [
    'Grug remember this for man.',
    'Saved in cave wall. Man find later.',
  ],
  error: [
    'Ugh. Something break. Grug confused.',
    'Cave have problem. Man try again?',
  ],
};

// Helper function to get random Grug quote
export function getRandomQuote(situation: keyof typeof grugQuotes): string {
  const quotes = grugQuotes[situation];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Helper to get category by ID
export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}

// Helper to get price range by value
export function getPriceRangeByValue(value: number): PriceRange {
  return priceRanges.find((r) => 
    value >= r.min && (r.max === null || value <= r.max)
  ) || priceRanges[0];
}
