'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Star } from 'lucide-react'

const mockCustomers = [
  { id: 'C001', name: 'Mehmet Aydın', email: 'mehmet@email.com', phone: '+90 532 111 2233', nationality: 'Türkiye', bookings: 3, totalSpent: 8200, lastBooking: '2025-06-15', status: 'vip', note: 'Düzenli müşteri. Havuzu olan villaları tercih ediyor.' },
  { id: 'C003', name: 'Dmitry Kuznetsov', email: 'dmitry@email.com', phone: '+7 916 123 4567', nationality: 'Rusya', bookings: 5, totalSpent: 28400, lastBooking: '2025-07-01', status: 'vip', note: 'Büyük aile grupları. Çocuk dostu villalar talep ediyor.' },
]

const mockBookingHistory = [
  { id: 'B001', villa: 'Villa Azure Dream', checkin: '2025-06-15', checkout: '2025-06-22', amount: 3150, status: 'confirmed' },
  { id: 'B006', villa: 'Villa Olive Grove', checkin: '2025-05-01', checkout: '2025-05-08', amount: 2800, status: 'completed' },
  { id: 'B009', villa: 'Villa Coral Bay', checkin: '2024-08-10', checkout: '2024-08-17', amount: 2250, status: 'completed' },
]

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const customer = mockCustomers.find(c => c.id === id) ?? mockCustomers[0]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-stone-800">{customer.name}</h2>
          <p className="text-stone-400 text-xs mt-0.5">{customer.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <h3 className="font-bold text-stone-800 mb-4">İletişim Bilgileri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-stone-100 rounded-lg flex items-center justify-center">
                  <Mail size={16} className="text-stone-500" />
                </div>
                <div>
                  <div className="text-xs text-stone-400">E-posta</div>
                  <a href={`mailto:${customer.email}`} className="text-sky-600 text-sm hover:text-sky-700">{customer.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-stone-100 rounded-lg flex items-center justify-center">
                  <Phone size={16} className="text-stone-500" />
                </div>
                <div>
                  <div className="text-xs text-stone-400">Telefon</div>
                  <a href={`tel:${customer.phone}`} className="text-stone-700 text-sm">{customer.phone}</a>
                </div>
              </div>
            </div>
            {customer.note && (
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <div className="text-xs font-semibold text-amber-700 mb-1">Not</div>
                <p className="text-amber-800 text-sm">{customer.note}</p>
              </div>
            )}
          </div>

          {/* Booking history */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-stone-400" />
              Rezervasyon Geçmişi
            </h3>
            <div className="space-y-3">
              {mockBookingHistory.map(b => (
                <div key={b.id} className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
                  <div>
                    <div className="font-medium text-stone-700 text-sm">{b.villa}</div>
                    <div className="text-stone-400 text-xs">{b.checkin} → {b.checkout}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
                      {b.status === 'confirmed' ? 'Onaylı' : 'Tamamlandı'}
                    </span>
                    <span className="font-semibold text-stone-700 text-sm">€{b.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <h3 className="font-bold text-stone-800 mb-4">İstatistikler</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-500 text-sm">
                  <Calendar size={15} />
                  Toplam Rezervasyon
                </div>
                <span className="font-bold text-stone-800">{customer.bookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-500 text-sm">
                  <DollarSign size={15} />
                  Toplam Harcama
                </div>
                <span className="font-bold text-stone-800">€{customer.totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-500 text-sm">
                  <Star size={15} />
                  Durum
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${customer.status === 'vip' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                  {customer.status === 'vip' ? 'VIP' : 'Düzenli'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
            <h3 className="font-bold text-stone-800 mb-3">Hızlı İşlemler</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${customer.email}`}
                className="flex items-center gap-2 w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <Mail size={14} />
                E-posta Gönder
              </a>
              <a
                href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
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
