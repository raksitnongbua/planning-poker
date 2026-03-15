'use client'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import React, { useTransition } from 'react'

import { setLocale } from '@/actions/locale'
import { Locale } from '@/i18n/request'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const LANGUAGES: { locale: Locale; label: string; flag: string; native: string }[] = [
  { locale: 'en', label: 'English', flag: '🇬🇧', native: 'EN' },
  { locale: 'th', label: 'ภาษาไทย', flag: '🇹🇭', native: 'ไทย' },
]

const LanguageSwitcher: React.FC = () => {
  const locale = useLocale() as Locale
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const current = LANGUAGES.find((l) => l.locale === locale) ?? LANGUAGES[0]

  const handleSelect = (next: Locale) => {
    if (next === locale) return
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/20 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-150 hover:border-border/70 hover:bg-muted/40 hover:text-foreground disabled:opacity-50"
          aria-label="Switch language"
        >
          <span className="text-sm leading-none">{current.flag}</span>
          <span className="hidden sm:inline">{current.native}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map(({ locale: l, label, flag, native }) => (
          <DropdownMenuItem
            key={l}
            onClick={() => handleSelect(l)}
            className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2"
          >
            <span className="text-base leading-none">{flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">{native}</span>
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
            {l === locale && (
              <span className="ml-auto text-[10px] font-semibold text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher
