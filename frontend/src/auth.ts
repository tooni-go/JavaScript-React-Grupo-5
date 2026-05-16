import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data && response.data.access_token) {
            return {
              id: response.data.user_id,
              email: credentials.email as string,
              rol: response.data.rol,
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        rol: token.rol as string,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        emailVerified: null,
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
