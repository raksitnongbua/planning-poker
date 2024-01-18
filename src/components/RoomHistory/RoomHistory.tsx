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

export interface RoomHistoryProps {
  onClickJoinRoom?: (roomId: string) => void
}

const RoomHistory: React.FC<RoomHistoryProps> = ({ onClickJoinRoom }) => {
  const rooms = [
    {
      id: 'mozal-486c1792-d9b8-4336-a97c-1718b394c97f',
      name: 'TestName',
      createdAt: '2024-01-17T18:28:22Z',
      totalMembers: 2,
      updatedAt: '2024-01-17T18:28:22Z',
    },
    {
      id: 'r3sa1-b34a444d-1bdb-45ac-9667-8c6d47f4e0a4',
      name: 'TestName2',
      createdAt: '2024-01-17T18:28:22Z',
      totalMembers: 2,
      updatedAt: '2024-01-17T19:47:53Z',
    },
  ]

  const handleClickJoinRoom = (id: string) => () => {
    onClickJoinRoom?.(id)
  }

  return (
    <Table>
      <TableCaption>A list of your recent rooms.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Name</TableHead>
          <TableHead className="text-center">Total Members</TableHead>
          <TableHead className="text-right">Last Used</TableHead>
          <TableHead className="text-right">Created Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell className="font-medium">{room.name}</TableCell>
            <TableCell className="text-center">{room.totalMembers}</TableCell>
            <TableCell className="text-right">
              {new Date(room.updatedAt).toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {new Date(room.createdAt).toLocaleString()}
            </TableCell>
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
