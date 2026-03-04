'use client'
import React from 'react'

import type { ThrownItem } from './useThrowLauncher'

interface Props {
  armedEmoji: string | null
  hoveredCardCenter: { x: number; y: number } | null
  thrown: ThrownItem[]
  impacts: ThrownItem[]
}

export default function ThrowOverlay({ armedEmoji, hoveredCardCenter, thrown, impacts }: Props) {
  return (
    <>
      {/* Holding preview above hovered card */}
      {armedEmoji && hoveredCardCenter && (
        <div
          className="pointer-events-none fixed z-40 flex flex-col items-center gap-1 animate-in fade-in zoom-in-75 duration-150"
          style={{
            left: hoveredCardCenter.x,
            top: hoveredCardCenter.y - 4,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <span className="animate-float text-3xl drop-shadow-lg">{armedEmoji}</span>
          <span className="rounded-full border border-orange-400/40 bg-orange-400/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-orange-400/80 backdrop-blur-sm">
            Click to throw
          </span>
          <span className="text-[10px] text-orange-400/60">▾</span>
        </div>
      )}

      {/* Disarm hint */}
      {armedEmoji && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/90 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-md">
            <span>Click to throw</span>
            <span className="text-border">·</span>
            <span>
              <kbd className="rounded border border-border/50 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
              {' '}or tap the armed emoji to disarm
            </span>
          </div>
        </div>
      )}

      {/* Flying thrown items */}
      {thrown.map(({ id, emoji, x, y }) => (
        <div
          key={id}
          id={`thrown-${id}`}
          className="pointer-events-none fixed z-50 select-none text-4xl"
          style={{
            left: x,
            top: y,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform, left, top, opacity',
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Hit impact effects */}
      {impacts.map(({ id, emoji, x, y }) => (
        <React.Fragment key={id}>
          <div
            className="pointer-events-none fixed z-50 select-none text-4xl animate-hit"
            style={{ left: x, top: y }}
          >
            {emoji}
          </div>
          <div
            className="pointer-events-none fixed z-50 rounded-full border-2 border-orange-400/80 animate-hit-ring"
            style={{ left: x, top: y, width: 40, height: 40 }}
          />
        </React.Fragment>
      ))}
    </>
  )
}
