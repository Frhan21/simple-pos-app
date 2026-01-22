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
import { Search, ShoppingCart } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <DashboardTitle>Dashboard</DashboardTitle>
            <DashboardDescription>
              Welcome to your Simple POS system dashboard.
            </DashboardDescription>
          </div>
          {!!cartStore.items.length && (
            <Button
              className="animate-in slide-in-from-right"
              onClick={() => setOrderSheetOpen(true)}
            >
              <ShoppingCart /> Cart
            </Button>
          )}
        </div>
      </DashboardHeader>

      <div className="space-y-6">
        <div className="relative">
          {/* Gunakan debouncing atau throttling */}
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products?.map((product) => (
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
