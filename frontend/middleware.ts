import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnProfile = req.nextUrl.pathname.startsWith('/profile')

  if ((isOnDashboard || isOnProfile) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  // Если пользователь залогинен или не на защищённой странице — пропускаем дальше
  return NextResponse.next()
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    // Добавьте другие защищенные роуты здесь
  ]
} 