'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { newsletterText } from '@/lib/grug-dictionary';
import { cn } from '@/lib/utils';

interface NewsletterSignupProps {
  variant?: 'full' | 'inline' | 'compact';
  className?: string;
}

export function NewsletterSignup({ variant = 'full', className }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    // TODO: Replace with Beehiiv API integration when publication ID is provided
    // For now, simulate success to show the UI flow
    try {
      // Placeholder: This will be replaced with actual Beehiiv API call
      // const response = await fetch(`https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      //   body: JSON.stringify({ email, utm_source: 'justgrug' }),
      // });
      
      console.log('Newsletter signup (placeholder):', email);
      
      // Simulate a brief delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStatus('success');
      setMessage(newsletterText.success);
      setEmail('');
    } catch {
      setStatus('error');
      setMessage(newsletterText.error);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={newsletterText.inputPlaceholder}
          required
          className="flex-grow text-sm"
          disabled={status === 'loading' || status === 'success'}
        />
        <Button
          type="submit"
          size="sm"
          disabled={!email.trim() || status === 'loading' || status === 'success'}
        >
          {status === 'success' ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
        </Button>
      </form>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('bg-stone-dark/50 border border-stone-dark rounded-rock p-4', className)}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🗿</span>
          <h3 className="font-grug text-sand text-sm">{newsletterText.heading}</h3>
        </div>
        <p className="text-stone-light text-xs mb-3">{newsletterText.subheading}</p>
        
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-moss text-sm">
            <Check className="w-4 h-4" />
            <span className="font-grug-speech">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={newsletterText.inputPlaceholder}
              required
              className="flex-grow text-sm"
              disabled={status === 'loading'}
            />
            <Button type="submit" size="sm" disabled={!email.trim() || status === 'loading'}>
              {status === 'loading' ? '...' : newsletterText.submitButton}
            </Button>
          </form>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-blood text-xs mt-2">
            <AlertCircle className="w-3 h-3" />
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={cn('bg-cave border-2 border-fire/20 rounded-rock p-6 md:p-8 text-center', className)}>
      <span className="text-5xl block mb-4">🗿</span>
      <h2 className="font-grug text-2xl text-sand mb-2">{newsletterText.heading}</h2>
      <p className="text-stone-light mb-6 max-w-md mx-auto font-grug-speech">
        {newsletterText.subheading}
      </p>

      {status === 'success' ? (
        <div className="flex items-center justify-center gap-2 text-moss text-lg">
          <Check className="w-5 h-5" />
          <span className="font-grug-speech">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={newsletterText.inputPlaceholder}
            required
            className="flex-grow text-center sm:text-left"
            disabled={status === 'loading'}
          />
          <Button type="submit" disabled={!email.trim() || status === 'loading'} className="whitespace-nowrap">
            {status === 'loading' ? 'Grug thinking...' : newsletterText.submitButton}
          </Button>
        </form>
      )}

      {status === 'error' && (
        <div className="flex items-center justify-center gap-2 text-blood text-sm mt-3">
          <AlertCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
