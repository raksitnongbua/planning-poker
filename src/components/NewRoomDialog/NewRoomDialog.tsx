import React, { useState } from 'react'

import { Input } from '@/components/ui/input'

import Dialog from '../common/Dialog'
import { Button } from '../ui/button'
import { Props } from './types'

const NewRoomDialog = ({ open, onClose, onCreate }: Props) => {
  const [roomName, setRoomName] = useState<string>('')

  const handleCreateRoom = () => {
    onCreate({ name: roomName })
  }

  const isCreateRoomButtonDisabled = roomName.trim() === ''

  return (
    <Dialog
      open={open}
      title="Create New Room"
      onOpenChange={(open) => !open && onClose()}
      content={
        <Input
          maxLength={25}
          placeholder="Room Name"
          onChange={(e) => setRoomName(e.target.value)}
          onKeyDown={(e) => e.code === 'Enter' && !isCreateRoomButtonDisabled && handleCreateRoom()}
        />
      }
      action={
        <>
          <Button disabled={isCreateRoomButtonDisabled} onClick={handleCreateRoom}>
            Create Room
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </>
      }
    />
  )
}

export default NewRoomDialog
