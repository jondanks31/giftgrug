import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/vote - Anonymous voting on wishlist items
// No auth required - anyone with the share link can vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, vote, shareToken } = body;

    // Validate inputs
    if (!itemId || !shareToken) {
      return NextResponse.json(
        { error: 'Missing itemId or shareToken' },
        { status: 400 }
      );
    }

    if (vote !== 'up' && vote !== 'down' && vote !== null) {
      return NextResponse.json(
        { error: 'Vote must be "up", "down", or null' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify the share token is valid and get the wishlist
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlists')
      .select('id')
      .eq('share_token', shareToken)
      .eq('is_active', true)
      .single();

    if (wishlistError || !wishlist) {
      return NextResponse.json(
        { error: 'Cave painting not found or no longer shared' },
        { status: 404 }
      );
    }

    // Verify the item belongs to this wishlist
    const { data: item, error: itemError } = await supabase
      .from('wishlist_items')
      .select('id, wishlist_id')
      .eq('id', itemId)
      .eq('wishlist_id', wishlist.id)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Thing not found in this cave painting' },
        { status: 404 }
      );
    }

    // Update the vote - using service role would be needed here
    // For now, we'll use a more permissive RLS policy
    const { error: updateError } = await supabase
      .from('wishlist_items')
      .update({
        vote,
        voted_at: vote ? new Date().toISOString() : null,
      })
      .eq('id', itemId);

    if (updateError) {
      console.error('Vote update error:', updateError);
      return NextResponse.json(
        { error: 'Grug confused. Vote not saved.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: vote === 'up' 
        ? 'Womanfolk like this thing!' 
        : vote === 'down' 
          ? 'Womanfolk not want this thing.' 
          : 'Vote removed.',
    });
  } catch (error) {
    console.error('Vote API error:', error);
    return NextResponse.json(
      { error: 'Something break. Grug sorry.' },
      { status: 500 }
    );
  }
}
