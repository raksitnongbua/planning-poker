'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const router = useRouter()

  return (
    <header className="px-2 py-1 sm:px-8 sm:pt-4 sm:-pb-2 flex justify-between items-start">
      <Image
        className="cursor-pointer"
        onClick={() => router.push('/')}
        src="/images/corgi-logo.png"
        alt="corgi-logo"
        width={60}
        height={60}
      />
      <a
        className="p-2"
        target="_blank"
        href="https://github.com/raksitnongbua/planning-poker"
        rel="noopener noreferrer"
      >
        <Image
          className="cursor-pointer"
          src="/icons/github.svg"
          alt="github-logo"
          width={30}
          height={30}
        />
      </a>
    </header>
  )
}

export default Navbar
