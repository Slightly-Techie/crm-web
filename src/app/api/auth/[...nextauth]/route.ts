import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      token?: string; // Add the token to the session user
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
