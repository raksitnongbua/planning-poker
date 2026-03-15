'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const KOFI_URL = 'https://ko-fi.com/raksitnongbua'
const GITHUB_SPONSORS_URL = 'https://github.com/sponsors/raksitnongbua'

interface DonateButtonProps {
  compact?: boolean
}

const DonateButton: React.FC<DonateButtonProps> = ({ compact = false }) => {
  const t = useTranslations('donate')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <button className="group relative overflow-hidden rounded-full border border-primary/40 bg-gradient-to-r from-primary/15 to-orange-400/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:scale-105 hover:border-primary/70 hover:from-primary/25 hover:to-orange-400/20 hover:shadow-md hover:shadow-primary/20 active:scale-100">
            <span className="animate-shine pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="relative flex items-center gap-1.5">
              <span className="transition-transform duration-200 group-hover:-rotate-12">🦴</span>
              <span className="hidden sm:inline">{t('support')}</span>
            </span>
          </button>
        ) : (
          <button className="group relative overflow-hidden rounded-md border border-primary/35 bg-gradient-to-r from-primary/12 to-orange-400/8 px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:scale-[1.02] hover:border-primary/60 hover:from-primary/22 hover:to-orange-400/15 hover:shadow-lg hover:shadow-primary/15 active:scale-100">
            <span className="animate-shine pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="relative flex items-center gap-2">
              <span className="transition-transform duration-200 group-hover:-rotate-12">🦴</span>
              <span>{t('buyTreat')}</span>
            </span>
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>🐾</span>
          <span>{t('supportProject')}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-3 px-2 py-2"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FF5E5B]/10">
              <Image src="/icons/kofi.svg" alt="Ko-fi" width={18} height={18} />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Ko-fi</span>
              <span className="text-[10px] text-muted-foreground">{t('kofiSubtitle')}</span>
            </div>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={GITHUB_SPONSORS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-3 px-2 py-2"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EA4AAA]/10">
              <Image src="/icons/github-sponsors.svg" alt="GitHub Sponsors" width={18} height={18} />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">GitHub Sponsors</span>
              <span className="text-[10px] text-muted-foreground">{t('githubSubtitle')}</span>
            </div>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DonateButton
