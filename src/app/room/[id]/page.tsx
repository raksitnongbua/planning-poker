'use client';

import { useParams } from 'next/navigation';
import React from 'react';

const Room = () => {
  const params = useParams();
  return <div>{params.id}</div>;
};

export default Room;
