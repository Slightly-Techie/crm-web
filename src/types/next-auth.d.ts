/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      token: string;
    };
  }

  interface User {
    token: string;
  }
}
