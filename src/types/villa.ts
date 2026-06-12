export type Locale = 'tr' | 'en' | 'ru'
export type Currency = 'EUR' | 'TRY' | 'USD'
export type VillaStatus = 'active' | 'inactive' | 'draft'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type AvailabilityStatus = 'available' | 'blocked' | 'booked'

export interface VillaTranslation {
  locale: Locale
  name: string
  description: string
  shortDescription: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

export interface VillaImage {
  id: string
  url: string
  altText: string
  sortOrder: number
  isCover: boolean
}

export interface Amenity {
  id: string
  slug: string
  icon: string
  group: string
  translations: Record<Locale, string>
}

export interface Category {
  id: string
  slug: string
  icon: string
  color: string
  translations: Record<Locale, { name: string; description: string }>
}

export interface PricingRule {
  id: string
  villaId: string
  name: string
  startDate: string
  endDate: string
  pricePerNight: number
  minStayNights: number
  type: 'peak' | 'off' | 'custom'
}

export interface Review {
  id: string
  villaId: string
  guestName: string
  guestAvatar?: string
  ratingOverall: number
  ratingCleanliness: number
  ratingLocation: number
  ratingValue: number
  ratingCommunication: number
  comment: string
  ownerReply?: string
  createdAt: string
}

export interface Villa {
  id: string
  slug: string
  status: VillaStatus
  locationLat: number
  locationLng: number
  locationAddress: string
  locationDistrict: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  sizeSqm: number
  basePricePerNight: number
  discountPercent?: number
  cleaningFee: number
  securityDeposit: number
  minStayNights: number
  checkinTime: string
  checkoutTime: string
  isFeatured: boolean
  isHoneymoon: boolean
  sortOrder: number
  viewCount: number
  createdAt: string
  updatedAt: string
  translations: Record<Locale, VillaTranslation>
  images: VillaImage[]
  amenities: string[]
  categories: string[]
  pricingRules: PricingRule[]
  reviews: Review[]
  averageRating: number
  reviewCount: number
}

export interface Booking {
  id: string
  villaId: string
  villaName: string
  checkinDate: string
  checkoutDate: string
  nights: number
  adults: number
  children: number
  babies: number
  totalPrice: number
  cleaningFee: number
  discountAmount: number
  status: BookingStatus
  specialRequests: string
  guestName: string
  guestEmail: string
  guestPhone: string
  createdAt: string
}

export interface SearchFilters {
  checkin?: string
  checkout?: string
  adults?: number
  children?: number
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  categories?: string[]
  amenities?: string[]
  location?: string
}

export interface BlogPost {
  id: string
  slug: string
  coverImage: string
  status: 'published' | 'draft'
  viewCount: number
  publishedAt: string
  translations: Record<Locale, {
    title: string
    content: string
    excerpt: string
    seoTitle: string
    seoDescription: string
  }>
  categories: string[]
}

export interface SeoPage {
  id: string
  pageKey: string
  locale: Locale
  metaTitle: string
  metaDescription: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  canonicalUrl: string
  noindex: boolean
  schemaJson: string
}
