# Настройка переменных окружения для Keycloak

## Создание .env.local

Создайте файл `.env.local` в корне frontend директории со следующим содержимым:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Keycloak Configuration
KEYCLOAK_CLIENT_ID=your-client-id
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ISSUER=https://your-keycloak-server/auth/realms/your-realm
```

## Примеры конфигурации

### Локальный Keycloak
```env
KEYCLOAK_ISSUER=http://localhost:8080/auth/realms/master
KEYCLOAK_CLIENT_ID=my-app
KEYCLOAK_CLIENT_SECRET=your-client-secret
```

### Keycloak на Docker
```env
KEYCLOAK_ISSUER=http://localhost:8080/auth/realms/my-realm
KEYCLOAK_CLIENT_ID=my-app
KEYCLOAK_CLIENT_SECRET=your-client-secret
```

### Production Keycloak
```env
KEYCLOAK_ISSUER=https://keycloak.yourdomain.com/auth/realms/production
KEYCLOAK_CLIENT_ID=my-app
KEYCLOAK_CLIENT_SECRET=your-production-secret
```

## Генерация NEXTAUTH_SECRET

Для генерации безопасного секретного ключа используйте:

```bash
openssl rand -base64 32
```

Или онлайн генератор: https://generate-secret.vercel.app/32

## Проверка конфигурации

После настройки переменных окружения:

1. Перезапустите сервер разработки
2. Проверьте, что нет ошибок в консоли
3. Попробуйте войти через Keycloak

## Безопасность

- Никогда не коммитьте `.env.local` в git
- Используйте разные секреты для разработки и продакшена
- Регулярно обновляйте секреты
- Используйте HTTPS в продакшене 