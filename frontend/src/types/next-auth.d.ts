import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      rol: string;
      accessToken: string;
      refreshToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    rol?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    rol?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
