'use client'

import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Props } from './types'

const JoinRoomDialog = ({ open, onClickConfirm, onClickSpectate, hasAvatar, defaultName, signedIn }: Props) => {
  const [name, setName] = useState(defaultName ?? '')
  const [isCheckedUseProfileAvatar, setIsCheckedUseProfileAvatar] = useState(hasAvatar)
  const isDisabled = name === ''
  const router = useRouter()

  const showDivider = onClickSpectate || !signedIn

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          if (onClickSpectate) {
            onClickSpectate()
          } else {
            router.push('/')
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Join the Room</DialogTitle>
          <DialogDescription>
            Enter your display name to start estimating with your team.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              autoFocus
              maxLength={20}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              onKeyDown={(e) =>
                e.code === 'Enter' && !isDisabled && onClickConfirm(name, isCheckedUseProfileAvatar)
              }
            />
          </div>
          {hasAvatar && (
            <div className="flex items-center gap-2">
              <Switch
                id="use-profile-avatar"
                checked={isCheckedUseProfileAvatar}
                onCheckedChange={setIsCheckedUseProfileAvatar}
              />
              <Label htmlFor="use-profile-avatar">Use profile picture</Label>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            disabled={isDisabled}
            onClick={() => onClickConfirm(name, isCheckedUseProfileAvatar)}
          >
            Join Room
          </Button>

          {showDivider && (
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">or</span>
              </div>
            </div>
          )}

          {!signedIn && (
            <Button variant="outline" className="w-full gap-2" onClick={() => signIn('google')}>
              <FontAwesomeIcon icon={faGoogle} className="size-4" />
              Sign in with Google
            </Button>
          )}

          {onClickSpectate && (
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={onClickSpectate}
            >
              Watch as spectator
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JoinRoomDialog
