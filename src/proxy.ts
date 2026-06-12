import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/lib/i18n/config'

const handleRequest = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
})

export default handleRequest

export const config = {
  matcher: [
    // Match all pathnames except for
    // - admin area
    // - API routes
    // - Local static images
    // - Next.js internal static assets
    // - Metadata files (favicon, sitemap, robots)
    // - Files with extensions (containing a dot)
    '/((?!admin|api|images|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
}
