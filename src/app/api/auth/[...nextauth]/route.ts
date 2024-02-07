import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

import { authOptions } from './option'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken: unknown
    user?: DefaultUser & {
      id: string
    }
  }
}
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    uid?: string
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
