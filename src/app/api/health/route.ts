import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest, _res: NextResponse) => {
  return new Response(JSON.stringify({ message: 'OK', appVersion: process.env.npm_package_version ?? 'unknown', env: process.env.NODE_ENV }), {
    status: 200,
  })
}

export { handler as GET, handler as POST }
