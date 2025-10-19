import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AuthService } from "@/service/authService";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the built-in types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken?: string;
      refreshToken?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    } & DefaultSession["user"];
  }

  // Extend the built-in User type
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { user, tokens } = await AuthService.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (user) {
            return {
              ...user,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && account.id_token) {
        try {
          const backendResponse = await AuthService.loginWithGoogle(
            account.id_token
          );
          user.accessToken = backendResponse.accessToken;
          user.refreshToken = backendResponse.refreshToken;

          // Decode JWT to get the real user ID from backend
          try {
            const payload = JSON.parse(
              Buffer.from(
                backendResponse.accessToken.split(".")[1],
                "base64"
              ).toString()
            );

            // Set user properties from JWT payload
            user.id = payload.id || payload.sub; // Use 'id' claim, fallback to 'sub'
            user.email = payload.email;
            user.role = payload.role;
          } catch (decodeError) {
            console.error("Failed to decode JWT:", decodeError);
          }

          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken || account?.access_token;
        token.refreshToken = user.refreshToken || account?.refresh_token;
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          ...token,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
