import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import Lottie from 'lottie-react';
import corgiLoadingAnimation from './corgi-loading.json';

const Loading = ({ open }: { open: boolean }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter='ease-out duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='ease-in duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <div className='fixed inset-0 bg-black bg-opacity-75 transition-opacity flex items-center justify-center z-20'>
          <Lottie animationData={corgiLoadingAnimation} loop className='w-40' />
        </div>
      </Transition.Child>
    </Transition.Root>
  );
};

export default Loading;
