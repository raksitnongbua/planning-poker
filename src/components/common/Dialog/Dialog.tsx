import React from 'react'
import {
  Dialog as RootDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Props } from './types'

const Dialog = ({ open, onOpenChange, title, content, action }: Props) => {
  return (
    <RootDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">{title}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
        </DialogHeader>
        {action && (
          <DialogFooter className="pt-4 flex-col gap-2 sm:flex-row">{action}</DialogFooter>
        )}
        <DialogClose className="invisible" />
      </DialogContent>
    </RootDialog>
  )
}

export default Dialog
