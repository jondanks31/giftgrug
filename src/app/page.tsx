'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageCircle, Mail, ShoppingBag, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';
import { Header, MobileNav, Footer } from '@/components';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { Button } from '@/components/ui';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          // Also reveal staggered children
          el.querySelectorAll('.reveal').forEach((child) => child.classList.add('visible'));
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function HomePage() {
  const featuresRef = useReveal();
  const newsletterRef = useReveal();

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      {/* ────────── HERO ────────── */}
      <section className="pt-5 pb-6 md:pt-16 md:pb-16 text-center px-6">
        {/* Mascot with glow */}
        <div className="hero-enter inline-block">
          <div className="inline-block">
            <img src="/grug_avatar.png" alt="Grug" className="h-28 md:h-44 w-auto select-none" />
          </div>
        </div>

        <h1 className="hero-enter-delay-1 font-grug text-3xl md:text-6xl text-sand leading-tight mt-1 md:mt-8 mb-2 md:mb-6">
          Modern Life Hard.
          <br />
          <span className="text-fire">Grug Help Make Simple.</span>
        </h1>

        <p className="hero-enter-delay-2 text-stone-light text-sm md:text-lg max-w-lg mx-auto leading-relaxed mb-5 md:mb-12">
          Too many choices. Too much noise. Grug cut through all that.
          <br className="hidden sm:block" />
          Simple advice, cool things, no overthinking.
        </p>

        {/* Dual CTA */}
        <div className="hero-enter-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link href="/talk" className="w-full sm:w-auto">
            <Button size="lg" className="w-full flex items-center justify-center gap-2.5 text-base px-8 py-4">
              <MessageCircle className="w-5 h-5" />
              Talk to Grug
            </Button>
          </Link>
          <a href="#tribe" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full flex items-center justify-center gap-2.5 text-base px-8 py-4">
              <Mail className="w-5 h-5" />
              Join Tribe
            </Button>
          </a>
        </div>

      </section>

      {/* ────────── DIVIDER ────────── */}
      <div className="cave-divider"><span className="cave-divider-center" /></div>

      {/* ────────── FEATURES ────────── */}
      <section className="py-16 md:py-24">
        <div ref={featuresRef} className="reveal-stagger max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Feature 1: Grug Give Advice */}
          <div className="reveal group rounded-rock bg-[#2e2924] border border-stone-dark/40 p-6 flex flex-col">
            <div className="icon-cave shrink-0 self-start mb-4">
              <Lightbulb className="w-7 h-7 text-fire" />
            </div>
            <h2 className="font-grug text-lg md:text-xl text-sand mb-3">Grug Give Advice</h2>
            <p className="text-stone-light text-sm leading-relaxed mb-4 flex-grow">
              World too confusing. Too many options. Man ask Grug question, Grug give simple answer. No waffle. Just straight talk from caveman who keep things simple.
            </p>
            <Link href="/talk" className="inline-flex items-center gap-2 font-grug text-sm text-fire hover:text-fire-light transition-all group-hover:gap-3">
              TALK TO GRUG <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Feature 2: Grug Find Cool Things */}
          <div className="reveal group rounded-rock bg-[#2e2924] border border-stone-dark/40 p-6 flex flex-col">
            <div className="icon-cave shrink-0 self-start mb-4">
              <ShoppingBag className="w-7 h-7 text-fire" />
            </div>
            <h2 className="font-grug text-lg md:text-xl text-sand mb-3">Grug Find Cool Things</h2>
            <p className="text-stone-light text-sm leading-relaxed mb-4 flex-grow">
              Grug find things tribe might like. No junk. Just good. Every thing in Grug cave is something Grug actually think is worth having.
            </p>
            <Link href="/hunt" className="inline-flex items-center gap-2 font-grug text-sm text-fire hover:text-fire-light transition-all group-hover:gap-3">
              SEE WHAT GRUG FOUND <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Feature 3: Grug Write Things Down */}
          <div className="reveal group rounded-rock bg-[#2e2924] border border-stone-dark/40 p-6 flex flex-col">
            <div className="icon-cave shrink-0 self-start mb-4">
              <BookOpen className="w-7 h-7 text-fire" />
            </div>
            <h2 className="font-grug text-lg md:text-xl text-sand mb-3">Grug Write Things Down</h2>
            <p className="text-stone-light text-sm leading-relaxed mb-4 flex-grow">
              Sometimes Grug have thoughts. Big thoughts. Small thoughts. Grug scratch them onto cave wall so tribe can read later.
            </p>
            <Link href="/scribbles" className="inline-flex items-center gap-2 font-grug text-sm text-fire hover:text-fire-light transition-all group-hover:gap-3">
              READ GRUG SCRIBBLES <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ────────── DIVIDER ────────── */}
      <div className="cave-divider"><span className="cave-divider-center" /></div>

      {/* ────────── NEWSLETTER ────────── */}
      <section id="tribe" className="py-20 md:py-28">
        <div ref={newsletterRef} className="reveal max-w-xl mx-auto px-6">
          <div className="newsletter-glow">
            <NewsletterSignup variant="full" />
          </div>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </div>
  );
}
