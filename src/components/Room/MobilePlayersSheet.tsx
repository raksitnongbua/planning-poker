'use client'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { faCircleCheck, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Member, Status } from './types'

interface MobilePlayersSheetProps {
  members: Member[]
  sortedMembers: Member[]
  roomStatus: Status
  isRevealed: boolean
  myId: string | null
  now: number
  inviteLink: string
  isCopied: boolean
  formatTimeAgo: (ms: number) => string
  onClose: () => void
  onCopy: () => void
}

const MobilePlayersSheet = ({
  members,
  sortedMembers,
  roomStatus,
  isRevealed,
  now,
  isCopied,
  formatTimeAgo,
  onClose,
  onCopy,
}: MobilePlayersSheetProps) => {
  const t = useTranslations('room')
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[75dvh] rounded-t-2xl border-t border-border/40 bg-background flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border/60 flex-shrink-0" />
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">In Room</p>
            <p className="text-lg font-bold tabular-nums leading-tight">
              {members.length} <span className="text-xs font-normal text-muted-foreground">players</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCopy}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all duration-300 ${
                isCopied
                  ? 'border-green-500/60 bg-green-500/10 text-green-400'
                  : 'border-dashed border-primary/50 text-primary/70 hover:border-primary hover:text-primary'
              }`}
            >
              <FontAwesomeIcon icon={isCopied ? faCircleCheck : faUserPlus} className="size-3" />
              {isCopied ? t('copied') : t('invite')}
            </button>
            <button
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-full bg-muted/40 text-muted-foreground"
            >
              <FontAwesomeIcon icon={faXmark} className="size-3.5" />
            </button>
          </div>
        </div>
        {roomStatus === Status.Voting && members.length > 0 && (() => {
          const votedCount = members.filter(m => m.estimatedValue !== '').length
          return (
            <div className="px-5 pb-3 space-y-1.5 flex-shrink-0">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('votedCount', { count: votedCount })}</span>
                <span>{t('waitingCount', { count: members.length - votedCount })}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(votedCount / members.length) * 100}%` }}
                />
              </div>
            </div>
          )
        })()}
        <div className="flex flex-col gap-1.5 overflow-y-auto px-4 pb-8 flex-1 min-h-0">
          {sortedMembers.map((member) => {
            const picked = member.estimatedValue !== ''
            const msDiff = now - member.lastActiveAt.getTime()
            const activeDot =
              msDiff <= 1 * 60_000 ? 'bg-green-500' :
              msDiff <= 10 * 60_000 ? 'bg-orange-400' :
              'bg-neutral-500'
            const activeLabel = formatTimeAgo(msDiff)
            return (
              <div
                key={member.id}
                className="relative flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-3 py-2.5"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="size-8 ring-1 ring-border">
                    <AvatarImage src={member.avatar ?? '/images/corgi-tood-cute.png'} alt={member.name} />
                    <AvatarFallback className="text-xs">{member.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background ${activeDot}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground">{activeLabel}</p>
                </div>
                {isRevealed && picked ? (
                  <span className="min-w-[24px] rounded-md bg-primary/20 px-1.5 py-0.5 text-center text-xs font-bold text-primary">
                    {member.estimatedValue}
                  </span>
                ) : picked ? (
                  <FontAwesomeIcon icon={faCircleCheck} className="size-4 flex-shrink-0 text-primary" />
                ) : (
                  <FontAwesomeIcon icon={faCircle} className="size-4 flex-shrink-0 text-muted-foreground/25" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobilePlayersSheet
