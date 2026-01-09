import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name must be at most 255 characters"),
  price: z.coerce.number().min(1000, "Price must be at least 1000"),
  categoryId: z.string(),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;
