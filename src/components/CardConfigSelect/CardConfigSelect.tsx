'use client'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CheckIcon } from '@radix-ui/react-icons'
import * as SelectPrimitive from '@radix-ui/react-select'
import React, { useState } from 'react'

import { cn } from '@/lib/utils'

import {
  Select,
  SelectContent,
  SelectGroup,
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
  value: string
  favoriteIds: string[]
  onToggleFavorite: (id: string) => void
}
export interface DeskConfig {
  id: string
  displayName: string
  value: string
  group?: 'preset' | 'custom'
}

interface DeckOptionProps {
  id: string
  displayName: string
  value: string
}

const DeckOption = ({ id, displayName, value }: DeckOptionProps) => {
  const chips = value.split(',').map((v) => v.trim()).filter(Boolean)
  return (
    <SelectPrimitive.Item
      value={id}
      className={cn(
        'relative flex w-full cursor-default select-none flex-col gap-1 rounded-md px-3 py-2 text-sm outline-none',
        'focus:bg-muted focus:text-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[state=checked]:bg-primary/10',
      )}
    >
      <div className="flex items-center justify-between pr-5">
        <SelectPrimitive.ItemText>
          <span className="font-medium">{displayName}</span>
        </SelectPrimitive.ItemText>
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <CheckIcon className="h-4 w-4 text-primary" />
          </SelectPrimitive.ItemIndicator>
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {chips.map((chip, i) => (
          <span
            key={i}
            className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground"
          >
            {chip}
          </span>
        ))}
      </div>
    </SelectPrimitive.Item>
  )
}

const CardConfigSelect: React.FC<CardConfigSelectProps> = (props) => {
  const { options, disabled, onValueChange, onCreateCustomDesk, value, favoriteIds, onToggleFavorite } = props
  const [isOpenCustomDesk, setOpenCustomDesk] = useState<boolean>(false)

  const handleCustomDeskSave = (deskName: string, deskValue: string) => {
    onCreateCustomDesk(deskName, deskValue)
    setOpenCustomDesk(false)
  }

  const isFavorite = favoriteIds.includes(value)
  const favoriteOptions = options.filter((o) => favoriteIds.includes(o.id))
  const presetOptions = options.filter((o) => o.group !== 'custom' && !favoriteIds.includes(o.id))
  const customOptions = options.filter((o) => o.group === 'custom' && !favoriteIds.includes(o.id))

  return (
    <>
      <div className="flex items-center gap-2">
        <Select defaultValue="fibonacci" onValueChange={onValueChange} value={value}>
          <SelectTrigger className="flex-1" disabled={disabled}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {favoriteOptions.length > 0 && (
              <SelectGroup>
                <SelectLabel>⭐ Favorites</SelectLabel>
                {favoriteOptions.map((o) => (
                  <DeckOption key={o.id} id={o.id} displayName={o.displayName} value={o.value} />
                ))}
              </SelectGroup>
            )}
            {presetOptions.length > 0 && (
              <SelectGroup>
                <SelectLabel>Preset Decks</SelectLabel>
                {presetOptions.map((o) => (
                  <DeckOption key={o.id} id={o.id} displayName={o.displayName} value={o.value} />
                ))}
              </SelectGroup>
            )}
            {customOptions.length > 0 && (
              <SelectGroup>
                <SelectLabel>Custom Decks</SelectLabel>
                {customOptions.map((o) => (
                  <DeckOption key={o.id} id={o.id} displayName={o.displayName} value={o.value} />
                ))}
              </SelectGroup>
            )}
            <SelectGroup>
              <Button
                variant="ghost"
                className="w-full text-primary hover:text-primary"
                onClick={() => setOpenCustomDesk(true)}
              >
                Create custom deck..
              </Button>
            </SelectGroup>
          </SelectContent>
        </Select>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onToggleFavorite(value)}
          className={`group relative flex size-9 flex-shrink-0 items-center justify-center rounded-xl border transition-all duration-200 disabled:opacity-40 ${
            isFavorite
              ? 'border-yellow-500/40 bg-yellow-500/10 hover:border-yellow-500/60 hover:bg-yellow-500/15'
              : 'border-border/40 bg-transparent hover:border-yellow-500/30 hover:bg-yellow-500/10'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FontAwesomeIcon
            icon={isFavorite ? faStar : faStarOutline}
            className={`size-3.5 transition-all duration-200 ${
              isFavorite
                ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)] group-hover:scale-110'
                : 'text-muted-foreground/50 group-hover:scale-110 group-hover:text-yellow-400'
            }`}
          />
        </button>
      </div>

      <CustomDeskDialog
        open={isOpenCustomDesk}
        onClose={() => setOpenCustomDesk(false)}
        onSave={handleCustomDeskSave}
      />
    </>
  )
}
export default CardConfigSelect
