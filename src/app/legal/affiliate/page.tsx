import { Metadata } from 'next';
import { Header, MobileNav } from '@/components';
import { Card } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure - Grug',
  description: 'Grug affiliate disclosure and FTC compliance information.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-grug text-3xl text-sand mb-6 text-center">
          SHINY COINS DISCLOSURE
        </h1>

        {/* Grug intro */}
        <Card className="mb-8 text-center">
          <p className="font-grug-speech text-xl text-sand leading-relaxed">
            "Grug asked man in funny suit to give fancy words so Grug no get sued"
          </p>
          <p className="text-stone-light mt-2 text-sm">
            👇 The serious stuff is below 👇
          </p>
        </Card>

        {/* Actual legal content */}
        <div className="prose prose-invert prose-sand max-w-none space-y-6 text-bone/80">
          <section>
            <h2 className="font-grug text-xl text-sand">Affiliate Disclosure</h2>
            <p>
              Grug is a participant in the Amazon Services LLC Associates Programme, 
              an affiliate advertising programme designed to provide a means for sites to 
              earn advertising fees by advertising and linking to Amazon.co.uk.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">What This Means</h2>
            <p>
              When you click on product links on this website and make a purchase, we may 
              receive a small commission at no additional cost to you. This commission helps 
              us keep Grug running and continue providing recommendations.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Our Commitment</h2>
            <p>
              We only recommend products that we believe will be genuinely useful for our 
              visitors. Our recommendations are not influenced by the commission we may receive. 
              We strive to provide honest, helpful gift suggestions regardless of affiliate 
              relationships.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">FTC Compliance</h2>
            <p>
              In accordance with the Federal Trade Commission's 16 CFR Part 255, "Guides 
              Concerning the Use of Endorsements and Testimonials in Advertising," and the 
              UK's Consumer Protection from Unfair Trading Regulations 2008, we disclose that 
              we may receive compensation for products purchased through links on this site.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Amazon Trademark</h2>
            <p>
              Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. 
              As an Amazon Associate, Grug earns from qualifying purchases.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Questions?</h2>
            <p>
              If you have any questions about our affiliate relationships or this disclosure, 
              please contact us at hello@giftgrug.com.
            </p>
          </section>

          <p className="text-sm text-stone-light pt-4 border-t border-stone-dark">
            Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
