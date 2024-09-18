import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "./axios";
import jwtDecode from "jwt-decode";

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
            throw new Error(err.response.data.detail);
          });

        // Ensure the returned user includes the token
        if (user && user.token) {
          return {
            ...user,
            token: user.token,
            refresh_token: user.refresh_token,
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
    maxAge: 30 * 60, // 30 minutes
  },
  jwt: {
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      // If the user object exists, it's a sign-in, so merge the token
      if (user) {
        return { ...token, ...user }; // Pass the token into the JWT
      }

      // Decode and check token expiration
      const tokenParts: {
        exp: number;
        sub: string;
      } = jwtDecode(token.token as string);

      // If the token is still valid, return it
      if (Date.now() < tokenParts.exp * 1000) {
        return token;
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
