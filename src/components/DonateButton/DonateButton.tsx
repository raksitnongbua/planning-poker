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
          <button
            aria-label={t('support')}
            className="group relative overflow-hidden rounded-lg border border-primary/60 bg-gradient-to-r from-orange-500/80 via-primary to-orange-400/80 px-2.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-primary/30 transition-all duration-200 hover:scale-[1.05] hover:shadow-lg hover:shadow-primary/40 active:scale-100"
          >
            {/* shine sweep */}
            <span className="animate-shine pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {/* pulse aura */}
            <span className="absolute inset-[-3px] -z-10 animate-pulse rounded-lg bg-primary/40 blur-md" style={{ animationDuration: '2.5s' }} />
            <span className="relative flex items-center gap-1.5">
              <span className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">🦴</span>
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
