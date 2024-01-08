import { ReactNode } from 'react';

export interface Props {
  open: boolean;
  title?: ReactNode;
  content?: ReactNode;
  action?: ReactNode;
}
