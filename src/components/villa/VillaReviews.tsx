import { Review } from '@/types/villa'
import { Star, MessageSquare } from 'lucide-react'
import { generateStarArray } from '@/lib/utils'

interface Props {
  reviews: Review[]
  averageRating: number
  reviewCount: number
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {generateStarArray(rating).map((type, i) => (
        <Star
          key={i}
          size={14}
          className={type === 'full' ? 'text-amber-400 fill-amber-400' : type === 'half' ? 'text-amber-400 fill-amber-400/40' : 'text-stone-200 fill-stone-200'}
        />
      ))}
    </div>
  )
}

export function VillaReviews({ reviews, averageRating, reviewCount }: Props) {
  const criteria = [
    { label: 'Temizlik', key: 'ratingCleanliness' },
    { label: 'Konum', key: 'ratingLocation' },
    { label: 'Değer', key: 'ratingValue' },
    { label: 'İletişim', key: 'ratingCommunication' },
  ]

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
        <h3 className="font-bold text-stone-800 text-lg mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-sky-500" />
          Değerlendirmeler
        </h3>
        <p className="text-stone-400 text-sm">Henüz değerlendirme bulunmuyor.</p>
      </div>
    )
  }

  // Calculate averages
  const avgCleanliness = reviews.reduce((sum, r) => sum + r.ratingCleanliness, 0) / reviews.length
  const avgLocation = reviews.reduce((sum, r) => sum + r.ratingLocation, 0) / reviews.length
  const avgValue = reviews.reduce((sum, r) => sum + r.ratingValue, 0) / reviews.length
  const avgComm = reviews.reduce((sum, r) => sum + r.ratingCommunication, 0) / reviews.length
  const avgs = [avgCleanliness, avgLocation, avgValue, avgComm]

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-stone-800">{averageRating.toFixed(1)}</div>
          <StarDisplay rating={averageRating} />
          <div className="text-xs text-stone-400 mt-1">{reviewCount} değerlendirme</div>
        </div>

        <div className="flex-1 space-y-2">
          {criteria.map((c, i) => (
            <div key={c.key} className="flex items-center gap-3">
              <span className="text-xs text-stone-500 w-20 shrink-0">{c.label}</span>
              <div className="flex-1 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${(avgs[i] / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-stone-600 w-8">{avgs[i].toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {reviews.map(review => (
          <div key={review.id} className="border-b border-stone-100 last:border-0 pb-5 last:pb-0">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm shrink-0">
                {review.guestName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-stone-800 text-sm">{review.guestName}</span>
                  <StarDisplay rating={review.ratingOverall} />
                  <span className="text-stone-400 text-xs ml-auto">
                    {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="text-stone-600 text-sm mt-1 leading-relaxed">{review.comment}</p>

                {review.ownerReply && (
                  <div className="mt-3 bg-sky-50 rounded-xl p-3 text-sm">
                    <div className="font-semibold text-sky-700 text-xs mb-1">🏡 İşletme Yanıtı:</div>
                    <p className="text-stone-600">{review.ownerReply}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
