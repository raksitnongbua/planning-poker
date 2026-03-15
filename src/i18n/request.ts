import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export const locales = ['en', 'th'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value ?? 'en') as Locale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
