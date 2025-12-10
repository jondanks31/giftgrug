'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  currentUrl: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

// Compress image before upload
async function compressImage(file: File, maxWidth = 800, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Scale down if wider than maxWidth
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

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not compress image'));
          }
        },
        'image/webp',
        quality
      );
    };
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = URL.createObjectURL(file);
  });
}

export function ImageUpload({ currentUrl, onUpload, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Grug only accept picture files!');
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError('Picture too big! Max 10MB.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Compress the image
      const compressedBlob = await compressImage(file);
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const filename = `${timestamp}-${randomId}.webp`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filename, compressedBlob, {
          contentType: 'image/webp',
          cacheControl: '31536000', // 1 year cache
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      onUpload(urlData.publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Grug fail to upload. Try again?');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function handleRemove() {
    if (!currentUrl) return;

    // Extract filename from URL
    const urlParts = currentUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    try {
      await supabase.storage.from('product-images').remove([filename]);
    } catch (err) {
      console.error('Delete error:', err);
    }

    onRemove();
  }

  return (
    <div className="space-y-2">
      {currentUrl ? (
        <div className="relative inline-block">
          <img
            src={currentUrl}
            alt="Product"
            className="w-32 h-32 object-contain bg-cave rounded-stone"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-blood text-bone rounded-full p-1 hover:bg-blood/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-32 h-32 bg-cave border-2 border-dashed border-stone-light/30 rounded-stone cursor-pointer hover:border-fire/50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="w-8 h-8 text-stone-light animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-stone-light mb-2" />
              <span className="text-xs text-stone-light">Upload</span>
            </>
          )}
        </label>
      )}

      {error && (
        <p className="text-blood text-xs">{error}</p>
      )}

      <p className="text-xs text-stone-light">
        Auto-compressed to WebP (max 800px wide)
      </p>
    </div>
  );
}
