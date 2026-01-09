import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { type ProductFormSchema } from "@/forms/product";
import { uploadFiletoSignedUrl } from "@/lib/supabase";
import { Bucket } from "@/server/bucket";
import { api } from "@/utils/api";
import { useState, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

type ProductFormProps = {
  onSubmit: (values: ProductFormSchema) => void;
  onChangeImageUrl:(imageUrl: string) => void; 
};

export const ProductForm = ({ onSubmit, onChangeImageUrl }: ProductFormProps) => {
  const form = useFormContext<ProductFormSchema>();

  const { data: categories } = api.category.getCategories.useQuery();

  const { mutateAsync: createImageSignURL } = api.product.createProductImageSignedUrl.useMutation();
  const imageChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; 
    if (files && files?.length > 0 ) {
        const file = files[0]; 

        if(!file) return;

        const {path, token} = await createImageSignURL(); 

        const imageUrl = await uploadFiletoSignedUrl({
          bucket: Bucket.ProductImages, 
          file: file, 
          path: path, 
          token: token
        })
        onChangeImageUrl(imageUrl!)
        alert("Image uploaded successfully: " + imageUrl);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input {...field} type="number" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Product Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => {
                    return (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-1">
        <Label>Upload Product Image</Label>
        <Input type="file" accept="image/*" onChange={imageChangeHandler}/>
      </div>
    </form>
  );
};
