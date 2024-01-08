import React, { useState } from 'react';
import Dialog from '@/components/common/Dialog';
import Button from '../common/Button/Button';
import { Props } from './types';

const JoinRoomDialog = ({ open, onClickConfirm }: Props) => {
  const [name, setName] = useState('');

  return (
    <Dialog
      open={open}
      title='Input your name'
      content={
        <input
          className='text-black'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='NAME'
          id='name'
        />
      }
      action={<Button onClick={() => onClickConfirm(name)}>Confirm</Button>}
    />
  );
};

export default JoinRoomDialog;
