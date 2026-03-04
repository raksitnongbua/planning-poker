import { NextRequest } from 'next/server'

const handler = async (_req: NextRequest) => {
  return new Response(JSON.stringify({ message: 'OK', appVersion: process.env.npm_package_version ?? 'unknown', env: process.env.NODE_ENV }), {
    status: 200,
  })
}

export { handler as GET, handler as POST }
