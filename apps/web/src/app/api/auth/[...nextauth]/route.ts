import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [Google],
  callbacks: {
    async session({ session, token }) {
      console.log('token: ', token);
      console.log('session: ', session);
      return session;
    }
  }
});

export const { GET, POST } = handlers;
