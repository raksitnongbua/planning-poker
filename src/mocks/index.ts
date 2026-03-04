// Browser-only init — called from MSWProvider (client component).
// Server-side init is handled separately in instrumentation.ts.
export async function initMocks() {
  if (process.env.NEXT_PUBLIC_MSW_ENABLED !== 'true') return

  const { worker } = await import('./browser')
  await worker.start({ onUnhandledRequest: 'warn' })
}
