'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'

import { DonateButton } from '../DonateButton'

export interface FooterProps {
  // types...
}

const Footer: React.FC<FooterProps> = ({}) => {
  const t = useTranslations('footer')
  return (
    <footer className="mt-auto border-t border-border/40 px-4 py-5">
      <div className="container mx-auto flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
        <span className="text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} Corgi Planning Poker
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground/70">
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
          <span className="text-border/60">·</span>
          <DonateButton />
        </div>
      </div>
    </footer>
  )
}

export default Footer
