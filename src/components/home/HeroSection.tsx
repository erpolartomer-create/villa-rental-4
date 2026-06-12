'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Search, Compass, Users, Calendar, ArrowRight, Zap, Star, MapPin, ChevronDown, Tag } from 'lucide-react'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'
import { useBookingStore } from '@/store/bookingStore'
import { getFeaturedVillas } from '@/lib/data/villas'
import { useCurrencyStore } from '@/store/currencyStore'
import { formatPrice } from '@/lib/utils'
import { Locale } from '@/types/villa'

const DISCOUNTS = [18, 22, 15]

const BOLGE_OPTIONS = [
  { value: '', label: 'Tüm Bölgeler' },
  { value: 'Kaş', label: 'Kaş' },
  { value: 'Kalkan', label: 'Kalkan' },
  { value: 'Patara', label: 'Patara' },
  { value: 'Çıralı', label: 'Çıralı' },
]

const KATEGORI_OPTIONS = [
  { value: '', label: 'Tüm Tipler' },
  { value: 'seaview', label: 'Deniz Manzaralı' },
  { value: 'pool', label: 'Havuzlu' },
  { value: 'honeymoon', label: 'Balayı' },
  { value: 'luxury', label: 'Lüks' },
  { value: 'family', label: 'Aile' },
  { value: 'beachfront', label: 'Denize Sıfır' },
]

