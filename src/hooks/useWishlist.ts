import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductWithImages } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function useWishlist() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          *,
          products (
            *,
            product_images (*)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(item => item.products).filter(Boolean) as ProductWithImages[];
    },
    enabled: !!user,
  });
}

export function useIsInWishlist(productId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wishlist-check", user?.id, productId],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (error) {
        return false;
      }

      return !!data;
    },
    enabled: !!user && !!productId,
  });
}

export function useAddToWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        throw new Error("You must be logged in");
      }

      const { error } = await supabase.from("wishlists").insert({
        user_id: user.id,
        product_id: productId,
      });

      if (error) {
        // Ignore duplicate errors
        if (error.code === "23505") {
          return;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-check"] });
      toast.success("Added to wishlist!");
    },
    onError: (error) => {
      toast.error(`Failed to add to wishlist: ${error.message}`);
    },
  });
}

export function useRemoveFromWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        throw new Error("You must be logged in");
      }

      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-check"] });
      toast.info("Removed from wishlist");
    },
    onError: (error) => {
      toast.error(`Failed to remove from wishlist: ${error.message}`);
    },
  });
}

export function useToggleWishlist() {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  return useMutation({
    mutationFn: async ({ productId, isInWishlist }: { productId: string; isInWishlist: boolean }) => {
      if (isInWishlist) {
        await removeFromWishlist.mutateAsync(productId);
      } else {
        await addToWishlist.mutateAsync(productId);
      }
    },
  });
}
