import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Test-only Prisma client against the simple-pos-test DB (schema pushed in global setup).
const createTestClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

export const testDb = createTestClient();
export const USER_A = "user_test_a";
export const USER_B = "user_test_b";

export const seedUsers = async () => {
  await testDb.user.createMany({
    data: [{ id: USER_A }, { id: USER_B }],
    skipDuplicates: true,
  });
};

export const cleanDb = async () => {
  await testDb.orderItem.deleteMany();
  await testDb.order.deleteMany();
  await testDb.product.deleteMany();
  await testDb.category.deleteMany();
  await testDb.user.deleteMany();
};
