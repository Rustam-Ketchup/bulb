'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log('session', session)
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  const handleKeycloakLogin = async () => {
    try {
      await signIn('keycloak', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войти в аккаунт
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Используйте Keycloak для аутентификации
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleKeycloakLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Войти через Keycloak
          </button>

          <div className="text-sm text-center text-gray-600">
            <p>Нажмите кнопку выше для входа через Keycloak</p>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Информация о Keycloak
          </h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Безопасная аутентификация через Keycloak</li>
            <li>• Автоматическая ротация токенов</li>
            <li>• Поддержка Single Sign-On (SSO)</li>
            <li>• Централизованное управление пользователями</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 