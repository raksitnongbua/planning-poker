'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'

const CURRENT_YEAR = new Date().getFullYear()

type StatusDot = 'available' | 'connecting' | 'unavailable'

const STATUS_DOT_CLASS: Record<StatusDot, string> = {
  available: 'bg-green-500 animate-heartbeat',
  connecting: 'bg-yellow-400 animate-ping',
  unavailable: 'bg-red-500',
}

const Footer: React.FC<{ status?: StatusDot }> = ({ status }) => {
  const t = useTranslations('footer')
  return (
    <footer className="sticky bottom-0 z-40 border-t border-border/40 bg-background/95 backdrop-blur-md px-4 py-2">
      <div className="container mx-auto flex flex-col-reverse items-center gap-2 sm:flex-row sm:justify-between">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40">
          {status && (
            <span className={`size-1.5 rounded-full shrink-0 ${STATUS_DOT_CLASS[status]}`} />
          )}
          © {CURRENT_YEAR} Corgi Planning Poker
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground/60">
          <Link href="/privacy-policy" className="transition-colors duration-150 hover:text-foreground">
            {t('privacyPolicy')}
          </Link>
          <a href="mailto:tan.raksit@gmail.com" className="transition-colors duration-150 hover:text-foreground">
            {t('contact')}
          </a>
          <a
            href="https://github.com/raksitnongbua/planning-poker"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-foreground"
          >
            {t('github')}
          </a>
          <a
            href="https://github.com/raksitnongbua/planning-poker/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-foreground"
          >
            {t('openIssue')}
          </a>
          <a
            href="https://github.com/raksitnongbua/planning-poker/pulls"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-foreground"
          >
            {t('contribute')}
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
