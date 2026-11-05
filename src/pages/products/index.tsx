import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import { ProductCatalogCard } from "@/components/shared/product/ProductCatalogCard";
import {
  CatalogEmpty,
  CatalogTable,
} from "@/components/shared/catalog/CatalogTable";
import { ProductForm } from "@/components/shared/product/ProductForm";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { productFormSchema, type ProductFormSchema } from "@/forms/product";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { toast } from "sonner";
import type { NextPageWithLayout } from "../_app";

const ProductsPage: NextPageWithLayout = () => {
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<string | null>(null);
  const [createImageUrl, setCreateImageUrl] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);

  const apiUtils = api.useUtils();

  const { data: products, isLoading: productLoading } =
    api.product.getAllProducts.useQuery();

  const { mutate: createProduct } = api.product.createProduct.useMutation({
    onSuccess: async () => {
      await apiUtils.product.getAllProducts.invalidate();
      await apiUtils.product.getProducts.invalidate();
      await apiUtils.category.getCategories.invalidate(); // productCount/_count
      toast("Product has been created");
      setProductFormOpen(false);
      setCreateImageUrl(null);
      creatProductForm.reset();
    },
  });

  const { mutate: deleteProduct } = api.product.deleteProduct.useMutation({
    onSuccess: async () => {
      await apiUtils.product.getAllProducts.invalidate();
      await apiUtils.product.getProducts.invalidate();
      await apiUtils.category.getCategories.invalidate();
      toast("Product has been deleted");
    },
  });

  const { mutate: editProduct } = api.product.editProduct.useMutation({
    onSuccess: async () => {
      await apiUtils.product.getAllProducts.invalidate();
      await apiUtils.product.getProducts.invalidate();
      await apiUtils.category.getCategories.invalidate(); // productCount/_count
      toast("Product has been updated");
      setEditFormOpen(false);
      setEditImageUrl(null);
      setProductToEdit(null);
      editProductForm.reset();
    },
  });

  // z.coerce: resolver input = unknown, output = number (Zod 4 + resolvers v7)
  const creatProductForm = useForm<
    z.input<typeof productFormSchema>,
    unknown,
    ProductFormSchema
  >({
    resolver: zodResolver(productFormSchema),
  });

  const editProductForm = useForm<
    z.input<typeof productFormSchema>,
    unknown,
    ProductFormSchema
  >({
    resolver: zodResolver(productFormSchema),
  });

  const handleDeletProduct = (productID: string) => {
    if (!productID) return;
    deleteProduct({ id: productID });
  };

  const handleEditProduct = (product: {
    id: string;
    name: string;
    price: number;
    categoryId: string;
  }) => {
    setEditFormOpen(true);
    setProductToEdit(product.id);
    setEditImageUrl(null);

    editProductForm.reset({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
    });
  };

  const handleSubmitProduct = (values: ProductFormSchema) => {
    if (!createImageUrl) {
      toast("Please upload an image first.");
      return;
    }
    createProduct({
      name: values.name,
      price: values.price,
      categoryId: values.categoryId,
      imageUrl: createImageUrl,
    });
  };

  const handleSubmitEditProduct = (values: ProductFormSchema) => {
    if (!productToEdit) return;
    editProduct({
      id: productToEdit,
      name: values.name,
      price: values.price,
      categoryId: values.categoryId,
      imageUrl: editImageUrl ?? undefined,
    });
  };

  return (
    <>
      <Head>
        <title>Products - Simple POS</title>
        <meta name="description" content="Manage your products" />
      </Head>
      <DashboardHeader>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <DashboardTitle>Products</DashboardTitle>
            <DashboardDescription>
              Keep names, categories, prices, and product images ready for the
              counter.
            </DashboardDescription>
          </div>
          <AlertDialog open={productFormOpen} onOpenChange={setProductFormOpen}>
            <AlertDialogTrigger asChild>
              <Button className="h-11 rounded-sm">Add product</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Product</AlertDialogTitle>
              </AlertDialogHeader>
              <Form {...creatProductForm}>
                <ProductForm
                  onSubmit={handleSubmitProduct}
                  onChangeImageUrl={(imageUrl) => {
                    setCreateImageUrl(imageUrl);
                  }}
                />
              </Form>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={creatProductForm.handleSubmit(handleSubmitProduct)}
                >
                  Create product
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardHeader>

      {productLoading ? (
        <div
          className="bg-muted h-72 animate-pulse"
          aria-label="Loading products"
        />
      ) : products?.length ? (
        <CatalogTable
          headers={["Product", "Category", "Price", "Actions"]}
          headerClassName="md:grid-cols-[minmax(260px,1.5fr)_minmax(150px,.8fr)_minmax(160px,.65fr)_200px] md:gap-x-6"
        >
          {products.map((product) => (
            <ProductCatalogCard
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.imageUrl ?? ""}
              category={product.category?.name ?? ""}
              onDelete={() => handleDeletProduct(product.id)}
              onEdit={() =>
                handleEditProduct({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  categoryId: product.category.id,
                })
              }
            />
          ))}
        </CatalogTable>
      ) : (
        <CatalogEmpty
          title="No products yet"
          description="Add the first product to make it available at the counter."
        />
      )}

      <AlertDialog open={editFormOpen} onOpenChange={setEditFormOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Product</AlertDialogTitle>
          </AlertDialogHeader>
          <Form {...editProductForm}>
            <ProductForm
              onSubmit={handleSubmitEditProduct}
              onChangeImageUrl={(imageUrl) => {
                setEditImageUrl(imageUrl);
              }}
            />
          </Form>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={editProductForm.handleSubmit(handleSubmitEditProduct)}
            >
              Edit Product
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

ProductsPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProductsPage;
