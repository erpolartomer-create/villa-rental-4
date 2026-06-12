'use client'
import { useSearchParams, useParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getVillaBySlug, villas } from '@/lib/data/villas'
import { Locale } from '@/types/villa'
import { formatPrice, calculateNights } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currencyStore'
import { useSettingsStore } from '@/store/settingsStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { User, Mail, Phone, Globe, MessageSquare, CheckCircle, ArrowLeft } from 'lucide-react'

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  nationality: z.string().optional(),
  specialRequests: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const t = useTranslations('booking')
  const locale = useLocale() as Locale
  const router = useRouter()
  const { currency } = useCurrencyStore()

  const villaId = params.villaId as string
  const villa = villas.find(v => v.id === villaId)
  const checkin = searchParams.get('checkin') || ''
  const checkout = searchParams.get('checkout') || ''
  const adults = Number(searchParams.get('adults') || 2)
  const children = Number(searchParams.get('children') || 0)

  const { settings } = useSettingsStore()
  const [submitted, setSubmitted] = useState(false)
  const [refCode] = useState(() => `KK-${Date.now().toString(36).toUpperCase()}`)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (!villa) return <div className="p-20 text-center">Villa bulunamadı</div>

  const tr = villa.translations[locale]
  const nights = checkin && checkout ? calculateNights(checkin, checkout) : 0
  const pricePerNight = villa.basePricePerNight
  const total = (nights * pricePerNight) + villa.cleaningFee

  const onSubmit = (data: FormData) => {
    const text = [
      `Rezervasyon Talebi — Ref: ${refCode}`,
      `Villa: ${tr.name}`,
      `Giriş: ${checkin}`,
      `Çıkış: ${checkout}`,
      `${nights} gece, ${adults + children} kişi`,
      `Ad Soyad: ${data.firstName} ${data.lastName}`,
      `Telefon: ${data.phone}`,
      `E-posta: ${data.email}`,
      data.nationality      && `Uyruk: ${data.nationality}`,
      data.specialRequests  && `Özel İstek: ${data.specialRequests}`,
    ].filter(Boolean).join('\n')

    const waNumber = settings.whatsapp.replace(/\D/g, '')
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 pt-24">
        <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-3">{t('confirmation.title')}</h1>
          <p className="text-stone-500 mb-6">{t('confirmation.subtitle')}</p>
          <div className="bg-stone-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">{t('confirmation.refCode')}</span>
              <span className="font-bold text-sky-700">{refCode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Villa</span>
              <span className="font-medium text-stone-700">{tr.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Tarihler</span>
              <span className="font-medium text-stone-700">{checkin} → {checkout}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/${locale}`)}
              className="flex-1 py-3 border-2 border-stone-200 text-stone-600 font-semibold rounded-xl hover:bg-stone-50"
            >
              {t('confirmation.backHome')}
            </button>
            <button
              onClick={() => router.push(`/${locale}/villas`)}
              className="flex-1 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700"
            >
              {t('confirmation.viewVillas')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container-villa max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Geri Dön
        </button>

        <h1 className="text-3xl font-bold text-stone-800 mb-8">{t('title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm space-y-5">
              <h2 className="font-bold text-stone-800 text-lg">{t('guestInfo')}</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5 flex items-center gap-1">
                    <User size={13} /> {t('firstName')}
                  </label>
                  <input
                    {...register('firstName')}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 ${errors.firstName ? 'border-rose-400' : 'border-stone-200'}`}
                    placeholder="Adınız"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">{t('lastName')}</label>
                  <input
                    {...register('lastName')}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 ${errors.lastName ? 'border-rose-400' : 'border-stone-200'}`}
                    placeholder="Soyadınız"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5 flex items-center gap-1">
                  <Mail size={13} /> {t('email')}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 ${errors.email ? 'border-rose-400' : 'border-stone-200'}`}
                  placeholder="ornek@email.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5 flex items-center gap-1">
                    <Phone size={13} /> {t('phone')}
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 ${errors.phone ? 'border-rose-400' : 'border-stone-200'}`}
                    placeholder="+90 5xx xxx xx xx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5 flex items-center gap-1">
                    <Globe size={13} /> {t('nationality')}
                  </label>
                  <input
                    {...register('nationality')}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                    placeholder="Türkiye"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5 flex items-center gap-1">
                  <MessageSquare size={13} /> {t('specialRequests')}
                </label>
                <textarea
                  {...register('specialRequests')}
                  rows={3}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 resize-none"
                  placeholder={t('specialRequestsPlaceholder')}
                />
              </div>

              <p className="text-stone-400 text-xs">{t('terms')}</p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-bold rounded-xl transition-colors text-lg"
              >
                {isSubmitting ? 'Gönderiliyor...' : t('submitRequest')}
              </button>
            </form>
          </div>

          {/* Booking summary */}
          <div>
            <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm sticky top-24">
              <h3 className="font-bold text-stone-800 mb-4">{t('summary')}</h3>

              {/* Villa image */}
              <div className="h-36 rounded-xl overflow-hidden mb-4">
                <img
                  src={villa.images[0]?.url}
                  alt={tr.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-semibold text-stone-800 mb-4">{tr.name}</div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-400">{t('checkin')}</span>
                  <span className="font-medium">{checkin || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{t('checkout')}</span>
                  <span className="font-medium">{checkout || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{t('nights')}</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{t('guests')}</span>
                  <span className="font-medium">{adults + children} kişi</span>
                </div>
                <div className="border-t border-stone-100 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-stone-400">{t('pricePerNight')}</span>
                    <span>{formatPrice(pricePerNight, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">{t('cleaningFee')}</span>
                    <span>{formatPrice(villa.cleaningFee, currency)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-800 mt-2 pt-2 border-t border-stone-100">
                    <span>{t('total')}</span>
                    <span className="text-sky-700 text-lg">{formatPrice(total, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
