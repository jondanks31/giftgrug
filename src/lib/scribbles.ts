export type ScribblePost = {
  slug: string;
  title: string;
  publishedAt: string; // ISO date (YYYY-MM-DD)
  excerpt: string;
  paragraphs: string[];
};

const posts: ScribblePost[] = [
  {
    slug: 'why-grug-make-scribbles',
    title: 'Why Grug Make Scribbles',
    publishedAt: '2025-12-12',
    excerpt: 'Man ask Grug many question. Grug write answer on cave wall so man no forget.',
    paragraphs: [
      'Once upon time, man ask Grug same thing every sun. Grug get tired. Grug decide: Grug scribble on cave wall.',
      'Scribbles is where Grug put thoughts, gift tricks, and warning for man. Simple. Short. Like club.',
      'If man read Scribbles, man have better chance not mess up special sun. Grug proud.',
    ],
  },
  {
    slug: 'three-gift-rules-grug-never-break',
    title: 'Three Gift Rules Grug Never Break',
    publishedAt: '2025-12-10',
    excerpt: 'Grug have rules. Rules keep man safe from womanfolk disappointment face.',
    paragraphs: [
      'Rule one: listen to womanfolk. If she say “I like this”, Grug believe her. If she say “no want”, Grug also believe her.',
      'Rule two: do not wait for last sun. Shipping slow. Panic big. Man cry.',
      'Rule three: if unsure, pick something she use every sun. Cozy, smell good, shiny rock. Simple.',
    ],
  },
];

export function getAllScribbles(): ScribblePost[] {
  return [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getScribbleBySlug(slug: string): ScribblePost | null {
  return posts.find((p) => p.slug === slug) ?? null;
}
