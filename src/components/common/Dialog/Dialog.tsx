import React from 'react';
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Props } from './types';

const Dialog = ({ open, title, content, action }: Props) => {
  return (
    <BaseDialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='pb-4'>{title}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
        </DialogHeader>
        {action && <DialogFooter>{action}</DialogFooter>}
      </DialogContent>
    </BaseDialog>
  );
};

export default Dialog;
