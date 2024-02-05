'use client'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export interface ProfileProps {
  imageSrc: string
  fallback: string
  onClickLogout?: () => void
  onClickSetting?: () => void
}

const Profile: React.FC<ProfileProps> = (props) => {
  const { imageSrc, fallback, onClickLogout, onClickSetting } = props

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <Avatar className="size-8">
          <AvatarImage alt="profile-icon" src={imageSrc} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-fit">
        <DropdownMenuItem onClick={onClickLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Profile
