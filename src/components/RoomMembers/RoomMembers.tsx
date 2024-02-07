'use client'
import React from 'react'

import { MINUTES, SECONDS } from '@/utils/time'

import { InviteButton } from '../InviteButton'
import MemberAvatar from '../MemberAvatar'
import { ActiveStatus } from '../MemberAvatar/types'
import { Member } from '../Room/types'
import { toast } from '../ui/use-toast'

export interface RoomMembersProps {
  members: Member[]
  isCardReveled: boolean
  inviteLink: string
}

const RoomMembers: React.FC<RoomMembersProps> = ({ members, inviteLink, isCardReveled }) => {
  const getActiveStatus = (lastActiveAt: Date): ActiveStatus => {
    const secDiff = (Date.now() - lastActiveAt.getTime()) / SECONDS

    if (secDiff <= 1 * MINUTES) {
      return ActiveStatus.Active
    } else if (secDiff <= 10 * MINUTES) {
      return ActiveStatus.Busy
    } else {
      return ActiveStatus.Inactive
    }
  }
  return (
    <div data-section="room-members" className="col-span-3 flex min-h-[200px] justify-center gap-2">
      {members.map(({ name, id, estimatedValue, lastActiveAt, avatar }) => (
        <MemberAvatar
          name={name}
          key={id}
          estimatedValue={estimatedValue}
          isCardReveled={isCardReveled}
          isShowingCard={estimatedValue !== ''}
          activeStatus={getActiveStatus(lastActiveAt)}
          avatar={avatar}
        />
      ))}
      <InviteButton
        onClick={() => {
          navigator.clipboard.writeText(inviteLink)
          toast({
            title: 'Invite link copied to clipboard',
          })
        }}
      />
    </div>
  )
}

export default RoomMembers
