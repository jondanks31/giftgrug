'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Plus, X } from 'lucide-react';
import { useAuth } from '@/components/auth';
import { Button, Input } from '@/components/ui';
import { wishlistText } from '@/lib/grug-dictionary';
import {
  getUserWishlists,
  createWishlist,
  addToWishlist,
  removeFromWishlist,
  getProductWishlists,
} from '@/lib/wishlists-db';
import type { Wishlist } from '@/lib/database.types';

interface SaveToWishlistProps {
  productId: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export function SaveToWishlist({ productId, variant = 'icon', className = '' }: SaveToWishlistProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [savedIn, setSavedIn] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRecipient, setNewRecipient] = useState('');

  // Fetch wishlists and check if product is saved
  useEffect(() => {
    if (user && isOpen) {
      fetchData();
    }
  }, [user, isOpen]);

  // Also check saved status on mount
  useEffect(() => {
    if (user) {
      getProductWishlists(productId).then(setSavedIn);
    }
  }, [user, productId]);

  const fetchData = async () => {
    setLoading(true);
    const [lists, saved] = await Promise.all([
      getUserWishlists(),
      getProductWishlists(productId),
    ]);
    setWishlists(lists);
    setSavedIn(saved);
    setLoading(false);
  };

  const handleToggleWishlist = async (wishlistId: string) => {
    const isInList = savedIn.includes(wishlistId);
    
    if (isInList) {
      await removeFromWishlist(wishlistId, productId);
      setSavedIn(savedIn.filter(id => id !== wishlistId));
    } else {
      await addToWishlist(wishlistId, productId);
      setSavedIn([...savedIn, wishlistId]);
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newName.trim()) return;
    
    setCreating(true);
    const wishlist = await createWishlist(newName.trim(), newRecipient.trim() || undefined);
    
    if (wishlist) {
      await addToWishlist(wishlist.id, productId);
      setWishlists([wishlist, ...wishlists]);
      setSavedIn([...savedIn, wishlist.id]);
      setNewName('');
      setNewRecipient('');
    }
    setCreating(false);
  };

  const isSaved = savedIn.length > 0;

  // Not logged in - show login prompt on click
  if (!user) {
    return (
      <button
        onClick={() => window.location.href = '/cave'}
        className={`transition-all ${className}`}
        title="Login to save"
      >
        {variant === 'icon' ? (
          <div className="flex items-center gap-1 text-stone-light hover:text-fire">
            <Bookmark className="w-5 h-5" />
          </div>
        ) : (
          <span className="flex items-center gap-2 text-sm text-stone-light hover:text-fire">
            <Bookmark className="w-4 h-4" />
            {wishlistText.saveToWishlist}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`transition-all ${className}`}
        title={isSaved ? 'Saved to cave painting' : 'Save to cave painting'}
      >
        {variant === 'icon' ? (
          <div className={`flex items-center gap-1 ${isSaved ? 'text-fire' : 'text-stone-light hover:text-fire'}`}>
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            {isSaved && <span className="text-xs font-grug">🗿</span>}
          </div>
        ) : (
          <span className={`flex items-center gap-2 text-sm font-grug ${isSaved ? 'text-fire' : 'text-stone-light hover:text-fire'}`}>
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {isSaved ? '🗿 SAVED' : wishlistText.saveToWishlist}
          </span>
        )}
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-cave border border-stone-dark rounded-rock shadow-xl">
            <div className="p-3 border-b border-stone-dark flex items-center justify-between">
              <h3 className="font-grug text-sand text-sm">{wishlistText.selectWishlistTitle}</h3>
              <button onClick={() => setIsOpen(false)} className="text-stone-light hover:text-sand">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <p className="p-4 text-center text-stone-light text-sm">Grug looking...</p>
              ) : (
                <>
                  {/* Existing Wishlists */}
                  {wishlists.map((wishlist) => (
                    <button
                      key={wishlist.id}
                      onClick={() => handleToggleWishlist(wishlist.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-stone-dark/50 transition-colors text-left"
                    >
                      <div>
                        <p className="text-sand text-sm font-medium">{wishlist.name}</p>
                        {wishlist.recipient_name && (
                          <p className="text-stone-light text-xs">For: {wishlist.recipient_name}</p>
                        )}
                      </div>
                      {savedIn.includes(wishlist.id) ? (
                        <BookmarkCheck className="w-5 h-5 text-fire" />
                      ) : (
                        <Bookmark className="w-5 h-5 text-stone-light" />
                      )}
                    </button>
                  ))}

                  {wishlists.length === 0 && (
                    <p className="p-4 text-center text-stone-light text-sm">
                      No cave paintings yet. Make one below!
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Create New Wishlist */}
            <div className="p-3 border-t border-stone-dark space-y-2">
              <p className="text-xs text-stone-light font-grug">{wishlistText.createNewOption}</p>
              <Input
                type="text"
                placeholder={wishlistText.wishlistNameLabel}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-sm"
              />
              <Input
                type="text"
                placeholder={`${wishlistText.recipientLabel} (optional)`}
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={handleCreateAndAdd}
                disabled={!newName.trim() || creating}
                className="w-full"
              >
                {creating ? 'Grug making...' : 'Make & Save'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
