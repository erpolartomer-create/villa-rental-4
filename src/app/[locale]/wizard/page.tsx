'use client'
import { useTranslations, useLocale } from 'next-intl'
import { useState, useCallback } from 'react'
import { categories } from '@/lib/data/categories'
import { amenities } from '@/lib/data/amenities'
import { searchVillas } from '@/lib/data/villas'
import { VillaCard } from '@/components/villa/VillaCard'
import { Locale } from '@/types/villa'
import {
  Users, Heart, Banknote, ArrowRight, ArrowLeft,
  Wand2, Minus, Plus, Sparkles, CheckCircle2, Search,
  ChevronLeft, ChevronRight, Moon, Calendar,
} from 'lucide-react'

// ─── Calendar helpers ──────────────────────────────────────────────
const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
const TR_DAYS   = ['Pt','Sa','Ça','Pe','Cu','Ct','Pz']

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function startDayOfMonth(year: number, month: number) {
  // Monday-first: 0=Mon … 6=Sun
  return (new Date(year, month, 1).getDay() + 6) % 7
}
function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}
function parseDate(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function nightsBetween(a: string, b: string) {
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / 86400000)
}

// ─── RangeCalendar ─────────────────────────────────────────────────
interface RangeCalendarProps {
  checkin: string
  checkout: string
  onChange: (ci: string, co: string) => void
}

