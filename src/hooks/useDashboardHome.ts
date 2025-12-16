import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserDashboardStats {
  totalOrders: number;
  recentOrders: {
    id: string;
    created_at: string;
    final_amount: number;
    status: string;
    items: number;
  }[];
}

async function fetchUserDashboard(): Promise<UserDashboardStats> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      final_amount,
      status,
      order_items(count)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return {
    totalOrders: data.length,
    recentOrders: data.slice(0, 5).map((o: any) => ({
      id: o.id,
      created_at: o.created_at,
      final_amount: o.final_amount,
      status: o.status,
      items: o.order_items?.[0]?.count ?? 0,
    })),
  };
}

export function useDashboardHome() {
  return useQuery({
    queryKey: ["user-dashboard-home"],
    queryFn: fetchUserDashboard,
  });
}
