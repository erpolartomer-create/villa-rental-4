'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Send, CheckCircle } from 'lucide-react'

export default function EmailSettingsPage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [settings, setSettings] = useState({
    resendApiKey: '',
    fromEmail: 'noreply@kaskalkan.com',
    fromName: 'Kaş & Kalkan Villalar',
    adminEmail: 'info@kaskalkan.com',
    replyTo: 'info@kaskalkan.com',
    bookingConfirmEnabled: true,
    bookingNotifyEnabled: true,
    inquiryEnabled: true,
    testEmail: '',
  })

  const update = (field: string, value: string | boolean) =>
    setSettings(prev => ({ ...prev, [field]: value }))

  const sendTest = () => {
    setTestSent(true)
    setTimeout(() => setTestSent(false), 3000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-bold text-stone-800">E-posta Ayarları</h2>
        </div>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
          className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm transition-colors ${saved ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white hover:bg-sky-700'}`}
        >
          <Save size={16} />
          {saved ? 'Kaydedildi!' : 'Kaydet'}
        </button>
      </div>

      <div className="space-y-6">
        {/* API config */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">Resend API</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1.5">API Anahtarı</label>
              <input
                type="password"
                value={settings.resendApiKey}
                onChange={e => update('resendApiKey', e.target.value)}
                placeholder="re_xxxxxxxxxxxxxxxxxx"
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 font-mono"
              />
              <p className="text-xs text-stone-400 mt-1">
                Resend hesabınızdan API anahtarı alın: <span className="text-sky-600">resend.com/api-keys</span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5">Gönderen E-posta</label>
                <input
                  value={settings.fromEmail}
                  onChange={e => update('fromEmail', e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5">Gönderen Adı</label>
                <input
                  value={settings.fromName}
                  onChange={e => update('fromName', e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5">Admin Bildirimleri</label>
                <input
                  value={settings.adminEmail}
                  onChange={e => update('adminEmail', e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5">Reply-To</label>
                <input
                  value={settings.replyTo}
                  onChange={e => update('replyTo', e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email triggers */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">E-posta Tetikleyicileri</h3>
          <div className="space-y-3">
            {[
              { field: 'bookingConfirmEnabled', label: 'Rezervasyon Onay E-postası', desc: 'Misafire rezervasyon onaylandığında' },
              { field: 'bookingNotifyEnabled', label: 'Admin Bildirim E-postası', desc: 'Yeni rezervasyonda admin\'e bildir' },
              { field: 'inquiryEnabled', label: 'Sorgulama E-postası', desc: 'İletişim formu gönderiminde' },
            ].map(item => (
              <label key={item.field} className="flex items-center justify-between p-4 rounded-xl border border-stone-100 cursor-pointer hover:bg-stone-50">
                <div>
                  <div className="font-medium text-stone-700 text-sm">{item.label}</div>
                  <div className="text-stone-400 text-xs">{item.desc}</div>
                </div>
                <div
                  onClick={() => update(item.field, !(settings as unknown as Record<string, boolean>)[item.field])}
                  className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${(settings as unknown as Record<string, boolean>)[item.field] ? 'bg-sky-600' : 'bg-stone-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${(settings as unknown as Record<string, boolean>)[item.field] ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Test email */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-5">Test E-postası Gönder</h3>
          <div className="flex gap-3">
            <input
              type="email"
              value={settings.testEmail}
              onChange={e => update('testEmail', e.target.value)}
              placeholder="test@email.com"
              className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
            />
            <button
              onClick={sendTest}
              disabled={!settings.testEmail}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${testSent ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-600 text-white hover:bg-sky-700 disabled:bg-stone-200 disabled:text-stone-400'}`}
            >
              {testSent ? <CheckCircle size={16} /> : <Send size={16} />}
              {testSent ? 'Gönderildi!' : 'Test Gönder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
