import clsx from 'clsx'
import React from 'react'
import ReactCardFlip from 'react-card-flip'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import BackCard from '../BackCard'
import FrontCard from '../FrontCard'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { ActiveStatus, Props } from './types'

const statusConfig: Record<ActiveStatus, { dot: string; ring: string; ping: string; label: string }> = {
  [ActiveStatus.Active]: {
    dot: 'bg-green-400',
    ring: 'ring-green-500/50',
    ping: 'bg-green-400/50',
    label: 'Online',
  },
  [ActiveStatus.Busy]: {
    dot: 'bg-orange-400',
    ring: 'ring-orange-400/50',
    ping: 'bg-orange-400/50',
    label: 'Busy',
  },
  [ActiveStatus.Inactive]: {
    dot: 'bg-red-500',
    ring: 'ring-red-500/40',
    ping: 'bg-red-500/40',
    label: 'Offline',
  },
}

const MemberAvatar = ({
  avatar,
  name,
  isCardReveled,
  estimatedValue,
  isShowingCard,
  activeStatus,
}: Props) => {
  const { dot, ring, ping, label } = statusConfig[activeStatus] ?? {
    dot: 'bg-neutral-600',
    ring: 'ring-neutral-600/30',
    ping: 'bg-neutral-600/30',
    label: 'N/A',
  }

  return (
    <div className="flex w-[80px] flex-col items-center gap-3">
      <div className="relative">
        <Avatar className={clsx('size-14 ring-2 ring-offset-2 ring-offset-background', ring)}>
          <AvatarImage alt="profile-icon" src={avatar ?? '/images/corgi-tood-cute.png'} />
          <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className={clsx('absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-background', dot)}>
          <span className={clsx('absolute inline-flex size-full rounded-full animate-ping', ping)} />
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className="block max-w-20 truncate rounded-md bg-muted/60 px-2 py-0.5 text-center text-xs font-medium text-foreground/80">
              {name}
            </span>
          </TooltipTrigger>
          <TooltipContent className="p-1 text-xs" side="top">
            {`${name} (${label})`}
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

export default MemberAvatar
