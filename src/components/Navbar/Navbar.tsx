'use client'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { DonateButton } from '../DonateButton'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { Profile } from '../Profile'
import { Button } from '../ui/button'
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
        <div className="flex items-center gap-2">
          <DonateButton compact />
          <Link
            href="/blog"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            {t('blog')}
          </Link>
          <Link
            className="p-2 transition-opacity duration-200 hover:opacity-70"
            target="_blank"
            href="https://github.com/raksitnongbua/planning-poker"
            rel="noopener noreferrer"
          >
            <Image
              className="size-8 cursor-pointer"
              src="/icons/github.svg"
              alt="GitHub repository"
              width={32}
              height={32}
            />
          </Link>
          <LanguageSwitcher />
          {status === 'loading' ? (
            <Skeleton className="h-9 w-16 rounded-md" />
          ) : status === 'authenticated' ? (
            <Profile
              imageSrc={session?.user?.image ?? ''}
              fallback={session?.user?.name?.[0] ?? 'P'}
              onClickLogout={() => signOut()}
            />
          ) : (
            <Button onClick={() => signIn('google')} size="sm">
              {t('signIn')}
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
