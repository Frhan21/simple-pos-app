# Simple POS

Aplikasi Point-of-Sale (POS) sederhana berbasis [Next.js](https://nextjs.org) (Pages Router) dengan tRPC, Prisma 7 + PostgreSQL, Clerk (auth), Supabase Storage, dan Xendit (QRIS).

## Requirements

- Node.js `>=20.9` (disarankan LTS aktif saat ini)
- npm `>=10` (repo pin `packageManager`)
- Docker atau Podman (untuk PostgreSQL lokal)

## Bootstrap lokal

1. Salin env lokal:

   ```bash
   cp .env.example .env
   ```

   Lalu isi nilai untuk `DATABASE_URL`, clerk, supabase, dan xendit sesuai kebutuhan.

2. Jalankan PostgreSQL lokal (script docker):

   ```bash
   ./start-database.sh
   ```

3. Install dependency dan generate Prisma Client:

   ```bash
   npm install
   npm run db:generate
   ```

4. Sinkron schema ke database development:
   ```bash
   npm run db:push
   ```

## Perintah umum

| Perintah                                | Fungsi                        |
| --------------------------------------- | ----------------------------- |
| `npm run dev`                           | Dev server Next.js            |
| `npm run build`                         | Build produksi                |
| `npm start`                             | Jalankan hasil build produksi |
| `npm run check`                         | ESLint + typecheck            |
| `npm run lint`                          | Lint (ESLint CLI)             |
| `npm run lint:fix`                      | Lint dengan autofix           |
| `npm run format:check` / `format:write` | Prettier check/write          |
| `npm run db:generate`                   | Prisma generate client        |
| `npm run db:push`                       | Sinkron schema ke DB dev      |
| `npm run db:migrate`                    | Prisma migrate deploy         |
| `npm run db:studio`                     | Prisma Studio                 |

## Environment variables

- `DATABASE_URL`: URL PostgreSQL (CLI Prisma + driver adapter runtime)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`: auth Clerk
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_ROLE_KEY`: Supabase Storage
- `XENDIT_SECRET_KEY`, `XENDIT_WEBHOOK_VERIFICATION`: Xendit QRIS + webhook

Jangan commit nilai env nyata; `.env` sudah diabaikan git.
