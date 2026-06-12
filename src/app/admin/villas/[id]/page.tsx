'use client'
import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { villas } from '@/lib/data/villas'
import { categories } from '@/lib/data/categories'
import { amenities } from '@/lib/data/amenities'
import { Save, ArrowLeft, Plus, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useVillaStore } from '@/store/villaStore'

const tabs = ['Genel', 'İçerik (TR)', 'İçerik (EN)', 'İçerik (RU)', 'Görseller', 'Özellikler', 'Kategoriler', 'Fiyatlandırma']

function EInput({ label, value, onChange, type = 'text' }: { label: string; value: string | number; onChange: (v: string | number) => void; type?: string }) {
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

function ETextarea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
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

export default function EditVillaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { updateVilla, getVillaById } = useVillaStore()
  const villa = getVillaById(id) || villas.find(v => v.id === id)

  const [activeTab, setActiveTab] = useState(0)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    bedrooms: villa?.bedrooms ?? 3,
    bathrooms: villa?.bathrooms ?? 2,
    maxGuests: villa?.maxGuests ?? 6,
    sizeSqm: villa?.sizeSqm ?? 200,
    basePricePerNight: villa?.basePricePerNight ?? 350,
    cleaningFee: villa?.cleaningFee ?? 70,
    securityDeposit: villa?.securityDeposit ?? 400,
    minStayNights: villa?.minStayNights ?? 3,
    checkinTime: villa?.checkinTime ?? '14:00',
    checkoutTime: villa?.checkoutTime ?? '11:00',
    locationAddress: villa?.locationAddress ?? '',
    locationDistrict: villa?.locationDistrict ?? 'Kaş',
    isFeatured: villa?.isFeatured ?? false,
    isHoneymoon: villa?.isHoneymoon ?? false,
    status: villa?.status ?? 'active',
    nameTR: villa?.translations.tr.name ?? '',
    descTR: villa?.translations.tr.description ?? '',
    shortDescTR: villa?.translations.tr.shortDescription ?? '',
    nameEN: villa?.translations.en.name ?? '',
    descEN: villa?.translations.en.description ?? '',
    shortDescEN: villa?.translations.en.shortDescription ?? '',
    nameRU: villa?.translations.ru.name ?? '',
    descRU: villa?.translations.ru.description ?? '',
    shortDescRU: villa?.translations.ru.shortDescription ?? '',
    selectedAmenities: villa?.amenities ?? [] as string[],
    selectedCategories: villa?.categories ?? [] as string[],
    imageUrls: villa?.images.map(i => i.url) ?? [''] as string[],
    pricingRules: villa?.pricingRules.map(r => ({
      name: r.name,
      startDate: r.startDate,
      endDate: r.endDate,
      pricePerNight: r.pricePerNight,
      type: r.type,
    })) ?? [] as { name: string; startDate: string; endDate: string; pricePerNight: number; type: string }[],
  })

  if (!villa) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500">Villa bulunamadı.</p>
        <button onClick={() => router.push('/admin/villas')} className="mt-4 text-sky-600 hover:text-sky-700">
          Geri dön
        </button>
      </div>
    )
  }

  const toggleAmenity = (slug: string) => {
    setForm(f => ({
      ...f,
      selectedAmenities: f.selectedAmenities.includes(slug)
        ? f.selectedAmenities.filter(a => a !== slug)
        : [...f.selectedAmenities, slug],
    }))
  }

  const toggleCategory = (slug: string) => {
    setForm(f => ({
      ...f,
      selectedCategories: f.selectedCategories.includes(slug)
        ? f.selectedCategories.filter(c => c !== slug)
        : [...f.selectedCategories, slug],
    }))
  }

  const handleSave = () => {
    if (!villa) return
    updateVilla({
      ...villa,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      maxGuests: form.maxGuests,
      sizeSqm: form.sizeSqm,
      basePricePerNight: form.basePricePerNight,
      cleaningFee: form.cleaningFee,
      securityDeposit: form.securityDeposit,
      minStayNights: form.minStayNights,
      checkinTime: form.checkinTime,
      checkoutTime: form.checkoutTime,
      locationAddress: form.locationAddress,
      locationDistrict: form.locationDistrict,
      isFeatured: form.isFeatured,
      isHoneymoon: form.isHoneymoon,
      status: form.status as 'active' | 'inactive' | 'draft',
      amenities: form.selectedAmenities,
      categories: form.selectedCategories,
      images: form.imageUrls.filter(Boolean).map((url, i) => ({
        id: `${villa.id}-img-${i}`,
        url,
        altText: '',
        sortOrder: i,
        isCover: i === 0,
      })),
      translations: {
        tr: { ...villa.translations.tr, name: form.nameTR, description: form.descTR, shortDescription: form.shortDescTR },
        en: { ...villa.translations.en, name: form.nameEN, description: form.descEN, shortDescription: form.shortDescEN },
        ru: { ...villa.translations.ru, name: form.nameRU, description: form.descRU, shortDescription: form.shortDescRU },
      },
      updatedAt: new Date().toISOString(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const fv = form as unknown as Record<string, string | number>
  const sv = (field: string) => (v: string | number) => setForm(f => ({ ...f, [field]: v }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-stone-800">{villa.translations.tr.name}</h2>
            <p className="text-stone-400 text-xs mt-0.5">{villa.id} · {villa.locationDistrict}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/tr/villas/${villa.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-stone-200 text-stone-600 font-medium rounded-xl hover:bg-stone-50 transition-colors text-sm"
          >
            <ExternalLink size={14} />
            Görüntüle
          </Link>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-colors text-sm ${
              saved ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white hover:bg-sky-700'
            }`}
          >
            <Save size={16} />
            {saved ? 'Kaydedildi!' : 'Kaydet'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === i ? 'bg-white text-sky-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
        {/* Tab 0: General */}
        {activeTab === 0 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <EInput label="Yatak Odası"            value={form.bedrooms}          onChange={sv('bedrooms')}          type="number"/>
              <EInput label="Banyo"                  value={form.bathrooms}         onChange={sv('bathrooms')}         type="number"/>
              <EInput label="Max Misafir"            value={form.maxGuests}         onChange={sv('maxGuests')}         type="number"/>
              <EInput label="Büyüklük (m²)"          value={form.sizeSqm}           onChange={sv('sizeSqm')}           type="number"/>
              <EInput label="Taban Fiyat (EUR/gece)" value={form.basePricePerNight} onChange={sv('basePricePerNight')} type="number"/>
              <EInput label="Temizlik Ücreti (EUR)"  value={form.cleaningFee}       onChange={sv('cleaningFee')}       type="number"/>
              <EInput label="Depozito (EUR)"         value={form.securityDeposit}   onChange={sv('securityDeposit')}   type="number"/>
              <EInput label="Min. Konaklama (gece)"  value={form.minStayNights}     onChange={sv('minStayNights')}     type="number"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <EInput label="Giriş Saati" value={form.checkinTime}  onChange={sv('checkinTime')}/>
              <EInput label="Çıkış Saati" value={form.checkoutTime} onChange={sv('checkoutTime')}/>
            </div>
            <EInput label="Adres" value={form.locationAddress} onChange={sv('locationAddress')}/>
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1.5">Bölge</label>
              <select
                value={form.locationDistrict}
                onChange={e => setForm(f => ({ ...f, locationDistrict: e.target.value }))}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
              >
                <option>Kaş</option>
                <option>Kalkan</option>
              </select>
            </div>
            <div className="flex gap-6">
              {[['isFeatured', 'Öne Çıkan'], ['isHoneymoon', 'Balayı Villası']].map(([field, label]) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(form as Record<string, unknown>)[field] as boolean}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.checked }))}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                  <span className="text-sm font-medium text-stone-700">{label}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1.5">Durum</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' | 'draft' }))}
                className="w-48 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
              >
                <option value="active">Aktif</option>
                <option value="draft">Taslak</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 1-3: Content */}
        {[1, 2, 3].includes(activeTab) && (() => {
          const langs = [['TR', 'nameTR', 'descTR', 'shortDescTR'], ['EN', 'nameEN', 'descEN', 'shortDescEN'], ['RU', 'nameRU', 'descRU', 'shortDescRU']]
          const [lang, nameF, descF, shortF] = langs[activeTab - 1]
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-stone-100 text-stone-600 text-xs font-bold px-2 py-1 rounded">
                  {lang === 'TR' ? '🇹🇷' : lang === 'EN' ? '🇬🇧' : '🇷🇺'} {lang}
                </span>
              </div>
              <EInput    label="Villa Adı"        value={String(fv[nameF]  ?? '')} onChange={sv(nameF)} />
              <ETextarea label="Kısa Açıklama"   value={String(fv[shortF] ?? '')} onChange={sv(shortF) as (v:string)=>void} />
              <ETextarea label="Detaylı Açıklama" value={String(fv[descF]  ?? '')} onChange={sv(descF)  as (v:string)=>void} />
            </div>
          )
        })()}

        {/* Tab 4: Images */}
        {activeTab === 4 && (
          <div>
            <p className="text-stone-500 text-sm mb-5">Görsel URL'lerini girin veya düzenleyin</p>
            <div className="space-y-3">
              {form.imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={url}
                    onChange={e => {
                      const urls = [...form.imageUrls]
                      urls[i] = e.target.value
                      setForm(f => ({ ...f, imageUrls: urls }))
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                  />
                  {url && <img src={url} alt="" className="w-12 h-10 rounded-lg object-cover shrink-0" />}
                  {i === 0 && <span className="text-xs text-sky-600 font-medium whitespace-nowrap">Kapak</span>}
                  <button onClick={() => setForm(f => ({ ...f, imageUrls: f.imageUrls.filter((_, idx) => idx !== i) }))}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setForm(f => ({ ...f, imageUrls: [...f.imageUrls, ''] }))}
                className="flex items-center gap-2 text-sky-600 text-sm font-medium hover:text-sky-700"
              >
                <Plus size={14} /> Görsel Ekle
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
                    className="w-4 h-4 text-sky-600 rounded"
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
            <p className="text-stone-500 text-sm mb-5">Villa'nın ait olduğu kategorileri seçin</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.slug)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm transition-all ${
                    form.selectedCategories.includes(cat.slug)
                      ? 'border-sky-500 bg-sky-50 text-sky-700 font-medium'
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
                  pricingRules: [...f.pricingRules, { name: '', startDate: '', endDate: '', pricePerNight: 0, type: 'peak' }]
                }))}
                className="flex items-center gap-1.5 text-sky-600 text-sm font-medium"
              >
                <Plus size={14} /> Kural Ekle
              </button>
            </div>
            {form.pricingRules.length === 0 ? (
              <div className="text-center py-8 text-stone-300">
                <p>Henüz fiyatlandırma kuralı eklenmedi.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.pricingRules.map((rule, i) => (
                  <div key={i} className="bg-stone-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <input placeholder="Kural Adı" value={rule.name} onChange={e => {
                      const rules = [...form.pricingRules]; rules[i] = { ...rules[i], name: e.target.value }
                      setForm(f => ({ ...f, pricingRules: rules }))
                    }} className="border border-stone-200 rounded-lg px-2.5 py-2 text-sm" />
                    <input type="date" value={rule.startDate} onChange={e => {
                      const rules = [...form.pricingRules]; rules[i] = { ...rules[i], startDate: e.target.value }
                      setForm(f => ({ ...f, pricingRules: rules }))
                    }} className="border border-stone-200 rounded-lg px-2.5 py-2 text-sm" />
                    <input type="date" value={rule.endDate} onChange={e => {
                      const rules = [...form.pricingRules]; rules[i] = { ...rules[i], endDate: e.target.value }
                      setForm(f => ({ ...f, pricingRules: rules }))
                    }} className="border border-stone-200 rounded-lg px-2.5 py-2 text-sm" />
                    <input type="number" placeholder="Fiyat (EUR)" value={rule.pricePerNight || ''} onChange={e => {
                      const rules = [...form.pricingRules]; rules[i] = { ...rules[i], pricePerNight: Number(e.target.value) }
                      setForm(f => ({ ...f, pricingRules: rules }))
                    }} className="border border-stone-200 rounded-lg px-2.5 py-2 text-sm" />
                    <button onClick={() => setForm(f => ({ ...f, pricingRules: f.pricingRules.filter((_, idx) => idx !== i) }))}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg flex items-center justify-center">
                      <Trash2 size={16} />
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
