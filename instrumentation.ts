// Next.js instrumentation hook — runs once on server startup.
// Starts the MSW Node server to intercept server-side fetch calls
// (Server Components, API routes) when NEXT_PUBLIC_MSW_ENABLED=true.
// Guard with NEXT_RUNTIME so msw/node is never bundled for the Edge runtime.
export async function register() {
  if (process.env.NEXT_PUBLIC_MSW_ENABLED !== 'true') return
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { server } = await import('./src/mocks/server')
  server.listen({ onUnhandledRequest: 'warn' })
}
