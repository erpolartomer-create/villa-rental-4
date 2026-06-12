'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Save, ChevronRight, Mail, Puzzle } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'

export default function AdminSettingsPage() {
  const { settings: stored, updateSettings } = useSettingsStore()
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    siteName: stored.siteName,
    siteUrl: 'https://kaskalkan.com',
    contactPhone: stored.phone,
    contactEmail: stored.email,
    whatsapp: stored.whatsapp,
    defaultCheckin: stored.checkinTime,
    defaultCheckout: stored.checkoutTime,
    currency: stored.currency,
    timezone: 'Europe/Istanbul',
    minBookingDays: String(stored.minStayNights),
    depositPercent: '30',
    cancellationPolicy: 'Giriş tarihinden 30 gün öncesine kadar tam iade. 30-14 gün arası %50 iade. 14 günden az iptal durumunda iade yapılmaz.',
  })

  const update = (field: string, value: string) => setSettings(prev => ({ ...prev, [field]: value }))

  const Field = ({ label, field, type = 'text' }: { label: string; field: string; type?: string }) => (
    <div>
      <label className="block text-sm font-semibold text-stone-600 mb-1.5">{label}</label>
      <input
        type={type}
        value={(settings as Record<string, string>)[field]}
        onChange={e => update(field, e.target.value)}
        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
      />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Genel Ayarlar</h2>
          <p className="text-stone-400 text-sm mt-0.5">Site geneli yapılandırma</p>
        </div>
        <button
          onClick={() => {
              updateSettings({
                siteName: settings.siteName,
                phone: settings.contactPhone,
                email: settings.contactEmail,
                whatsapp: settings.whatsapp,
                checkinTime: settings.defaultCheckin,
                checkoutTime: settings.defaultCheckout,
                currency: settings.currency,
                minStayNights: Number(settings.minBookingDays),
              })
              setSaved(true)
              setTimeout(() => setSaved(false), 2500)
            }}
          className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm transition-colors ${saved ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white hover:bg-sky-700'}`}
        >
          <Save size={16} />
          {saved ? 'Kaydedildi!' : 'Kaydet'}
        </button>
      </div>

      {/* Quick nav to sub-settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Link href="/admin/settings/email" className="flex items-center justify-between bg-white rounded-xl border border-stone-100 p-4 hover:border-sky-200 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
              <Mail size={18} />
            </div>
            <div>
              <div className="font-semibold text-stone-700">E-posta Ayarları</div>
              <div className="text-stone-400 text-xs">Resend API, şablonlar</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-stone-300 group-hover:text-sky-500" />
        </Link>
        <Link href="/admin/settings/integrations" className="flex items-center justify-between bg-white rounded-xl border border-stone-100 p-4 hover:border-sky-200 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Puzzle size={18} />
            </div>
            <div>
              <div className="font-semibold text-stone-700">Entegrasyonlar</div>
              <div className="text-stone-400 text-xs">Supabase, Analytics</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-stone-300 group-hover:text-sky-500" />
        </Link>
      </div>

      <div className="space-y-6">
        {/* Site info */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">Site Bilgileri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Site Adı" field="siteName" />
            <Field label="Site URL" field="siteUrl" />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">İletişim Bilgileri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Telefon" field="contactPhone" />
            <Field label="E-posta" field="contactEmail" />
            <Field label="WhatsApp (ülke kodu dahil)" field="whatsapp" />
          </div>
        </div>

        {/* Booking defaults */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">Rezervasyon Ayarları</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <Field label="Varsayılan Giriş Saati" field="defaultCheckin" />
            <Field label="Varsayılan Çıkış Saati" field="defaultCheckout" />
            <Field label="Min. Konaklama (gece)" field="minBookingDays" type="number" />
            <Field label="Depozit Oranı (%)" field="depositPercent" type="number" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-600 mb-1.5">İptal Politikası</label>
            <textarea
              value={settings.cancellationPolicy}
              onChange={e => update('cancellationPolicy', e.target.value)}
              rows={4}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 resize-none"
            />
          </div>
        </div>

        {/* Currency & Timezone */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">Bölgesel Ayarlar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1.5">Varsayılan Para Birimi</label>
              <select
                value={settings.currency}
                onChange={e => update('currency', e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="TRY">TRY (₺)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1.5">Saat Dilimi</label>
              <select
                value={settings.timezone}
                onChange={e => update('timezone', e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
              >
                <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
