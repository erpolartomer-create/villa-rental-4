'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { getDiscountedVillas } from '@/lib/data/villas'
import { VillaCard } from '@/components/villa/VillaCard'
import { Locale } from '@/types/villa'
import { formatPrice } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currencyStore'
import { Tag, Clock, ArrowLeft, TrendingDown } from 'lucide-react'

export default function IndirimliVillalarPage() {
  const locale = useLocale() as Locale
  const villas = getDiscountedVillas()
  const { currency } = useCurrencyStore()

  const totalSavings = villas.reduce((sum, v) => {
    return sum + Math.round(v.basePricePerNight * ((v.discountPercent ?? 0) / 100))
  }, 0)

  return (
    <div className="min-h-screen" style={{ background: '#f7f5f0' }}>

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0608] via-[#2d0a0a] to-[#0e1a2e] py-16 sm:py-20">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-48 bg-red-600/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-40 bg-[#c8892a]/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 container-villa">
          {/* Breadcrumb */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            Ana Sayfa
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-red-400 text-xs font-bold tracking-widest uppercase mb-4 bg-red-500/15 border border-red-500/25 px-3.5 py-1.5 rounded-full">
                <Tag size={11} />
                Son Dakika Fırsatları
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                İndirimli Villalar
              </h1>
              <p className="text-white/50 text-base max-w-lg leading-relaxed">
                Kaş ve Kalkan&apos;ın en seçkin villalarında sınırlı süreli özel fiyatlar. Fırsatları kaçırmayın.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-stretch gap-4 shrink-0">
              <div className="bg-white/7 border border-white/10 rounded-2xl px-5 py-4 text-center">
                <div className="text-3xl font-black text-white mb-1">{villas.length}</div>
                <div className="text-white/40 text-xs">İndirimli Villa</div>
              </div>
              <div className="bg-white/7 border border-white/10 rounded-2xl px-5 py-4 text-center">
                <div className="text-3xl font-black text-emerald-400 mb-1">%{Math.max(...villas.map(v => v.discountPercent ?? 0))}</div>
                <div className="text-white/40 text-xs">Maks. İndirim</div>
              </div>
              <div className="bg-white/7 border border-white/10 rounded-2xl px-5 py-4 text-center flex items-center gap-3">
                <Clock size={18} className="text-red-400 shrink-0" />
                <div className="text-left">
                  <div className="text-white/40 text-[10px] uppercase tracking-wide font-semibold leading-none mb-1">Son tarih</div>
                  <div className="text-white font-bold text-sm">15 Haz 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings banner */}
      <div className="bg-emerald-600 py-3">
        <div className="container-villa flex items-center justify-center gap-2 text-white">
          <TrendingDown size={16} />
          <span className="text-sm font-semibold">
            Bu sayfalaki villalarda gecelik ortalama&nbsp;
            <strong>{formatPrice(Math.round(totalSavings / villas.length), currency)}</strong>
            &nbsp;tasarruf edin
          </span>
        </div>
      </div>

      {/* Villa grid */}
      <div className="section-padding">
        <div className="container-villa">
          {/* Sort / count bar */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-[#9b9389] text-sm">
              <span className="font-bold text-[#1c1712]">{villas.length}</span> indirimli villa bulundu
            </p>
            <div className="flex items-center gap-2 text-[#9b9389] text-xs bg-white border border-[#e8e3da] rounded-xl px-3 py-2">
              <Tag size={12} className="text-red-500" />
              En yüksek indirimler önce
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {villas
              .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
              .map(villa => (
                <VillaCard key={villa.id} villa={villa} />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
