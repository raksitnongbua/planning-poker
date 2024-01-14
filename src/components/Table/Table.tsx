import React from 'react'

export interface TableProps {
  name: string
}

const Table = ({ name }: TableProps) => {
  return (
    <div className="min-w-64 h-32 border uppercase flex justify-center items-center rounded-md">
      {name}
    </div>
  )
}

export default Table
