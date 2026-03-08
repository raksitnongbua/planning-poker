'use client'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import React from 'react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '../ui/button'

export interface Room {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  totalMembers: number
}
export interface RoomHistoryProps {
  rooms: Room[]
  onClickJoinRoom?: (roomId: string) => void
}

const RoomHistory: React.FC<RoomHistoryProps> = ({ onClickJoinRoom, rooms }) => {
  const handleClickJoinRoom = (id: string) => () => {
    onClickJoinRoom?.(id)
  }
  const isNotFoundData = rooms.length === 0

  return (
    <>
      <div className="flex w-full flex-col gap-2 md:hidden">
        {isNotFoundData ? (
          <p className="py-8 text-center text-sm text-muted-foreground/50">Your recent rooms could not be found.</p>
        ) : (
          rooms.map((room, i) => (
            <div
              key={room.id}
              className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-4 py-3 animate-in fade-in slide-in-from-left-3 duration-300"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{room.name}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/50">
                  {room.totalMembers} player{room.totalMembers !== 1 ? 's' : ''} · {format(room.updatedAt, 'dd MMM yyyy')}
                </p>
              </div>
              <Button
                size="sm"
                id="join-recent-room"
                aria-label="Resume room"
                className="flex-shrink-0 gap-1.5"
                onClick={handleClickJoinRoom(room.id)}
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="size-3.5" />
                Resume
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="hidden w-full md:block">
        <Table>
          {isNotFoundData && <TableCaption>Your recent rooms could not be found.</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Total Members</TableHead>
              <TableHead className="text-right">Updated Date</TableHead>
              <TableHead className="text-right">Created Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isNotFoundData &&
              rooms.map((room, i) => (
                <TableRow
                  key={room.id}
                  className="animate-in fade-in slide-in-from-left-3 duration-300 transition-colors"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                >
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell className="text-center">{room.totalMembers}</TableCell>
                  <TableCell className="text-right">{format(room.updatedAt, 'eee dd-MMM-yyyy HH:mm')}</TableCell>
                  <TableCell className="text-right">{format(room.createdAt, 'eee dd-MMM-yyyy HH:mm')}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      id="join-recent-room"
                      aria-label="Resume room"
                      className="gap-1.5"
                      onClick={handleClickJoinRoom(room.id)}
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="size-3.5" />
                      Resume
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default RoomHistory
