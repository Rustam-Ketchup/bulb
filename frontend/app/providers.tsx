'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>
}

// HOC для проверки прав пользователя
export function withAuth<P>(
  WrappedComponent: React.ComponentType<P>,
  options?: { requiredRole?: string }
) {
  return function AuthComponent(props: React.PropsWithChildren<P>) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/login')
      } else if (
        options?.requiredRole &&
        session?.user?.role !== options.requiredRole
      ) {
        router.push('/unauthorized')
      }
    }, [status, session, router])

    if (status === 'loading') {
      return <div>Загрузка...</div>
    }

    if (
      status === 'unauthenticated' ||
      (options?.requiredRole && session?.user?.role !== options.requiredRole)
    ) {
      return null
    }

    return <WrappedComponent {...props} />
  }
} 