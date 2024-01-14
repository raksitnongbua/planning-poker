import React, { useState } from 'react'
import Dialog from '@/components/common/Dialog'
import { Props } from './types'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const JoinRoomDialog = ({ open, onClickConfirm }: Props) => {
  const [name, setName] = useState('')

  const isDisabled = name === ''
  return (
    <Dialog
      open={open}
      title="Input your name"
      content={
        <Input
          type="string"
          maxLength={20}
          placeholder="Your name"
          onChange={(e) => setName(e.target.value.trim())}
          onKeyDown={(e) => e.code === 'Enter' && !isDisabled && onClickConfirm(name)}
        />
      }
      action={
        <Button disabled={isDisabled} onClick={() => onClickConfirm(name)}>
          Confirm
        </Button>
      }
    />
  )
}

export default JoinRoomDialog
