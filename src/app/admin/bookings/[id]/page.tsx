'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, User, Home, Phone, Mail, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react'

const mockBookings = [
  { id: 'B001', villa: 'Villa Azure Dream', villaId: 'v001', villaSlug: 'villa-azure-dream', guest: 'Mehmet Aydın', email: 'mehmet@email.com', phone: '+90 532 111 2233', nationality: 'Türkiye', checkin: '2025-06-15', checkout: '2025-06-22', nights: 7, adults: 4, children: 0, babies: 0, status: 'confirmed', amount: 3150, cleaningFee: 80, specialRequests: 'Havuzun temiz olması önemli. Erken check-in mümkün mü?', createdAt: '2025-05-10' },
  { id: 'B002', villa: 'Villa Romantika', villaId: 'v002', villaSlug: 'villa-romantika', guest: 'Sarah Thompson', email: 'sarah@email.com', phone: '+44 7700 900123', nationality: 'İngiltere', checkin: '2025-06-18', checkout: '2025-06-25', nights: 7, adults: 2, children: 0, babies: 0, status: 'pending', amount: 1960, cleaningFee: 60, specialRequests: '', createdAt: '2025-05-12' },
  { id: 'B003', villa: 'Villa Coral Bay', villaId: 'v003', villaSlug: 'villa-coral-bay', guest: 'Dmitry Kuznetsov', email: 'dmitry@email.com', phone: '+7 916 123 4567', nationality: 'Rusya', checkin: '2025-07-01', checkout: '2025-07-10', nights: 9, adults: 6, children: 2, babies: 0, status: 'confirmed', amount: 7700, cleaningFee: 100, specialRequests: 'Çocuk yatağı gerekiyor. Havuz güvenliği önemli.', createdAt: '2025-05-15' },
]

const statusConfig = {
  confirmed: { label: 'Onaylı', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
  pending: { label: 'Beklemede', color: 'text-amber-600 bg-amber-50', icon: Clock },
  cancelled: { label: 'İptal', color: 'text-rose-600 bg-rose-50', icon: XCircle },
  completed: { label: 'Tamamlandı', color: 'text-sky-600 bg-sky-50', icon: CheckCircle },
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const booking = mockBookings.find(b => b.id === id) ?? mockBookings[0]

  const statusCfg = statusConfig[booking.status as keyof typeof statusConfig]
  const StatusIcon = statusCfg.icon

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-stone-800">Rezervasyon {booking.id}</h2>
          <p className="text-stone-400 text-xs mt-0.5">{booking.createdAt} tarihinde oluşturuldu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status card */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-800">Durum</h3>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusCfg.color}`}>
                <StatusIcon size={15} />
                {statusCfg.label}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {(['confirmed', 'pending', 'cancelled', 'completed'] as const).map(s => (
                <button key={s} className={`py-2 rounded-xl text-xs font-medium border transition-colors ${booking.status === s ? 'border-sky-400 bg-sky-50 text-sky-700' : 'border-stone-100 text-stone-500 hover:border-stone-200'}`}>
                  {statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Guest info */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <User size={16} className="text-stone-400" />
              Misafir Bilgileri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-stone-400 mb-1">Ad Soyad</div>
                <div className="font-medium text-stone-700">{booking.guest}</div>
              </div>
              <div>
                <div className="text-xs text-stone-400 mb-1">Uyruk</div>
                <div className="font-medium text-stone-700">{booking.nationality}</div>
              </div>
              <div>
                <div className="text-xs text-stone-400 mb-1 flex items-center gap-1"><Mail size={11} /> E-posta</div>
                <a href={`mailto:${booking.email}`} className="font-medium text-sky-600 hover:text-sky-700">{booking.email}</a>
              </div>
              <div>
                <div className="text-xs text-stone-400 mb-1 flex items-center gap-1"><Phone size={11} /> Telefon</div>
                <a href={`tel:${booking.phone}`} className="font-medium text-stone-700">{booking.phone}</a>
              </div>
            </div>
          </div>

          {/* Stay details */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-stone-400" />
              Konaklama Detayları
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-stone-400 mb-1">Giriş</div>
                <div className="font-semibold text-stone-700">{booking.checkin}</div>
              </div>
              <div>
                <div className="text-xs text-stone-400 mb-1">Çıkış</div>
                <div className="font-semibold text-stone-700">{booking.checkout}</div>
              </div>
              <div>
                <div className="text-xs text-stone-400 mb-1">Gece</div>
                <div className="font-semibold text-stone-700">{booking.nights} gece</div>
              </div>
              <div>
                <div className="text-xs text-stone-400 mb-1">Kişi</div>
                <div className="font-semibold text-stone-700">
                  {booking.adults} yetişkin{booking.children > 0 ? ` · ${booking.children} çocuk` : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Special requests */}
          {booking.specialRequests && (
            <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
              <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                <MessageSquare size={16} className="text-stone-400" />
                Özel İstekler
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed bg-stone-50 rounded-xl p-4">{booking.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Right: summary */}
        <div className="space-y-5">
          {/* Villa */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Home size={16} className="text-stone-400" />
              Villa
            </h3>
            <div className="font-semibold text-stone-700 mb-1">{booking.villa}</div>
            <div className="text-stone-400 text-xs mb-3">{booking.villaId}</div>
            <a
              href={`/tr/villas/${booking.villaSlug}`}
              target="_blank"
              className="text-sky-600 text-sm hover:text-sky-700"
            >
              Villayı Görüntüle →
            </a>
          </div>

          {/* Price summary */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <h3 className="font-bold text-stone-800 mb-4">Fiyat Özeti</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Konaklama ({booking.nights} gece)</span>
                <span>€{(booking.amount - booking.cleaningFee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Temizlik ücreti</span>
                <span>€{booking.cleaningFee}</span>
              </div>
              <div className="border-t border-stone-100 pt-2 flex justify-between font-bold text-stone-800">
                <span>Toplam</span>
                <span>€{booking.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <h3 className="font-bold text-stone-800 mb-3">Hızlı İşlemler</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${booking.email}?subject=Rezervasyon ${booking.id} Hakkında`}
                className="flex items-center gap-2 w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <Mail size={14} />
                E-posta Gönder
              </a>
              <a
                href={`https://wa.me/${booking.phone.replace(/\D/g, '')}`}
                target="_blank"
                className="flex items-center gap-2 w-full px-3 py-2.5 bg-green-600 rounded-xl text-sm text-white hover:bg-green-700 transition-colors"
              >
                <Phone size={14} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
