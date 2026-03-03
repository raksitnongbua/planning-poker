import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface InviteButtonProps {
  onClick: () => void
}

const InviteButton = ({ onClick }: InviteButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex w-[80px] flex-col items-center gap-3">
            <button
              onClick={onClick}
              className="relative flex size-14 items-center justify-center rounded-full border-2 border-dashed border-primary/60 text-primary/60 transition-all duration-200 hover:scale-105 hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
<FontAwesomeIcon icon={faUserPlus} className="size-5" />
            </button>
            <span className="text-xs text-muted-foreground">Invite</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-1 text-xs">
          Copy invite link
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default InviteButton
