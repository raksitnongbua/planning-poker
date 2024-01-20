import Image from 'next/image'
import React from 'react'

export interface BackCardProps {
  className?: string
}

const BackCard = ({ className }: BackCardProps) => {
  return (
    <div data-component="card-inactive" className={className}>
      <Image
        className="rounded-md object-fill border"
        alt="corgi-card"
        src="/images/corgi-card-back.png"
        width="120"
        height="180"
      />
    </div>
  )
}

export default BackCard
