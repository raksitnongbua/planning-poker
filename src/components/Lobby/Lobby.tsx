'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { RoomInfo } from '../CreateRoomDialog/types';
import CreateRoomDialog from '../CreateRoomDialog';
import { httpClient } from '@/utils/httpClient';
import Loading from '../Loading';
import { useUserInfoStore } from '@/store/zustand';

const Lobby = () => {
  const [isOpenCreateRoomDialog, setIsOpenCreateRoomDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { uid } = useUserInfoStore();

  useEffect(() => {
    setIsLoading(!Boolean(uid));
  }, [uid]);

  const handleCreateRoom = async (room: RoomInfo) => {
    setIsLoading(true);
    try {
      const res = await httpClient.post('/api/v1/new-room', {
        room_name: room.name,
        hosting_id: uid,
      });
      if (res.status === 200) {
        const roomId = res.data.room_id;
        router.push(`/room/${roomId}`);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('new room error:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='p-10 w-full flex items-center flex-col'>
        <Image
          src='/images/corgi-good.png'
          alt='corgi-logo'
          width={150}
          height={200}
        />
        <div className='my-5 grid gap-4'>
          <h1 className='text-4xl'>Corgi Planning Poker</h1>
          <p className='text-lg'>
            Make Estimating Agile Projects Accurate & Fun
          </p>
          <button
            className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'
            onClick={() => setIsOpenCreateRoomDialog(true)}
          >
            Create Room
          </button>
        </div>
      </div>
      <Loading open={isLoading} />
      <CreateRoomDialog
        open={isOpenCreateRoomDialog}
        onClose={() => {
          setIsOpenCreateRoomDialog(false);
        }}
        onCreate={handleCreateRoom}
      />
    </>
  );
};

export default Lobby;
