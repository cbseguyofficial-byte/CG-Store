import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductWithImages, ProductInsert, ProductUpdate } from "@/lib/types";
import { toast } from "sonner";

interface ProductFilters {
  search?: string;
  class?: string;
  board?: string;
  subject?: string;
  format?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  inStockOnly?: boolean;
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          product_images (*)
        `)
        .eq("status", "PUBLISHED")
        .order("created_at", { ascending: false });

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,subject.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.class) {
        query = query.eq("class", filters.class);
      }

      if (filters?.board) {
        query = query.eq("board", filters.board);
      }

      if (filters?.subject) {
        query = query.eq("subject", filters.subject);
      }

      if (filters?.format) {
        query = query.eq("format", filters.format as any);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte("sale_price", filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte("sale_price", filters.maxPrice);
      }

      if (filters?.inStockOnly) {
        query = query.or("stock_count.gt.0,format.eq.PDF");
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as ProductWithImages[];
    },
  });
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      // Try by slug first, then by id
      let query = supabase
        .from("products")
        .select(`
          *,
          product_images (*)
        `)
        .eq("status", "PUBLISHED");

      // Check if it's a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

      if (isUUID) {
        query = query.eq("id", idOrSlug);
      } else {
        query = query.eq("slug", idOrSlug);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        throw error;
      }

      return data as ProductWithImages | null;
    },
    enabled: !!idOrSlug,
  });
}

export function useRelatedProducts(productId: string, productClass: string, subject: string) {
  return useQuery({
    queryKey: ["related-products", productId, productClass, subject],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images (*)
        `)
        .eq("status", "PUBLISHED")
        .neq("id", productId)
        .or(`class.eq.${productClass},subject.eq.${subject}`)
        .limit(4);

      if (error) {
        throw error;
      }

      return data as ProductWithImages[];
    },
    enabled: !!productId,
  });
}

// Admin hooks
export function useAdminProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["admin-products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          product_images (*)
        `)
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status as any);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as ProductWithImages[];
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${error.message}`);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.id] });
      queryClient.invalidateQueries({ queryKey: ["product", data.slug] });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });
}
