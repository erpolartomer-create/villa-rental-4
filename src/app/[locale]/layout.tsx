import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/lib/i18n/config'
import { Locale } from '@/types/villa'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ChatBot } from '@/components/ChatBot'
import { StoreHydration } from '@/components/StoreHydration'
import { Toaster } from 'sonner'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.hero' })

  const titles: Record<string, string> = {
    tr: 'Kaş & Kalkan Villa Kiralama | Lüks Tatil Villaları',
    en: 'Kaş & Kalkan Villa Rental | Luxury Holiday Villas',
    ru: 'Аренда Вилл Каш и Калкан | Роскошные Виллы',
  }
  const descriptions: Record<string, string> = {
    tr: 'Kaş ve Kalkan\'ın en güzel villalarını keşfedin. Lüks, balayı, deniz manzaralı, aile villaları. Ücretsiz danışma ve rezervasyon.',
    en: 'Discover the most beautiful villas in Kaş and Kalkan. Luxury, honeymoon, sea view, family villas. Free consultation and booking.',
    ru: 'Откройте для себя лучшие виллы Каша и Калкана. Люкс, медовый месяц, вид на море, семейные виллы.',
  }

  return {
    title: { default: titles[locale] || titles.en, template: `%s | Kaş & Kalkan Villas` },
    description: descriptions[locale] || descriptions.en,
    keywords: 'villa kiralama, kalkan villa, kaş villa, turkey villa rental, luxury villa',
    openGraph: {
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : locale === 'ru' ? 'ru_RU' : 'en_US',
      siteName: 'Kaş & Kalkan Villa Rental',
      images: [{ url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
    alternates: {
      languages: {
        'tr': '/tr',
        'en': '/en',
        'ru': '/ru',
      }
    },
    robots: { index: true, follow: true },
  }
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <StoreHydration />
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ChatBot />
      <Toaster position="top-right" richColors />
    </NextIntlClientProvider>
  )
}
