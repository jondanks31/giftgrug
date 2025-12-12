'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Loader2 } from 'lucide-react';

interface ScribblesImageUploadProps {
  onUpload: (publicUrl: string) => void;
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Could not compress image'));
        },
        'image/webp',
        quality
      );
    };
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = URL.createObjectURL(file);
  });
}

export function ScribblesImageUpload({ onUpload }: ScribblesImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Grug only accept picture files!');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Picture too big! Max 10MB.');
      return;
    }

    setUploading(true);

    try {
      const compressedBlob = await compressImage(file);
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const filename = `${timestamp}-${randomId}.webp`;

      const { data, error: uploadError } = await supabase.storage
        .from('scribbles-images')
        .upload(filename, compressedBlob, {
          contentType: 'image/webp',
          cacheControl: '31536000',
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('scribbles-images')
        .getPublicUrl(data.path);

      onUpload(urlData.publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Grug fail to upload. Try again?');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-stone border border-stone-dark text-stone-light hover:text-sand hover:bg-stone-dark/40 cursor-pointer transition-colors">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      {uploading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Upload className="w-4 h-4" />
      )}
      Upload Image
    </label>
  );
}
