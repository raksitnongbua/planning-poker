import { useUserInfoStore } from '@/store/zustand';
import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import JoinRoomDialog from '../JoinRoomDialog';
import GuestAvatar from '../GuestAvatar';
import { Member, Props } from './types';

const RoomContent = ({ roomId }: Props) => {
  const { uid } = useUserInfoStore();
  const [openJoinRoomDialog, setOpenJoinRoomDialog] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const socketUrl = `${process.env.NEXT_PUBLIC_WS_ENDPOINT}/room/${uid}/${roomId}`;
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const handleClickJoinRoom = (name: string) => {
    sendJsonMessage({ action: 'JOIN_ROOM', payload: { uid, name } });
    setOpenJoinRoomDialog(false);
  };

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    const jsonMessage = JSON.parse(lastMessage.data);
    const action = jsonMessage.action;
    switch (action) {
      case 'NEED_TO_JOIN':
        setOpenJoinRoomDialog(true);
        break;
      case 'UPDATE_ROOM':
        const payload = jsonMessage.payload;
        if (payload.members) {
          setMembers(payload.members);
        }
        break;
      default:
        break;
    }
  }, [lastMessage, lastMessage?.data]);

  return (
    <>
      <div className='p-8'>
        <div className='flex gap-2'>
          {members.map(({ name, id }) => (
            <GuestAvatar name={name} key={id} />
          ))}
        </div>
        {!openJoinRoomDialog && (
          <p className='text-xs text-muted-foreground absolute bottom-2 right-2'>
            The WebSocket is currently {connectionStatus}
          </p>
        )}
      </div>

      <JoinRoomDialog
        open={openJoinRoomDialog}
        onClickConfirm={handleClickJoinRoom}
      />
    </>
  );
};

export default RoomContent;
