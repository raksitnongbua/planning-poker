import { DialogProps } from '@radix-ui/react-dialog'
import { ReactNode } from 'react'

export interface Props extends Pick<DialogProps, 'open' | 'onOpenChange'> {
  title?: ReactNode
  content?: ReactNode
  action?: ReactNode
}
