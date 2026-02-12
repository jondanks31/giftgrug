'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Trash2, 
  Share2, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  X
} from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import { wishlistText } from '@/lib/grug-dictionary';
import {
  getUserWishlists,
  getWishlistItems,
  createWishlist,
  deleteWishlist,
  removeFromWishlist,
  getWishlistVoteCounts,
} from '@/lib/wishlists-db';
import type { Wishlist, WishlistItemWithProduct } from '@/lib/database.types';

export function CavePaintings() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [items, setItems] = useState<Record<string, WishlistItemWithProduct[]>>({});
  const [voteCounts, setVoteCounts] = useState<Record<string, { up: number; down: number; pending: number }>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    setLoading(true);
    const data = await getUserWishlists();
    setWishlists(data);
    setLoading(false);
  };

  const handleExpand = async (wishlistId: string) => {
    if (expandedId === wishlistId) {
      setExpandedId(null);
      return;
    }
    
    setExpandedId(wishlistId);
    
    // Fetch items if not already loaded
    if (!items[wishlistId]) {
      const wishlistItems = await getWishlistItems(wishlistId);
      setItems(prev => ({ ...prev, [wishlistId]: wishlistItems }));
      
      const counts = await getWishlistVoteCounts(wishlistId);
      setVoteCounts(prev => ({ ...prev, [wishlistId]: counts }));
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      console.log('No name provided');
      return;
    }
    
    console.log('Creating wishlist:', newName.trim());
    const wishlist = await createWishlist(newName.trim(), newRecipient.trim() || undefined);
    console.log('Create result:', wishlist);
    
    if (wishlist) {
      setWishlists([wishlist, ...wishlists]);
      setNewName('');
      setNewRecipient('');
      setIsCreating(false);
    } else {
      console.error('Failed to create wishlist');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Burn this cave painting? All things inside will be lost.')) return;
    
    const success = await deleteWishlist(id);
    if (success) {
      setWishlists(wishlists.filter(w => w.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const handleRemoveItem = async (wishlistId: string, productId: string) => {
    const success = await removeFromWishlist(wishlistId, productId);
    if (success) {
      setItems(prev => ({
        ...prev,
        [wishlistId]: prev[wishlistId].filter(item => item.product_id !== productId),
      }));
    }
  };

  const handleCopyLink = async (shareToken: string, wishlistId: string) => {
    const url = `${window.location.origin}/cave-painting/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(wishlistId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <Card className="text-center py-8">
        <p className="text-stone-light font-grug-speech">Grug looking at cave walls...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-grug text-xl text-sand flex items-center gap-2">
          <img src="/grug_avatar.png" alt="Grug" className="h-7 w-auto inline-block" /> {wishlistText.cavePaintingsHeading}
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-grug text-sand">{wishlistText.createWishlist}</h3>
            <button onClick={() => setIsCreating(false)} className="text-stone-light hover:text-sand">
              <X className="w-4 h-4" />
            </button>
          </div>
          <Input
            type="text"
            placeholder={wishlistText.wishlistNameLabel}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            type="text"
            placeholder={`${wishlistText.recipientLabel} (optional)`}
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
          />
          <Button onClick={handleCreate} disabled={!newName.trim()}>
            Make Cave Painting
          </Button>
        </Card>
      )}

      {/* Wishlists */}
      {wishlists.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-stone-light font-grug-speech text-lg">
            {wishlistText.cavePaintingsEmpty}
          </p>
          <p className="text-stone-light text-sm mt-2">
            Go to Hunt page and save things you like!
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {wishlists.map((wishlist) => {
            const isExpanded = expandedId === wishlist.id;
            const wishlistItems = items[wishlist.id] || [];
            const counts = voteCounts[wishlist.id];
            
            return (
              <Card key={wishlist.id} className="overflow-hidden">
                {/* Wishlist Header */}
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleExpand(wishlist.id)}
                >
                  <div className="flex-grow">
                    <p className="font-grug text-sand flex items-center gap-2">
                      <img src="/grug_avatar.png" alt="Grug" className="h-6 w-auto inline-block" /> {wishlist.name}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-stone-light">
                      {wishlist.recipient_name && (
                        <span>For: {wishlist.recipient_name}</span>
                      )}
                      {counts && (
                        <span className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3 text-moss" /> {counts.up}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown className="w-3 h-3 text-blood" /> {counts.down}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Share Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(wishlist.share_token, wishlist.id);
                      }}
                      className="p-2 text-stone-light hover:text-fire transition-colors"
                      title={wishlistText.shareWishlist}
                    >
                      {copiedId === wishlist.id ? (
                        <Check className="w-4 h-4 text-moss" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(wishlist.id);
                      }}
                      className="p-2 text-stone-light hover:text-blood transition-colors"
                      title={wishlistText.deleteWishlist}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    {/* Expand/Collapse */}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-light" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-light" />
                    )}
                  </div>
                </div>

                {/* Expanded Items */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-dark">
                    {wishlistItems.length === 0 ? (
                      <p className="text-stone-light text-sm text-center py-4">
                        No things in this cave painting yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {wishlistItems.map((item) => (
                          <div 
                            key={item.id} 
                            className={`flex items-center gap-3 p-2 rounded-stone ${
                              item.vote === 'up' ? 'bg-moss/10' : 
                              item.vote === 'down' ? 'bg-blood/10' : 
                              'bg-stone-dark/30'
                            }`}
                          >
                            {/* Product Image */}
                            <div className="w-12 h-12 bg-bone/90 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {item.product.image_url ? (
                                <img 
                                  src={item.product.image_url} 
                                  alt={item.product.real_name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              ) : (
                                <span className="text-xl opacity-30">🎁</span>
                              )}
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-grow min-w-0">
                              <p className="font-grug text-sand text-sm truncate">
                                {item.product.grug_name}
                              </p>
                              <p className="text-xs text-stone-light truncate">
                                £{item.product.price}
                              </p>
                            </div>
                            
                            {/* Vote Status */}
                            {item.vote && (
                              <div className={`flex items-center gap-1 text-xs ${
                                item.vote === 'up' ? 'text-moss' : 'text-blood'
                              }`}>
                                {item.vote === 'up' ? (
                                  <><ThumbsUp className="w-4 h-4" /> Like!</>
                                ) : (
                                  <><ThumbsDown className="w-4 h-4" /> No</>
                                )}
                              </div>
                            )}
                            
                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <a
                                href={item.product.amazon_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-stone-light hover:text-fire"
                                title="View on Amazon"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleRemoveItem(wishlist.id, item.product_id)}
                                className="p-1.5 text-stone-light hover:text-blood"
                                title="Remove"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Share Link */}
                    <div className="mt-4 pt-3 border-t border-stone-dark">
                      <p className="text-xs text-stone-light mb-2">Share link with womanfolk:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-grow bg-stone-dark/50 px-3 py-2 rounded text-xs text-sand truncate">
                          {`${typeof window !== 'undefined' ? window.location.origin : ''}/cave-painting/${wishlist.share_token}`}
                        </code>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleCopyLink(wishlist.share_token, wishlist.id)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
