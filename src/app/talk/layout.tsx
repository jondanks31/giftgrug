import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talk to Grug',
  description: 'Ask Grug anything. Life advice, product picks, cooking tips, and more. Simple answers from a simple caveman.',
  openGraph: {
    title: 'Talk to Grug',
    description: 'Ask Grug anything. Simple answers from a simple caveman.',
  },
};

export default function TalkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
