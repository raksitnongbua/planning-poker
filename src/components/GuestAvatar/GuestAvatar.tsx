import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ActiveStatus, Props } from './types'
import BackCard from '../BackCard'
import FrontCard from '../FrontCard'
import clsx from 'clsx'

const GuestAvatar = ({
  name,
  isCardReveled,
  estimatedPoint,
  isShowingCard,
  activeStatus,
}: Props) => {
  const getClassWithActiveStatus = (status: ActiveStatus): string => {
    switch (status) {
      case ActiveStatus.Active:
        return `bg-green-400`
      case ActiveStatus.Busy:
        return `bg-orange-400`
      case ActiveStatus.Inactive:
        return `bg-red-500`
      default:
        return `bg-neutral-600`
    }
  }

  return (
    <div className="flex items-center flex-col w-[80px] gap-3">
      <div className="relative">
        <Avatar className="size-14">
          <AvatarImage alt="guest-icon" src="/images/corgi-tood-cute.png" />
          <AvatarFallback>GUEST</AvatarFallback>
        </Avatar>
        <div
          className={clsx(
            'absolute right-0 bottom-0 rounded-full size-[6px]',
            getClassWithActiveStatus(activeStatus)
          )}
        />
      </div>
      <code className="relative rounded bg-muted p-1 font-mono text-sm font-semibold">{name}</code>
      {isShowingCard && (
        <div className="w-[52px] h-[76px] hover:scale-110 hover:translate-y-1">
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
