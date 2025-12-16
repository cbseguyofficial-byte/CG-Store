import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DigitalFile {
  id: string;
  file_name: string;
  file_path: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export function useAdminFiles() {
  return useQuery({
    queryKey: ["admin-files"],
    queryFn: async (): Promise<DigitalFile[]> => {
      const { data: files, error } = await supabase
        .from("digital_files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get product link counts
      const { data: links } = await supabase
        .from("product_digital_links")
        .select("digital_file_id");

      const linkCounts = (links || []).reduce((acc, link) => {
        acc[link.digital_file_id] = (acc[link.digital_file_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return (files || []).map((file) => ({
        ...file,
        product_count: linkCounts[file.id] || 0,
      }));
    },
  });
}

export function useUploadDigitalFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, description }: { file: File; description?: string }) => {
      // Upload to storage
      const filePath = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("digital-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase.from("digital_files").insert({
        file_name: file.name,
        file_path: filePath,
        description: description || null,
      });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
      toast.success("File uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });
}

export function useDeleteDigitalFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("digital-files")
        .remove([filePath]);

      if (storageError) {
        console.warn("Storage deletion failed:", storageError);
      }

      // Delete database record
      const { error: dbError } = await supabase
        .from("digital_files")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
      toast.success("File deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });
}

export function useUpdateDigitalFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, fileName, description }: { id: string; fileName: string; description?: string }) => {
      const { error } = await supabase
        .from("digital_files")
        .update({ 
          file_name: fileName, 
          description: description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-files"] });
      toast.success("File updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });
}
