import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const handler = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  return new Response(JSON.stringify({ token }), {
    status: 200,
  })
}

export { handler as GET, handler as POST }
