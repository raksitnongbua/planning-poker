'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
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
    </header>
  )
}

export default Navbar
