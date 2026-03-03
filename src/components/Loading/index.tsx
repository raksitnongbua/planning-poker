import dynamic from 'next/dynamic'

export default dynamic(() => import('./Loading'), { ssr: false })
