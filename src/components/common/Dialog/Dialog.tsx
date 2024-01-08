import React, { Fragment } from 'react';
import { Dialog as HeadlessUIDialog, Transition } from '@headlessui/react';
import { Props } from './types';

const Dialog = ({ open, title, content, action }: Props) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <HeadlessUIDialog as='div' className='relative z-10' onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-white bg-opacity-15 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <HeadlessUIDialog.Panel className='relative transform overflow-hidden rounded-lg bg-neutral-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='bg-neutral-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                      <HeadlessUIDialog.Title
                        as='h3'
                        className='text-base font-semibold leading-6 text-white'
                      >
                        {title}
                      </HeadlessUIDialog.Title>
                      <div className='mt-2'>{content}</div>
                    </div>
                  </div>
                </div>
                <div className='bg-neutral-800 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6'>
                  {action}
                </div>
              </HeadlessUIDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessUIDialog>
    </Transition.Root>
  );
};

export default Dialog;
