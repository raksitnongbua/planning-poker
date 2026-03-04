import Image from 'next/image'
import React from 'react'

export interface CorgiFeelingProps {
  badlyPercentage: number
  width?: number
  height?: number
}

const CorgiFeeling = ({ badlyPercentage, width = 160, height = 144 }: CorgiFeelingProps) => {
  const getImagePathByPercentage = (percentage: number) => {
    if (percentage <= 20) {
      return '/images/corgi-love.png'
    } else if (percentage <= 40) {
      return '/images/corgi-good.png'
    } else if (percentage <= 60) {
      return '/images/corgi-anger.png'
    } else if (percentage <= 80) {
      return '/images/corgi-sad.png'
    } else {
      return '/images/corgi-dead.png'
    }
  }
  return (
    <Image
      src={getImagePathByPercentage(badlyPercentage)}
      height={height}
      width={width}
      alt="corgi-feeling"
      className="object-contain animate-shake-interval"
      style={{ width, height }}
    />
  )
}

export default CorgiFeeling
