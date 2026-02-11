import { Metadata } from 'next';
import Link from 'next/link';
import { Header, MobileNav, Footer } from '@/components';
import { Button, Card } from '@/components/ui';
import { Heart, MessageCircle, Clock, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Grug',
  description: 'Grug help make modern life simple. Advice, cool things, and wisdom from a simple caveman.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Hero */}
        <section className="text-center mb-12">
          <span className="text-6xl block">🗿</span>
          
          <h1 className="font-grug text-3xl md:text-4xl text-sand mt-6 mb-4">
            THE GRUG STORY
          </h1>
        </section>

        {/* Origin Story */}
        <Card className="mb-8">
          <h2 className="font-grug text-xl text-fire mb-4">WHY GRUG EXIST?</h2>
          <div className="space-y-4 text-sand/90 font-grug-speech text-lg leading-relaxed">
            <p>
              Once upon time, man forget womanfolk birthday. Man panic. Man google 
              "gifts for wife" at 11pm. Man find 47 listicles that all say same thing. 
              Man still confused.
            </p>
            <p>
              Grug see this happen to many man. Then Grug think bigger: why man 
              struggle with so many things? Not just gifts. Life. Cooking. Fashion. 
              Everything have too many options and too many fancy words.
            </p>
            <p>
              So Grug make simple cave. Cave where man ask Grug anything and get 
              simple, honest answer. No judgement. No fancy words. Just Grug help.
            </p>
          </div>
        </Card>

        {/* How it works */}
        <section className="mb-12">
          <h2 className="font-grug text-2xl text-sand mb-6 text-center">HOW GRUG HELP</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="text-center">
              <MessageCircle className="w-10 h-10 text-fire mx-auto mb-3" />
              <h3 className="font-grug text-lg text-sand mb-2">TALK TO GRUG</h3>
              <p className="text-stone-light text-sm">
                Ask Grug anything. Gifts, life stuff, what to cook for dinner. 
                Grug not always smart but Grug always honest.
              </p>
            </Card>
            
            <Card className="text-center">
              <Sparkles className="w-10 h-10 text-fire mx-auto mb-3" />
              <h3 className="font-grug text-lg text-sand mb-2">SIMPLE WORDS</h3>
              <p className="text-stone-light text-sm">
                No fancy marketing speak. Grug tell man what thing is in words 
                man understand. Simple.
              </p>
            </Card>
            
            <Card className="text-center">
              <Clock className="w-10 h-10 text-fire mx-auto mb-3" />
              <h3 className="font-grug text-lg text-sand mb-2">GRUG HELP NOW</h3>
              <p className="text-stone-light text-sm">
                Man in trouble? Grug have emergency button. Fast answers, 
                quick fixes. Grug got man's back.
              </p>
            </Card>
            
            <Card className="text-center">
              <Heart className="w-10 h-10 text-fire mx-auto mb-3" />
              <h3 className="font-grug text-lg text-sand mb-2">DATE REMINDERS</h3>
              <p className="text-stone-light text-sm">
                Save special suns in cave. Grug remind man before it too late. 
                No more "I forgot" excuse.
              </p>
            </Card>
          </div>
        </section>

        {/* How Grug makes coins */}
        <Card className="mb-8 bg-cave border border-stone-dark">
          <h2 className="font-grug text-xl text-sand mb-3">HOW GRUG MAKE SHINY COINS</h2>
          <p className="text-stone-light">
            Grug sell cool things in cave store. Sometimes Grug recommend things 
            in scribbles and newsletter — if man buy, Grug get small commission. 
            This no cost man extra. It just how Grug keep fire burning.
          </p>
        </Card>

        {/* CTA */}
        <section className="text-center">
          <p className="font-grug-speech text-xl text-sand mb-6">
            "Enough talk. Man go ask Grug something. Or go hunt for things."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/talk">
              <Button size="lg">
                TALK TO GRUG
              </Button>
            </Link>
            <Link href="/hunt">
              <Button variant="secondary" size="lg">
                GO HUNT
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
