'use client';

import React, { useState } from 'react';
import CreateRoomDialog from '../CreateRoomDialog';

const Lobby = () => {
  const [isOpenCreateRoomDialog, setIsOpenCreateRoomDialog] = useState(false);

  return (
    <>
      <div className='p-10'>
        <div className='my-5 grid gap-4'>
          <h1 className='text-4xl'>Simple Planning</h1>
          <p className='text-lg'>
            Make Estimating Agile Projects Accurate & Fun
          </p>
        </div>
        <button
          className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'
          onClick={() => setIsOpenCreateRoomDialog(true)}
        >
          Create Room
        </button>
      </div>
      <CreateRoomDialog
        open={isOpenCreateRoomDialog}
        onClose={() => {
          setIsOpenCreateRoomDialog(false);
        }}
        onCreate={() => {}}
      />
    </>
  );
};

export default Lobby;
