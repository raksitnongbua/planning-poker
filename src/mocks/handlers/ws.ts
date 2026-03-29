import { ws } from 'msw'

const WS_ENDPOINT = process.env.NEXT_PUBLIC_WS_ENDPOINT ?? 'ws://localhost:8080'

// Match the socket URL pattern from Room.tsx:
// `${NEXT_PUBLIC_WS_ENDPOINT}/room/${id}/${roomId}`
const roomLink = ws.link(`${WS_ENDPOINT}/room/:uid/:roomId`)

interface MockMember {
  id: string
  name: string
  estimated_value: string
  last_active_at: string
  picture: string
}

interface RoomState {
  name: string
  status: 'NONE' | 'VOTING' | 'REVEALED_CARDS'
  members: MockMember[]
  desk_config: string
  result: Record<string, number> | null
}

const BOT_MEMBERS: MockMember[] = [
  { id: 'bot-alice', name: 'Alice', estimated_value: '', last_active_at: new Date().toISOString(), picture: '' },
  { id: 'bot-bob', name: 'Bob', estimated_value: '', last_active_at: new Date().toISOString(), picture: '' },
]

// addEventListener() returns the WebSocketHandler — that is what setupWorker/setupServer accepts
const roomHandler = roomLink.addEventListener('connection', ({ client, params }) => {
  const { uid } = params

  const state: RoomState = {
    name: 'Mock Planning Room',
    status: 'NONE',
    // Clone bots so each connection has independent state
    members: BOT_MEMBERS.map((m) => ({ ...m })),
    desk_config: '1, 2, 3, 5, 8, 13, 21, 34',
    result: null,
  }

  const send = (action: string, payload: unknown) => {
    client.send(JSON.stringify({ action, payload }))
  }

  const broadcastRoom = () => {
    send('UPDATE_ROOM', {
      name: state.name,
      status: state.status,
      members: state.members,
      desk_config: state.desk_config,
      result: state.result,
    })
  }

  // Prompt the user to join after connection is established
  setTimeout(() => send('NEED_TO_JOIN', null), 150)

  client.addEventListener('message', (event) => {
    const { action, payload } = JSON.parse(event.data as string)

    switch (action) {
      case 'JOIN_ROOM': {
        state.status = 'VOTING'

        const userMember: MockMember = {
          id: String(uid),
          name: payload.name,
          estimated_value: '',
          last_active_at: new Date().toISOString(),
          picture: payload.profile ?? '',
        }

        const existingIdx = state.members.findIndex((m) => m.id === String(uid))
        if (existingIdx >= 0) {
          state.members[existingIdx] = userMember
        } else {
          state.members.push(userMember)
        }

        broadcastRoom()

        // Bots auto-vote 1.5s after the user joins for a realistic feel
        setTimeout(() => {
          const cardValues = state.desk_config.split(',').map((v) => v.trim())
          state.members = state.members.map((m) =>
            m.id.startsWith('bot-')
              ? { ...m, estimated_value: cardValues[Math.floor(Math.random() * cardValues.length)], last_active_at: new Date().toISOString() }
              : m,
          )
          broadcastRoom()
        }, 1500)

        break
      }

      case 'UPDATE_ESTIMATED_VALUE': {
        const idx = state.members.findIndex((m) => m.id === String(uid))
        if (idx >= 0) {
          state.members[idx] = {
            ...state.members[idx],
            estimated_value: String(payload.value),
            last_active_at: new Date().toISOString(),
          }
        }
        broadcastRoom()
        break
      }

      case 'REVEAL_CARDS': {
        state.status = 'REVEALED_CARDS'
        const tally: Record<string, number> = {}
        for (const m of state.members) {
          if (m.estimated_value) {
            tally[m.estimated_value] = (tally[m.estimated_value] ?? 0) + 1
          }
        }
        state.result = tally
        broadcastRoom()
        break
      }

      case 'NEXT_ROUND': {
        state.status = 'VOTING'
        state.members = state.members.map((m) => ({
          ...m,
          estimated_value: '',
          last_active_at: new Date().toISOString(),
        }))
        state.result = null
        broadcastRoom()

        // Bots re-vote after reset
        setTimeout(() => {
          const cardValues = state.desk_config.split(',').map((v) => v.trim())
          state.members = state.members.map((m) =>
            m.id.startsWith('bot-')
              ? { ...m, estimated_value: cardValues[Math.floor(Math.random() * cardValues.length)], last_active_at: new Date().toISOString() }
              : m,
          )
          broadcastRoom()
        }, 1500)

        break
      }

      case 'THROW_EMOJI': {
        // Reflect the throw back to the sender (real server broadcasts to all clients)
        send('EMOJI_THROWN', {
          from_user_id: String(uid),
          emoji: payload.emoji,
          target_x_ratio: payload.target_x_ratio,
          target_y_ratio: payload.target_y_ratio,
          target_table_member_id: payload.target_table_member_id ?? null,
          target_panel_member_id: payload.target_panel_member_id ?? null,
        })
        break
      }

      default:
        break
    }
  })
})

export const wsHandlers = [roomHandler]
