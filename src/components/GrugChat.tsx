'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle, LogIn, Mail } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { GrugMascot } from '@/components/GrugMascot';
import { chatText } from '@/lib/grug-dictionary';
import { FREE_MESSAGE_LIMIT, generateSessionId, type ChatMessageUI } from '@/lib/grug-chat';
import { useAuth } from '@/components/auth';
import Link from 'next/link';

export function GrugChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageUI[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => generateSessionId());
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(FREE_MESSAGE_LIMIT);
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isGated = remaining !== null && remaining <= 0 && !isAdmin;

  // Fetch usage from server on mount and when user changes
  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await fetch('/api/chat/usage');
        if (res.ok) {
          const data = await res.json();
          setRemaining(data.remaining);
          setLimit(data.limit);
          setIsAdmin(data.isAdmin);
        }
      } catch {
        // If usage check fails, allow messages (fail open)
      }
    }
    fetchUsage();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading || isGated) return;

    setError(null);
    const userMessage: ChatMessageUI = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: content.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    if (remaining !== null && !isAdmin) setRemaining(prev => prev !== null ? prev - 1 : prev);
    setIsLoading(true);

    // Create placeholder for assistant response
    const assistantId = `assistant_${Date.now()}`;
    setMessages([...newMessages, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          sessionId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || chatText.error);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

          for (const line of lines) {
            const data = line.replace('data: ', '');
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantId ? { ...m, content: assistantContent } : m
                  )
                );
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || chatText.error);
      // Remove empty assistant message on error
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
      // Re-fetch actual usage from server
      try {
        const res = await fetch('/api/chat/usage');
        if (res.ok) {
          const data = await res.json();
          setRemaining(data.remaining);
          setLimit(data.limit);
          setIsAdmin(data.isAdmin);
        }
      } catch {}
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleStarter = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <GrugMascot situation="chatting" size="lg" />
            
            <h2 className="font-grug text-2xl text-sand mt-6 mb-2">
              {chatText.pageTitle}
            </h2>
            <p className="text-stone-light mb-8 max-w-md mx-auto">
              {chatText.pageSubtitle}
            </p>

            {/* Conversation Starters */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
              {chatText.starters.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleStarter(starter.message)}
                  className="bg-stone-dark/50 hover:bg-stone-dark border border-stone-dark hover:border-fire/30 rounded-rock p-3 text-left transition-all"
                >
                  <span className="text-sm text-sand">{starter.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-rock px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-fire/20 border border-fire/30 text-sand'
                  : 'bg-stone-dark border border-stone-dark text-sand'
              }`}
            >
              {message.role === 'assistant' && (
                <span className="text-lg mr-2">🗿</span>
              )}
              <div className="font-grug-speech text-sm leading-relaxed whitespace-pre-wrap">
                {message.content || (
                  <span className="flex items-center gap-2 text-stone-light">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {chatText.thinking}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {error && (
          <div className="flex justify-center">
            <div className="bg-blood/20 border border-blood rounded-stone p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blood" />
              <p className="text-blood text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Signup Gate */}
        {isGated && (
          <Card className="text-center py-6 mx-auto max-w-md">
            <GrugMascot size="sm" customMessage={chatText.freeMessagesUsed} />
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Link href="/cave">
                <Button size="sm" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  {chatText.signUpPrompt}
                </Button>
              </Link>
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {chatText.newsletterPrompt}
              </Button>
            </div>
          </Card>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-stone-dark pt-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isGated ? 'Sign up to keep talking...' : chatText.inputPlaceholder}
            disabled={isLoading || isGated}
            className="flex-grow"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading || isGated}
            className="px-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        {!isAdmin && !isGated && remaining !== null && remaining > 0 && remaining < limit && (
          <p className="text-stone-light/50 text-xs mt-2 text-center">
            {remaining} {user ? 'messages' : 'free messages'} left today
          </p>
        )}
      </div>
    </div>
  );
}
