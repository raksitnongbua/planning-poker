import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Props } from './types'
import BackCard from '../BackCard'
import FrontCard from '../FrontCard'

const GuestAvatar = ({ name, isCardReveled, estimatedPoint, isShowingCard }: Props) => {
  return (
    <div className="flex items-center flex-col w-[80px] gap-3">
      <Avatar className="size-14">
        <AvatarImage alt="guest-icon" src="/images/corgi-tood.png" />
        <AvatarFallback>GUEST</AvatarFallback>
      </Avatar>
      <code className="relative rounded bg-muted p-1 font-mono text-sm font-semibold">{name}</code>
      {isShowingCard && (
        <div className="w-[52px] h-[76px]">
          {isCardReveled ? (
            <FrontCard label={String(estimatedPoint)} className="text-2xl" />
          ) : (
            <BackCard />
          )}
        </div>
      )}
    </div>
  )
}

export default GuestAvatar
