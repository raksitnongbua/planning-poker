'use client'
import React from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Button } from '../ui/button'

export interface CardConfigSelectProps {
  options: DeskConfig[]
  onValueChange?: (value: string) => void
}
export interface DeskConfig {
  id: string
  displayName: string
  value: string
}

const CardConfigSelect: React.FC<CardConfigSelectProps> = ({ options, onValueChange }) => {
  return (
    <Select defaultValue="default" onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
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

          <Button variant="ghost" className="w-full" disabled>
            Create custom desk..
          </Button>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
export default CardConfigSelect
