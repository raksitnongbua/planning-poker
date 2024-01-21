import Lottie from 'lottie-react'
import React, { Fragment } from 'react'

import loadingAnim from './loading.json'

const Loading = ({ open }: { open: boolean }) => {
  if (!open) return <></>
  return (
    <div
      data-component="loading"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 transition-opacity"
    >
      <Lottie animationData={loadingAnim} loop className="w-24" />
    </div>
  )
}

export default Loading
