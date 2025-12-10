'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card } from '@/components/ui';
import { GrugMascot } from '@/components/GrugMascot';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot';

const grugAuthText = {
  login: {
    title: 'MAN ENTER CAVE',
    subtitle: 'Grug remember man. Man prove identity.',
    button: 'ENTER CAVE',
    switchText: 'Man not have cave?',
    switchButton: 'MAKE NEW CAVE',
    grugMessage: 'Grug check if man real. Enter secret words.',
  },
  signup: {
    title: 'MAN MAKE NEW CAVE',
    subtitle: 'Grug help man build cave. Just need few things.',
    button: 'BUILD CAVE',
    switchText: 'Man already have cave?',
    switchButton: 'ENTER OLD CAVE',
    grugMessage: 'New cave! Exciting. Grug help man set up.',
  },
  forgot: {
    title: 'MAN FORGET SECRET WORDS?',
    subtitle: 'Happen to best caveman. Grug send new words.',
    button: 'SEND MAGIC LETTER',
    switchText: 'Man remember now?',
    switchButton: 'GO BACK',
    grugMessage: 'Grug send bird with new secret words to man fire-letter box.',
  },
};

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grugName, setGrugName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();
  const text = grugAuthText[mode];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Redirect happens via auth state change
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              grug_name: grugName || 'Cave Dweller',
            },
          },
        });
        if (error) throw error;
        setMessage('Grug send bird to man fire-letter! Check inbox (and junk cave - sometimes bird get lost there) then click magic rock to enter cave.');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/cave/reset-password`,
        });
        if (error) throw error;
        setMessage('Bird sent! Check fire-letter box (and junk cave) for magic rock link.');
      }
    } catch (err: any) {
      // Translate errors to Grug speak
      let grugError = err.message;
      if (err.message.includes('Invalid login credentials')) {
        grugError = 'Grug not recognize man. Wrong secret words or fire-letter.';
      } else if (err.message.includes('Email not confirmed')) {
        grugError = 'Man not click magic link in fire-letter yet!';
      } else if (err.message.includes('already registered')) {
        grugError = 'This fire-letter already have cave. Man try enter instead?';
      }
      setError(grugError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError('Grug confused. Try again?');
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <GrugMascot 
          size="sm" 
          customMessage={text.grugMessage}
        />
        <h1 className="font-grug text-2xl text-sand mt-4">{text.title}</h1>
        <p className="text-stone-light text-sm mt-1">{text.subtitle}</p>
      </div>

      {error && (
        <div className="bg-blood/20 border border-blood rounded-stone p-3 mb-4">
          <p className="text-blood text-sm font-scribble">{error}</p>
        </div>
      )}

      {message && (
        <div className="bg-moss/20 border border-moss rounded-stone p-3 mb-4">
          <p className="text-moss-light text-sm font-scribble">{message}</p>
          <p className="text-moss-light/70 text-xs mt-2">
            After clicking magic rock, come back and{' '}
            <button 
              type="button"
              onClick={() => setMode('login')} 
              className="text-fire underline hover:text-fire-light"
            >
              enter cave here
            </button>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm text-stone-light mb-1">
              What Grug call man? (Cave Name)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-light" />
              <Input
                type="text"
                placeholder="Strong Rock Crusher"
                value={grugName}
                onChange={(e) => setGrugName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm text-stone-light mb-1">
            Man's Fire-Letter (Email)
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-light" />
            <Input
              type="email"
              placeholder="man@cave.rock"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        {mode !== 'forgot' && (
          <div>
            <label className="block text-sm text-stone-light mb-1">
              Secret Cave Words (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-light" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-light hover:text-sand"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs text-fire hover:text-fire-light mt-1"
              >
                Man forget secret words?
              </button>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Grug thinking...' : text.button}
        </Button>
      </form>

      {/* Google login - uncomment when ready
      {mode !== 'forgot' && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-stone-dark text-stone-light">
                or use magic rock
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google Rock
          </Button>
        </>
      )}
      */}

      <div className="text-center mt-6">
        <p className="text-stone-light text-sm">{text.switchText}</p>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : mode === 'signup' ? 'login' : 'login')}
          className="text-fire hover:text-fire-light font-grug text-sm mt-1"
        >
          {text.switchButton}
        </button>
      </div>
    </Card>
  );
}
