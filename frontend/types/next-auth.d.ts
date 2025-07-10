import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    error?: string
    user: {
      id: string
      email: string
      name?: string
      role?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
    user?: {
      id: string
      email: string
      name?: string
      role?: string
    }
  }
} 