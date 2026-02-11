'use client';

import Link from 'next/link';
import { MessageCircle, Mail, ShoppingBag, BookOpen, Lightbulb } from 'lucide-react';
import { Header, MobileNav, Footer } from '@/components';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { Button } from '@/components/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      {/* ────────── HERO ────────── */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 text-center px-6">
        <span className="text-7xl md:text-8xl block mb-8 select-none">🗿</span>

        <h1 className="font-grug text-3xl md:text-5xl text-sand leading-tight mb-5">
          Modern Life Too Complicated.
          <br />
          <span className="text-fire">Grug Help Make Simple.</span>
        </h1>

        <p className="text-stone-light text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-10">
          Too many choices. Too much noise. Grug cut through all that.
          Simple advice, cool things, no overthinking.
        </p>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
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

      {/* ────────── FEATURES ────────── */}
      <section className="py-16 md:py-24 border-t border-stone-dark/40">
        <div className="max-w-3xl mx-auto px-6 space-y-20">

          {/* Feature 1: Grug Give Advice */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="bg-fire/10 rounded-2xl p-4 shrink-0">
              <Lightbulb className="w-8 h-8 text-fire" />
            </div>
            <div>
              <h2 className="font-grug text-2xl text-sand mb-3">Grug Give Advice</h2>
              <p className="text-stone-light leading-relaxed mb-2">
                World too confusing. Too many options, too many opinions, too many 
                people telling man what to do. Grug think this wrong.
              </p>
              <p className="text-stone-light leading-relaxed mb-4">
                Man ask Grug question, Grug give simple answer. No waffle. 
                No "it depends". Just straight talk from caveman who keep things simple.
              </p>
              <Link href="/talk" className="font-grug text-sm text-fire hover:text-fire-light transition-colors">
                TALK TO GRUG →
              </Link>
            </div>
          </div>

          {/* Feature 2: Grug Find Cool Things */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="bg-fire/10 rounded-2xl p-4 shrink-0">
              <ShoppingBag className="w-8 h-8 text-fire" />
            </div>
            <div>
              <h2 className="font-grug text-2xl text-sand mb-3">Grug Find Cool Things</h2>
              <p className="text-stone-light leading-relaxed mb-2">
                Grug find things tribe might like. No junk. Just good.
                Cool sticks. Nice rocks. Useful stuff.
              </p>
              <p className="text-stone-light leading-relaxed mb-4">
                Every thing in Grug cave is something Grug actually think is worth having.
                If Grug wouldn't use it, Grug not put it in cave.
              </p>
              <Link href="/hunt" className="font-grug text-sm text-fire hover:text-fire-light transition-colors">
                SEE WHAT GRUG FOUND →
              </Link>
            </div>
          </div>

          {/* Feature 3: Grug Write Things Down */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="bg-fire/10 rounded-2xl p-4 shrink-0">
              <BookOpen className="w-8 h-8 text-fire" />
            </div>
            <div>
              <h2 className="font-grug text-2xl text-sand mb-3">Grug Write Things Down</h2>
              <p className="text-stone-light leading-relaxed mb-2">
                Sometimes Grug have thoughts. Big thoughts. Small thoughts.
                Grug scratch them onto cave wall so tribe can read later.
              </p>
              <p className="text-stone-light leading-relaxed mb-4">
                Guides, opinions, random wisdom — Grug scribbles are for anyone 
                who want a simpler take on complicated stuff.
              </p>
              <Link href="/scribbles" className="font-grug text-sm text-fire hover:text-fire-light transition-colors">
                READ GRUG SCRIBBLES →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── NEWSLETTER ────────── */}
      <section id="tribe" className="py-16 md:py-24 border-t border-stone-dark/40">
        <div className="max-w-xl mx-auto px-6">
          <NewsletterSignup variant="full" />
        </div>
      </section>

      <Footer />
      <MobileNav />
    </div>
  );
}
