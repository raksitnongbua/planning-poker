import React from 'react'

import { Props, Status } from './types'

const config: Record<Status, { dot: string; pulse: string; text: string; label: string }> = {
  available: {
    dot: 'bg-green-500',
    pulse: 'bg-green-500/40',
    text: 'text-green-400',
    label: 'Operational',
  },
  connecting: {
    dot: 'bg-yellow-400',
    pulse: 'bg-yellow-400/40',
    text: 'text-yellow-400',
    label: 'Connecting',
  },
  unavailable: {
    dot: 'bg-red-500',
    pulse: 'bg-red-500/40',
    text: 'text-red-400',
    label: 'Unavailable',
  },
}

const ServiceStatus = ({ status }: Props) => {
  const { dot, pulse, text, label } = config[status] ?? {
    dot: 'bg-gray-500',
    pulse: 'bg-gray-500/40',
    text: 'text-gray-400',
    label: 'Unknown',
  }

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
      <span className="relative flex size-2">
        {status === 'connecting' && (
          <span className={`absolute inline-flex size-full animate-ping rounded-full ${pulse}`} />
        )}
        <span className={`relative inline-flex size-2 rounded-full ${dot}`} />
      </span>
      <span className={`text-xs font-medium ${text}`}>{label}</span>
    </div>
  )
}

export default ServiceStatus
