'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { getFeaturedVillas } from '@/lib/data/villas'
import { VillaCard } from '@/components/villa/VillaCard'
import { ArrowRight, Sparkles } from 'lucide-react'

export function PopularVillas() {
  const t = useTranslations('home.featured')
  const locale = useLocale()
  const villas = getFeaturedVillas().slice(0, 6)

  return (
    <section className="section-padding bg-white">
      <div className="container-villa">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            {/* Badge — WizardCTA gold style */}
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              <Sparkles size={11} />
              Seçkin Villalar
            </div>
            <h2 className="heading-section text-[#1c1712]">{t('title')}</h2>
            <p className="text-[#9b9389] text-sm mt-2 max-w-md leading-relaxed">
              Kaş ve Kalkan&apos;ın en seçkin villalarını keşfedin, hayalinizdeki tatil sizi bekliyor.
            </p>
          </div>
          <Link
            href={`/${locale}/villas`}
            className="group hidden sm:inline-flex items-center gap-3 px-6 py-3 bg-[#c8892a]/15 hover:bg-[#c8892a] border border-[#c8892a]/30 hover:border-[#c8892a] text-[#c8892a] hover:text-white font-semibold text-sm rounded-2xl transition-all duration-300 whitespace-nowrap"
          >
            {t('viewAll')}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Villa grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {villas.map(villa => (
            <VillaCard key={villa.id} villa={villa} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href={`/${locale}/villas`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold rounded-2xl transition-all shadow-[0_8px_32px_rgba(200,137,42,0.45)] hover:shadow-[0_12px_40px_rgba(200,137,42,0.6)] text-sm"
          >
            {t('viewAll')}
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>

  )
}
