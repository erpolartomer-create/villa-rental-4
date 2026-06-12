import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Currency } from '@/types/villa'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CURRENCY_RATES: Record<Currency, number> = {
  EUR: 1,
  TRY: 35.5,
  USD: 1.08,
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  TRY: '₺',
  USD: '$',
}

export function formatPrice(priceInEur: number, currency: Currency): string {
  const converted = priceInEur * CURRENCY_RATES[currency]
  const symbol = CURRENCY_SYMBOLS[currency]
  if (currency === 'TRY') {
    return `${Math.round(converted).toLocaleString('tr-TR')} ${symbol}`
  }
  return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function calculateNights(checkin: string, checkout: string): number {
  const start = new Date(checkin)
  const end = new Date(checkout)
  const diff = end.getTime() - start.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatDate(date: string | Date, locale = 'tr-TR'): string {
  return new Date(date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateStarArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push('full')
    else if (rating >= i - 0.5) stars.push('half')
    else stars.push('empty')
  }
  return stars
}
