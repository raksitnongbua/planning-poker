'use client';

import RoomContent from '@/components/RoomContent';
import { useParams } from 'next/navigation';
import React from 'react';

const Room = () => {
  const params = useParams();
  return <RoomContent roomId={params.id.toString()} />;
};

export default Room;
