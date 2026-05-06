import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Lightweight auth config for Edge Runtime (proxy/middleware)
// Does NOT use PrismaAdapter — that only runs in the API route
export const { auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
