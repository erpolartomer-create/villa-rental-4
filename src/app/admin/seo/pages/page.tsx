'use client'
import { useState } from 'react'
import { villas } from '@/lib/data/villas'

import { Save, Search, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react'

type PageType = 'home' | 'villas' | 'about' | 'contact' | 'blog' | 'villa' | 'blog_post'

interface SeoEntry {
  pageKey: string
  pageType: PageType
  locale: 'tr' | 'en' | 'ru'
  label: string
  metaTitle: string
  metaDescription: string
  ogTitle: string
  ogDescription: string
  noindex: boolean
}

const staticPages: Omit<SeoEntry, 'locale' | 'metaTitle' | 'metaDescription' | 'ogTitle' | 'ogDescription' | 'noindex'>[] = [
  { pageKey: 'home', pageType: 'home', label: 'Ana Sayfa' },
  { pageKey: 'villas', pageType: 'villas', label: 'Villa Listesi' },
  { pageKey: 'about', pageType: 'about', label: 'Hakkımızda' },
  { pageKey: 'contact', pageType: 'contact', label: 'İletişim' },
  { pageKey: 'blog', pageType: 'blog', label: 'Blog' },
]

function buildInitialEntries(): SeoEntry[] {
  const entries: SeoEntry[] = []
  const locales: ('tr' | 'en' | 'ru')[] = ['tr', 'en', 'ru']

  locales.forEach(locale => {
    staticPages.forEach(p => {
      entries.push({ ...p, locale, metaTitle: '', metaDescription: '', ogTitle: '', ogDescription: '', noindex: false })
    })
    villas.slice(0, 5).forEach(v => {
      const t = v.translations[locale]
      entries.push({
        pageKey: `villa_${v.id}`,
        pageType: 'villa',
        locale,
        label: `Villa: ${v.translations.tr.name}`,
        metaTitle: t.seoTitle ?? '',
        metaDescription: t.seoDescription ?? '',
        ogTitle: t.name,
        ogDescription: t.shortDescription,
        noindex: false,
      })
    })
  })
  return entries
}

const scoreEntry = (e: SeoEntry) => {
  let score = 0
  if (e.metaTitle.length >= 30 && e.metaTitle.length <= 60) score += 40
  if (e.metaDescription.length >= 120 && e.metaDescription.length <= 160) score += 40
  if (e.ogTitle) score += 10
  if (e.ogDescription) score += 10
  return score
}

export default function SeoPageManagement() {
  const [entries, setEntries] = useState<SeoEntry[]>(buildInitialEntries)
  const [search, setSearch] = useState('')
  const [activeLocale, setActiveLocale] = useState<'tr' | 'en' | 'ru'>('tr')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  const filtered = entries.filter(
    e => e.locale === activeLocale &&
      (e.label.toLowerCase().includes(search.toLowerCase()) || e.pageKey.includes(search.toLowerCase()))
  )

  const update = (pageKey: string, locale: string, field: string, value: string | boolean) => {
    setEntries(prev => prev.map(e =>
      e.pageKey === pageKey && e.locale === locale ? { ...e, [field]: value } : e
    ))
  }

  const handleSave = (pageKey: string) => {
    setSaved(pageKey)
    setTimeout(() => setSaved(null), 2000)
  }

  const locales = [
    { key: 'tr' as const, flag: '🇹🇷', label: 'TR' },
    { key: 'en' as const, flag: '🇬🇧', label: 'EN' },
    { key: 'ru' as const, flag: '🇷🇺', label: 'RU' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Sayfa Bazlı SEO</h2>
          <p className="text-stone-400 text-sm mt-0.5">Her sayfa için meta etiket ve OG ayarları</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-100 p-4 mb-5 flex items-center gap-4">
        <Search size={16} className="text-stone-400 shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Sayfa ara..."
          className="flex-1 text-sm focus:outline-none text-stone-700 placeholder-stone-400"
        />
        <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg">
          {locales.map(l => (
            <button
              key={l.key}
              onClick={() => setActiveLocale(l.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeLocale === l.key ? 'bg-white text-sky-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pages list */}
      <div className="space-y-2">
        {filtered.map(entry => {
          const score = scoreEntry(entry)
          const isExpanded = expandedKey === `${entry.pageKey}_${entry.locale}`
          const isSaved = saved === `${entry.pageKey}_${entry.locale}`

          return (
            <div key={`${entry.pageKey}_${entry.locale}`} className="bg-white rounded-xl border border-stone-100 overflow-hidden">
              <button
                onClick={() => setExpandedKey(isExpanded ? null : `${entry.pageKey}_${entry.locale}`)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-stone-50 transition-colors text-left"
              >
                {/* Score indicator */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${score >= 80 ? 'bg-emerald-400' : score >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`} />

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-stone-700 text-sm">{entry.label}</div>
                  <div className="text-stone-400 text-xs truncate mt-0.5">
                    {entry.metaTitle || <span className="text-amber-500">Meta başlık eksik</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                    score >= 40 ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {score}%
                  </span>
                  {isExpanded ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-stone-100 p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-600 mb-1.5">
                        Meta Başlık
                        <span className={`ml-2 text-xs font-normal ${entry.metaTitle.length >= 30 && entry.metaTitle.length <= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {entry.metaTitle.length}/60
                        </span>
                      </label>
                      <input
                        value={entry.metaTitle}
                        onChange={e => update(entry.pageKey, entry.locale, 'metaTitle', e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                        placeholder="30-60 karakter önerilir"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-600 mb-1.5">
                        OG Başlık
                      </label>
                      <input
                        value={entry.ogTitle}
                        onChange={e => update(entry.pageKey, entry.locale, 'ogTitle', e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-600 mb-1.5">
                        Meta Açıklama
                        <span className={`ml-2 text-xs font-normal ${entry.metaDescription.length >= 120 && entry.metaDescription.length <= 160 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {entry.metaDescription.length}/160
                        </span>
                      </label>
                      <textarea
                        value={entry.metaDescription}
                        onChange={e => update(entry.pageKey, entry.locale, 'metaDescription', e.target.value)}
                        rows={3}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 resize-none"
                        placeholder="120-160 karakter önerilir"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-600 mb-1.5">OG Açıklama</label>
                      <textarea
                        value={entry.ogDescription}
                        onChange={e => update(entry.pageKey, entry.locale, 'ogDescription', e.target.value)}
                        rows={3}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={entry.noindex}
                        onChange={e => update(entry.pageKey, entry.locale, 'noindex', e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600"
                      />
                      <span className="text-sm text-stone-600">Noindex (arama motorlarında gizle)</span>
                    </label>
                    <button
                      onClick={() => handleSave(`${entry.pageKey}_${entry.locale}`)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSaved ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-600 text-white hover:bg-sky-700'
                      }`}
                    >
                      {isSaved ? <CheckCircle size={14} /> : <Save size={14} />}
                      {isSaved ? 'Kaydedildi' : 'Kaydet'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
