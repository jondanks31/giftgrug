import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { GRUG_SYSTEM_PROMPT, FREE_MESSAGE_LIMIT, SIGNED_IN_MESSAGE_LIMIT } from '@/lib/grug-chat';
import { createClient as createServerClient } from '@/lib/supabase/server';

// Hash IP for privacy (we don't store raw IPs)
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + (process.env.SUPABASE_SERVICE_ROLE_KEY || 'salt'));
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Grug brain not connected yet. Come back soon.' },
        { status: 503 }
      );
    }

    // Get user session if signed in
    const supabaseAuth = createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    // Rate limiting requires service role key
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    let supabaseAdmin: ReturnType<typeof createClient> | null = null;
    let identifier = '';
    let identifierType: 'user' | 'ip' = 'ip';
    let isAdmin = false;

    if (hasServiceKey) {
      supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      if (user) {
        identifier = user.id;
        identifierType = 'user';
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single() as { data: { is_admin: boolean } | null };
        isAdmin = profile?.is_admin === true;
      } else {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          || request.headers.get('x-real-ip')
          || 'unknown';
        identifier = await hashIP(ip);
        identifierType = 'ip';
      }

      const limit = user ? SIGNED_IN_MESSAGE_LIMIT : FREE_MESSAGE_LIMIT;

      // Check rate limit (skip for admins)
      if (!isAdmin) {
        const today = new Date().toISOString().split('T')[0];
        const { data: usage } = await supabaseAdmin
          .from('chat_usage')
          .select('message_count')
          .eq('identifier', identifier)
          .eq('identifier_type', identifierType)
          .eq('message_date', today)
          .single() as { data: { message_count: number } | null };

        const currentCount = usage?.message_count || 0;

        if (currentCount >= limit) {
          const errorMsg = user
            ? 'Grug tired. Grug already talk lots today. Come back tomorrow.'
            : 'Grug only talk to strangers a little bit. Sign up to talk more.';
          return NextResponse.json(
            { error: errorMsg, rateLimited: true, remaining: 0 },
            { status: 429 }
          );
        }
      }
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Man not say anything. Grug need words.' },
        { status: 400 }
      );
    }

    // Build the message history for OpenAI
    const openaiMessages = [
      { role: 'system' as const, content: GRUG_SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || 'gpt-5-mini-2025-08-07';
    const stream = await openai.chat.completions.create({
      model,
      messages: openaiMessages,
      stream: true,
    });

    // Increment usage count after successful API call (skip for admins)
    if (supabaseAdmin && !isAdmin) {
      const today = new Date().toISOString().split('T')[0];
      try {
        await (supabaseAdmin as any).rpc('increment_chat_usage', {
          p_identifier: identifier,
          p_identifier_type: identifierType,
          p_message_date: today,
        });
      } catch {
        // Non-critical: don't fail the request if usage tracking fails
      }
    }

    // Stream the response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;
            const content = delta?.content || (delta as any)?.text;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[Chat] Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Grug brain hurt. Try again?' },
      { status: 500 }
    );
  }
}
