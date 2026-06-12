'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle, Zap, Globe2 } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'

export default function ContactPage() {
  const t = useTranslations('contact')
  const { settings } = useSettingsStore()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const name    = fd.get('name')    as string
    const phone   = fd.get('phone')   as string
    const email   = fd.get('email')   as string
    const subject = fd.get('subject') as string
    const message = fd.get('message') as string

    const text = [
      `Merhaba! Ben ${name}.`,
      subject  && `Konu: ${subject}`,
      email    && `E-posta: ${email}`,
      phone    && `Telefon: ${phone}`,
      message  && `Mesaj: ${message}`,
    ].filter(Boolean).join('\n')

    const waNumber = settings.whatsapp.replace(/\D/g, '')
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank')
    setLoading(false)
    setSent(true)
  }

  const contactInfo = [
    {
      icon: MapPin,
      label: t('info.address'),
      value: t('info.addressValue'),
      href: undefined,
    },
    {
      icon: Phone,
      label: t('info.phone'),
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: t('info.email'),
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: Clock,
      label: t('info.hours'),
      value: t('info.hoursValue'),
      href: undefined,
    },
  ]

  const quickStats = [
    { icon: Zap, label: 'Ortalama yanıt', value: '< 2 saat' },
    { icon: Globe2, label: 'Dil desteği', value: 'TR / EN / RU' },
    { icon: MessageCircle, label: 'WhatsApp', value: '7/24 aktif' },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* ── Cinematic Hero ── */}
      <div className="relative overflow-hidden" style={{ minHeight: '40vh' }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2000&q=85"
            alt="Kaş sahil"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/50 to-black/82" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-1/3 w-96 h-48 bg-[#c8892a]/10 blur-[80px]" />
        </div>

        <div className="relative z-10 container-villa flex flex-col justify-end pt-32 pb-14">
          <div className="inline-flex items-center gap-2 bg-[#c8892a]/20 border border-[#c8892a]/40 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5 w-fit">
            <Mail size={11} />
            İletişim
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4 max-w-xl">
            {t('title')}
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* ── Quick stats bar ── */}
      <div className="bg-[#f7f5f0] border-b border-[#e8e3da]">
        <div className="container-villa py-4 flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-10">
          {quickStats.map(s => (
            <div key={s.label} className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#c8892a]/12 border border-[#c8892a]/20 rounded-xl flex items-center justify-center shrink-0">
                <s.icon size={14} className="text-[#c8892a]" />
              </div>
              <div>
                <div className="text-[10px] text-[#9b9389] uppercase tracking-wider font-semibold leading-none mb-0.5">{s.label}</div>
                <div className="text-sm font-bold text-[#1c1712]">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="container-villa py-14 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* ── Form ── */}
          <div className="lg:col-span-3 bg-white border border-[#e8e3da] rounded-3xl shadow-[0_4px_32px_rgba(28,23,18,0.07)] overflow-hidden">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-8">
                <div className="w-20 h-20 bg-[#c8892a]/12 border border-[#c8892a]/25 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={36} className="text-[#c8892a]" />
                </div>
                <h3 className="text-2xl font-black text-[#1c1712] mb-3">Teşekkürler!</h3>
                <p className="text-[#9b9389] max-w-sm leading-relaxed">{t('form.success')}</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-8 px-6 py-2.5 bg-[#c8892a]/15 hover:bg-[#c8892a]/25 border border-[#c8892a]/30 text-[#c8892a] font-semibold text-sm rounded-xl transition-all"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Form header */}
                <div className="px-8 pt-8 pb-6 border-b border-[#e8e3da]">
                  <div className="inline-flex items-center gap-2 bg-[#c8892a]/12 border border-[#c8892a]/20 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-3">
                    <Send size={10} />
                    Mesaj Formu
                  </div>
                  <h2 className="text-xl font-black text-[#1c1712]">Bize Yazın</h2>
                </div>

                <div className="px-8 py-7 space-y-5">
                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1c1712] uppercase tracking-wider mb-2">
                        {t('form.name')} <span className="text-[#c8892a]">*</span>
                      </label>
                      <input
                        required
                        name="name"
                        placeholder="Ad Soyad"
                        className="w-full border border-[#e8e3da] hover:border-[#c8892a]/40 focus:border-[#c8892a] rounded-xl px-4 py-3 text-sm text-[#1c1712] placeholder-[#c4bdb5] outline-none transition-colors bg-[#fafaf9] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1c1712] uppercase tracking-wider mb-2">
                        {t('form.phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+90 5xx xxx xx xx"
                        className="w-full border border-[#e8e3da] hover:border-[#c8892a]/40 focus:border-[#c8892a] rounded-xl px-4 py-3 text-sm text-[#1c1712] placeholder-[#c4bdb5] outline-none transition-colors bg-[#fafaf9] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#1c1712] uppercase tracking-wider mb-2">
                      {t('form.email')} <span className="text-[#c8892a]">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="ornek@email.com"
                      className="w-full border border-[#e8e3da] hover:border-[#c8892a]/40 focus:border-[#c8892a] rounded-xl px-4 py-3 text-sm text-[#1c1712] placeholder-[#c4bdb5] outline-none transition-colors bg-[#fafaf9] focus:bg-white"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-[#1c1712] uppercase tracking-wider mb-2">
                      {t('form.subject')} <span className="text-[#c8892a]">*</span>
                    </label>
                    <input
                      required
                      name="subject"
                      placeholder="Konu başlığı"
                      className="w-full border border-[#e8e3da] hover:border-[#c8892a]/40 focus:border-[#c8892a] rounded-xl px-4 py-3 text-sm text-[#1c1712] placeholder-[#c4bdb5] outline-none transition-colors bg-[#fafaf9] focus:bg-white"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-[#1c1712] uppercase tracking-wider mb-2">
                      {t('form.message')} <span className="text-[#c8892a]">*</span>
                    </label>
                    <textarea
                      required
                      name="message"
                      rows={5}
                      placeholder="Mesajınızı buraya yazın..."
                      className="w-full border border-[#e8e3da] hover:border-[#c8892a]/40 focus:border-[#c8892a] rounded-xl px-4 py-3 text-sm text-[#1c1712] placeholder-[#c4bdb5] outline-none transition-colors resize-none bg-[#fafaf9] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#c8892a] hover:bg-[#b07820] disabled:bg-[#c8892a]/50 text-white font-bold rounded-xl transition-all shadow-[0_8px_24px_rgba(200,137,42,0.35)] hover:shadow-[0_12px_32px_rgba(200,137,42,0.5)] text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        {t('form.send')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Info column ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Contact info cards */}
            {contactInfo.map(info => (
              <div
                key={info.label}
                className="flex gap-4 bg-white border border-[#e8e3da] hover:border-[#c8892a]/25 rounded-2xl p-5 shadow-[0_2px_12px_rgba(28,23,18,0.05)] hover:shadow-[0_8px_28px_rgba(28,23,18,0.09)] transition-all duration-300 group"
              >
                <div className="w-11 h-11 bg-[#c8892a]/10 border border-[#c8892a]/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#c8892a]/20 transition-colors">
                  <info.icon size={18} className="text-[#c8892a]" />
                </div>
                <div>
                  <div className="text-[10px] text-[#9b9389] font-bold uppercase tracking-wider mb-0.5">{info.label}</div>
                  {info.href ? (
                    <a href={info.href} className="font-semibold text-[#1c1712] hover:text-[#c8892a] transition-colors text-sm">
                      {info.value}
                    </a>
                  ) : (
                    <div className="font-semibold text-[#1c1712] text-sm">{info.value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-2xl p-5 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_8px_28px_rgba(34,197,94,0.45)]"
            >
              <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-sm">WhatsApp ile Ulaşın</div>
                <div className="text-green-100 text-xs">+90 532 123 45 67 · Anında yanıt</div>
              </div>
            </a>

            {/* Map placeholder */}
            <div className="relative bg-[#f7f5f0] border border-[#e8e3da] rounded-2xl overflow-hidden flex-1" style={{ minHeight: 160 }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 bg-[#c8892a]/12 border border-[#c8892a]/20 rounded-xl flex items-center justify-center mb-3">
                  <MapPin size={20} className="text-[#c8892a]" />
                </div>
                <p className="font-bold text-[#1c1712] text-sm mb-0.5">Çukurbağ Yarımadası</p>
                <p className="text-[#9b9389] text-xs">Kaş, Antalya, Türkiye</p>
                <a
                  href="https://maps.google.com/?q=Kas,Antalya,Turkey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-[#c8892a] text-xs font-bold hover:underline"
                >
                  <MapPin size={11} />
                  Haritada Gör
                </a>
              </div>
              {/* Decorative dots */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-[#c8892a]/30 rounded-full" />
              <div className="absolute top-3 right-7 w-1.5 h-1.5 bg-[#c8892a]/20 rounded-full" />
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-[#c8892a]/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
