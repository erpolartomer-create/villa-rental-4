'use client'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { CalendarDays } from 'lucide-react'
import { useCurrencyStore } from '@/store/currencyStore'
import { formatPrice } from '@/lib/utils'

interface Props {
  villaId: string
  basePricePerNight: number
  discountPercent?: number
  averageRating: number
  reviewCount: number
}

export function MobileStickyBar({
  villaId,
  basePricePerNight,
  discountPercent,
  averageRating,
  reviewCount,
}: Props) {
  const locale   = useLocale()
  const { currency } = useCurrencyStore()

  const displayPrice = discountPercent
    ? Math.round(basePricePerNight * (1 - discountPercent / 100))
    : basePricePerNight

  const scrollToCalendar = () => {
    document.getElementById('availability-calendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e8e3da] shadow-[0_-4px_24px_rgba(28,23,18,0.10)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">

        {/* Price */}
        <div className="flex-1 min-w-0">
          {discountPercent && discountPercent > 0 && (
            <div className="text-xs text-[#9b9389] line-through leading-none mb-0.5">
              {formatPrice(basePricePerNight, currency)}
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#1c1712]">
              {formatPrice(displayPrice, currency)}
            </span>
            <span className="text-xs text-[#9b9389]">/ gece</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <svg className="w-3 h-3 fill-[#c8892a] text-[#c8892a]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-xs font-semibold text-[#1c1712]">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-[#9b9389]">({reviewCount})</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Calendar scroll button */}
          <button
            onClick={scrollToCalendar}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-[#e8e3da] rounded-xl text-[#6b6154] hover:border-[#c8892a]/40 hover:text-[#c8892a] transition-all text-sm font-semibold"
          >
            <CalendarDays size={15} />
            <span className="hidden xs:inline">Takvim</span>
          </button>

          {/* Booking CTA */}
          <Link
            href={`/${locale}/booking/${villaId}`}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold rounded-xl transition-all text-sm shadow-[0_4px_16px_rgba(200,137,42,0.40)]"
          >
            Rezervasyon
          </Link>
        </div>
      </div>
    </div>
  )
}
