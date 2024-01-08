import React, { useState } from 'react';
import { Props } from './types';
import Dialog from '../common/Dialog';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';

const CreateRoomDIalog = ({ open, onClose, onCreate }: Props) => {
  const [roomName, setRoomName] = useState<string>('');

  const handleCreateRoom = () => {
    onCreate({ name: roomName });
  };

  const isCreateRoomButtonDisabled = roomName.trim() === '';

  return (
    <Dialog
      open={open}
      title='Create New Room'
      content={
        <Input
          placeholder='Room Name'
          onChange={(e) => setRoomName(e.target.value)}
        />
      }
      action={
        <>
          <Button
            disabled={isCreateRoomButtonDisabled}
            onClick={handleCreateRoom}
          >
            Create Room
          </Button>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
        </>
      }
    />
  );
};

export default CreateRoomDIalog;
