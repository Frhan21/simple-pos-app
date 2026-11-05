/**
 * Test env must be set before any module imports touch `src/env.js`.
 * DATABASE_URL for tests points at the dedicated `simple-pos-test` database.
 */
const u = new URL(
  process.env.TEST_DIRECT_URL ??
    process.env.DIRECT_URL ??
    "postgresql://postgres:postgres@localhost:5432/simple-pos",
);
u.pathname = "/simple-pos-test";

process.env.DATABASE_URL = u.toString();
process.env.DIRECT_URL = u.toString();
process.env.PRISMA_DB_URL = u.toString();
(process.env as { NODE_ENV?: string }).NODE_ENV = "test";
process.env.CLERK_SECRET_KEY ??= "sk_test_placeholder";
process.env.CLERK_WEBHOOK_SIGNING_SECRET ??= "whsec_test_placeholder";
process.env.XENDIT_SECRET_KEY ??= "xendit_test";
process.env.XENDIT_WEBHOOK_VERIFICATION ??= "xendit_webhook_token";
// Supabase admin client is created at import time by supabase-admin.ts / lib/supabase.ts;
// tests never call storage endpoints, so a dummy origin satisfies the SDK constructor.
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "test_anon_key";
process.env.SUPABASE_ROLE_KEY ??= "test_service_role_key";
process.env.SKIP_ENV_VALIDATION = "1";
