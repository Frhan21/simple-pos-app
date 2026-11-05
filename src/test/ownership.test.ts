import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { cleanDb, seedUsers, testDb, USER_A, USER_B } from "./helpers/database";
import { callerAs } from "./helpers/auth-context";

beforeEach(async () => {
  await cleanDb();
  await seedUsers();
});

afterAll(async () => {
  await testDb.$disconnect();
});

describe("user data ownership", () => {
  it("user A sees only their own categories", async () => {
    await callerAs(USER_A).category.createCategory({ name: "Coffee A" });
    await callerAs(USER_B).category.createCategory({ name: "Coffee B" });

    const categoriesA = await callerAs(USER_A).category.getCategories();
    expect(categoriesA.map((c) => c.name)).toEqual(["Coffee A"]);
  });

  it("user B cannot edit or delete user A's category", async () => {
    const catA = await callerAs(USER_A).category.createCategory({
      name: "Owned by A",
    });

    await expect(
      callerAs(USER_B).category.editCategory({ id: catA.id, name: "Hacked" }),
    ).rejects.toThrowError();

    await expect(
      callerAs(USER_B).category.deleteCategory({ id: catA.id }),
    ).rejects.toThrowError();

    const catAfter = await testDb.category.findUnique({
      where: { id: catA.id },
    });
    expect(catAfter?.name).toBe("Owned by A");
  });

  it("user B cannot create a product inside user A's category", async () => {
    const catA = await callerAs(USER_A).category.createCategory({
      name: "Cat A",
    });

    await expect(
      callerAs(USER_B).product.createProduct({
        name: "Product B",
        price: 10000,
        categoryId: catA.id,
        imageUrl: "https://example.com/b.png",
      }),
    ).rejects.toThrowError();

    expect(await testDb.product.count()).toBe(0);
  });

  it("user B cannot see, edit, or delete user A's product", async () => {
    const catA = await callerAs(USER_A).category.createCategory({
      name: "Cat A",
    });
    const prodA = await callerAs(USER_A).product.createProduct({
      name: "Prod A",
      price: 5000,
      categoryId: catA.id,
      imageUrl: "https://example.com/a.png",
    });

    const productsB = await callerAs(USER_B).product.getAllProducts();
    expect(productsB).toHaveLength(0);

    await expect(
      callerAs(USER_B).product.editProduct({
        id: prodA.id,
        name: "Hacked",
        price: 1,
        categoryId: catA.id,
      }),
    ).rejects.toThrowError();

    await expect(
      callerAs(USER_B).product.deleteProduct({ id: prodA.id }),
    ).rejects.toThrowError();

    expect(await testDb.product.count()).toBe(1);
  });

  it("order can only use products owned by the same user", async () => {
    const catA = await callerAs(USER_A).category.createCategory({
      name: "Cat A",
    });
    const prodA = await callerAs(USER_A).product.createProduct({
      name: "Prod A",
      price: 5000,
      categoryId: catA.id,
      imageUrl: "https://example.com/a.png",
    });

    await expect(
      callerAs(USER_B).order.createOrder({
        orderItems: [{ productId: prodA.id, quantity: 1 }],
      }),
    ).rejects.toThrowError();

    expect(await testDb.order.count()).toBe(0);
  });

  it("user B cannot read or advance user A's order", async () => {
    const catA = await callerAs(USER_A).category.createCategory({
      name: "Cat A",
    });
    const prodA = await callerAs(USER_A).product.createProduct({
      name: "Prod A",
      price: 10000,
      categoryId: catA.id,
      imageUrl: "https://example.com/a.png",
    });
    // Seed order directly (bypass Xendit) as A.
    const orderA = await testDb.order.create({
      data: {
        userId: USER_A,
        subtotal: 10000,
        tax: 1000,
        grandtotal: 11000,
        paidAt: new Date(),
        status: "PAID",
        orderItems: {
          create: { productId: prodA.id, price: 10000, quantity: 1 },
        },
      },
    });

    const ordersB = await callerAs(USER_B).order.getOrders({ status: "ALL" });
    expect(ordersB).toHaveLength(0);

    await expect(
      callerAs(USER_B).order.checkOrderStatus({ orderId: orderA.id }),
    ).resolves.toBe(false);

    await expect(
      callerAs(USER_B).order.updateOrderStatus({ orderId: orderA.id }),
    ).rejects.toThrowError();
  });

  it("sales report is scoped per user", async () => {
    const catA = await callerAs(USER_A).category.createCategory({
      name: "Cat A",
    });
    const prodA = await callerAs(USER_A).product.createProduct({
      name: "Prod A",
      price: 10000,
      categoryId: catA.id,
      imageUrl: "https://example.com/a.png",
    });
    await testDb.order.create({
      data: {
        userId: USER_A,
        subtotal: 10000,
        tax: 1000,
        grandtotal: 11000,
        paidAt: new Date(),
        status: "DONE",
        orderItems: {
          create: { productId: prodA.id, price: 10000, quantity: 1 },
        },
      },
    });

    const reportB = await callerAs(USER_B).order.getSalesRepost();
    expect(reportB.totalRevenue).toBe(0);

    const reportA = await callerAs(USER_A).order.getSalesRepost();
    expect(reportA.totalRevenue).toBe(11000);
    expect(reportA.totalCompleteOrder).toBe(1);
  });

  it("soft-deleted user loses access but data remains", async () => {
    const catA = await callerAs(USER_A).category.createCategory({
      name: "Cat A",
    });

    await testDb.user.update({
      where: { id: USER_A },
      data: { deletedAt: new Date() },
    });

    await expect(
      callerAs(USER_A).category.getCategories(),
    ).rejects.toThrowError();

    const stillThere = await testDb.category.findUnique({
      where: { id: catA.id },
    });
    expect(stillThere).not.toBeNull();
  });
});
