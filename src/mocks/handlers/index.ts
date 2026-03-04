import { restHandlers } from './rest'
import { wsHandlers } from './ws'

export const handlers = [...restHandlers, ...wsHandlers]
