'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header, MobileNav, GrugMascot, Footer } from '@/components';
import { Button, Card } from '@/components/ui';
import { wishlistText } from '@/lib/grug-dictionary';
import { getWishlistByToken, getWishlistItemsByToken } from '@/lib/wishlists-db';
import type { Wishlist, WishlistItemWithProduct } from '@/lib/database.types';
import { ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';

export default function SharedWishlistPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [items, setItems] = useState<WishlistItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    
    const wishlistData = await getWishlistByToken(token);
    
    if (!wishlistData) {
      setError('Cave painting not found. Maybe man hide it?');
      setLoading(false);
      return;
    }
    
    setWishlist(wishlistData);
    
    const itemsData = await getWishlistItemsByToken(token);
    setItems(itemsData);
    setLoading(false);
  };

  const handleVote = async (itemId: string, vote: 'up' | 'down') => {
    setVotingId(itemId);
    
    // Find current item to check if we're toggling
    const currentItem = items.find(i => i.id === itemId);
    const newVote = currentItem?.vote === vote ? null : vote;
    
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          vote: newVote,
          shareToken: token,
        }),
      });
      
      if (response.ok) {
        // Update local state
        setItems(items.map(item => 
          item.id === itemId 
            ? { ...item, vote: newVote, voted_at: newVote ? new Date().toISOString() : null }
            : item
        ));
        setHasVoted(true);
      }
    } catch (err) {
      console.error('Vote failed:', err);
    }
    
    setVotingId(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 bg-cave-dark">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <GrugMascot situation="searching" size="lg" />
          <p className="font-grug text-sand mt-4">Grug finding cave painting...</p>
        </div>
        <MobileNav />
      </div>
    );
  }

  // Error state
  if (error || !wishlist) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 bg-cave-dark">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <GrugMascot situation="error" size="lg" />
          <h1 className="font-grug text-2xl text-sand mt-4">Ugh. Problem.</h1>
          <p className="text-stone-light mt-2">{error || 'Cave painting not exist.'}</p>
          <Link href="/">
            <Button className="mt-6">Go to Grug Cave</Button>
          </Link>
        </div>
        <MobileNav />
      </div>
    );
  }

  const votedCount = items.filter(i => i.vote !== null).length;
  const upCount = items.filter(i => i.vote === 'up').length;
  const downCount = items.filter(i => i.vote === 'down').length;

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-cave-dark">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/grug_avatar.png" alt="Grug" className="h-12 w-auto" />
            <h1 className="font-grug text-2xl md:text-4xl text-sand">
              {wishlist.name}
            </h1>
          </div>
          
          {wishlist.recipient_name && (
            <p className="text-stone-light mb-4">
              For: <span className="text-sand">{wishlist.recipient_name}</span>
            </p>
          )}
          
          <GrugMascot 
            size="md" 
            customMessage={wishlistText.sharePageSubtitle}
          />
        </section>

        {/* Instructions */}
        <section className="max-w-md mx-auto mb-8">
          <Card className="bg-fire/10 border border-fire/30 text-center">
            <p className="font-grug-speech text-sand">
              {wishlistText.sharePageInstruction}
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-moss">
                <ThumbsUp className="w-6 h-6" />
                <span className="font-grug text-sm">= Want</span>
              </div>
              <div className="flex items-center gap-2 text-blood">
                <ThumbsDown className="w-6 h-6" />
                <span className="font-grug text-sm">= No Want</span>
              </div>
            </div>
          </Card>
        </section>

        {/* Progress */}
        {items.length > 0 && (
          <section className="max-w-md mx-auto mb-6 text-center">
            <p className="text-stone-light text-sm">
              Voted on {votedCount} of {items.length} things
              {upCount > 0 && <span className="text-moss ml-2">({upCount} 👍)</span>}
              {downCount > 0 && <span className="text-blood ml-2">({downCount} 👎)</span>}
            </p>
          </section>
        )}

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-light">No things in this cave painting yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {items.map((item) => (
              <VotableProductCard
                key={item.id}
                item={item}
                onVote={handleVote}
                isVoting={votingId === item.id}
              />
            ))}
          </div>
        )}

        {/* Thank You Message */}
        {hasVoted && (
          <section className="max-w-md mx-auto mt-8 text-center">
            <Card className="bg-moss/10 border border-moss/30">
              <p className="font-grug text-moss text-lg">
                {wishlistText.thankYouVoted}
              </p>
              <p className="text-sand/80 text-sm mt-2 font-grug-speech">
                Man can see what you pick. Grug help man not mess up.
              </p>
            </Card>
          </section>
        )}
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}

function VotableProductCard({ 
  item, 
  onVote, 
  isVoting 
}: { 
  item: WishlistItemWithProduct;
  onVote: (itemId: string, vote: 'up' | 'down') => void;
  isVoting: boolean;
}) {
  const product = item.product;
  
  return (
    <Card 
      className={`flex flex-col transition-all ${
        item.vote === 'up' ? 'ring-2 ring-moss bg-moss/5' : 
        item.vote === 'down' ? 'ring-2 ring-blood bg-blood/5' : 
        ''
      }`}
    >
      {/* Product Image */}
      <div className="bg-bone/95 rounded-stone h-40 flex items-center justify-center mb-3 overflow-hidden p-3">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.real_name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span className="text-5xl opacity-30">🎁</span>
        )}
      </div>
      
      {/* Product Info */}
      <h3 className="font-grug text-md text-sand mb-1">{product.grug_name}</h3>
      <p className="text-xs text-stone-light mb-2">({product.real_name})</p>
      
      {/* Price */}
      <p className="font-grug text-fire text-sm mb-3">£{product.price}</p>
      
      {/* Grug Says */}
      <p className="font-grug-speech text-sand/70 text-sm mb-4 flex-grow">
        "{product.grug_says}"
      </p>
      
      {/* Vote Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onVote(item.id, 'up')}
          disabled={isVoting}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-stone font-grug text-sm transition-all ${
            item.vote === 'up'
              ? 'bg-moss text-cave-dark'
              : 'bg-stone-dark text-stone-light hover:bg-moss/20 hover:text-moss'
          } ${isVoting ? 'opacity-50' : ''}`}
        >
          <ThumbsUp className="w-5 h-5" />
          {item.vote === 'up' ? 'LIKE!' : 'Want'}
        </button>
        
        <button
          onClick={() => onVote(item.id, 'down')}
          disabled={isVoting}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-stone font-grug text-sm transition-all ${
            item.vote === 'down'
              ? 'bg-blood text-bone'
              : 'bg-stone-dark text-stone-light hover:bg-blood/20 hover:text-blood'
          } ${isVoting ? 'opacity-50' : ''}`}
        >
          <ThumbsDown className="w-5 h-5" />
          {item.vote === 'down' ? 'NO' : 'No'}
        </button>
      </div>
      
      {/* View on Amazon (smaller, secondary) */}
      <a
        href={product.amazon_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-center text-xs text-stone-light hover:text-fire flex items-center justify-center gap-1"
      >
        <ExternalLink className="w-3 h-3" />
        View on Amazon
      </a>
    </Card>
  );
}
