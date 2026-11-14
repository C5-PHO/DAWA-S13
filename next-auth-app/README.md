# Next Auth App

Laboratorio de autenticación con Next.js, NextAuth y sesiones JWT. Incluye acceso con Google y GitHub, registro con credenciales y bloqueo temporal tras cinco intentos fallidos.

## Requisitos

Node.js 22 y npm. Para los proveedores OAuth se necesitan aplicaciones configuradas en Google Cloud y GitHub.

## Instalación

```powershell
cd next-auth-app
npm install
```

Crea `.env.local` en esta carpeta con las siguientes variables (sin compartir sus valores):

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

Las URLs de retorno locales son `http://localhost:3000/api/auth/callback/google` y `http://localhost:3000/api/auth/callback/github`.

```powershell
npm run dev
```

Abre `http://localhost:3000`. El registro guarda los usuarios localmente en SQLite y las contraseñas como hashes bcrypt. La base local se crea automáticamente y está excluida de Git. Para desplegar en Vercel se requiere una base de datos persistente remota y configurar las URLs y variables correspondientes.

## Verificación

```powershell
npm run lint
npm run build
```
