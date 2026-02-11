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
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini-2025-08-07',
      messages: openaiMessages,
      max_tokens: 500,
      temperature: 0.8,
      stream: true,
    });

    // Create a ReadableStream from the OpenAI stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
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
