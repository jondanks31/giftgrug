import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GRUG_SYSTEM_PROMPT } from '@/lib/grug-chat';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Grug brain not connected yet. Come back soon.' },
        { status: 503 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

    // Stream the response
    const model = process.env.OPENAI_MODEL || 'gpt-5-mini-2025-08-07';
    console.log('[Chat] Using model:', model);
    
    const stream = await openai.chat.completions.create({
      model,
      messages: openaiMessages,
      stream: true,
    });

    console.log('[Chat] Stream created successfully');

    // Create a ReadableStream from the OpenAI stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let chunkCount = 0;
          for await (const chunk of stream) {
            // Log first few chunks to debug structure
            if (chunkCount < 3) {
              console.log('[Chat] Chunk:', JSON.stringify(chunk.choices[0]));
            }
            const delta = chunk.choices[0]?.delta;
            const content = delta?.content || (delta as any)?.text;
            if (content) {
              chunkCount++;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          console.log('[Chat] Stream complete, chunks:', chunkCount);
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
