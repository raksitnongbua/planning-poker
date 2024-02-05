import clsx from 'clsx'
import React from 'react'
import ReactCardFlip from 'react-card-flip'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import BackCard from '../BackCard'
import FrontCard from '../FrontCard'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { ActiveStatus, Props } from './types'

const GuestAvatar = ({
  avatar,
  name,
  isCardReveled,
  estimatedValue,
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

  const getDetailActiveStatus = (status: ActiveStatus): string => {
    switch (status) {
      case ActiveStatus.Active:
        return 'Online'
      case ActiveStatus.Busy:
        return 'Busy'
      case ActiveStatus.Inactive:
        return 'Offline'
      default:
        return 'N/A'
    }
  }

  return (
    <div className="flex w-[80px] flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="size-14">
          <AvatarImage alt="guest-icon" src={avatar ?? '/images/corgi-tood-cute.png'} />
          <AvatarFallback>GUEST</AvatarFallback>
        </Avatar>
        <div
          className={clsx(
            'absolute bottom-0 right-0 size-[6px] rounded-full',
            getClassWithActiveStatus(activeStatus)
          )}
        />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <code className="relative block max-w-20 overflow-hidden overflow-ellipsis text-nowrap rounded bg-muted p-1 font-mono text-sm font-semibold">
              {name}
            </code>
          </TooltipTrigger>
          <TooltipContent className="p-1 text-xs" side="top">
            {`${name} (${getDetailActiveStatus(activeStatus)})`}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isShowingCard && (
        <div className="h-[76px] w-[52px] hover:translate-y-1 hover:scale-110">
          <ReactCardFlip isFlipped={isCardReveled}>
            <BackCard />
            <FrontCard label={estimatedValue} className="text-2xl" />
          </ReactCardFlip>
        </div>
      )}
    </div>
  )
}

export default GuestAvatar