function RangeCalendar({ checkin, checkout, onChange }: RangeCalendarProps) {
  const today = new Date()
  const [leftYear, setLeftYear]   = useState(today.getFullYear())
  const [leftMonth, setLeftMonth] = useState(today.getMonth())

  // right panel = left + 1 month
  const rightDate  = new Date(leftYear, leftMonth + 1, 1)
  const rightMonth = rightDate.getMonth()
  const rightYear  = rightDate.getFullYear()

  const [hovered, setHovered] = useState('')

  const prevMonth = () => {
    const d = new Date(leftYear, leftMonth - 1, 1)
    setLeftYear(d.getFullYear()); setLeftMonth(d.getMonth())
  }
  const nextMonth = () => {
    const d = new Date(leftYear, leftMonth + 1, 1)
    setLeftYear(d.getFullYear()); setLeftMonth(d.getMonth())
  }

  const handleDayClick = useCallback((dateStr: string) => {
    const todayStr = toDateStr(today)
    if (dateStr < todayStr) return
    if (!checkin || (checkin && checkout)) {
      onChange(dateStr, '')
    } else {
      if (dateStr <= checkin) {
        onChange(dateStr, '')
      } else {
        onChange(checkin, dateStr)
      }
    }
  }, [checkin, checkout, onChange])

  const isStart    = (d: string) => d === checkin
  const isEnd      = (d: string) => d === checkout
  const isInRange  = (d: string) => {
    const end = checkout || hovered
    if (!checkin || !end) return false
    return d > checkin && d < end
  }
  const isPast     = (d: string) => d < toDateStr(today)
  const isToday    = (d: string) => d === toDateStr(today)

  function MonthGrid({ year, month }: { year: number; month: number }) {
    const days   = daysInMonth(year, month)
    const start  = startDayOfMonth(year, month)
    const cells: (string | null)[] = Array(start).fill(null)
    for (let i = 1; i <= days; i++) {
      cells.push(toDateStr(new Date(year, month, i)))
    }
    // pad to full weeks
    while (cells.length % 7 !== 0) cells.push(null)

    return (
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-7 mb-2">
          {TR_DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-[#9b9389] uppercase py-1.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((dateStr, idx) => {
            if (!dateStr) return <div key={idx} />
            const past  = isPast(dateStr)
            const start = isStart(dateStr)
            const end   = isEnd(dateStr)
            const range = isInRange(dateStr)
            const tod   = isToday(dateStr)

            return (
              <div
                key={dateStr}
                className={`relative flex items-center justify-center h-9 cursor-pointer select-none transition-all duration-100 ${
                  range ? 'bg-[#c8892a]/12' : ''
                } ${
                  start ? 'rounded-l-full' : ''
                } ${
                  end ? 'rounded-r-full' : ''
                } ${
                  (start || end) && !range ? 'rounded-full' : ''
                }`}
                onClick={() => !past && handleDayClick(dateStr)}
                onMouseEnter={() => { if (checkin && !checkout) setHovered(dateStr) }}
                onMouseLeave={() => setHovered('')}
              >
                <span
                  className={`
                    w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-150
                    ${past ? 'text-[#d4cfc8] cursor-not-allowed' : ''}
                    ${start || end ? 'bg-[#c8892a] text-white font-bold shadow-[0_4px_14px_rgba(200,137,42,0.5)]' : ''}
                    ${!past && !start && !end ? 'hover:bg-[#c8892a]/15 hover:text-[#c8892a]' : ''}
                    ${!start && !end && !past && tod ? 'ring-2 ring-[#c8892a]/50 text-[#c8892a]' : ''}
                    ${range ? 'text-[#b07820] font-semibold' : ''}
                    ${!past && !start && !end ? 'text-[#1c1712]' : ''}
                  `}
                >
                  {new Date(dateStr).getDate()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={leftYear === today.getFullYear() && leftMonth <= today.getMonth()}
          className="w-8 h-8 rounded-xl border border-[#e8e3da] flex items-center justify-center text-[#9b9389] hover:border-[#c8892a]/40 hover:text-[#c8892a] disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={15} />
        </button>
        <div className="flex gap-8 sm:gap-16">
          <span className="text-sm font-bold text-[#1c1712]">{TR_MONTHS[leftMonth]} {leftYear}</span>
          <span className="hidden sm:block text-sm font-bold text-[#1c1712]">{TR_MONTHS[rightMonth]} {rightYear}</span>
        </div>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-xl border border-[#e8e3da] flex items-center justify-center text-[#9b9389] hover:border-[#c8892a]/40 hover:text-[#c8892a] transition-all"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Month grids */}
      <div className="flex gap-6">
        <MonthGrid year={leftYear} month={leftMonth} />
        <div className="hidden sm:block w-px bg-[#e8e3da] shrink-0" />
        <div className="hidden sm:block flex-1">
          <MonthGrid year={rightYear} month={rightMonth} />
        </div>
      </div>

      {/* Summary strip */}
      <div className="mt-5 pt-5 border-t border-[#e8e3da]">
        {checkin && checkout ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center bg-[#c8892a]/10 border border-[#c8892a]/20 rounded-xl px-4 py-2">
                <span className="text-[9px] font-bold text-[#c8892a] uppercase tracking-wider">Giriş</span>
                <span className="text-sm font-black text-[#1c1712]">{parseDate(checkin).toLocaleDateString('tr-TR', { day:'numeric', month:'short' })}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f7f5f0] rounded-xl px-3 py-2">
                <Moon size={12} className="text-[#c8892a]" />
                <span className="text-sm font-black text-[#1c1712]">{nights}</span>
                <span className="text-xs text-[#9b9389]">gece</span>
              </div>
              <div className="flex flex-col items-center bg-[#c8892a]/10 border border-[#c8892a]/20 rounded-xl px-4 py-2">
                <span className="text-[9px] font-bold text-[#c8892a] uppercase tracking-wider">Çıkış</span>
                <span className="text-sm font-black text-[#1c1712]">{parseDate(checkout).toLocaleDateString('tr-TR', { day:'numeric', month:'short' })}</span>
              </div>
            </div>
            <button
              onClick={() => onChange('', '')}
              className="text-xs text-[#9b9389] hover:text-[#c8892a] transition-colors font-medium"
            >
              Temizle
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[#9b9389] text-sm">
            <Calendar size={14} className="text-[#c8892a]" />
            {!checkin ? 'Giriş tarihini seçin' : 'Çıkış tarihini seçin'}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Wizard Page ────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4 | 'results'

export default function WizardPage() {
  const t = useTranslations('wizard')
  const locale = useLocale() as Locale

  const [step, setStep]                       = useState<Step>(1)
  const [checkin, setCheckin]                 = useState('')
  const [checkout, setCheckout]               = useState('')
  const [adults, setAdults]                   = useState(2)
  const [children, setChildren]               = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities]   = useState<string[]>([])
  const [minBudget, setMinBudget]             = useState(0)
  const [maxBudget, setMaxBudget]             = useState(2000)

  const toggleCategory = (slug: string) =>
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    )
  const toggleAmenity = (slug: string) =>
    setSelectedAmenities(prev =>
      prev.includes(slug) ? prev.filter(a => a !== slug) : [...prev, slug]
    )

  const results = searchVillas({
    guests: adults + children,
    minPrice: minBudget || undefined,
    maxPrice: maxBudget || undefined,
    categories: selectedCategories.length ? selectedCategories : undefined,
    amenities:  selectedAmenities.length  ? selectedAmenities  : undefined,
  })

  const totalSteps = 4
  const progress   = step === 'results' ? 100 : ((step as number) / totalSteps) * 100
  const stepIcons  = [Calendar, Users, Heart, Banknote]
  const stepLabels = ['Tarihler', 'Kişiler', 'Tercihler', 'Bütçe']
  const canProceed1 = step !== 1 || (checkin && checkout)
  const canProceed2 = step !== 2 || adults >= 1

  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* ── Cinematic Hero ── */}
      <div className="relative overflow-hidden" style={{ minHeight: '32vh' }}>
        <div className="absolute inset-0">
          <img
            src="/images/hero_bg.png"
            alt="Villa arama"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/80" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-[#c8892a]/10 blur-[80px]" />
        </div>
        <div className="relative z-10 container-villa flex flex-col justify-end pt-28 pb-10">
          <div className="inline-flex items-center gap-2 bg-[#c8892a]/20 border border-[#c8892a]/40 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4 w-fit">
            <Sparkles size={11} />
            Villa Arama Robotu
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-2">
            {t('title')}
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-xl">{t('subtitle')}</p>
        </div>
      </div>

      {/* ── Wizard Body ── */}
      <div className="container-villa max-w-3xl py-8 pb-20">

        {step !== 'results' && (
          <>
            {/* Step indicators */}
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4].map(s => {
                const Icon    = stepIcons[s - 1]
                const isActive = s === step
                const isDone   = (step as number) > s
                return (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`flex flex-col items-center gap-1.5 flex-1 ${isActive ? 'opacity-100' : isDone ? 'opacity-80' : 'opacity-35'}`}>
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isActive  ? 'bg-[#c8892a] text-white shadow-[0_6px_20px_rgba(200,137,42,0.45)]'
                        : isDone  ? 'bg-[#c8892a]/15 border-2 border-[#c8892a]/40 text-[#c8892a]'
                                  : 'bg-[#e8e3da] text-[#9b9389]'
                      }`}>
                        {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                      </div>
                      <span className={`text-xs font-semibold hidden sm:block ${isActive ? 'text-[#c8892a]' : 'text-[#9b9389]'}`}>
                        {stepLabels[s - 1]}
                      </span>
                    </div>
                    {s < 4 && (
                      <div className={`h-px flex-1 mx-2 mb-4 transition-colors duration-300 ${
                        (step as number) > s ? 'bg-[#c8892a]/40' : 'bg-[#e8e3da]'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#9b9389] font-medium">{t('step')} {step} / {totalSteps}</span>
              <span className="text-xs font-bold text-[#c8892a]">{Math.round(progress)}% tamamlandı</span>
            </div>
            <div className="h-1.5 bg-[#e8e3da] rounded-full mb-7 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c8892a] to-[#e6a83c] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        {/* ── Step 1: Dates ── */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-[#e8e3da] shadow-[0_4px_24px_rgba(28,23,18,0.07)] overflow-hidden">
            <div className="px-7 pt-7 pb-5 border-b border-[#e8e3da]">
              <h2 className="text-2xl font-black text-[#1c1712] tracking-tight mb-1">{t('step1.title')}</h2>
              <p className="text-[#9b9389] text-sm">Takvimden giriş ve çıkış tarihlerini seçin</p>
            </div>
            <div className="px-7 py-6">
              <RangeCalendar
                checkin={checkin}
                checkout={checkout}
                onChange={(ci, co) => { setCheckin(ci); setCheckout(co) }}
              />
            </div>
          </div>
        )}

        {/* ── Step 2: Guests ── */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-[#e8e3da] shadow-[0_4px_24px_rgba(28,23,18,0.07)] overflow-hidden">
            <div className="px-8 pt-8 pb-6 border-b border-[#e8e3da]">
              <h2 className="text-2xl font-black text-[#1c1712] tracking-tight mb-1">{t('step2.title')}</h2>
              <p className="text-[#9b9389] text-sm">Tüm misafirleri dahil edin</p>
            </div>
            <div className="px-8 py-6 space-y-0">
              {[
                { label: t('step2.adults'), note: t('step2.adultsNote'), val: adults, set: setAdults, min: 1 },
                { label: t('step2.children'), note: t('step2.childrenNote'), val: children, set: setChildren, min: 0 },
              ].map((item, idx) => (
                <div key={item.label} className={`flex items-center justify-between py-5 ${idx < 1 ? 'border-b border-[#e8e3da]' : ''}`}>
                  <div>
                    <div className="font-bold text-[#1c1712] text-sm">{item.label}</div>
                    <div className="text-[#9b9389] text-xs mt-0.5">{item.note}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => item.set(Math.max(item.min, item.val - 1))}
                      disabled={item.val <= item.min}
                      className="w-10 h-10 rounded-2xl border-2 border-[#e8e3da] hover:border-[#c8892a]/50 flex items-center justify-center disabled:opacity-30 transition-all text-[#6b6154]"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-8 text-center font-black text-xl text-[#1c1712]">{item.val}</span>
                    <button
                      onClick={() => item.set(item.val + 1)}
                      className="w-10 h-10 rounded-2xl border-2 border-[#c8892a]/30 bg-[#c8892a]/10 hover:bg-[#c8892a]/20 hover:border-[#c8892a]/50 flex items-center justify-center transition-all text-[#c8892a]"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-8 mb-7 bg-[#f7f5f0] rounded-2xl px-4 py-3 text-center border border-[#e8e3da]">
              <span className="font-black text-[#1c1712]">{adults + children}</span>
              <span className="text-[#9b9389] text-sm ml-2">kişi toplam misafir</span>
            </div>
          </div>
        )}

        {/* ── Step 3: Preferences ── */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border border-[#e8e3da] shadow-[0_4px_24px_rgba(28,23,18,0.07)] overflow-hidden">
            <div className="px-8 pt-8 pb-6 border-b border-[#e8e3da]">
              <h2 className="text-2xl font-black text-[#1c1712] tracking-tight mb-1">{t('step3.title')}</h2>
              <p className="text-[#9b9389] text-sm">{t('step3.subtitle')}</p>
            </div>
            <div className="px-8 py-6">
              <p className="text-xs font-bold text-[#6b6154] uppercase tracking-wider mb-3">Kategoriler</p>
              <div className="grid grid-cols-2 gap-2 mb-7">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.slug)}
                    className={`flex items-center gap-2.5 p-3.5 rounded-2xl border-2 text-left transition-all text-sm font-medium ${
                      selectedCategories.includes(cat.slug)
                        ? 'border-[#c8892a] bg-[#c8892a]/10 text-[#c8892a] shadow-[0_2px_12px_rgba(200,137,42,0.15)]'
                        : 'border-[#e8e3da] text-[#6b6154] hover:border-[#c8892a]/30 hover:bg-[#fdf3e3]/50'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    {cat.translations[locale]?.name}
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-[#6b6154] uppercase tracking-wider mb-3">Özellikler</p>
              <div className="flex flex-wrap gap-2">
                {amenities.slice(0, 10).map(amenity => (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.slug)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium transition-all ${
                      selectedAmenities.includes(amenity.slug)
                        ? 'border-[#c8892a] bg-[#c8892a]/10 text-[#c8892a]'
                        : 'border-[#e8e3da] text-[#6b6154] hover:border-[#c8892a]/30 bg-[#f7f5f0]'
                    }`}
                  >
                    <span>{amenity.icon}</span> {amenity.translations[locale]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Budget ── */}
        {step === 4 && (
          <div className="bg-white rounded-3xl border border-[#e8e3da] shadow-[0_4px_24px_rgba(28,23,18,0.07)] overflow-hidden">
            <div className="px-8 pt-8 pb-6 border-b border-[#e8e3da]">
              <h2 className="text-2xl font-black text-[#1c1712] tracking-tight mb-1">{t('step4.title')}</h2>
              <p className="text-[#9b9389] text-sm">EUR cinsinden gecelik bütçe aralığı belirleyin</p>
            </div>
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-[#6b6154] uppercase tracking-wider mb-2">Min. (EUR)</label>
                  <input
                    type="number"
                    value={minBudget}
                    onChange={e => setMinBudget(Number(e.target.value))}
                    min={0}
                    className="w-full border-2 border-[#e8e3da] focus:border-[#c8892a] rounded-2xl px-4 py-3 text-[#1c1712] text-sm outline-none transition-colors bg-[#fafaf9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6b6154] uppercase tracking-wider mb-2">Max. (EUR)</label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={e => setMaxBudget(Number(e.target.value))}
                    min={minBudget}
                    className="w-full border-2 border-[#e8e3da] focus:border-[#c8892a] rounded-2xl px-4 py-3 text-[#1c1712] text-sm outline-none transition-colors bg-[#fafaf9]"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {[[0, 300], [300, 600], [600, 1000], [1000, 99999]].map(([min, max]) => (
                  <button
                    key={`${min}-${max}`}
                    onClick={() => { setMinBudget(min); setMaxBudget(max) }}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      minBudget === min && maxBudget === max
                        ? 'bg-[#c8892a] text-white border-[#c8892a] shadow-[0_4px_12px_rgba(200,137,42,0.35)]'
                        : 'border-[#e8e3da] text-[#6b6154] hover:border-[#c8892a]/40 bg-[#f7f5f0]'
                    }`}
                  >
                    {max === 99999 ? `€${min}+` : `€${min} – €${max}`}
                  </button>
                ))}
              </div>
              <div className="bg-[#c8892a]/10 border border-[#c8892a]/25 rounded-2xl px-4 py-3 text-center">
                <span className="text-[#c8892a] font-bold text-sm">
                  Seçilen: €{minBudget} – {maxBudget === 99999 ? '∞' : `€${maxBudget}`} / gece
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {step === 'results' && (
          <div>
            <div className="bg-white rounded-3xl border border-[#e8e3da] shadow-[0_4px_24px_rgba(28,23,18,0.07)] px-7 py-5 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#1c1712] tracking-tight">{t('results.title')}</h2>
                <p className="text-[#9b9389] text-sm mt-0.5">
                  <span className="font-bold text-[#c8892a]">{results.length}</span> villa {t('results.found')}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#c8892a]/10 hover:bg-[#c8892a]/20 border border-[#c8892a]/25 text-[#c8892a] text-sm font-semibold rounded-2xl transition-all"
              >
                <Search size={13} />
                {t('results.modifySearch')}
              </button>
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#e8e3da] p-12 text-center">
                <div className="w-16 h-16 bg-[#c8892a]/10 border border-[#c8892a]/20 rounded-3xl flex items-center justify-center mx-auto mb-5">
                  <Wand2 size={28} className="text-[#c8892a]" />
                </div>
                <h3 className="font-black text-[#1c1712] text-xl mb-2">{t('results.noResults')}</h3>
                <p className="text-[#9b9389] text-sm mb-6">Farklı kriterlerle tekrar deneyin</p>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold rounded-2xl text-sm transition-colors shadow-[0_6px_20px_rgba(200,137,42,0.4)]"
                >
                  Kriterleri Değiştir
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {results.map(villa => (
                  <VillaCard key={villa.id} villa={villa} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Navigation ── */}
        {step !== 'results' && (
          <div className="flex gap-3 mt-5">
            {(step as number) > 1 && (
              <button
                onClick={() => setStep(prev => ((prev as number) - 1) as Step)}
                className="flex items-center gap-2 px-6 py-3.5 border-2 border-[#e8e3da] hover:border-[#c8892a]/30 text-[#6b6154] hover:text-[#1c1712] font-semibold rounded-2xl transition-all text-sm"
              >
                <ArrowLeft size={15} />
                {t('back')}
              </button>
            )}
            <button
              onClick={() => {
                if (step === 4) setStep('results')
                else setStep(prev => ((prev as number) + 1) as Step)
              }}
              disabled={!canProceed1 || !canProceed2}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#c8892a] hover:bg-[#b07820] disabled:bg-[#e8e3da] disabled:text-[#9b9389] text-white font-bold rounded-2xl transition-all text-sm shadow-[0_6px_20px_rgba(200,137,42,0.35)] disabled:shadow-none"
            >
              {step === 4 ? (
                <><Search size={15} /> {t('search')}</>
              ) : (
                <>{t('next')} <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
