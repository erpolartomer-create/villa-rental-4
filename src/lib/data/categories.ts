import { Category } from '@/types/villa'

export const categories: Category[] = [
  {
    id: 'luxury',
    slug: 'luxury',
    icon: '👑',
    color: 'from-amber-500 to-yellow-600',
    translations: {
      tr: { name: 'Lüks Villalar', description: 'En yüksek konfor standartlarıyla donatılmış premium villalar' },
      en: { name: 'Luxury Villas', description: 'Premium villas equipped with the highest comfort standards' },
      ru: { name: 'Люкс виллы', description: 'Премиальные виллы с наивысшими стандартами комфорта' },
    },
  },
  {
    id: 'seaview',
    slug: 'seaview',
    icon: '🌊',
    color: 'from-blue-500 to-cyan-600',
    translations: {
      tr: { name: 'Deniz Manzaralı', description: 'Akdeniz\'in muhteşem manzarasına sahip villalar' },
      en: { name: 'Sea View', description: 'Villas with stunning Mediterranean sea views' },
      ru: { name: 'С видом на море', description: 'Виллы с потрясающим видом на Средиземное море' },
    },
  },
  {
    id: 'honeymoon',
    slug: 'honeymoon',
    icon: '💑',
    color: 'from-pink-500 to-rose-600',
    translations: {
      tr: { name: 'Balayı Villaları', description: 'Çiftler için romantik ve özel tasarlanmış villalar' },
      en: { name: 'Honeymoon Villas', description: 'Romantic and specially designed villas for couples' },
      ru: { name: 'Медовый месяц', description: 'Романтические виллы, специально разработанные для пар' },
    },
  },
  {
    id: 'family',
    slug: 'family',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-green-500 to-emerald-600',
    translations: {
      tr: { name: 'Aile Villaları', description: 'Çocuklar için çocuk havuzu ve güvenli alan sunan villalar' },
      en: { name: 'Family Villas', description: 'Villas with kids pool and safe play areas for families' },
      ru: { name: 'Семейные виллы', description: 'Виллы с детским бассейном и безопасными игровыми зонами' },
    },
  },
  {
    id: 'conservative',
    slug: 'conservative',
    icon: '🏡',
    color: 'from-teal-500 to-green-600',
    translations: {
      tr: { name: 'Muhafazakâr Villalar', description: 'Özel havuzlu, kapalı ve gizlilik odaklı villalar' },
      en: { name: 'Conservative Villas', description: 'Private pool, enclosed and privacy-focused villas' },
      ru: { name: 'Консервативные', description: 'Виллы с частным бассейном, закрытые и ориентированные на приватность' },
    },
  },
  {
    id: 'beachfront',
    slug: 'beachfront',
    icon: '🏖️',
    color: 'from-orange-500 to-amber-600',
    translations: {
      tr: { name: 'Sahile Yakın', description: 'Denize yürüme mesafesinde konumlanan özel villalar' },
      en: { name: 'Beachfront', description: 'Private villas located within walking distance to the beach' },
      ru: { name: 'У пляжа', description: 'Частные виллы в шаговой доступности от пляжа' },
    },
  },
  {
    id: 'petfriendly',
    slug: 'petfriendly',
    icon: '🐾',
    color: 'from-purple-500 to-violet-600',
    translations: {
      tr: { name: 'Evcil Hayvan Dostu', description: 'Evcil hayvanlarınızla birlikte konaklamanız için uygun villalar' },
      en: { name: 'Pet Friendly', description: 'Villas suitable for staying with your beloved pets' },
      ru: { name: 'Можно с питомцами', description: 'Виллы, подходящие для проживания с домашними животными' },
    },
  },
  {
    id: 'boutique',
    slug: 'boutique',
    icon: '✨',
    color: 'from-slate-600 to-gray-700',
    translations: {
      tr: { name: 'Butik Villalar', description: 'Özgün mimari ve tasarımıyla farklı bir deneyim sunan villalar' },
      en: { name: 'Boutique Villas', description: 'Villas offering a unique experience with original architecture' },
      ru: { name: 'Бутик виллы', description: 'Виллы с оригинальной архитектурой и уникальным опытом' },
    },
  },
]
