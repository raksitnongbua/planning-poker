import React from 'react'

import { Props, Status } from './types'

const ServiceStatus = ({ status: serviceStatus }: Props) => {
  const getClassByStatus = (status: Status) => {
    switch (status) {
      case 'unavailable':
        return 'bg-red-500'
      case 'connecting':
        return 'bg-yellow-500'
      case 'available':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="flex items-center gap-2 fixed bottom-4 left-4">
      <code className="text-sm font-medium text-muted-foreground">Service Status</code>
      <div className={`rounded-full size-2 ${getClassByStatus(serviceStatus)}`} />
    </div>
  )
}

export default ServiceStatus
