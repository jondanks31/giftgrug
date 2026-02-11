import { Metadata } from 'next';
import { Header, MobileNav } from '@/components';
import { Card } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Privacy Policy - Grug',
  description: 'Grug privacy policy - how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-grug text-3xl text-sand mb-6 text-center">
          CAVE SECRETS POLICY
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
            <h2 className="font-grug text-xl text-sand">Introduction</h2>
            <p>
              Grug ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you visit our website giftgrug.com.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Information We Collect</h2>
            <h3 className="text-sand/80 text-lg">Account Information</h3>
            <p>
              When you create an account, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email address</li>
              <li>Display name (optional)</li>
              <li>Special dates you choose to save (birthdays, anniversaries, etc.)</li>
            </ul>

            <h3 className="text-sand/80 text-lg mt-4">Automatically Collected Information</h3>
            <p>
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>IP address (anonymised)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide and maintain our service</li>
              <li>Send you reminders about saved special dates (if enabled)</li>
              <li>Improve our website and user experience</li>
              <li>Respond to your enquiries</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> - For authentication and data storage (EU servers)</li>
              <li><strong>Amazon Associates</strong> - For affiliate product links</li>
              <li><strong>Google Analytics</strong> - For website analytics (if enabled)</li>
            </ul>
            <p className="mt-2">
              Each of these services has their own privacy policy governing their use of your data.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Cookies</h2>
            <p>
              We use essential cookies to keep you logged in and remember your preferences. 
              We may also use analytics cookies to understand how visitors use our site. 
              You can disable cookies in your browser settings, but this may affect 
              functionality.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. You can 
              delete your account at any time by contacting us, and we will remove your 
              data within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Your Rights (GDPR)</h2>
            <p>If you are in the UK or EU, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at hello@giftgrug.com.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Children's Privacy</h2>
            <p>
              Grug is not intended for children under 16. We do not knowingly collect 
              personal information from children under 16. If you believe we have collected 
              such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of 
              any changes by posting the new policy on this page and updating the "last 
              updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-grug text-xl text-sand">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: hello@giftgrug.com
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
