'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';

import { RoomInfo } from '../CreateRoomDialog/types';
import CreateRoomDialog from '../CreateRoomDialog';
import { httpClient } from '@/utils/httpClient';
import Loading from '../Loading';

const Lobby = () => {
  const [isOpenCreateRoomDialog, setIsOpenCreateRoomDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cookies = useCookies();
  const router = useRouter();

  const uidKey = 'CPPUniID';

  useEffect(() => {
    const uuid = cookies.get(uidKey);

    if (!uuid) {
      const signIn = async () => {
        setIsLoading(true);
        try {
          const res = await httpClient.get('/api/v1/guest/sign-in');
          cookies.set(uidKey, res.data.uuid);
        } catch (error) {
          console.error('Lobby error:', error);
        }
        setIsLoading(false);
      };
      signIn();
    }
  }, [cookies]);

  const handleCreateRoom = async (room: RoomInfo) => {
    setIsLoading(true);
    try {
      const res = await httpClient.post('/api/v1/new-room', {
        room_name: room.name,
        hosting_id: cookies.get(uidKey),
      });
      if (res.status === 200) {
        const roomId = res.data.room_id;
        router.push(`/room/${roomId}`);
      }
    } catch (error) {
      console.error('new room error:', error);
    }
    setIsLoading(false);
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
