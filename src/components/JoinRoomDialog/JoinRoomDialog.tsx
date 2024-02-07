import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

import Dialog from '@/components/common/Dialog'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Props } from './types'

const JoinRoomDialog = ({ open, onClickConfirm, hasAvatar, defaultName }: Props) => {
  const [name, setName] = useState(defaultName ?? '')
  const [isCheckedUseProfileAvatar, setIsCheckedUseProfileAvatar] = useState(hasAvatar)
  const isDisabled = name === ''
  const router = useRouter()

  return (
    <Dialog
      open={open}
      title="Input your name"
      onOpenChange={(open) => {
        if (!open) {
          router.push('/')
        }
      }}
      content={
        <div className="flex flex-col gap-4">
          <Input
            type="string"
            maxLength={20}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            onKeyDown={(e) =>
              e.code === 'Enter' && !isDisabled && onClickConfirm(name, isCheckedUseProfileAvatar)
            }
          />
          {hasAvatar && (
            <div className="flex items-center space-x-2">
              <Switch
                id="use-profile-avatar"
                checked={isCheckedUseProfileAvatar}
                onCheckedChange={setIsCheckedUseProfileAvatar}
              />
              <Label htmlFor="use-profile-avatar">Enable profile display in this Room</Label>
            </div>
          )}
        </div>
      }
      action={
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => signIn('google')}>
            Sign In
          </Button>
          <Button
            disabled={isDisabled}
            onClick={() => onClickConfirm(name, isCheckedUseProfileAvatar)}
          >
            Confirm
          </Button>
        </div>
      }
    />
  )
}

export default JoinRoomDialog
