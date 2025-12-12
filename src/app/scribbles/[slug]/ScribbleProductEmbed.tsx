import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button, Card } from '@/components/ui';

export async function ScribbleProductEmbed({ productId }: { productId: string }) {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (!data) {
    return (
      <Card className="bg-stone-dark/40">
        <p className="text-stone-light text-sm">Grug try find product. Grug fail.</p>
      </Card>
    );
  }

  return (
    <Card variant={data.is_grug_pick ? 'featured' : 'default'} className="flex flex-col">
      <div className="bg-bone/95 rounded-stone h-48 flex items-center justify-center mb-4 overflow-hidden p-4">
        {data.image_url ? (
          <img
            src={data.image_url}
            alt={data.real_name}
            className="max-w-full max-h-full object-contain drop-shadow-md"
          />
        ) : (
          <span className="text-6xl opacity-30">🎁</span>
        )}
      </div>

      <h3 className="font-grug text-lg text-sand mb-1">{data.grug_name}</h3>
      <p className="text-sm text-stone-light mb-2">({data.real_name})</p>

      <p className="font-grug-speech text-sand/80 text-sm mb-4 flex-grow">"{data.grug_says}"</p>

      <div className="flex items-center justify-between mb-4">
        <span className="font-grug text-fire text-lg">£{data.price}</span>
      </div>

      <a href={data.amazon_url} target="_blank" rel="noopener noreferrer" className="block">
        <Button className="w-full">Buy on Amazon</Button>
      </a>

      <div className="mt-3 text-center">
        <Link href={`/hunt?q=${encodeURIComponent(data.real_name)}`} className="text-xs text-stone-light hover:text-fire">
          Find similar →
        </Link>
      </div>
    </Card>
  );
}
