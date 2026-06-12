import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Shield, Award, HeadphonesIcon, Users, Star, Home, ArrowRight, CheckCircle2, Globe2 } from 'lucide-react'

const TEAM = [
  {
    name: 'Ahmet Yılmaz',
    role: 'Kurucu & CEO',
    bio: '15 yıllık turizm deneyimi',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Ayşe Kaya',
    role: 'Villa Koordinatörü',
    bio: 'Kaş & Kalkan uzmanı',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  {
    name: 'Ivan Petrov',
    role: 'Rusça Müşteri Hizm.',
    bio: 'Rus turistlere özel hizmet',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  },
  {
    name: 'Emma Wilson',
    role: 'İngilizce Destek',
    bio: 'Uluslararası müşteri ilişkileri',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  },
]

const MILESTONES = [
  { year: '2015', label: 'Kaş\'ta kurulduk', desc: '5 villa ile başladık' },
  { year: '2018', label: 'Kalkan\'a genişledik', desc: '50+ villa portföyü' },
  { year: '2021', label: 'Dijital platform', desc: '7/24 online rezervasyon' },
  { year: '2025', label: 'Bölgenin lideri', desc: '200+ villa, 5000+ misafir' },
]

export default function AboutPage() {
  const t = useTranslations('about')
  const locale = useLocale()

  const stats = [
    { value: '200+', label: 'Premium Villa', icon: Home },
    { value: '5.000+', label: 'Mutlu Misafir', icon: Users },
    { value: '4.9', label: 'Ortalama Puan', icon: Star },
    { value: '10', label: 'Yıllık Deneyim', icon: Award },
  ]

  const values = [
    {
      title: t('values.trust'),
      desc: t('values.trustDesc'),
      icon: Shield,
    },
    {
      title: t('values.quality'),
      desc: t('values.qualityDesc'),
      icon: Award,
    },
    {
      title: t('values.service'),
      desc: t('values.serviceDesc'),
      icon: HeadphonesIcon,
    },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* ── Cinematic Hero ── */}
      <div className="relative overflow-hidden" style={{ minHeight: '50vh' }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=2000&q=85"
            alt="Kaş Kalkan"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          <div className="absolute bottom-0 left-1/3 w-96 h-48 bg-[#c8892a]/10 blur-[80px]" />
        </div>

        <div className="relative z-10 container-villa flex flex-col justify-end pt-32 pb-14">
          <div className="inline-flex items-center gap-2 bg-[#c8892a]/20 border border-[#c8892a]/40 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5 w-fit">
            <Globe2 size={11} />
            Hakkımızda
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight mb-4 max-w-2xl">
            {t('title')}
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* ── Story + Photo Bento ── */}
      <section className="section-padding bg-white">
        <div className="container-villa grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left: Story */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <Award size={11} />
              Hikayemiz
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1c1712] leading-tight tracking-tight mb-6">
              {t('story.title')}
            </h2>
            <p className="text-[#9b9389] text-base leading-[1.85] mb-8">
              {t('story.content')}
            </p>

            {/* Milestones */}
            <div className="space-y-0">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="flex gap-5 group">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#c8892a]/15 border-2 border-[#c8892a]/40 flex items-center justify-center shrink-0 group-hover:bg-[#c8892a] group-hover:border-[#c8892a] transition-all duration-300">
                      <CheckCircle2 size={14} className="text-[#c8892a] group-hover:text-white transition-colors" />
                    </div>
                    {i < MILESTONES.length - 1 && (
                      <div className="w-px flex-1 bg-[#c8892a]/20 my-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[#c8892a] font-black text-sm">{m.year}</span>
                      <span className="font-bold text-[#1c1712] text-sm">{m.label}</span>
                    </div>
                    <p className="text-[#9b9389] text-xs">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Photo bento */}
          <div className="grid grid-cols-5 gap-3" style={{ height: 460 }}>
            <div className="col-span-3 row-span-2 rounded-3xl overflow-hidden h-full">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=85"
                alt="Villa manzara"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-2 rounded-3xl overflow-hidden" style={{ height: 220 }}>
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=85"
                alt="Kaş sahil"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-2 rounded-3xl overflow-hidden" style={{ height: 224 }}>
              <img
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=700&q=85"
                alt="Villa havuz"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-[#071220] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#071220]/75 via-[#0a1a2e]/90 to-[#0a1a2e]/97" />
        <div className="absolute bottom-0 left-1/4 -translate-x-1/2 w-[500px] h-64 bg-[#c8892a]/8 blur-[90px]" />
        <div className="relative z-10 container-villa grid grid-cols-2 sm:grid-cols-4 gap-5">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center bg-white/7 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-8 hover:bg-white/12 hover:border-[#c8892a]/25 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#c8892a]/15 border border-[#c8892a]/25 rounded-2xl flex items-center justify-center mb-4">
                <stat.icon size={22} className="text-[#c8892a]" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight mb-1">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section-padding bg-white">
        <div className="container-villa">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              <Shield size={11} />
              Değerlerimiz
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1c1712] tracking-tight">
              {t('values.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="group relative p-8 bg-white border border-[#e8e3da] hover:border-[#c8892a]/30 rounded-3xl shadow-[0_2px_16px_rgba(28,23,18,0.05)] hover:shadow-[0_16px_48px_rgba(28,23,18,0.10)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Background number */}
                <div className="absolute top-4 right-5 text-8xl font-black text-[#e8e3da] group-hover:text-[#c8892a]/8 transition-colors select-none leading-none">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="relative">
                  <div className="w-14 h-14 bg-[#c8892a]/12 border border-[#c8892a]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#c8892a]/20 transition-colors">
                    <v.icon size={24} className="text-[#c8892a]" />
                  </div>
                  <h3 className="font-black text-[#1c1712] text-xl mb-3 tracking-tight">{v.title}</h3>
                  <p className="text-[#9b9389] leading-relaxed text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section-padding bg-[#f7f5f0]">
        <div className="container-villa">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              <Users size={11} />
              Ekibimiz
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1c1712] tracking-tight">
              {t('team')}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {TEAM.map(member => (
              <div
                key={member.name}
                className="group bg-white border border-[#e8e3da] hover:border-[#c8892a]/25 rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(28,23,18,0.05)] hover:shadow-[0_12px_40px_rgba(28,23,18,0.10)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative h-52 sm:h-56 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                {/* Info */}
                <div className="p-4 text-center">
                  <h3 className="font-bold text-[#1c1712] mb-0.5 text-sm">{member.name}</h3>
                  <p className="text-[#c8892a] text-xs font-semibold mb-1.5">{member.role}</p>
                  <p className="text-[#9b9389] text-xs leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#071220]/75 via-[#0a1a2e]/90 to-[#0a1a2e]/97" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=1600&q=70"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-[#c8892a]/12 blur-[80px]" />

        <div className="relative z-10 container-villa max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#c8892a]/20 border border-[#c8892a]/40 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            <Star size={11} />
            Hayalinizdeki Tatil
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            Tatil Planlamaya<br />
            <span style={{ color: '#e6a83c' }}>Hazır mısınız?</span>
          </h2>
          <p className="text-white/55 text-base leading-relaxed mb-10">
            Uzman ekibimiz size en uygun villayı bulmak için hazır. 7/24 destek, ücretsiz danışmanlık.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold rounded-2xl transition-all shadow-[0_8px_32px_rgba(200,137,42,0.45)] hover:shadow-[0_12px_40px_rgba(200,137,42,0.6)]"
            >
              {t('contact')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/villas`}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold rounded-2xl transition-all"
            >
              <Home size={16} />
              Villaları Gör
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
