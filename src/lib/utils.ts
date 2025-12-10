import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(price);
}

export function generateAmazonAffiliateUrl(
  asin: string,
  associateId: string = process.env.AMAZON_ASSOCIATE_ID || 'giftgrug-21'
): string {
  return `https://www.amazon.co.uk/dp/${asin}?tag=${associateId}`;
}

export function generateAmazonSearchUrl(
  searchTerm: string,
  associateId: string = process.env.AMAZON_ASSOCIATE_ID || 'giftgrug-21'
): string {
  const encodedSearch = encodeURIComponent(searchTerm);
  return `https://www.amazon.co.uk/s?k=${encodedSearch}&tag=${associateId}`;
}
