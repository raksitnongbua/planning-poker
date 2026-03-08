'use client'
import { faCommentDots, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ChatMessage } from './types'

interface ChatWidgetProps {
  isOpen: boolean
  messages: ChatMessage[]
  unreadCount: number
  chatInput: string
  myId: string
  chatEndRef: React.RefObject<HTMLDivElement | null>
  onToggle: () => void
  onInputChange: (val: string) => void
  onSend: () => void
}

const ChatWidget = ({
  isOpen,
  messages,
  unreadCount,
  myId,
  chatEndRef,
  onToggle,
}: ChatWidgetProps) => {
  return (
    <div className="fixed bottom-20 left-4 z-30 flex flex-col items-start gap-2">
      {isOpen && (
        <div className="flex flex-col w-64 h-80 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-md shadow-2xl shadow-black/40 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          {/* Chat header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/40 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">Chat</span>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary/70">Coming soon</span>
            </div>
            <button onClick={onToggle} className="text-muted-foreground hover:text-foreground transition-colors text-xs leading-none">✕</button>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 px-3 py-2">
            {messages.length === 0 && (
              <p className="text-center text-[11px] text-muted-foreground/40 mt-6">No messages yet</p>
            )}
            {messages.map((msg) => {
              const isMe = msg.memberId === myId
              return (
                <div key={msg.id} className={`flex gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="size-5 flex-shrink-0 mt-0.5">
                    <AvatarImage src={msg.avatar ?? '/images/corgi-tood-cute.png'} alt={msg.name} />
                    <AvatarFallback className="text-[7px]">{msg.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col gap-0.5 min-w-0 ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && <span className="text-[10px] text-muted-foreground/60 leading-none">{msg.name}</span>}
                    <div className={`rounded-2xl px-2.5 py-1.5 text-xs leading-snug break-words max-w-[168px] ${
                      isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted/60 text-foreground rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-1.5 px-3 py-2.5 border-t border-border/40 flex-shrink-0">
            <input
              className="flex-1 min-w-0 rounded-lg border border-border/50 bg-muted/20 px-2.5 py-1.5 text-xs placeholder:text-muted-foreground/25 cursor-not-allowed opacity-50"
              placeholder="Coming soon…"
              disabled
            />
            <button
              disabled
              className="flex-shrink-0 rounded-lg bg-primary/80 px-2.5 py-1.5 text-primary-foreground opacity-30 cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="relative flex items-center justify-center size-10 rounded-full border border-border/50 bg-background/95 backdrop-blur-md shadow-lg text-muted-foreground hover:text-foreground transition-colors"
      >
        <FontAwesomeIcon icon={faCommentDots} className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center size-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  )
}

export default ChatWidget
