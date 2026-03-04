const now = Date.now()
const day = 24 * 60 * 60 * 1000

export const mockRooms = [
  {
    id: 'room-mock-001',
    name: 'Sprint 10 Planning',
    created_at: new Date(now - 3 * day).toISOString(),
    updated_at: new Date(now - 2 * day).toISOString(),
    members: [
      { id: 'bot-alice', name: 'Alice' },
      { id: 'bot-bob', name: 'Bob' },
      { id: 'bot-charlie', name: 'Charlie' },
    ],
  },
  {
    id: 'room-mock-002',
    name: 'Backend API Estimation',
    created_at: new Date(now - 7 * day).toISOString(),
    updated_at: new Date(now - 6 * day).toISOString(),
    members: [
      { id: 'bot-alice', name: 'Alice' },
      { id: 'bot-diana', name: 'Diana' },
    ],
  },
  {
    id: 'room-mock-003',
    name: 'UI Refactor Session',
    created_at: new Date(now - 14 * day).toISOString(),
    updated_at: new Date(now - 13 * day).toISOString(),
    members: [
      { id: 'bot-bob', name: 'Bob' },
      { id: 'bot-charlie', name: 'Charlie' },
      { id: 'bot-eve', name: 'Eve' },
      { id: 'bot-frank', name: 'Frank' },
    ],
  },
]
