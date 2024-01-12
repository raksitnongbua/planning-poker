import React, { useState } from 'react'
import Dialog from '@/components/common/Dialog'
import { Props } from './types'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const JoinRoomDialog = ({ open, onClickConfirm }: Props) => {
  const [name, setName] = useState('')

  return (
    <Dialog
      open={open}
      title="Input your name"
      content={<Input placeholder="Your name" onChange={(e) => setName(e.target.value)} />}
      action={<Button onClick={() => onClickConfirm(name)}>Confirm</Button>}
    />
  )
}

export default JoinRoomDialog
