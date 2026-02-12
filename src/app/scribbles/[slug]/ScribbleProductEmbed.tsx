import { createClient } from '@/lib/supabase/server';
import { ExternalLink } from 'lucide-react';

export async function ScribbleProductEmbed({ productId }: { productId: string }) {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (!data) {
    return (
      <div className="bg-stone-dark/30 rounded-stone p-4 border border-stone-dark/50">
        <p className="text-stone-light text-sm flex items-center gap-2"><img src="/grug_avatar.png" alt="Grug" className="h-6 w-auto inline-block" /> Grug try find product. Grug fail. Maybe product gone?</p>
      </div>
    );
  }

  return (
    <div className={`rounded-stone border overflow-hidden ${
      data.is_grug_pick 
        ? 'border-fire/40 bg-gradient-to-br from-cave to-fire/5' 
        : 'border-stone-dark/50 bg-stone-dark/20'
    }`}>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-40 md:w-48 flex-shrink-0 bg-bone/95 flex items-center justify-center p-4">
          {data.image_url ? (
            <img
              src={data.image_url}
              alt={data.real_name}
              className="w-full h-32 sm:h-36 object-contain drop-shadow-md"
            />
          ) : (
            <span className="text-5xl opacity-40">🎁</span>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              {data.is_grug_pick && (
                <span className="inline-block text-xs bg-fire/20 text-fire px-2 py-0.5 rounded-full mb-2">
                  <img src="/grug_avatar.png" alt="Grug" className="h-5 w-auto inline-block align-middle" /> Grug Pick
                </span>
              )}
              <h4 className="font-grug text-lg text-sand leading-tight">{data.grug_name}</h4>
              <p className="text-sm text-stone-light">({data.real_name})</p>
            </div>
            <span className="font-grug text-fire text-xl flex-shrink-0">£{data.price}</span>
          </div>

          {data.grug_says && (
            <p className="font-grug-speech text-sand/80 text-sm mb-4 flex-grow leading-relaxed">
              "{data.grug_says}"
            </p>
          )}

          <a
            href={data.amazon_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-fire hover:bg-fire/90 text-cave font-grug text-sm px-4 py-2.5 rounded-stone transition-colors w-full sm:w-auto"
          >
            Buy on Amazon
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
