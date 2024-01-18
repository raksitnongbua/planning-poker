'use client'
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

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
      {isNotFoundData && <TableCaption>Not found your recent rooms.</TableCaption>}
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
              <TableCell className="text-right">{room.updatedAt.toLocaleString()}</TableCell>
              <TableCell className="text-right">{room.createdAt.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Button size="icon" onClick={handleClickJoinRoom(room.id)}>
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
