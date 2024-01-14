'use client'
import React from 'react'
import GuestAvatar from '../GuestAvatar'
import { Member } from '../Room/types'
import { InviteButton } from '../InviteButton'
import { toast } from '../ui/use-toast'
import { ActiveStatus } from '../GuestAvatar/types'

export interface RoomMembersProps {
  members: Member[]
  isCardReveled: boolean
  inviteLink: string
}

const TIME_SECOND = 1000
const TIME_MINUTE = 60

const RoomMembers: React.FC<RoomMembersProps> = ({ members, inviteLink, isCardReveled }) => {
  const getActiveStatus = (lastActiveAt: Date): ActiveStatus => {
    const secDiff = (Date.now() - lastActiveAt.getTime()) / TIME_SECOND

    if (secDiff <= 15) {
      return ActiveStatus.Active
    } else if (secDiff <= 5 * TIME_MINUTE) {
      return ActiveStatus.Busy
    } else {
      return ActiveStatus.Inactive
    }
  }
  return (
    <div data-section="room-members" className="flex justify-center gap-2 col-span-3 min-h-[200px]">
      {members.map(({ name, id, estimatedPoint, lastActiveAt }) => (
        <GuestAvatar
          name={name}
          key={id}
          estimatedPoint={estimatedPoint}
          isCardReveled={isCardReveled}
          isShowingCard={estimatedPoint >= 0}
          activeStatus={getActiveStatus(lastActiveAt)}
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
