import type { NextAuthOptions } from 'next-auth'
import Google from 'next-auth/providers/google'

const authOptions: NextAuthOptions = {
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

export { authOptions }
