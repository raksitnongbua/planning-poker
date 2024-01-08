import React, { Fragment, useState } from 'react';
import { Props } from './types';
import Dialog from '../common/Dialog';

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
        <input
          className='rounded-sm px-2 bg-neutral-100 text-black focus-visible:outline-none'
          placeholder='Enter room name'
          onChange={(e) => setRoomName(e.target.value)}
        />
      }
      action={
        <>
          <button
            type='button'
            className='inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:hover:bg-blue-600'
            disabled={isCreateRoomButtonDisabled}
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
          <button
            type='button'
            className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
            onClick={onClose}
          >
            Cancel
          </button>
        </>
      }
    />
  );
};

export default CreateRoomDIalog;
