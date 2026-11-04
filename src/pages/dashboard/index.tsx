import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import { CategoryFilterCard } from "@/components/shared/category/CategoryFilterCard";
import { CreateOrderSheet } from "@/components/shared/CreateOrderSheet";
import { ProductMenuCard } from "@/components/shared/product/ProductMenuCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";
import { api } from "@/utils/api";
import { PackageSearch, Search, ShoppingCart } from "lucide-react";
import Head from "next/head";
import type { ReactElement } from "react";
import { useState } from "react";
import type { NextPageWithLayout } from "../_app";

const DashboardPage: NextPageWithLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderSheetOpen, setOrderSheetOpen] = useState(false);

  const cartStore = useCartStore();

  const { data: products } = api.product.getProducts.useQuery({
    categoryId: selectedCategory,
  });
  const { data: categories } = api.category.getCategories.useQuery();

  const totalProduct = categories?.reduce((a, b) => {
    return a + b._count.products;
  }, 0);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = (productId: string) => {
    // setOrderSheetOpen(true);
    const product = products?.find((product) => product.id === productId);
    if (!product) return;
    cartStore.addToCart({
      productID: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl ?? "https://placehold.co/600x400/png",
    });
  };

  return (
    <>
      <Head>
        <title>Dashboard - Simple POS</title>
        <meta
          name="description"
          content="Dashboard for the Simple POS system"
        />
      </Head>
      <DashboardHeader>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <DashboardTitle>New order</DashboardTitle>
            <DashboardDescription>
              Find an item, add it to the cart, and keep the counter moving.
            </DashboardDescription>
          </div>
          <Button
            variant={cartStore.items.length ? "default" : "outline"}
            className="h-11 min-w-32 rounded-sm"
            onClick={() => setOrderSheetOpen(true)}
            disabled={!cartStore.items.length}
          >
            <ShoppingCart /> Cart
            {!!cartStore.items.length && (
              <span className="tabular-nums">{cartStore.items.length}</span>
            )}
          </Button>
        </div>
      </DashboardHeader>

      <div className="space-y-5">
        <div className="bg-card ring-border p-3 ring-1 sm:p-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              aria-label="Search products"
              placeholder="Search products"
              className="bg-muted h-11 rounded-sm border-0 pl-10 shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto py-1">
          <CategoryFilterCard
            key="all"
            name="All"
            isSelected={selectedCategory === "all"}
            onClick={() => handleCategoryClick("all")}
            productCount={totalProduct ?? 0}
          />
          {categories?.map((cat) => (
            <CategoryFilterCard
              key={cat.id}
              name={cat.name}
              isSelected={cat.id === selectedCategory}
              onClick={() => handleCategoryClick(cat.id)}
              productCount={cat._count.products}
            />
          ))}
        </div>

        <div>
          {products?.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products
                .filter((product) =>
                  product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
                )
                .map((product) => (
                  <ProductMenuCard
                    key={product.id}
                    productId={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={
                      product.imageUrl ?? "https://placehold.co/600x400/png"
                    }
                    onAddToCart={handleAddToCart}
                  />
                ))}
            </div>
          ) : (
            <div className="bg-card ring-border grid min-h-72 place-items-center p-8 text-center ring-1">
              <div>
                <PackageSearch className="text-muted-foreground mx-auto size-7" />
                <h2 className="mt-4 text-lg font-bold">No products here yet</h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  Add products or choose another category.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateOrderSheet
        open={orderSheetOpen}
        onOpenChange={setOrderSheetOpen}
      />
    </>
  );
};

DashboardPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;