function formatDate(d?: Date) {
  if (!d) return ''
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

export function HeroSection() {
  const t = useTranslations('home.hero')
  const locale = useLocale() as Locale
  const router = useRouter()
  const { setDates, setGuests } = useBookingStore()
  const { currency } = useCurrencyStore()

  const [bolge, setBolge] = useState('')
  const [kategori, setKategori] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [guests, setGuestsLocal] = useState(2)

  const [showCalendar, setShowCalendar] = useState(false)
  const [showBolge, setShowBolge] = useState(false)
  const [showKategori, setShowKategori] = useState(false)
  const [showGuests, setShowGuests] = useState(false)

  const calendarRef  = useRef<HTMLDivElement>(null)
  const bolgeRef     = useRef<HTMLDivElement>(null)
  const kategoriRef  = useRef<HTMLDivElement>(null)
  const guestsRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (calendarRef.current  && !calendarRef.current.contains(e.target as Node))  setShowCalendar(false)
      if (bolgeRef.current     && !bolgeRef.current.contains(e.target as Node))     setShowBolge(false)
      if (kategoriRef.current  && !kategoriRef.current.contains(e.target as Node))  setShowKategori(false)
      if (guestsRef.current    && !guestsRef.current.contains(e.target as Node))    setShowGuests(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const checkin  = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : ''
  const checkout = dateRange?.to   ? dateRange.to.toISOString().split('T')[0]   : ''

  const handleSearch = () => {
    if (checkin && checkout) setDates(checkin, checkout)
    setGuests(guests, 0, 0)
    const params = new URLSearchParams()
    if (checkin)   params.set('checkin', checkin)
    if (checkout)  params.set('checkout', checkout)
    params.set('guests', String(guests))
    if (bolge)    params.set('location', bolge)
    if (kategori) params.set('category', kategori)
    router.push(`/${locale}/villas?${params.toString()}`)
  }

  const closeAll = (except?: string) => {
    if (except !== 'bolge')    setShowBolge(false)
    if (except !== 'kategori') setShowKategori(false)
    if (except !== 'calendar') setShowCalendar(false)
    if (except !== 'guests')   setShowGuests(false)
  }

  const stats = [
    { value: '200+',   label: t('stats.villas') },
    { value: '5.000+', label: t('stats.guests') },
    { value: '10',     label: t('stats.years')  },
  ]

  const lastMinuteVillas = getFeaturedVillas().slice(0, 3)

  /* ─────────────────────────────────────────────────── */
  return (
    <section className="relative overflow-hidden" style={{ minHeight: '100svh' }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=2000&q=85"
          alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
      </div>

      {/* ══════════════════════════════
          MOBILE LAYOUT  (hidden on lg+)
      ══════════════════════════════ */}
      <div className="lg:hidden relative z-10 flex flex-col px-5 pt-20 pb-8 min-h-[100svh]">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/20 rounded-full px-3.5 py-1.5 mb-4 text-xs text-white/90 w-fit">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
          Türkiye'nin En Seçkin Tatil Bölgesi
        </div>

        {/* Heading */}
        <h1 className="text-white font-black leading-[1.1] tracking-tight mb-2"
          style={{ fontSize: 'clamp(1.75rem, 8vw, 2.5rem)' }}>
          {t('title')}<br />
          <span style={{ color: '#e6a83c' }}>{t('titleHighlight')}</span>
        </h1>

        <p className="text-white/60 text-sm leading-relaxed mb-7 max-w-xs">
          {t('subtitle')}
        </p>

        <div className="w-full h-px bg-white/20 mb-7" />

        {/* ── Mobile search: compact glass pill ── */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden mb-5">
          {/* Bölge */}
          <div ref={bolgeRef} className="relative border-b border-white/12">
            <button onClick={() => { closeAll('bolge'); setShowBolge(v => !v) }}
              className="w-full px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <MapPin size={9} /> Bölge
                </div>
                <div className="text-white text-sm font-medium">{bolge || 'Tüm Bölgeler'}</div>
              </div>
              <ChevronDown size={14} className={`text-white/40 transition-transform ${showBolge ? 'rotate-180' : ''}`} />
            </button>
            {showBolge && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white rounded-xl border border-[#e8e3da] shadow-xl mt-1 overflow-hidden">
                {BOLGE_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setBolge(opt.value); setShowBolge(false) }}
                    className={`w-full px-4 py-3 text-sm text-left ${bolge === opt.value ? 'bg-[#c8892a]/10 text-[#c8892a] font-semibold' : 'text-[#1c1712] hover:bg-[#f7f5f0]'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Villa Tipi */}
          <div ref={kategoriRef} className="relative border-b border-white/12">
            <button onClick={() => { closeAll('kategori'); setShowKategori(v => !v) }}
              className="w-full px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <Tag size={9} /> Villa Tipi
                </div>
                <div className="text-white text-sm font-medium">{KATEGORI_OPTIONS.find(k => k.value === kategori)?.label || 'Tüm Tipler'}</div>
              </div>
              <ChevronDown size={14} className={`text-white/40 transition-transform ${showKategori ? 'rotate-180' : ''}`} />
            </button>
            {showKategori && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white rounded-xl border border-[#e8e3da] shadow-xl mt-1 overflow-hidden">
                {KATEGORI_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setKategori(opt.value); setShowKategori(false) }}
                    className={`w-full px-4 py-3 text-sm text-left ${kategori === opt.value ? 'bg-[#c8892a]/10 text-[#c8892a] font-semibold' : 'text-[#1c1712] hover:bg-[#f7f5f0]'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tarihler */}
          <div ref={calendarRef} className="relative border-b border-white/12">
            <button onClick={() => { closeAll('calendar'); setShowCalendar(v => !v) }}
              className="w-full px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <Calendar size={9} /> Tarihler
                </div>
                <div className={`text-sm font-medium ${dateRange?.from ? 'text-white' : 'text-white/55'}`}>
                  {dateRange?.from ? `${formatDate(dateRange.from)} — ${dateRange.to ? formatDate(dateRange.to) : '?'}` : 'Giriş — Çıkış'}
                </div>
              </div>
              <ChevronDown size={14} className={`text-white/40 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
            </button>
            {showCalendar && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white rounded-xl border border-[#e8e3da] shadow-xl mt-1 p-3"
                style={{ '--rdp-accent-color': '#c8892a', '--rdp-background-color': '#fdf3e3' } as React.CSSProperties}>
                <DayPicker mode="range" selected={dateRange}
                  onSelect={r => { setDateRange(r); if (r?.from && r?.to) setShowCalendar(false) }}
                  numberOfMonths={1} disabled={{ before: new Date() }}
                  styles={{ root: { fontFamily: 'inherit', fontSize: '13px' } }} />
              </div>
            )}
          </div>

          {/* Misafir */}
          <div ref={guestsRef} className="relative">
            <button onClick={() => { closeAll('guests'); setShowGuests(v => !v) }}
              className="w-full px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <Users size={9} /> Misafir
                </div>
                <div className="text-white text-sm font-medium">{guests} Kişi</div>
              </div>
              <ChevronDown size={14} className={`text-white/40 transition-transform ${showGuests ? 'rotate-180' : ''}`} />
            </button>
            {showGuests && (
              <div className="absolute bottom-full left-0 right-0 z-50 bg-white rounded-xl border border-[#e8e3da] shadow-xl mb-1 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-[#1c1712]">Misafir Sayısı</div>
                    <div className="text-xs text-[#9b9389]">Tüm yaşlar</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setGuestsLocal(Math.max(1, guests - 1))} disabled={guests <= 1}
                      className="w-8 h-8 rounded-full border border-[#e8e3da] flex items-center justify-center text-[#1c1712] hover:bg-[#f7f5f0] disabled:opacity-30 font-bold text-lg">−</button>
                    <span className="w-5 text-center font-bold text-[#1c1712]">{guests}</span>
                    <button onClick={() => setGuestsLocal(Math.min(20, guests + 1))} disabled={guests >= 20}
                      className="w-8 h-8 rounded-full border border-[#e8e3da] flex items-center justify-center text-[#1c1712] hover:bg-[#f7f5f0] disabled:opacity-30 font-bold text-lg">+</button>
                  </div>
                </div>
                <button onClick={() => setShowGuests(false)}
                  className="w-full py-2.5 bg-[#c8892a] hover:bg-[#b07820] text-white text-sm font-semibold rounded-xl transition-colors">Tamam</button>
              </div>
            )}
          </div>

          {/* Ara button */}
          <button onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold text-sm transition-all shadow-[0_8px_32px_rgba(200,137,42,0.35)]">
            <Search size={15} /> Ara
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-0 mb-4">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center">
              {i > 0 && <div className="w-px h-7 bg-white/20 mx-4" />}
              <div>
                <div className="text-lg font-bold text-white tracking-tight leading-none">{s.value}</div>
                <div className="text-white/50 text-[10px] mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Wizard link */}
        <Link href={`/${locale}/wizard`}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors group w-fit mb-8">
          <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
            <Compass size={13} />
          </div>
          Bana uygun villayı bul
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="w-full h-px bg-white/20 mb-6" />

        {/* ── Mobile Son Dakika Fırsatları ── */}
        <div className="bg-white/12 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/12">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#c8892a] rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(200,137,42,0.45)]">
                <Zap size={14} className="text-white fill-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-none">Son Dakika Fırsatları</div>
                <div className="text-white/45 text-[11px] mt-0.5">Bugüne özel indirimler</div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-2.5 py-1 shrink-0">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-[10px] font-semibold">Canlı</span>
            </div>
          </div>

          {/* Vertical stacked cards */}
          <div className="flex flex-col gap-2.5 px-4 py-3">
            {lastMinuteVillas.map((villa, i) => {
              const tr = villa.translations[locale] || villa.translations.tr
              const cover = villa.images.find(img => img.isCover) || villa.images[0]
              const discount = DISCOUNTS[i]
              const originalPrice = Math.round(villa.basePricePerNight / (1 - discount / 100))
              return (
                <Link key={villa.id} href={`/${locale}/villas/${villa.slug}`}
                  className="group flex items-center gap-3 bg-white/8 hover:bg-white/15 border border-white/12 rounded-xl overflow-hidden transition-all">
                  <div className="relative w-20 h-20 shrink-0">
                    <img src={cover?.url} alt={tr.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-1.5 left-1.5 bg-[#c8892a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      -{discount}%
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-2">
                    <div className="text-white font-semibold text-xs line-clamp-1 mb-0.5">{tr.name}</div>
                    <div className="flex items-center gap-1 text-white/45 text-[10px] mb-1.5">
                      <MapPin size={8} />{villa.locationDistrict}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/35 text-[10px] line-through">{formatPrice(originalPrice, currency)}</span>
                      <span className="text-[#c8892a] font-bold text-sm leading-none">
                        {formatPrice(villa.basePricePerNight, currency)}
                      </span>
                      <span className="text-white/40 text-[10px]">/gece</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* CTA */}
          <div className="px-4 pb-3.5">
            <Link href={`/${locale}/villas`}
              className="group flex items-center justify-center gap-2 py-2.5 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold text-sm rounded-xl transition-all">
              Tüm Fırsatları Gör
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          DESKTOP LAYOUT  (hidden on mobile)
      ══════════════════════════════ */}
      <div className="hidden lg:flex min-h-screen relative z-10">

        {/* Left column */}
        <div className="flex flex-col justify-center flex-[0_0_58%] pl-16 xl:pl-20 pr-8 pt-24 pb-14">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/12 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 text-sm text-white/90 w-fit">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Türkiye'nin En Seçkin Tatil Bölgesi
          </div>

          <h1 className="heading-display text-white mb-3 max-w-xl">
            {t('title')}<br />
            <span style={{ color: '#e6a83c' }}>{t('titleHighlight')}</span>
          </h1>

          <p className="text-white/70 text-base mb-7 max-w-md leading-relaxed">{t('subtitle')}</p>

          {/* Desktop search bar — white card, horizontal */}
          <div className="rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] mb-6 max-w-3xl" style={{ background: '#ffffff' }}>
            <div className="flex">
              {/* Bölge */}
              <div ref={bolgeRef} className="relative flex-1 border-r border-[#e8e3da]">
                <button onClick={() => { closeAll('bolge'); setShowBolge(v => !v) }} className="w-full px-4 py-3.5 text-left">
                  <div className="text-[#9b9389] text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={10} /> Bölge</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1c1712] text-sm font-medium">{bolge || 'Tüm Bölgeler'}</span>
                    <ChevronDown size={13} className={`text-[#9b9389] transition-transform ${showBolge ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {showBolge && (
                  <div className="absolute top-full left-0 z-[60] bg-white rounded-2xl border border-[#e8e3da] shadow-[0_16px_48px_rgba(0,0,0,0.15)] mt-1 min-w-[160px] overflow-hidden">
                    {BOLGE_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setBolge(opt.value); setShowBolge(false) }}
                        className={`w-full px-4 py-2.5 text-sm text-left ${bolge === opt.value ? 'bg-[#c8892a]/10 text-[#c8892a] font-semibold' : 'text-[#1c1712] hover:bg-[#f7f5f0]'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Kategori */}
              <div ref={kategoriRef} className="relative flex-1 border-r border-[#e8e3da]">
                <button onClick={() => { closeAll('kategori'); setShowKategori(v => !v) }} className="w-full px-4 py-3.5 text-left">
                  <div className="text-[#9b9389] text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Tag size={10} /> Villa Tipi</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1c1712] text-sm font-medium">{KATEGORI_OPTIONS.find(k => k.value === kategori)?.label || 'Tüm Tipler'}</span>
                    <ChevronDown size={13} className={`text-[#9b9389] transition-transform ${showKategori ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {showKategori && (
                  <div className="absolute top-full left-0 z-[60] bg-white rounded-2xl border border-[#e8e3da] shadow-[0_16px_48px_rgba(0,0,0,0.15)] mt-1 min-w-[170px] overflow-hidden">
                    {KATEGORI_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setKategori(opt.value); setShowKategori(false) }}
                        className={`w-full px-4 py-2.5 text-sm text-left ${kategori === opt.value ? 'bg-[#c8892a]/10 text-[#c8892a] font-semibold' : 'text-[#1c1712] hover:bg-[#f7f5f0]'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tarihler */}
              <div ref={calendarRef} className="relative flex-[1.4] border-r border-[#e8e3da]">
                <button onClick={() => { closeAll('calendar'); setShowCalendar(v => !v) }} className="w-full px-4 py-3.5 text-left">
                  <div className="text-[#9b9389] text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={10} /> Tarihler</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${dateRange?.from ? 'text-[#1c1712]' : 'text-[#9b9389]'}`}>
                      {dateRange?.from ? `${formatDate(dateRange.from)} — ${dateRange.to ? formatDate(dateRange.to) : '?'}` : 'Giriş — Çıkış'}
                    </span>
                    <ChevronDown size={13} className={`text-[#9b9389] transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {showCalendar && (
                  <div className="absolute top-full left-0 z-[60] bg-white rounded-2xl border border-[#e8e3da] shadow-[0_24px_64px_rgba(0,0,0,0.18)] mt-1 p-3"
                    style={{ '--rdp-accent-color': '#c8892a', '--rdp-background-color': '#fdf3e3' } as React.CSSProperties}>
                    <DayPicker mode="range" selected={dateRange}
                      onSelect={r => { setDateRange(r); if (r?.from && r?.to) setShowCalendar(false) }}
                      numberOfMonths={2} disabled={{ before: new Date() }}
                      styles={{ root: { fontFamily: 'inherit', fontSize: '13px' }, months: { display: 'flex', gap: '1.5rem' } }} />
                  </div>
                )}
              </div>

              {/* Misafir */}
              <div ref={guestsRef} className="relative w-36 border-r border-[#e8e3da]">
                <button onClick={() => { closeAll('guests'); setShowGuests(v => !v) }} className="w-full px-4 py-3.5 text-left">
                  <div className="text-[#9b9389] text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Users size={10} /> Misafir</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1c1712] text-sm font-medium">{guests} Kişi</span>
                    <ChevronDown size={13} className={`text-[#9b9389] transition-transform ${showGuests ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {showGuests && (
                  <div className="absolute top-full left-0 z-[60] bg-white rounded-2xl border border-[#e8e3da] shadow-[0_16px_48px_rgba(0,0,0,0.15)] mt-1 w-48 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm font-semibold text-[#1c1712]">Misafir Sayısı</div>
                        <div className="text-xs text-[#9b9389]">Tüm yaşlar</div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button onClick={() => setGuestsLocal(Math.max(1, guests - 1))} disabled={guests <= 1}
                          className="w-7 h-7 rounded-full border border-[#e8e3da] flex items-center justify-center hover:bg-[#f7f5f0] disabled:opacity-30 font-bold">−</button>
                        <span className="w-5 text-center font-bold text-[#1c1712] text-sm">{guests}</span>
                        <button onClick={() => setGuestsLocal(Math.min(20, guests + 1))} disabled={guests >= 20}
                          className="w-7 h-7 rounded-full border border-[#e8e3da] flex items-center justify-center hover:bg-[#f7f5f0] disabled:opacity-30 font-bold">+</button>
                      </div>
                    </div>
                    <button onClick={() => setShowGuests(false)}
                      className="w-full py-2 bg-[#c8892a] hover:bg-[#b07820] text-white text-sm font-semibold rounded-xl transition-colors">Tamam</button>
                  </div>
                )}
              </div>

              {/* Ara */}
              <div className="p-2 flex items-center">
                <button onClick={handleSearch}
                  className="flex items-center gap-2 px-6 py-3.5 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold rounded-xl text-sm shadow-[0_8px_24px_rgba(200,137,42,0.4)] transition-all">
                  <Search size={16} /> Ara
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-0 mb-5">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center">
                {i > 0 && <div className="w-px h-9 bg-white/20 mx-6" />}
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight leading-none">{s.value}</div>
                  <div className="text-white/55 text-xs mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Wizard */}
          <Link href={`/${locale}/wizard`}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors group w-fit">
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center group-hover:bg-white/25 transition-colors">
              <Compass size={15} />
            </div>
            Bana uygun villayı bul
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right column — Son Dakika Fırsatları */}
        <div className="flex flex-col justify-center items-center flex-[0_0_42%] xl:flex-[0_0_40%] pr-8 xl:pr-14 pt-24 pb-10">
          <div className="w-full max-w-[460px] mt-5">
            <div className="bg-white/12 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
              <div className="px-7 pt-7 pb-5 flex items-center justify-between border-b border-white/15">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-[#c8892a] rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(200,137,42,0.55)]">
                    <Zap size={20} className="text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-base">Son Dakika Fırsatları</div>
                    <div className="text-white/45 text-xs">Bugüne özel indirimler</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-3 py-1 text-emerald-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Canlı
                </div>
              </div>

              <div className="px-5 py-5 space-y-4">
                {lastMinuteVillas.map((villa, i) => {
                  const tr = villa.translations[locale] || villa.translations.tr
                  const cover = villa.images.find(img => img.isCover) || villa.images[0]
                  const discount = DISCOUNTS[i]
                  const originalPrice = Math.round(villa.basePricePerNight / (1 - discount / 100))
                  return (
                    <Link key={villa.id} href={`/${locale}/villas/${villa.slug}`}
                      className="group flex items-center gap-4 bg-white/8 hover:bg-white/18 border border-white/12 hover:border-white/30 rounded-2xl p-4 transition-all duration-200">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                        <img src={cover?.url} alt={tr.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-2 left-2 bg-[#c8892a] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">-{discount}%</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm truncate">{tr.name}</div>
                        <div className="flex items-center gap-1 text-white/50 text-xs mt-1">
                          <MapPin size={10} /><span className="truncate">{villa.locationDistrict}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Star size={10} className="fill-[#c8892a] text-[#c8892a]" />
                          <span className="text-white/70 text-xs">{villa.averageRating}</span>
                          <span className="text-white/25">·</span>
                          <span className="text-white/50 text-xs">{villa.bedrooms} yatak · {villa.maxGuests} kişi</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-white/40 text-xs line-through">{formatPrice(originalPrice, currency)}</div>
                        <div className="text-white font-bold text-base">{formatPrice(villa.basePricePerNight, currency)}</div>
                        <div className="text-white/40 text-xs">/gece</div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className="px-5 pb-6">
                <Link href={`/${locale}/villas`}
                  className="group flex items-center justify-center gap-2 py-3.5 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_16px_rgba(200,137,42,0.4)] hover:shadow-[0_8px_24px_rgba(200,137,42,0.5)]">
                  Tüm Fırsatları Gör
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-white/35 text-xs">
              <span>✓ Ücretsiz iptal</span>
              <span className="w-1 h-1 bg-white/25 rounded-full" />
              <span>✓ En iyi fiyat garantisi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — desktop */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-1.5 text-white/35">
        <div className="w-[1px] h-7 bg-gradient-to-b from-transparent to-white/35" />
        <span className="text-[10px] tracking-[0.2em] uppercase">Kaydır</span>
      </div>
    </section>
  )
}
