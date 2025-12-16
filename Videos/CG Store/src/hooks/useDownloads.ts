import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Download {
  id: string;
  product_id: string;
  product_title: string;
  file_name: string;
  file_path: string;
  order_id: string;
  purchased_at: string;
}

export function useDownloads() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["downloads", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all confirmed orders for this user
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          created_at,
          order_items (
            product_id,
            title_snapshot,
            format_snapshot
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "CONFIRMED");

      if (ordersError) {
        throw ordersError;
      }

      if (!orders || orders.length === 0) {
        return [];
      }

      // Get product IDs from confirmed orders (only PDF or COMBO formats)
      const productIds = orders.flatMap(order => 
        order.order_items
          .filter(item => item.format_snapshot === "PDF" || item.format_snapshot === "COMBO")
          .map(item => item.product_id)
          .filter(Boolean)
      );

      if (productIds.length === 0) {
        return [];
      }

      // Get digital files linked to these products
      const { data: digitalLinks, error: linksError } = await supabase
        .from("product_digital_links")
        .select(`
          *,
          digital_files (*)
        `)
        .in("product_id", productIds);

      if (linksError) {
        throw linksError;
      }

      // Build downloads list
      const downloads: Download[] = [];

      for (const order of orders) {
        for (const item of order.order_items) {
          if ((item.format_snapshot === "PDF" || item.format_snapshot === "COMBO") && item.product_id) {
            const links = digitalLinks?.filter(link => link.product_id === item.product_id) || [];
            
            for (const link of links) {
              if (link.digital_files) {
                downloads.push({
                  id: link.id,
                  product_id: item.product_id,
                  product_title: item.title_snapshot,
                  file_name: link.digital_files.file_name,
                  file_path: link.digital_files.file_path,
                  order_id: order.id,
                  purchased_at: order.created_at,
                });
              }
            }
          }
        }
      }

      return downloads;
    },
    enabled: !!user,
  });
}

export function useDownloadUrl(filePath: string) {
  return useQuery({
    queryKey: ["download-url", filePath],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from("digital-files")
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) {
        throw error;
      }

      return data.signedUrl;
    },
    enabled: !!filePath,
  });
}
