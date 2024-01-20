'use client'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from "date-fns";
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
    <Table>
      {isNotFoundData && <TableCaption>Your recent rooms could not be found.</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead className="">Name</TableHead>
          <TableHead className="text-center">Total Members</TableHead>
          <TableHead className="text-right">Updated Date</TableHead>
          <TableHead className="text-right">Created Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!isNotFoundData &&
          rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">{room.name}</TableCell>
              <TableCell className="text-center">{room.totalMembers}</TableCell>
              <TableCell className="text-right">{format(room.updatedAt,"eee dd-MMM-yyyy HH:mm")}</TableCell>
              <TableCell className="text-right">{format(room.createdAt,"eee dd-MMM-yyyy HH:mm")}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  id="join-recent-room"
                  aria-label="Join recent room"
                  onClick={handleClickJoinRoom(room.id)}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

export default RoomHistory
