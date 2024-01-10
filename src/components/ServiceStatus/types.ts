export interface Props {
  status: Status;
}

export type Status = 'unavailable' | 'connecting' | 'available';
