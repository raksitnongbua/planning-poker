import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'th'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headerStore = await headers()
  
  const locale = (headerStore.get('x-locale') || cookieStore.get('locale')?.value || 'en') as Locale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
