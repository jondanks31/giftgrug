import { Metadata } from 'next';
import Link from 'next/link';
import { Header, MobileNav, GrugMascot } from '@/components';
import { Button, Card } from '@/components/ui';
import { Heart, Gift, Clock, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About GiftGrug - Our Story',
  description: 'GiftGrug helps clueless men find perfect gifts for the women in their lives. Simple, funny, actually useful.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Hero */}
        <section className="text-center mb-12">
          <GrugMascot size="lg" customMessage="Grug tell man story of how this cave born..." />
          
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
              Grug see this happen to many man. Grug think: "Why gift finding so hard? 
              Why every site use fancy words man no understand?"
            </p>
            <p>
              So Grug make simple cave. Cave have good things. Cave explain things 
              in way man understand. Cave help man not sleep on couch.
            </p>
          </div>
        </Card>

        {/* How it works */}
        <section className="mb-12">
          <h2 className="font-grug text-2xl text-sand mb-6 text-center">HOW GRUG HELP</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="text-center">
              <Gift className="w-10 h-10 text-fire mx-auto mb-3" />
              <h3 className="font-grug text-lg text-sand mb-2">CURATED PICKS</h3>
              <p className="text-stone-light text-sm">
                Grug hand-pick every thing. No random algorithm. Just good stuff 
                that actually make womanfolk happy.
              </p>
            </Card>
            
            <Card className="text-center">
              <Sparkles className="w-10 h-10 text-fire mx-auto mb-3" />
              <h3 className="font-grug text-lg text-sand mb-2">SIMPLE WORDS</h3>
              <p className="text-stone-light text-sm">
                No fancy marketing speak. Grug tell man what thing is and why 
                womanfolk like it. Simple.
              </p>
            </Card>
            
            <Card className="text-center">
              <Clock className="w-10 h-10 text-fire mx-auto mb-3" />
              <h3 className="font-grug text-lg text-sand mb-2">PANIC MODE</h3>
              <p className="text-stone-light text-sm">
                Forgot special day? Grug have emergency button. Fast things that 
                arrive quick. Grug got man's back.
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

        {/* Affiliate transparency */}
        <Card className="mb-8 bg-cave border border-stone-dark">
          <h2 className="font-grug text-xl text-sand mb-3">HOW GRUG MAKE SHINY COINS</h2>
          <p className="text-stone-light">
            When man click product and buy from Amazon, Grug get small commission. 
            This no cost man extra coins. It just how Grug keep cave running and 
            fire burning. Grug only recommend things Grug actually think good.
          </p>
          <Link href="/legal/affiliate" className="text-fire text-sm hover:underline mt-2 inline-block">
            Read full disclosure →
          </Link>
        </Card>

        {/* CTA */}
        <section className="text-center">
          <p className="font-grug-speech text-xl text-sand mb-6">
            "Enough talk. Man go find gift now. Womanfolk waiting."
          </p>
          <Link href="/hunt">
            <Button size="lg">
              START HUNTING
            </Button>
          </Link>
        </section>
      </div>

      <MobileNav />
    </div>
  );
}
