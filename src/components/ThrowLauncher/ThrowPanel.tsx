'use client'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'

const EMOJIS = [
  '🗑️', '🚀', '❤️', '💩', '🎉', '💣', '⚡', '🍕', '🥊',
  '🔥', '💀', '🧨', '🎃', '🍌', '🥚', '🏈', '❄️', '🥕',
  '🍔', '👟', '🦴', '🫐', '🧸', '🎈', '🍩',
  '👍', '👎', '👆', '👇', '👉', '🤙', '😊', '😂', '😭', '😡',
]

interface Props {
  armedEmoji: string | null
  isExpanded: boolean
  onToggleExpand: () => void
  onArmEmoji: (emoji: string) => void
  onDisarm: () => void
}

export default function ThrowPanel({
  armedEmoji,
  isExpanded,
  onToggleExpand,
  onArmEmoji,
  onDisarm,
}: Props) {
  const t = useTranslations('throwPanel')

  return (
    <div
      className="fixed bottom-20 left-3 z-20 hidden flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/95 shadow-xl shadow-black/30 backdrop-blur-md transition-[width] duration-300 md:flex"
      style={{ maxHeight: 'calc(100dvh - 120px)', width: isExpanded ? '120px' : '40px' }}
    >
      <div className="flex w-full items-center justify-between px-2 pt-2 pb-1.5">
        {isExpanded ? (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-sm leading-none">🎯</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {t('throw')}
            </span>
          </div>
        ) : (
          <span className="text-base leading-none">🎯</span>
        )}
        <button
          onClick={onToggleExpand}
          title={!isExpanded ? 'Throw emojis at teammates 🎯' : undefined}
          className="ml-auto flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground/40 transition-colors duration-150 hover:bg-muted/30 hover:text-muted-foreground/70"
        >
          <FontAwesomeIcon
            icon={isExpanded ? faChevronLeft : faChevronRight}
            className="size-2.5"
          />
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="mx-2 border-t border-border/40" />

          {/* Hint */}
          <p className="px-2.5 pt-2 pb-1 text-[9px] leading-snug text-muted-foreground/40">
            Pick an emoji &amp; click a teammate to throw it at them 🎳
          </p>

          {armedEmoji && (
            <div className="flex flex-col items-center gap-1 px-2 pt-2 pb-1">
              <button
                onClick={onDisarm}
                title="Tap to disarm (Esc)"
                className="group relative flex size-8 cursor-pointer items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-base transition-all duration-200 hover:border-destructive/50 hover:bg-destructive/10"
              >
                <span className="transition-all duration-150 group-hover:scale-0 group-hover:opacity-0">
                  {armedEmoji}
                </span>
                <span className="absolute scale-0 text-xs font-semibold text-destructive opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100">
                  ✕
                </span>
                <span className="absolute -right-1 -top-1 size-2 animate-pulse rounded-full bg-primary ring-1 ring-background" />
              </button>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-primary/70">
                {t('armed')}
              </span>
            </div>
          )}

          <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="grid grid-cols-3 gap-1 p-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onArmEmoji(emoji)}
                  title={armedEmoji === emoji ? 'Tap to disarm' : 'Arm to throw'}
                  className={`flex size-8 cursor-pointer items-center justify-center rounded-lg border text-base transition-all duration-150 active:scale-90 ${
                    armedEmoji === emoji
                      ? 'scale-105 border-primary/40 bg-primary/15 shadow-sm shadow-primary/20'
                      : 'border-border/40 bg-muted/20 hover:scale-110 hover:border-border/70 hover:bg-muted/40'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
