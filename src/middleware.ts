import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/lib/i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
})

export const config = {
  matcher: [
    '/((?!admin|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
