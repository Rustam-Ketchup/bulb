'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Выйти
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Информация о пользователе
              </h2>
              <div className="space-y-2">
                <p><strong>ID:</strong> {session.user?.id || 'Не указан'}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Имя:</strong> {session.user?.name || 'Не указано'}</p>
                <p><strong>Провайдер:</strong> Keycloak</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Токены Keycloak
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Access Token:</strong>
                  <span className="text-xs text-gray-500 block mt-1 break-all">
                    {session.accessToken ? `${session.accessToken.substring(0, 20)}...` : 'Не доступен'}
                  </span>
                </p>
                {session.error && (
                  <p className="text-red-600">
                    <strong>Ошибка:</strong> {session.error}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Keycloak Аутентификация
            </h3>
            <ul className="text-green-800 space-y-1 text-sm">
              <li>• ✅ Аутентификация через Keycloak настроена</li>
              <li>• ✅ Автоматическая ротация токенов работает</li>
              <li>• ✅ Refresh токены обновляются в фоне</li>
              <li>• ✅ Безопасное хранение токенов в JWT</li>
              <li>• ✅ Поддержка Single Sign-On (SSO)</li>
            </ul>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Как работает ротация токенов с Keycloak
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Access токен автоматически обновляется при истечении срока действия</li>
              <li>• Refresh токен используется для получения нового access токена</li>
              <li>• Запросы к Keycloak выполняются через OpenID Connect</li>
              <li>• Если refresh токен истек, пользователь перенаправляется на страницу входа</li>
              <li>• Все токены хранятся в JWT и автоматически обновляются в фоне</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 