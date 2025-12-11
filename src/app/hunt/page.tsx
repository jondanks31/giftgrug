'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { Header, MobileNav, GrugMascot, Footer } from '@/components';
import { Button, Card, Input, ProductGridSkeleton } from '@/components/ui';
import { uiText, categories, getCategoryById, priceRanges } from '@/lib/grug-dictionary';
import { 
  getAllProducts, 
  getProductsByCategory, 
  searchProducts, 
  filterByPriceRange, 
  getPriceCoins,
  type ProductDisplay 
} from '@/lib/products-db';
import { ExternalLink, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function HuntContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get('category');
  const query = searchParams.get('q');
  const priceParam = searchParams.get('price');
  
  // Find price range index from URL param (null = no filter)
  const initialPriceIndex = priceParam ? priceRanges.findIndex(r => r.id === priceParam) : -1;
  const [priceRangeIndex, setPriceRangeIndex] = useState<number | null>(initialPriceIndex >= 0 ? initialPriceIndex : null);
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(uiText.resultsHeading);
  const [subtitle, setSubtitle] = useState('');
  const [enabledCategories, setEnabledCategories] = useState<string[]>([]);

  // Fetch enabled categories
  useEffect(() => {
    async function fetchEnabledCategories() {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('id')
        .eq('is_enabled', true)
        .order('display_order', { ascending: true });
      
      if (data) {
        setEnabledCategories(data.map(c => c.id));
      }
    }
    fetchEnabledCategories();
  }, []);

  // Fetch products based on category/query
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let fetchedProducts: ProductDisplay[] = [];
      
      if (categoryId) {
        const category = getCategoryById(categoryId as any);
        if (category) {
          fetchedProducts = await getProductsByCategory(categoryId);
          setTitle(category.grugName);
          setSubtitle(category.realName);
        }
      } else if (query) {
        fetchedProducts = await searchProducts(query);
        setTitle(`GRUG HUNT FOR: "${query.toUpperCase()}"`);
        setSubtitle('');
      } else {
        fetchedProducts = await getAllProducts();
        setTitle('ALL GRUG PICKS');
        setSubtitle('');
      }
      
      setProducts(fetchedProducts);
      setLoading(false);
    }
    
    fetchProducts();
  }, [categoryId, query]);

  // Apply price filter only if one is selected
  const currentPriceRange = priceRangeIndex !== null ? priceRanges[priceRangeIndex] : null;
  const filteredProducts = currentPriceRange 
    ? filterByPriceRange(products, currentPriceRange.min, currentPriceRange.max)
    : products;
  
  // Handle search from hunt page
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      let url = `/hunt?q=${encodeURIComponent(searchQuery.trim())}`;
      if (priceRangeIndex !== null) {
        url += `&price=${priceRanges[priceRangeIndex].id}`;
      }
      router.push(url);
    }
  };

  // Handle price filter change
  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newIndex = value === '' ? null : parseInt(value);
    setPriceRangeIndex(newIndex);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (newIndex !== null) {
      params.set('price', priceRanges[newIndex].id);
    } else {
      params.delete('price');
    }
    router.replace(`/hunt?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <section className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-light" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={uiText.searchPlaceholder}
                className="pl-12 w-full"
              />
            </div>
            
            {/* Price Dropdown */}
            <select
              value={priceRangeIndex ?? ''}
              onChange={handlePriceChange}
              className="input-cave px-4 py-3 min-w-[180px] cursor-pointer"
            >
              <option value="">🪙 All Prices</option>
              {priceRanges.map((range, index) => (
                <option key={range.id} value={index}>
                  {'🪙'.repeat(range.coins)} {range.max ? `£${range.min}-${range.max}` : `£${range.min}+`}
                </option>
              ))}
            </select>
            
            <Button type="submit">
              HUNT
            </Button>
          </form>
        </section>

        {/* Page Header */}
        <section className="text-center mb-6">
          <h1 className="font-grug text-2xl md:text-4xl text-sand mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-stone-light">({subtitle})</p>
          )}
          <p className="text-stone-light text-sm mt-2">
            {filteredProducts.length} thing{filteredProducts.length !== 1 ? 's' : ''} found
            {currentPriceRange && ` in ${currentPriceRange.grugName} range`}
          </p>
        </section>

        {/* Results */}
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-6">
            {/* Split products into chunks of 6 for ad insertion */}
            {(() => {
              const chunks: typeof filteredProducts[] = [];
              for (let i = 0; i < filteredProducts.length; i += 6) {
                chunks.push(filteredProducts.slice(i, i + 6));
              }
              return chunks.map((chunk, chunkIndex) => (
                <div key={chunkIndex}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chunk.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  {/* Show ad after each chunk except the last */}
                  {chunkIndex < chunks.length - 1 && (
                    <div className="mt-6">
                      <AdCard />
                    </div>
                  )}
                </div>
              ));
            })()}
          </div>
        ) : (
          <div className="text-center py-12">
            <GrugMascot situation="empty" customMessage={
              currentPriceRange 
                ? "Grug find nothing in this price. Try different coins?" 
                : "Grug find nothing. Try different words?"
            } />
            <p className="text-stone-light mt-4">
              {products.length > 0 && currentPriceRange
                ? `Grug have ${products.length} things, but none match man's coins.`
                : uiText.noResults
              }
            </p>
            <Link href="/">
              <Button variant="secondary" className="mt-4">
                Back to Cave
              </Button>
            </Link>
          </div>
        )}

        {/* Category Quick Links - Only show enabled categories */}
        {enabledCategories.length > 0 && (
          <section className="mt-12">
            <h2 className="font-grug text-lg text-sand mb-4 text-center">
              Or Look at Other Things:
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {categories
                .filter(cat => enabledCategories.includes(cat.id))
                .slice(0, 8)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/hunt?category=${cat.id}`}
                    className="px-4 py-2 bg-stone-dark rounded-stone text-sm text-sand hover:bg-stone transition-colors"
                  >
                    {cat.emoji} {cat.grugName}
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}

function ProductCard({ product }: { product: ProductDisplay }) {
  return (
    <Card variant={product.isGrugPick ? 'featured' : 'default'} className="flex flex-col">
      {product.isGrugPick && (
        <div className="bg-fire/20 text-fire text-xs font-grug px-3 py-1 rounded-full self-start mb-3">
          {uiText.grugPickLabel}
        </div>
      )}
      
      {/* Product Image */}
      <div className="bg-bone/95 rounded-stone h-48 flex items-center justify-center mb-4 overflow-hidden p-4">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.realName}
            className="max-w-full max-h-full object-contain drop-shadow-md"
          />
        ) : (
          <span className="text-6xl opacity-30">🎁</span>
        )}
      </div>
      
      <h3 className="font-grug text-lg text-sand mb-1">{product.grugName}</h3>
      <p className="text-sm text-stone-light mb-2">({product.realName})</p>
      
      {/* Grug Quote */}
      <p className="font-grug-speech text-sand/80 text-sm mb-4 flex-grow">
        "{product.grugSays}"
      </p>
      
      {/* Price */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-stone-light text-sm">{uiText.priceLabel}</span>
        <span className="font-grug text-fire">£{product.price}</span>
        <span className="text-xs text-stone-light">
          ({Array.from({ length: getPriceCoins(product.priceRange) }).map(() => '🪙').join('')})
        </span>
      </div>
      
      {/* CTA */}
      <a
        href={product.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Button className="w-full flex items-center justify-center gap-2">
          {uiText.buyButton}
          <ExternalLink className="w-4 h-4" />
        </Button>
      </a>
    </Card>
  );
}

function AdCard() {
  return (
    <Card variant="ad" className="flex flex-col items-center justify-center text-center min-h-[300px]">
      {/* Google AdSense container - paste your ad code here */}
      <div className="w-full mb-4 min-h-[250px] flex items-center justify-center bg-cave/50 rounded-stone">
        {/* Replace this placeholder with your AdSense code */}
        <div className="text-stone-light text-sm">
          [Ad Space - 300x250]
        </div>
      </div>
      
      {/* Grug's comment on ads */}
      <p className="font-grug-speech text-sand/60 text-sm">
        "Grug need shiny coins too. Man understand."
      </p>
    </Card>
  );
}


export default function HuntPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cave-dark">
        <p className="font-grug text-sand">{uiText.loading}</p>
      </div>
    }>
      <HuntContent />
    </Suspense>
  );
}
