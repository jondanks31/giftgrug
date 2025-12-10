import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hunt for Gifts - GiftGrug',
  description: 'Browse gift ideas by category or search for the perfect present. Jewellery, perfume, bags, watches and more - all with Grug\'s seal of approval.',
  openGraph: {
    title: 'Hunt for Gifts - GiftGrug',
    description: 'Browse gift ideas by category or search for the perfect present.',
  },
};

export default function HuntLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
