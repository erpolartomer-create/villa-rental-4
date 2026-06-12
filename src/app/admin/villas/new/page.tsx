'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { categories } from '@/lib/data/categories'
import { amenities } from '@/lib/data/amenities'
import { Save, ArrowLeft, Plus, Trash2, Languages, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const tabs = ['Genel', 'İçerik (TR)', 'İçerik (EN)', 'İçerik (RU)', 'Görseller', 'Özellikler', 'Kategoriler', 'Fiyatlandırma']

const LANG_META = {
  TR: { code: 'tr', flag: '🇹🇷', label: 'Türkçe',  nameF: 'nameTR', shortF: 'shortDescTR', descF: 'descTR' },
  EN: { code: 'en', flag: '🇬🇧', label: 'İngilizce', nameF: 'nameEN', shortF: 'shortDescEN', descF: 'descEN' },
  RU: { code: 'ru', flag: '🇷🇺', label: 'Rusça',    nameF: 'nameRU', shortF: 'shortDescRU', descF: 'descRU' },
} as const

type LangKey = 'TR' | 'EN' | 'RU'
type TranslateState = 'idle' | 'loading' | 'success' | 'error'

// Defined OUTSIDE the page component so React never recreates the type on re-render → no focus loss
function FInput({
  label, value, onChange, type = 'text',
}: {
  label: string; value: string | number; onChange: (v: string | number) => void; type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-600 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c8892a]"
      />
    </div>
  )
}

function FTextarea({
  label, value, onChange, rows = 4,
}: {
  label: string; value: string; onChange: (v: string) => void; rows?: number
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-600 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c8892a] resize-none"
      />
    </div>
  )
}

