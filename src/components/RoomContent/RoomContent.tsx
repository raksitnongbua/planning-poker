import { useUserInfoStore } from '@/store/zustand';
import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import JoinRoomDialog from '../JoinRoomDialog';
import Loading from '../Loading';

interface Props {
  roomId?: string;
}

const RoomContent = ({ roomId }: Props) => {
  const { uid } = useUserInfoStore();
  const [openJoinRoomDialog, setOpenJoinRoomDialog] = useState(false);

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
    if (lastMessage) {
      const action = JSON.parse(lastMessage.data).action;
      if (action === 'NEED_TO_JOIN') {
        setOpenJoinRoomDialog(true);
      }
    }
  }, [lastMessage, lastMessage?.data]);

  return (
    <>
      <span>The WebSocket is currently {connectionStatus}</span>
      <br />
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <JoinRoomDialog
        open={openJoinRoomDialog}
        onClickConfirm={handleClickJoinRoom}
      />
    </>
  );
};

export default RoomContent;
