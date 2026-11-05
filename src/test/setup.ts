/**
 * Test env must be set before any module imports touch `src/env.js`.
 * DATABASE_URL for tests points at the dedicated `simple-pos-test` database.
 */
const u = new URL(process.env.TEST_DIRECT_URL ?? "");
u.pathname = "/simple-pos-test";

process.env.DATABASE_URL = u.toString();
process.env.DIRECT_URL = u.toString();
process.env.PRISMA_DB_URL = u.toString();
(process.env as { NODE_ENV?: string }).NODE_ENV = "test";
process.env.CLERK_SECRET_KEY ??= "sk_test_placeholder";
process.env.CLERK_WEBHOOK_SIGNING_SECRET ??= "whsec_test_placeholder";
process.env.XENDIT_SECRET_KEY ??= "xendit_test";
process.env.XENDIT_WEBHOOK_VERIFICATION ??= "xendit_webhook_token";
process.env.SKIP_ENV_VALIDATION = "1";