export default function NewVillaPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [translateState, setTranslateState] = useState<TranslateState>('idle')
  const [translateError, setTranslateError] = useState('')

  const [form, setForm] = useState({
    bedrooms: 3, bathrooms: 2, maxGuests: 6, sizeSqm: 200,
    basePricePerNight: 350, cleaningFee: 70, securityDeposit: 400,
    minStayNights: 3, checkinTime: '14:00', checkoutTime: '11:00',
    locationAddress: '', locationDistrict: 'Kaş',
    isFeatured: false, isHoneymoon: false, status: 'active',
    nameTR: '', descTR: '', shortDescTR: '',
    nameEN: '', descEN: '', shortDescEN: '',
    nameRU: '', descRU: '', shortDescRU: '',
    selectedAmenities: [] as string[],
    selectedCategories: [] as string[],
    imageUrls: [''] as string[],
    pricingRules: [] as { name: string; startDate: string; endDate: string; pricePerNight: number; type: string }[],
  })

  const toggleAmenity = (slug: string) =>
    setForm(f => ({
      ...f,
      selectedAmenities: f.selectedAmenities.includes(slug)
        ? f.selectedAmenities.filter(a => a !== slug)
        : [...f.selectedAmenities, slug],
    }))

  const toggleCategory = (slug: string) =>
    setForm(f => ({
      ...f,
      selectedCategories: f.selectedCategories.includes(slug)
        ? f.selectedCategories.filter(c => c !== slug)
        : [...f.selectedCategories, slug],
    }))

  const handleSave = () => {
    alert('Villa kaydedildi! (Demo)')
    router.push('/admin/villas')
  }

  // ── Auto-translate ─────────────────────────────────────────────
  const handleTranslate = async (sourceLang: LangKey) => {
    const meta    = LANG_META[sourceLang]
    const targets = (['TR', 'EN', 'RU'] as LangKey[]).filter(l => l !== sourceLang)

    const f = form as unknown as Record<string, string>
    const sourceFields = {
      name:      f[meta.nameF]  || '',
      shortDesc: f[meta.shortF] || '',
      desc:      f[meta.descF]  || '',
    }

    if (!sourceFields.name && !sourceFields.shortDesc && !sourceFields.desc) {
      setTranslateError(`Önce ${meta.label} içeriğini doldurun.`)
      setTranslateState('error')
      setTimeout(() => setTranslateState('idle'), 3000)
      return
    }

    setTranslateState('loading')
    setTranslateError('')

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: sourceFields,
          from: meta.code,
          targets: targets.map(l => LANG_META[l].code),
        }),
      })
      const data = await res.json()

      if (!data.ok) throw new Error(data.error || 'Çeviri başarısız')

      // Map result back to form fields
      setForm(prev => {
        const next = { ...prev } as unknown as Record<string, string>
        for (const target of targets) {
          const tm  = LANG_META[target]
          const r   = data.result[tm.code]
          if (r) {
            next[tm.nameF]  = r.name      || ''
            next[tm.shortF] = r.shortDesc || ''
            next[tm.descF]  = r.desc      || ''
          }
        }
        return next as unknown as typeof prev
      })

      setTranslateState('success')
      setTimeout(() => setTranslateState('idle'), 3000)
    } catch (err) {
      setTranslateError(String(err))
      setTranslateState('error')
      setTimeout(() => setTranslateState('idle'), 4000)
    }
  }

  // Shorthand setters — stable reference-like wrappers for FInput/FTextarea
  const set = (field: string) => (v: string | number) => setForm(f => ({ ...f, [field]: v }))

  // ── Content tab lang index ─────────────────────────────────────
  const contentLang: LangKey | null =
    activeTab === 1 ? 'TR' : activeTab === 2 ? 'EN' : activeTab === 3 ? 'RU' : null

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-bold text-stone-800">Yeni Villa Ekle</h2>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c8892a] hover:bg-[#b07820] text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
        >
          <Save size={16} />
          Kaydet
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-5 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === i ? 'bg-white text-[#c8892a] shadow-sm font-semibold' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Auto-translate bar (content tabs only) ── */}
      {contentLang && (
        <div className={`mb-4 rounded-2xl border px-4 py-3 flex flex-wrap items-center gap-3 transition-colors ${
          translateState === 'success' ? 'border-emerald-200 bg-emerald-50' :
          translateState === 'error'   ? 'border-rose-200 bg-rose-50' :
                                         'border-[#c8892a]/20 bg-[#c8892a]/5'
        }`}>

          {/* Source label */}
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-600 shrink-0">
            <Languages size={16} className="text-[#c8892a]"/>
            <span>{LANG_META[contentLang].flag} {LANG_META[contentLang].label}</span>
            <span className="text-stone-300">→</span>
            {(['TR','EN','RU'] as LangKey[]).filter(l => l !== contentLang).map(l => (
              <span key={l}>{LANG_META[l].flag}</span>
            ))}
          </div>

          {/* Translate button */}
          <button
            onClick={() => handleTranslate(contentLang)}
            disabled={translateState === 'loading'}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              translateState === 'loading'
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-[#c8892a] hover:bg-[#b07820] text-white shadow-sm hover:shadow-md'
            }`}
          >
            {translateState === 'loading' ? (
              <><Loader2 size={14} className="animate-spin"/> Çevriliyor...</>
            ) : (
              <><Languages size={14}/> Otomatik Çevir</>
            )}
          </button>

          {/* Status messages */}
          {translateState === 'success' && (
            <div className="flex items-center gap-1.5 text-emerald-700 text-sm font-semibold">
              <CheckCircle size={15}/>
              Diğer diller başarıyla çevrildi!
            </div>
          )}
          {translateState === 'error' && (
            <div className="flex items-center gap-1.5 text-rose-600 text-sm">
              <AlertCircle size={15}/>
              {translateError || 'Çeviri sırasında hata oluştu.'}
            </div>
          )}

          {/* Help text */}
          {translateState === 'idle' && (
            <p className="text-xs text-stone-400 ml-auto hidden sm:block">
              Bu sekmedeki içerik diğer dillere otomatik çevrilir
            </p>
          )}
        </div>
      )}

      {/* ── Tab content ── */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">

        {/* Tab 0: General */}
        {activeTab === 0 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <FInput label="Yatak Odası"           value={form.bedrooms}          onChange={set('bedrooms')}          type="number"/>
              <FInput label="Banyo"                 value={form.bathrooms}         onChange={set('bathrooms')}         type="number"/>
              <FInput label="Max Misafir"           value={form.maxGuests}         onChange={set('maxGuests')}         type="number"/>
              <FInput label="Büyüklük (m²)"         value={form.sizeSqm}           onChange={set('sizeSqm')}           type="number"/>
              <FInput label="Taban Fiyat (EUR/gece)" value={form.basePricePerNight} onChange={set('basePricePerNight')} type="number"/>
              <FInput label="Temizlik Ücreti (EUR)" value={form.cleaningFee}       onChange={set('cleaningFee')}       type="number"/>
              <FInput label="Depozito (EUR)"        value={form.securityDeposit}   onChange={set('securityDeposit')}   type="number"/>
              <FInput label="Min. Konaklama (gece)" value={form.minStayNights}     onChange={set('minStayNights')}     type="number"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FInput label="Giriş Saati" value={form.checkinTime}  onChange={set('checkinTime')}/>
              <FInput label="Çıkış Saati" value={form.checkoutTime} onChange={set('checkoutTime')}/>
            </div>
            <FInput label="Adres" value={form.locationAddress} onChange={set('locationAddress')}/>
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1.5">Bölge</label>
              <select
                value={form.locationDistrict}
                onChange={e => setForm(f => ({ ...f, locationDistrict: e.target.value }))}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c8892a]"
              >
                <option>Kaş</option>
                <option>Kalkan</option>
              </select>
            </div>
            <div className="flex gap-6">
              {[['isFeatured','Öne Çıkan'],['isHoneymoon','Balayı Villası']].map(([field,label]) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(form as Record<string,unknown>)[field] as boolean}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.checked }))}
                    className="w-4 h-4 rounded accent-[#c8892a]"
                  />
                  <span className="text-sm font-medium text-stone-700">{label}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1.5">Durum</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-48 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c8892a]"
              >
                <option value="active">Aktif</option>
                <option value="draft">Taslak</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        )}

        {/* Tabs 1-3: Content (TR / EN / RU) */}
        {[1,2,3].includes(activeTab) && (() => {
          const langKeys: LangKey[] = ['TR','EN','RU']
          const lang = langKeys[activeTab - 1]
          const meta = LANG_META[lang]
          return (
            <div className="space-y-5">
              {/* Lang header */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
                <span className="text-2xl">{meta.flag}</span>
                <div>
                  <div className="font-bold text-stone-800 text-sm">{meta.label} İçeriği</div>
                  <div className="text-xs text-stone-400">
                    {lang === 'TR' ? 'Ana dil — bu içerik zorunludur' : 'Otomatik çeviri butonu ile doldurabilirsiniz'}
                  </div>
                </div>
                {/* Filled indicator */}
                {(form as unknown as Record<string,string>)[meta.nameF] && (
                  <span className="ml-auto inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle size={11}/> Dolduruldu
                  </span>
                )}
              </div>

              <FInput
                label="Villa Adı"
                value={(form as unknown as Record<string,string>)[meta.nameF] || ''}
                onChange={v => setForm(f => ({ ...f, [meta.nameF]: String(v) }))}
              />
              <FTextarea
                label="Kısa Açıklama"
                value={(form as unknown as Record<string,string>)[meta.shortF] || ''}
                onChange={v => setForm(f => ({ ...f, [meta.shortF]: v }))}
                rows={3}
              />
              <FTextarea
                label="Detaylı Açıklama"
                value={(form as unknown as Record<string,string>)[meta.descF] || ''}
                onChange={v => setForm(f => ({ ...f, [meta.descF]: v }))}
                rows={6}
              />
            </div>
          )
        })()}

        {/* Tab 4: Images */}
        {activeTab === 4 && (
          <div>
            <p className="text-stone-500 text-sm mb-5">Görsel URL'lerini girin (Unsplash, Supabase Storage vb.)</p>
            <div className="space-y-3">
              {form.imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={url}
                    onChange={e => {
                      const urls = [...form.imageUrls]; urls[i] = e.target.value
                      setForm(f => ({ ...f, imageUrls: urls }))
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c8892a]"
                  />
                  {url && <img src={url} alt="" className="w-10 h-10 rounded-lg object-cover"/>}
                  <button
                    onClick={() => setForm(f => ({ ...f, imageUrls: f.imageUrls.filter((_,idx) => idx !== i) }))}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
              <button
                onClick={() => setForm(f => ({ ...f, imageUrls: [...f.imageUrls,''] }))}
                className="flex items-center gap-2 text-[#c8892a] text-sm font-medium hover:text-[#b07820]"
              >
                <Plus size={14}/> Görsel Ekle
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Amenities */}
        {activeTab === 5 && (
          <div>
            <p className="text-stone-500 text-sm mb-5">Villanın sunduğu özellik ve hizmetleri seçin</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {amenities.map(a => (
                <label key={a.id} className="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer hover:bg-stone-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.selectedAmenities.includes(a.slug)}
                    onChange={() => toggleAmenity(a.slug)}
                    className="w-4 h-4 rounded accent-[#c8892a]"
                  />
                  <span className="text-sm text-stone-600">{a.icon} {a.translations.tr}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Categories */}
        {activeTab === 6 && (
          <div>
            <p className="text-stone-500 text-sm mb-5">Villa&apos;nın ait olduğu kategorileri seçin</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.slug)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm transition-all ${
                    form.selectedCategories.includes(cat.slug)
                      ? 'border-[#c8892a] bg-[#c8892a]/10 text-[#c8892a] font-medium'
                      : 'border-stone-100 text-stone-600 hover:border-stone-200'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  {cat.translations.tr.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Pricing */}
        {activeTab === 7 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-stone-500 text-sm">Mevsimsel fiyatlandırma kuralları</p>
              <button
                onClick={() => setForm(f => ({
                  ...f,
                  pricingRules: [...f.pricingRules, { name:'', startDate:'', endDate:'', pricePerNight:0, type:'peak' }],
                }))}
                className="flex items-center gap-1.5 text-[#c8892a] text-sm font-medium"
              >
                <Plus size={14}/> Kural Ekle
              </button>
            </div>
            {form.pricingRules.length === 0 ? (
              <div className="text-center py-8 text-stone-300">
                <p>Henüz fiyatlandırma kuralı eklenmedi.</p>
                <p className="text-sm mt-1">Yüksek/düşük sezon fiyatları için kural ekleyin.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.pricingRules.map((rule, i) => (
                  <div key={i} className="bg-stone-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <input placeholder="Kural Adı" value={rule.name} onChange={e => {
                      const rules=[...form.pricingRules]; rules[i].name=e.target.value
                      setForm(f => ({ ...f, pricingRules: rules }))
                    }} className="border border-stone-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:border-[#c8892a]"/>
                    <input type="date" value={rule.startDate} onChange={e => {
                      const rules=[...form.pricingRules]; rules[i].startDate=e.target.value
                      setForm(f => ({ ...f, pricingRules: rules }))
                    }} className="border border-stone-200 rounded-lg px-2.5 py-2 text-sm"/>
                    <input type="date" value={rule.endDate} onChange={e => {
                      const rules=[...form.pricingRules]; rules[i].endDate=e.target.value
                      setForm(f => ({ ...f, pricingRules: rules }))
                    }} className="border border-stone-200 rounded-lg px-2.5 py-2 text-sm"/>
                    <input type="number" placeholder="Fiyat (EUR)" value={rule.pricePerNight||''} onChange={e => {
                      const rules=[...form.pricingRules]; rules[i].pricePerNight=Number(e.target.value)
                      setForm(f => ({ ...f, pricingRules: rules }))
                    }} className="border border-stone-200 rounded-lg px-2.5 py-2 text-sm"/>
                    <button
                      onClick={() => setForm(f => ({ ...f, pricingRules: f.pricingRules.filter((_,idx) => idx !== i) }))}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg flex items-center justify-center"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
