import type { Bucket } from "@/server/bucket";
import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { error } from "console";

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const uploadFiletoSignedUrl = async ({
  file,
  token,
  path,
  bucket,
}: {
  file: File;
  path: string;
  token: string;
  bucket: Bucket;
}) => {
  try {
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .uploadToSignedUrl(path, token, file);

    if (error) throw error;
    if (!data) throw new Error("No data returned from upload");

    const fileUrl = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(data?.path);
    return fileUrl.data.publicUrl;
    
  } catch (error) {
    if (error instanceof Error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
  }
};
