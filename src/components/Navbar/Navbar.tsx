'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter()
  return (
    <header className="px-2 py-1 sm:p-4 flex justify-between items-start">
      <Image
        className="cursor-pointer"
        onClick={() => router.push('/')}
        src="/images/corgi-logo.png"
        alt="corgi-logo"
        width={80}
        height={80}
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