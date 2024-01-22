'use client'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import FrontCard from '../FrontCard'

export interface CustomDeskDialogProps {
  open: boolean
  onSave?: (deskName: string, deskValue: string) => void
  onClose?: () => void
}
const DEFAULT_DESK_VALUES = ['0', '0.5', '1', '2', '4', '8']
const MAX_CARDS = 15

const CustomDeskDialog: React.FC<CustomDeskDialogProps> = ({ open, onSave, onClose }) => {
  const [deskValues, setDeskValues] = useState<string[]>(DEFAULT_DESK_VALUES)
  const [deskName, setDeskName] = useState<string>('My custom deck')

  const canSubmit = deskValues.filter((v) => Number(v)).length > 0 && deskName.trim() !== ''

  const convertToDeskValues = (value: string) => {
    const array = value
      .replace(/[^0-9,.]/g, '')
      .split(',')
      .filter((_, index) => index <= MAX_CARDS)

    return array.map((value) => {
      const [integer, float] = value.split('.')
      if (!integer) return ''
      const floatText = float === '' ? '.' : Boolean(float) ? `.${float.slice(0, 2)}` : ''
      const result = `${integer.slice(0, 2)}${floatText}`
      return result.endsWith('.') ? result : Number(result).toString()
    })
  }

  const filteredDeskValues = deskValues.filter((value) => value !== '')

  const handleOpenChange = () => {
    setDeskValues(DEFAULT_DESK_VALUES)
    setDeskName('My custom deck')
    onClose?.()
  }
  const onClickSave = () => {
    onSave?.(deskName, deskValues.map((v) => Number(v)).toString())
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Create custom deck</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="desk-name" className="text-right" autoFocus>
              Desk name
            </Label>
            <Input
              id="desk-name"
              className="col-span-5"
              value={deskName}
              onChange={(e) => setDeskName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-6 items-baseline gap-4">
            <Label htmlFor="desk-values" className="text-right">
              Desk values
            </Label>
            <div className="col-span-5">
              <Input
                id="desk-values"
                value={deskValues.toString()}
                onChange={(e) => {
                  const newDeskValues = convertToDeskValues(e.target.value)
                  setDeskValues(newDeskValues)
                }}
              />
              <Label
                htmlFor="desk-values"
                className="flex gap-1 px-px pt-2 text-[12px] font-thin opacity-75"
              >
                <InfoCircledIcon />
                Each card can hold up to 2 digits, not including decimals, separated by commas.
              </Label>
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2 overflow-auto px-3">
            <h6 className="text-md">Preview</h6>
            <div className="relative flex overflow-x-auto">
              <div className="flex w-full min-w-fit justify-center gap-1 self-center">
                {filteredDeskValues.map((label, index) => (
                  <FrontCard
                    key={label + index}
                    label={Number(label).toString()}
                    className="h-[76px] w-[52px] text-xl "
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={!canSubmit} type="submit" onClick={onClickSave}>
            Save desk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDeskDialog
