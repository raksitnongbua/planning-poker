'use client'

import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('joinRoom')

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
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="display-name">{t('displayName')}</Label>
            <Input
              id="display-name"
              autoFocus
              maxLength={20}
              placeholder={t('namePlaceholder')}
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
              <Label htmlFor="use-profile-avatar">{t('useProfilePicture')}</Label>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            disabled={isDisabled}
            onClick={() => onClickConfirm(name, isCheckedUseProfileAvatar)}
          >
            {t('joinRoom')}
          </Button>

          {showDivider && (
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">{t('or')}</span>
              </div>
            </div>
          )}

          {!signedIn && (
            <Button variant="outline" className="w-full gap-2" onClick={() => signIn('google')}>
              <FontAwesomeIcon icon={faGoogle} className="size-4" />
              {t('signInWithGoogle')}
            </Button>
          )}

          {onClickSpectate && (
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={onClickSpectate}
            >
              {t('watchAsSpectator')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JoinRoomDialog
