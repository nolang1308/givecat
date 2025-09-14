import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      nickname?: string | null
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    email: string
    nickname: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    nickname: string
  }
}