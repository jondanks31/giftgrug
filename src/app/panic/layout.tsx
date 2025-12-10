import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PANIC MODE - Last Minute Gifts - GiftGrug',
  description: 'Forgot a birthday or anniversary? Don\'t panic! Quick gift ideas that arrive fast. Gift cards, flowers, chocolates and more emergency options.',
  openGraph: {
    title: 'PANIC MODE - Last Minute Gifts',
    description: 'Forgot a birthday or anniversary? Quick gift ideas that arrive fast.',
  },
};

export default function PanicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
