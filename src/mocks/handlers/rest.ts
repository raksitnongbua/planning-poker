import { http,HttpResponse } from 'msw'
import { v4 as uuidv4 } from 'uuid'

import { mockRooms } from '../data/rooms'

// httpClient uses NEXT_PUBLIC_API_ENDPOINT as baseURL — match both absolute and relative paths
const API = process.env.NEXT_PUBLIC_API_ENDPOINT ?? ''

export const restHandlers = [
  // Guest sign-in (called from proxy.ts middleware — intercepted by Node server only)
  http.get(`${API}/api/v1/guest/sign-in`, () => {
    return HttpResponse.json({ uuid: uuidv4() })
  }),

  // Create room — httpClient.post('/api/v1/new-room') resolves to ${API}/api/v1/new-room
  http.post(`${API}/api/v1/new-room`, async () => {
    const roomId = `room-mock-${uuidv4().slice(0, 8)}`
    return HttpResponse.json({ room_id: roomId }, { status: 201 })
  }),

  // Recent rooms — plain axios('/api/v1/room/recent-rooms/:uid') is a relative path
  http.get('/api/v1/room/recent-rooms/:uid', () => {
    return HttpResponse.json({ data: mockRooms })
  }),

  // Health check — httpClient('/health') resolves to ${API}/health
  http.get(`${API}/health`, () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]
