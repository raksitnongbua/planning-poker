'use client'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { DonateButton } from '../DonateButton'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { Profile } from '../Profile'
import { Skeleton } from '../ui/skeleton'

const Navbar = () => {
  const { data: session, status } = useSession()
  const t = useTranslations('navbar')

  return (
    <header>
      <nav className="w-full flex items-center justify-between px-3 py-2 sm:px-5">
        <Link href="/" className="transition-transform duration-200 hover:scale-110 inline-block">
          <Image
            className="cursor-pointer"
            src="/images/corgi-logo.png"
            alt="Corgi Planning Poker home"
            width={60}
            height={60}
            priority
          />
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            href="/blog"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            {t('blog')}
          </Link>
          <LanguageSwitcher />
          <div className="mx-1 h-5 w-px bg-border/50" />
          {status === 'loading' ? (
            <Skeleton className="h-8 w-16 rounded-lg" />
          ) : status === 'authenticated' ? (
            <Profile
              imageSrc={session?.user?.image ?? ''}
              fallback={session?.user?.name?.[0] ?? 'P'}
              onClickLogout={() => signOut()}
            />
          ) : (
            <button
              onClick={() => signIn('google')}
              className="rounded-lg border border-border/50 bg-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
            >
              {t('signIn')}
            </button>
          )}
          <div className="mx-1 h-5 w-px bg-border/50" />
          <Link
            href="https://github.com/raksitnongbua/planning-poker"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="flex items-center justify-center rounded-lg border border-border/40 bg-muted/20 p-2 transition-all duration-150 hover:border-border/70 hover:bg-muted/40"
          >
            <Image src="/icons/github.svg" alt="" width={18} height={18} />
          </Link>
          <DonateButton compact />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
