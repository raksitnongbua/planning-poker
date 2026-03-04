import { setupServer } from 'msw/node'

import { handlers } from './handlers'

// Used for Node.js server-side interception (Server Components, API routes).
// NOTE: Edge Middleware (proxy.ts guest sign-in) runs on the Edge runtime and
// cannot be intercepted by this Node.js server — the guest sign-in fetch will
// hit the real endpoint or fail silently (the UID cookie won't be set).
// Workaround: pre-set the UID cookie manually or ensure NEXT_PUBLIC_API_ENDPOINT
// points to a running server in your .env.local.
export const server = setupServer(...handlers)
