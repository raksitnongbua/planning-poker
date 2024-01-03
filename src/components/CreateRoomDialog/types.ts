export interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (room: RoomInfo) => void;
}

export interface RoomInfo {
  name: string;
}
