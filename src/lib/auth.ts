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

        return { ...user };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  jwt: {
    maxAge: 30 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      if (trigger === "update" && session) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        return { ...token, ...session };
      }
      if (user && account) {
        return { ...token, ...user };
      }
      const tokenParts: {
        exp: number;
        sub: string;
      } = jwtDecode(token.token as string);
      if (Date.now() < tokenParts.exp * 1000) {
        return token;
      }
      return { ...token, error: "token-expired" };
    },
    async session({ session, token }) {
      session.user = token as Session["user"];
      return session;
    },
  },
};
