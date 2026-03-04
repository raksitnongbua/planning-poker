import React, { useEffect, useState } from 'react'

const NO_SPIN_EMOJIS = new Set(['🔥', '🎉', '🧨', '🎃', '🧸', '❤️', '💀'])

export interface ThrownItem {
  id: string
  emoji: string
  x: number
  y: number
}

export type ThrowTargetContext = 'table' | 'panel'

export interface ThrowLauncherReturn {
  armedEmoji: string | null
  thrown: ThrownItem[]
  impacts: ThrownItem[]
  isExpanded: boolean
  hoveredMemberId: string | null
  hoveredCardCenter: { x: number; y: number } | null
  handleFire: (targetX: number, targetY: number, targetMemberId?: string, targetContext?: ThrowTargetContext) => void
  fireRemote: (emoji: string, fromX: number, fromY: number, targetX: number, targetY: number) => void
  handleArmEmoji: (emoji: string) => void
  disarm: () => void
  toggleExpanded: () => void
  setHoveredMemberId: React.Dispatch<React.SetStateAction<string | null>>
  setHoveredCardCenter: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
}

export interface ThrowLauncherOptions {
  onThrow?: (emoji: string, targetX: number, targetY: number, targetMemberId?: string, targetContext?: ThrowTargetContext) => void
}

export function useThrowLauncher(
  shooterRef: React.RefObject<HTMLDivElement>,
  options: ThrowLauncherOptions = {},
): ThrowLauncherReturn {
  const { onThrow } = options
  const [thrown, setThrown] = useState<ThrownItem[]>([])
  const [impacts, setImpacts] = useState<ThrownItem[]>([])
  const [armedEmoji, setArmedEmoji] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null)
  const [hoveredCardCenter, setHoveredCardCenter] = useState<{ x: number; y: number } | null>(null)

  const disarm = () => {
    setArmedEmoji(null)
    setHoveredMemberId(null)
    setHoveredCardCenter(null)
  }

  useEffect(() => {
    if (!armedEmoji) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setArmedEmoji(null)
        setHoveredMemberId(null)
        setHoveredCardCenter(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [armedEmoji])

  useEffect(() => {
    document.body.style.userSelect = armedEmoji ? 'none' : ''
    return () => { document.body.style.userSelect = '' }
  }, [armedEmoji])

  const animate = (emoji: string, startX: number, startY: number, targetX: number, targetY: number) => {
    if (!Number.isFinite(startX) || !Number.isFinite(startY) || !Number.isFinite(targetX) || !Number.isFinite(targetY)) return
    const throwId = Math.random().toString(36).slice(2)
    setThrown(p => [...p, { id: throwId, emoji, x: startX, y: startY }])

    const dx = targetX - startX
    const dy = targetY - startY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const arcHeight = Math.min(distance * 0.4, 220)
    const duration = Math.max(600, Math.min(1100, distance * 0.9))
    const spinDir = dx >= 0 ? 1 : -1
    const noSpin = NO_SPIN_EMOJIS.has(emoji)
    const startTime = performance.now()

    const frame = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const x = startX + dx * t
      const y = startY + dy * t - arcHeight * 4 * t * (1 - t)
      const scale = t < 0.75 ? 1 + t * 0.5 : Math.max(0.05, 1.375 - (t - 0.75) * 5.5)
      const opacity = t > 0.8 ? Math.max(0, 1 - (t - 0.8) * 5) : 1
      const spin = noSpin ? 0 : spinDir * t * 480

      const el = document.getElementById(`thrown-${throwId}`)
      if (el) {
        el.style.left = `${x}px`
        el.style.top = `${y}px`
        el.style.transform = `translate(-50%, -50%) rotate(${spin}deg) scale(${scale})`
        el.style.opacity = String(opacity)
      }

      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        setThrown(p => p.filter(item => item.id !== throwId))
        const hitId = Math.random().toString(36).slice(2)
        setImpacts(p => [...p, { id: hitId, emoji, x: targetX, y: targetY }])
        setTimeout(() => setImpacts(p => p.filter(i => i.id !== hitId)), 600)
      }
    }

    requestAnimationFrame(frame)
  }

  const handleArmEmoji = (emoji: string) => {
    setArmedEmoji(prev => (prev === emoji ? null : emoji))
    setHoveredMemberId(null)
    setHoveredCardCenter(null)
  }

  const fireAt = (emoji: string, targetX: number, targetY: number) => {
    const shooter = shooterRef.current?.getBoundingClientRect()
    const startX = shooter ? shooter.left + shooter.width / 2 : window.innerWidth - 80
    const startY = shooter ? shooter.top + shooter.height / 2 : window.innerHeight / 2
    animate(emoji, startX, startY, targetX, targetY)
  }

  const fireRemote = (emoji: string, fromX: number, fromY: number, targetX: number, targetY: number) => {
    animate(emoji, fromX, fromY, targetX, targetY)
  }

  const handleFire = (targetX: number, targetY: number, targetMemberId?: string, targetContext?: ThrowTargetContext) => {
    if (!armedEmoji) return
    fireAt(armedEmoji, targetX, targetY)
    onThrow?.(armedEmoji, targetX, targetY, targetMemberId, targetContext)
  }

  const toggleExpanded = () => setIsExpanded(p => !p)

  return {
    armedEmoji,
    thrown,
    impacts,
    isExpanded,
    hoveredMemberId,
    hoveredCardCenter,
    handleFire,
    fireRemote,
    handleArmEmoji,
    disarm,
    toggleExpanded,
    setHoveredMemberId,
    setHoveredCardCenter,
  }
}
