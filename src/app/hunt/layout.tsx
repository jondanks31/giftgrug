import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hunt - Grug',
  description: 'Cool things Grug found. No junk. Just good sticks, nice rocks, useful stuff.',
  openGraph: {
    title: 'Hunt - Grug',
    description: 'Cool things Grug found. No junk. Just good.',
  },
};

export default function HuntLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
