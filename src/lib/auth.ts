import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "./axios";
import jwtDecode from "jwt-decode";
import { getApiErrorMessage } from "@/utils";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("No credentials.");
        }
        let formData = new URLSearchParams();
        formData.append("username", credentials.email);
        formData.append("password", credentials.password);

        const user = await axios
          .post("/api/v1/users/login", formData)
          .then((res) => res.data)
          .catch((err) => {
            throw new Error(getApiErrorMessage(err, "Login failed. Please try again."));
          });

        // Ensure the returned user includes the token
        if (user && user.token) {
          return {
            ...user,
            id: user.id,
            email: user.email,
            username: user.username,
            is_active: user.is_active,
            token: user.token,
            refresh_token: user.refresh_token,
            status: user.user_status, // Map user_status to status
            role: user.role, // Explicitly include role
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // If the user object exists, it's a sign-in, so merge the token
      if (user) {
        const userData = user as any;
        return {
          ...token,
          ...userData,
          // Ensure critical fields are present
          id: userData.id,
          email: userData.email,
          username: userData.username,
          is_active: userData.is_active,
          status: userData.status, // This should be mapped from user_status
          role: userData.role,
          token: userData.token,
        };
      }

      // Decode and check token expiration
      try {
        const tokenParts: {
          exp: number;
          sub: string;
        } = jwtDecode(token.token as string);

        // If the token is still valid, return it
        if (Date.now() < tokenParts.exp * 1000) {
          return token;
        }
      } catch {
        // jwtDecode failed — token is missing or malformed
      }

      // Return token with expiration error if invalid
      return { ...token, error: "token-expired" };
    },
    async session({ session, token }) {
      // Pass the token to the session
      session.user = token as Session["user"];
      return session;
    },
  },
};
