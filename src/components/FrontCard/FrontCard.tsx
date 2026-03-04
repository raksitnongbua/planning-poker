'use client'
import Image from 'next/image'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface FrontCardProps {
  label: string
  className?: string
}

const FrontCard = ({ label, className }: FrontCardProps) => {
  return (
    <div
      className={twMerge(
        'relative border rounded-md flex justify-center items-center cursor-pointer text-4xl',
        className
      )}
    >
      <Image
        className="rounded-md object-fill border"
        alt="corgi-card"
        src="/images/corgi-card-front.png"
        width="120"
        height="180"
      />
      <span className="absolute font-bold text-black drop-shadow-sm">{label}</span>
    </div>
  )
}

export default FrontCard
