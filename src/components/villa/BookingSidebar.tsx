'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Calendar, Users, Minus, Plus, ChevronDown, Star, Phone, Mail } from 'lucide-react'
import { Villa, Locale } from '@/types/villa'
import { useBookingStore } from '@/store/bookingStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { formatPrice, calculateNights } from '@/lib/utils'

interface Props {
  villa: Villa
}

export function BookingSidebar({ villa }: Props) {
  const t = useTranslations('villa.sticky')
  const locale = useLocale() as Locale
  const { currency } = useCurrencyStore()
  const { checkin, checkout, adults, children, babies, setDates, setGuests, getNights } = useBookingStore()

  const [localCheckin, setLocalCheckin] = useState(checkin || '')
  const [localCheckout, setLocalCheckout] = useState(checkout || '')
  const [localAdults, setLocalAdults] = useState(adults)
  const [localChildren, setLocalChildren] = useState(children)
  const [guestsOpen, setGuestsOpen] = useState(false)

  useEffect(() => {
    if (localCheckin && localCheckout) {
      setDates(localCheckin, localCheckout)
    }
  }, [localCheckin, localCheckout])

  useEffect(() => {
    setGuests(localAdults, localChildren, babies)
  }, [localAdults, localChildren])

  const nights = localCheckin && localCheckout ? calculateNights(localCheckin, localCheckout) : 0

  // Get price for period (check pricing rules)
  const getPricePerNight = () => {
    if (!localCheckin || !localCheckout) return villa.basePricePerNight
    const checkinDate = new Date(localCheckin)
    const applicable = villa.pricingRules.find(rule => {
      const start = new Date(rule.startDate)
      const end = new Date(rule.endDate)
      return checkinDate >= start && checkinDate <= end
    })
    return applicable?.pricePerNight || villa.basePricePerNight
  }

  const pricePerNight = getPricePerNight()
  const nightsTotal = nights * pricePerNight
  const cleaningFee = villa.cleaningFee
  const grandTotal = nightsTotal + cleaningFee

  const totalGuests = localAdults + localChildren
  const maxGuests = villa.maxGuests

  const bookingUrl = `/${locale}/booking/${villa.id}?checkin=${localCheckin}&checkout=${localCheckout}&adults=${localAdults}&children=${localChildren}`

  return (
    <div className="sticky top-24 space-y-4">
      <div className="bg-white rounded-2xl border border-[#e8e3da] shadow-[0_4px_24px_rgba(28,23,18,0.09)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0e3d6e] text-white p-5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold">{formatPrice(pricePerNight, currency)}</span>
            <span className="text-white/60 text-sm">/ gece</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Star size={14} className="fill-[#c8892a] text-[#c8892a]" />
            <span className="font-semibold text-sm">{villa.averageRating}</span>
            <span className="text-white/50 text-sm">({villa.reviewCount} değerlendirme)</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[#9b9389] mb-1.5 flex items-center gap-1">
                <Calendar size={11} /> {t('checkin')}
              </label>
              <input
                type="date"
                value={localCheckin}
                onChange={e => setLocalCheckin(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-[#e8e3da] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0e3d6e] focus:ring-1 focus:ring-[#0e3d6e] text-[#1c1712]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#9b9389] mb-1.5 flex items-center gap-1">
                <Calendar size={11} /> {t('checkout')}
              </label>
              <input
                type="date"
                value={localCheckout}
                onChange={e => setLocalCheckout(e.target.value)}
                min={localCheckin || new Date().toISOString().split('T')[0]}
                className="w-full border border-[#e8e3da] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0e3d6e] focus:ring-1 focus:ring-[#0e3d6e] text-[#1c1712]"
              />
            </div>
          </div>

          {/* Guests selector */}
          <div className="relative">
            <label className="text-xs font-semibold text-[#9b9389] mb-1.5 flex items-center gap-1">
              <Users size={11} /> {t('guests')}
            </label>
            <button
              onClick={() => setGuestsOpen(!guestsOpen)}
              className={`w-full flex items-center justify-between border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors text-[#1c1712] ${
                totalGuests > maxGuests ? 'border-rose-400' : 'border-[#e8e3da] hover:border-[#0e3d6e]'
              }`}
            >
              <span>{localAdults} {t('adults')}{localChildren > 0 ? `, ${localChildren} ${t('children')}` : ''}</span>
              <ChevronDown size={15} className={`transition-transform text-[#9b9389] ${guestsOpen ? 'rotate-180' : ''}`} />
            </button>
            {totalGuests > maxGuests && (
              <p className="text-rose-500 text-xs mt-1">Max {maxGuests} misafir</p>
            )}

            {guestsOpen && (
              <div className="absolute top-full left-0 right-0 z-20 bg-white border border-[#e8e3da] rounded-2xl shadow-[0_8px_32px_rgba(28,23,18,0.15)] mt-1 p-4 space-y-3">
                {[
                  { label: t('adults'), note: '13+', val: localAdults, set: setLocalAdults, min: 1 },
                  { label: t('children'), note: '2-12', val: localChildren, set: setLocalChildren, min: 0 },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-[#1c1712]">{item.label}</div>
                      <div className="text-xs text-[#9b9389]">{item.note}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => item.set(Math.max(item.min, item.val - 1))}
                        disabled={item.val <= item.min}
                        className="w-8 h-8 rounded-full border border-[#e8e3da] flex items-center justify-center hover:bg-[#f7f5f0] disabled:opacity-30 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-bold text-[#1c1712]">{item.val}</span>
                      <button
                        onClick={() => item.set(Math.min(maxGuests - (item.label === t('adults') ? localChildren : localAdults) + (item.label === t('adults') ? 0 : 0), item.val + 1))}
                        disabled={totalGuests >= maxGuests}
                        className="w-8 h-8 rounded-full border border-[#e8e3da] flex items-center justify-center hover:bg-[#f7f5f0] disabled:opacity-30 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setGuestsOpen(false)} className="w-full py-2 bg-[#0e3d6e] text-white text-sm rounded-xl hover:bg-[#0a2d54] transition-colors">
                  Tamam
                </button>
              </div>
            )}
          </div>

          {/* Price breakdown */}
          {nights > 0 && (
            <div className="bg-[#f7f5f0] rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#6b6154]">
                <span>{formatPrice(pricePerNight, currency)} × {nights} gece</span>
                <span>{formatPrice(nightsTotal, currency)}</span>
              </div>
              <div className="flex justify-between text-[#6b6154]">
                <span>{t('cleaningFee')}</span>
                <span>{formatPrice(cleaningFee, currency)}</span>
              </div>
              <div className="border-t border-[#e8e3da] pt-2 flex justify-between font-bold text-[#1c1712]">
                <span>{t('total')}</span>
                <span className="text-[#0e3d6e]">{formatPrice(grandTotal, currency)}</span>
              </div>
            </div>
          )}

          {/* CTA Button */}
          {nights > 0 && totalGuests <= maxGuests ? (
            <Link
              href={bookingUrl}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(200,137,42,0.35)] hover:shadow-[0_8px_32px_rgba(200,137,42,0.45)] text-sm"
            >
              {t('requestButton')}
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-3.5 bg-[#f0ede6] text-[#9b9389] font-bold rounded-xl cursor-not-allowed text-sm"
            >
              {nights <= 0 ? t('selectDates') : `Max ${maxGuests} misafir`}
            </button>
          )}

          <p className="text-center text-xs text-[#9b9389]">{t('inquiryNote')}</p>
        </div>
      </div>

      {/* Contact box */}
      <div className="bg-white rounded-2xl border border-[#e8e3da] p-4 space-y-3 shadow-[0_2px_16px_rgba(28,23,18,0.06)]">
        <h4 className="font-semibold text-[#1c1712] text-sm">Sorularınız mı var?</h4>
        <a
          href="tel:+905321234567"
          className="flex items-center gap-2 text-sm text-[#6b6154] hover:text-[#0e3d6e] transition-colors"
        >
          <Phone size={15} className="text-[#0e3d6e]" />
          +90 532 123 45 67
        </a>
        <a
          href="mailto:info@kaskalkan.com"
          className="flex items-center gap-2 text-sm text-[#6b6154] hover:text-[#0e3d6e] transition-colors"
        >
          <Mail size={15} className="text-[#0e3d6e]" />
          info@kaskalkan.com
        </a>
        <a
          href="https://wa.me/905321234567"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-xl hover:bg-green-100 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          WhatsApp ile Yaz
        </a>
      </div>
    </div>
  )
}
