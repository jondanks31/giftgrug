import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { FREE_MESSAGE_LIMIT, SIGNED_IN_MESSAGE_LIMIT } from '@/lib/grug-chat';
import { createClient as createServerClient } from '@/lib/supabase/server';

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + (process.env.SUPABASE_SERVICE_ROLE_KEY || 'salt'));
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function GET(request: NextRequest) {
  try {
    // Without service role key, return defaults (dev environment)
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ remaining: 99, limit: 99, used: 0, isAdmin: false });
    }

    const supabaseAuth = createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let identifier: string;
    let identifierType: 'user' | 'ip';
    let limit: number;
    let isAdmin = false;

    if (user) {
      identifier = user.id;
      identifierType = 'user';
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single() as { data: { is_admin: boolean } | null };
      isAdmin = profile?.is_admin === true;
      limit = SIGNED_IN_MESSAGE_LIMIT;
    } else {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';
      identifier = await hashIP(ip);
      identifierType = 'ip';
      limit = FREE_MESSAGE_LIMIT;
    }

    if (isAdmin) {
      return NextResponse.json({ remaining: -1, limit: -1, used: 0, isAdmin: true });
    }

    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabaseAdmin
      .from('chat_usage')
      .select('message_count')
      .eq('identifier', identifier)
      .eq('identifier_type', identifierType)
      .eq('message_date', today)
      .single() as { data: { message_count: number } | null };

    const used = usage?.message_count || 0;
    return NextResponse.json({
      remaining: Math.max(0, limit - used),
      limit,
      used,
      isAdmin: false,
    });
  } catch (error) {
    console.error('Usage check error:', error);
    return NextResponse.json({ remaining: 5, limit: 5, used: 0, isAdmin: false });
  }
}
