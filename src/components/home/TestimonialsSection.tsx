'use client'
import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'

const testimonials = [
  { name: 'Ayşe & Mehmet K.', origin: 'İstanbul', rating: 5, text: 'Kalkan\'da geçirdiğimiz tatil hayatımızın en güzeliydi. Villa muhteşemdi, havuz manzarası gözlerimizi kamaştırdı. Kesinlikle tekrar geleceğiz!', villa: 'Villa Azure Dream', avatar: 'AK', color: '#0e3d6e' },
  { name: 'Sarah Thompson',    origin: 'London, UK', rating: 5, text: 'Absolutely breathtaking! The villa exceeded all our expectations. The team was incredibly helpful and responsive throughout our stay.', villa: 'Villa Coral Bay', avatar: 'ST', color: '#c8892a' },
  { name: 'Дмитрий Иванов',   origin: 'Москва', rating: 5, text: 'Невероятное место! Вилла была просто роскошной, вид на море — потрясающим. Персонал очень любезный. Будем возвращаться каждый год!', villa: 'Villa Stone Palace', avatar: 'ДИ', color: '#2d7a4f' },
  { name: 'Fatma & Ali Y.',    origin: 'Ankara', rating: 5, text: 'Balayımız için mükemmel bir seçimdi. Jakuzi ve romantik atmosfer, her şey harikaydı. Teşekkürler!', villa: 'Villa Romantika', avatar: 'FY', color: '#7c3aed' },
  { name: 'Hans Mueller',      origin: 'Berlin, DE', rating: 5, text: 'Fantastic villa with incredible views! Everything was perfect, from the private pool to the fully equipped kitchen. Highly recommended!', villa: 'Villa Turquoise Palace', avatar: 'HM', color: '#db2777' },
  { name: 'Анна Смирнова',     origin: 'Санкт-Петербург', rating: 5, text: 'Прекрасная вилла с замечательным видом на море и бухту. Дети были в восторге от детского бассейна!', villa: 'Villa Patara Sun', avatar: 'АС', color: '#0891b2' },
]

export function TestimonialsSection() {
  const t = useTranslations('home.testimonials')

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: '#08111e' }}>
      {/* Subtle dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Gold atmospheric glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-56 bg-[#c8892a]/7 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-48 bg-[#0e3d6e]/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 container-villa">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#c8892a] text-xs font-bold tracking-widest uppercase mb-3 bg-[#c8892a]/10 border border-[#c8892a]/20 px-3.5 py-1.5 rounded-full">
              Misafir Yorumları
            </div>
            <h2 className="heading-section text-white">{t('title')}</h2>
          </div>

          {/* Rating block */}
          <div className="flex items-center gap-6 shrink-0 bg-white/5 border border-white/8 rounded-2xl px-6 py-4">
            <div className="text-center">
              <div className="text-4xl font-black text-white tracking-tight leading-none mb-1">4.9</div>
              <div className="flex justify-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="text-[#c8892a] fill-[#c8892a]" />
                ))}
              </div>
              <div className="text-white/35 text-[11px]">Ortalama puan</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-black text-white tracking-tight leading-none mb-1">500+</div>
              <div className="text-white/35 text-[11px] mt-1.5">Değerlendirme</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-white tracking-tight leading-none mb-1">🇹🇷🇬🇧🇷🇺</div>
              <div className="text-white/35 text-[11px] mt-1.5">3 dilde yorum</div>
            </div>
          </div>
        </div>

        {/* Testimonial card wall */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white/[0.045] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] rounded-3xl p-6 transition-all duration-300 flex flex-col"
            >
              {/* Decorative quote mark */}
              <div
                className="absolute top-4 right-5 text-[72px] font-serif leading-none select-none pointer-events-none"
                style={{ color: item.color + '22' }}
              >
                "
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(item.rating)].map((_, j) => (
                  <Star key={j} size={12} className="text-[#c8892a] fill-[#c8892a]" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-white/65 text-sm leading-relaxed flex-1 mb-5 relative z-10 line-clamp-4">
                {item.text}
              </p>

              {/* Reviewer row */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.07]">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-lg"
                  style={{ background: item.color }}
                >
                  {item.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-sm leading-tight">{item.name}</div>
                  <div className="text-white/35 text-[11px] mt-0.5 truncate">{item.origin} · {item.villa}</div>
                </div>
              </div>

              {/* Hover glow line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)` }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
