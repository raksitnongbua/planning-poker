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
    <header className="sm:-pb-2 flex items-start justify-between px-2 py-1 sm:px-8 sm:pt-4">
      <Link href="/">
        <Image
          className="cursor-pointer"
          src="/images/corgi-logo.png"
          alt="corgi-logo"
          width={60}
          height={60}
        />
      </Link>
      <div className="flex items-center gap-2">
        <Link
          className="p-2"
          target="_blank"
          href="https://github.com/raksitnongbua/planning-poker"
          rel="noopener noreferrer"
        >
          <Image
            className="size-8 cursor-pointer"
            src="/icons/github.svg"
            alt="github-logo"
            width={0}
            height={0}
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
    </header>
  )
}

export default Navbar
