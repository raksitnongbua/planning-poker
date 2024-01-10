import React from 'react';
import { Props, Status } from './types';

const ServiceStatus = ({ status }: Props) => {
  const getClassByStatus = (inputStatus: Status) => {
    switch (inputStatus) {
      case 'unavailable':
        return 'bg-red-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'available':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className='flex items-center gap-2 fixed bottom-4 right-4'>
      <code className='text-sm font-medium text-muted-foreground'>
        Service Status
      </code>
      <div className={`rounded-full size-2 ${getClassByStatus(status)}`} />
    </div>
  );
};

export default ServiceStatus;
