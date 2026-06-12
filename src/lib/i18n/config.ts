import { Locale } from '@/types/villa'

export const locales: Locale[] = ['tr', 'en', 'ru']
export const defaultLocale: Locale = 'tr'

export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
  ru: 'Русский',
}

export const localeFlags: Record<Locale, string> = {
  tr: '🇹🇷',
  en: '🇬🇧',
  ru: '🇷🇺',
}

export const villasPathByLocale: Record<Locale, string> = {
  tr: 'villalar',
  en: 'villas',
  ru: 'villy',
}
