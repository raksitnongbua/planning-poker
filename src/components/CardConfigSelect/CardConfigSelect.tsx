'use client'
import React, { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { CustomDeskDialog } from '../CustomDeskDialog'
import { Button } from '../ui/button'

export interface CardConfigSelectProps {
  options: DeskConfig[]
  onValueChange?: (value: string) => void
  disabled: boolean
  onCreateCustomDesk: (deskName: string, deskValue: string) => void
}
export interface DeskConfig {
  id: string
  displayName: string
  value: string
}

const CardConfigSelect: React.FC<CardConfigSelectProps> = (props) => {
  const { options, disabled, onValueChange, onCreateCustomDesk } = props
  const [isOpenCustomDesk, setOpenCustomDesk] = useState<boolean>(false)

  const handleCustomDeskSave = (deskName: string, deskValue: string) => {
    onCreateCustomDesk(deskName, deskValue)
    setOpenCustomDesk(false)
  }
  return (
    <>
      <Select defaultValue="default" onValueChange={onValueChange}>
        <SelectTrigger className="w-full" disabled={disabled}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Voting System</SelectLabel>
            {options.map(({ id, displayName, value }: DeskConfig) => (
              <SelectItem key={id} value={id}>
                {`${displayName} (${value})`}
              </SelectItem>
            ))}
            <Button variant="ghost" className="w-full" onClick={() => setOpenCustomDesk(true)}>
              Create custom desk..
            </Button>
          </SelectGroup>
        </SelectContent>
      </Select>
      <CustomDeskDialog
        open={isOpenCustomDesk}
        onClose={() => setOpenCustomDesk(false)}
        onSave={handleCustomDeskSave}
      />
    </>
  )
}
export default CardConfigSelect
