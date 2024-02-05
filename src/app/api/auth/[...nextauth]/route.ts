import NextAuth, { AuthOptions, DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'
import Google from 'next-auth/providers/google'
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

export const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.uid = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      if (session?.user) {
        session.user.id = token.uid ?? ''
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
