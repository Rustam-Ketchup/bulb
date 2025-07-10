# Настройка NextAuth v5 с Keycloak и ротацией токенов

## Обзор

Этот проект настроен с NextAuth v5 и Keycloak для аутентификации с автоматической ротацией токенов. Keycloak предоставляет централизованную систему управления идентификацией и доступом (IAM) с поддержкой OpenID Connect.

## Структура файлов

```
frontend/
├── auth.config.ts                    # Основная конфигурация NextAuth с Keycloak
├── auth.ts                          # Экспорт функций NextAuth
├── types/next-auth.d.ts             # Типы для расширения NextAuth
├── middleware.ts                    # Защита роутов
├── app/
│   ├── api/auth/
│   │   └── [...nextauth]/route.ts   # NextAuth API роут
│   ├── login/page.tsx               # Страница входа через Keycloak
│   ├── dashboard/page.tsx           # Защищенная страница
│   ├── providers.tsx                # Провайдер аутентификации
│   └── layout.tsx                   # Корневой layout
└── AUTH_SETUP.md                    # Эта документация
```

## Настройка переменных окружения

Создайте файл `.env.local` в корне frontend директории:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Keycloak Configuration
KEYCLOAK_CLIENT_ID=your-client-id
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ISSUER=https://your-keycloak-server/auth/realms/your-realm
```

## Настройка Keycloak

### 1. Создание Realm
1. Войдите в Keycloak Admin Console
2. Создайте новый realm или используйте существующий
3. Настройте realm settings

### 2. Создание Client
1. Перейдите в Clients → Create
2. Настройте client:
   - Client ID: `your-client-id`
   - Client Protocol: `openid-connect`
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:3000/api/auth/callback/keycloak`
   - Web Origins: `http://localhost:3000`

### 3. Получение Client Secret
1. Перейдите в Credentials вкладку клиента
2. Скопируйте Client Secret

### 4. Настройка User
1. Создайте пользователя в Users
2. Установите пароль
3. Назначьте роли если необходимо

## Как работает ротация токенов с Keycloak

### 1. Первоначальный вход
- Пользователь нажимает "Войти через Keycloak"
- Происходит редирект на Keycloak login page
- После успешной аутентификации пользователь возвращается с access и refresh токенами
- Токены сохраняются в JWT

### 2. Автоматическое обновление
- При каждом запросе NextAuth проверяет срок действия access токена
- Если токен истек, автоматически вызывается функция `refreshAccessToken`
- Запрос отправляется на Keycloak endpoint: `/protocol/openid-connect/token`
- Новые токены сохраняются в JWT
- Пользователь продолжает работу без прерывания

### 3. Обработка ошибок
- Если refresh токен истек, пользователь перенаправляется на страницу входа
- Ошибки обновления токенов логируются в консоль

## Ключевые компоненты

### auth.config.ts
Основная конфигурация NextAuth с:
- Keycloak провайдером
- Callback функциями для обработки JWT и сессий
- Функцией `refreshAccessToken` для обновления токенов через Keycloak

### API эндпоинты
- `/api/auth/[...nextauth]` - NextAuth API роут для обработки Keycloak

### Компоненты
- `LoginPage` - кнопка входа через Keycloak
- `DashboardPage` - защищенная страница с информацией о токенах
- `Providers` - провайдер аутентификации

## Тестирование

1. Настройте Keycloak сервер и создайте client
2. Обновите переменные окружения в `.env.local`
3. Запустите сервер разработки:
```bash
npm run dev
```

4. Откройте http://localhost:3000/login

5. Нажмите "Войти через Keycloak"

6. После успешной аутентификации вы будете перенаправлены на /dashboard

## Настройка для продакшена

### 1. Безопасность
- Измените `NEXTAUTH_SECRET` на безопасный секретный ключ
- Используйте HTTPS в продакшене
- Настройте CORS в Keycloak
- Используйте secure cookies

### 2. Keycloak Production
- Разверните Keycloak в production среде
- Настройте SSL/TLS
- Настройте backup и monitoring
- Используйте production database (PostgreSQL, MySQL)

### 3. Токены
- Настройте правильные сроки действия токенов в Keycloak
- Используйте короткие сроки для access токенов (5-15 минут)
- Используйте более длинные сроки для refresh токенов (7-30 дней)

### 4. Мониторинг
- Настройте логирование в Keycloak
- Мониторьте успешные/неуспешные попытки входа
- Настройте алерты для подозрительной активности

## Дополнительные возможности

### Добавление других провайдеров
```typescript
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

export const authConfig = {
  providers: [
    Keycloak({...}),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
}
```

### Настройка ролей и разрешений
1. Создайте роли в Keycloak
2. Назначьте роли пользователям
3. Используйте роли в вашем приложении:

```typescript
// В auth.config.ts
callbacks: {
  async jwt({ token, user, account }) {
    if (account && user) {
      token.roles = user.roles // Добавьте роли в токен
    }
    return token
  },
  async session({ session, token }) {
    session.user.roles = token.roles // Передайте роли в сессию
    return session
  },
}
```

### Настройка middleware
Создайте `middleware.ts` для защиты роутов:

```typescript
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  
  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }
  return null
})

export const config = {
  matcher: ["/dashboard/:path*"]
}
```

### Кастомизация страниц
- Измените `pages.signIn` в конфигурации
- Создайте кастомные страницы ошибок
- Настройте редиректы после входа/выхода

## Устранение неполадок

### Проблемы с подключением к Keycloak
1. Проверьте правильность URL в `KEYCLOAK_ISSUER`
2. Убедитесь, что client ID и secret правильные
3. Проверьте настройки redirect URIs в Keycloak
4. Убедитесь, что Keycloak сервер доступен

### Проблемы с обновлением токенов
1. Проверьте правильность client credentials
2. Убедитесь, что refresh токен валиден
3. Проверьте логи Keycloak на ошибки
4. Убедитесь, что client имеет правильные разрешения

### Проблемы с сессиями
1. Проверьте настройки `NEXTAUTH_SECRET`
2. Убедитесь, что Keycloak провайдер правильно настроен
3. Проверьте типы в `types/next-auth.d.ts`

### Проблемы с редиректами
1. Проверьте настройки `pages` в конфигурации
2. Убедитесь, что redirect URIs настроены правильно в Keycloak
3. Проверьте логику в callback `authorized`

## Полезные ссылки

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [OpenID Connect Specification](https://openid.net/connect/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749) 