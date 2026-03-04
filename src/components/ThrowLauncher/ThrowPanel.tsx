'use client'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  return (
    <div
      className={`fixed left-3 top-[72px] z-20 flex flex-col items-center overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300 ${
        armedEmoji
          ? 'border-primary/30 bg-background/95 shadow-md shadow-primary/10'
          : 'border-border/40 bg-background/95 shadow-sm'
      }`}
      style={{ maxHeight: 'calc(100dvh - 120px)' }}
    >
      {/* Header */}
      <div className="flex w-full flex-col items-center gap-1 px-2.5 pt-3 pb-2.5">
        {armedEmoji ? (
          <>
            <button
              onClick={onDisarm}
              title="Tap to disarm (Esc)"
              className="group relative flex size-10 cursor-pointer items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-xl transition-all duration-200 hover:border-destructive/50 hover:bg-destructive/10"
            >
              <span className="transition-all duration-150 group-hover:scale-0 group-hover:opacity-0">
                {armedEmoji}
              </span>
              <span className="absolute scale-0 text-sm font-semibold text-destructive opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100">
                ✕
              </span>
              <span className="absolute -right-1 -top-1 size-2 animate-pulse rounded-full bg-primary ring-1 ring-background" />
            </button>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-primary/70">
              Armed
            </span>
            <span className="text-[8px] text-muted-foreground/40">
              tap &middot; <kbd className="font-mono">esc</kbd>
            </span>
          </>
        ) : (
          <>
            <span className="text-lg leading-none text-muted-foreground/40">🎯</span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">
              Throw
            </span>
          </>
        )}
      </div>

      {/* Divider + expand toggle */}
      <button
        onClick={onToggleExpand}
        className={`flex w-full items-center justify-center border-t py-1 transition-colors duration-150 hover:bg-muted/30 ${
          armedEmoji
            ? 'border-primary/15 text-primary/30 hover:text-primary/60'
            : 'border-border/40 text-muted-foreground/30 hover:text-muted-foreground/70'
        }`}
      >
        <FontAwesomeIcon
          icon={isExpanded ? faChevronUp : faChevronDown}
          className="size-2.5"
        />
      </button>

      {/* Expandable emoji grid */}
      <div
        className={`overflow-y-auto [&::-webkit-scrollbar]:hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid grid-cols-2 gap-1 p-2 pb-2.5">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onArmEmoji(emoji)}
              title={armedEmoji === emoji ? 'Tap to disarm' : 'Arm to throw'}
              className={`flex size-9 cursor-pointer items-center justify-center rounded-lg border text-xl transition-all duration-150 active:scale-90 ${
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
    </div>
  )
}
