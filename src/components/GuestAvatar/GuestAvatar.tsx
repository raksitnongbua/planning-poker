import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Props } from './types'

const GuestAvatar = ({ name }: Props) => {
  return (
    <div className="flex justify-center items-center flex-col w-[80px]">
      <Avatar className="size-14">
        <AvatarImage alt="guest-icon" src="/images/guest-icon.png" />
        <AvatarFallback>GUEST</AvatarFallback>
      </Avatar>
      <code className="relative rounded bg-muted p-1 mt-2 font-mono text-sm font-semibold">
        {name}
      </code>
    </div>
  )
}

export default GuestAvatar
