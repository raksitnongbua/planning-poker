'use client'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

import { Profile } from '../Profile'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

const Navbar = () => {
  const { data: session, status } = useSession()
  return (
    <header className="container mx-auto px-2 py-4 sm:px-8">
      <nav className="flex items-start justify-between">
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
          {status === 'loading' ? (
            <Skeleton className="size-8 rounded-full" />
          ) : status === 'authenticated' ? (
            <Profile
              imageSrc={session?.user?.image ?? ''}
              fallback={session?.user?.name?.[0] ?? 'P'}
              onClickLogout={() => signOut()}
            />
          ) : (
            <Button onClick={() => signIn('google')} size="sm">
              Sign In
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
