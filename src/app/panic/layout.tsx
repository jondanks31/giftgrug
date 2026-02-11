import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GRUG HELP NOW - Emergency Mode',
  description: 'Man in trouble? Grug drop everything and help fast. Quick gift ideas, last-minute saves, and emergency solutions.',
  openGraph: {
    title: 'GRUG HELP NOW - Emergency Mode',
    description: 'Man in trouble? Grug drop everything and help fast.',
  },
};

export default function PanicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
