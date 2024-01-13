import React from 'react'

export interface InviteButtonProps {
  onClick: () => void
}

const InviteButton = ({ onClick }: InviteButtonProps) => {
  return (
    <div className="flex items-center flex-col w-[80px] gap-3">
      <button
        onClick={onClick}
        className="text-black bg-white hover:bg-neutral-300 rounded-full size-14 text-xl"
      >
        +
      </button>
    </div>
  )
}

export default InviteButton
