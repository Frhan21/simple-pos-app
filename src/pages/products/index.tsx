import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import { ProductCatalogCard } from "@/components/shared/product/ProductCatalogCard";
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
      await apiUtils.product.getProducts.invalidate();
      toast("Product has been created");
      setProductFormOpen(false);
      setCreateImageUrl(null);
      creatProductForm.reset();
    },
  });

  const { mutate: deleteProduct } = api.product.deleteProduct.useMutation({
    onSuccess: async () => {
      await apiUtils.product.getAllProducts.invalidate();
      toast("Product has been deleted");
    },
  });

  const { mutate: editProduct } = api.product.editProduct.useMutation({
    onSuccess: async () => {
      await apiUtils.product.getProducts.invalidate();
      toast("Product has been updated");
      setEditFormOpen(false);
      setEditImageUrl(null);
      setProductToEdit(null);
      editProductForm.reset();
    },
  });

  const creatProductForm = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
  });

  const editProductForm = useForm<ProductFormSchema>({
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <DashboardTitle>Product Management</DashboardTitle>
            <DashboardDescription>
              View, add, edit, and delete products in your inventory.
            </DashboardDescription>
          </div>
          <AlertDialog open={productFormOpen} onOpenChange={setProductFormOpen}>
            <AlertDialogTrigger asChild>
              <Button>Add New Product</Button>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => {
          return (
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
          );
        })}
      </div>

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
