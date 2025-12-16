import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  todaysSales: number;
  pendingOrders: number;
  ordersByStatus: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  topProducts: {
    id: string;
    title: string;
    sales: number;
    revenue: number;
  }[];
  couponStats: {
    code: string;
    uses: number;
  }[];
  referralStats: {
    totalReferrals: number;
    earnedRewards: number;
    activeReferrers: number;
  };
}

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      // Fetch all completed orders for revenue calculation
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, status, payment_status, final_amount, created_at, coupon_code, referral_code");

      if (ordersError) throw ordersError;

      // Calculate stats from orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const paidOrders = orders?.filter(o => o.payment_status === "PAID") || [];
      const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);
      
      const todaysOrders = paidOrders.filter(o => new Date(o.created_at) >= today);
      const todaysSales = todaysOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);

      const ordersByStatus = {
        pending: orders?.filter(o => o.status === "PENDING_VERIFICATION").length || 0,
        confirmed: orders?.filter(o => o.status === "CONFIRMED").length || 0,
        shipped: orders?.filter(o => o.status === "SHIPPED").length || 0,
        delivered: orders?.filter(o => o.status === "DELIVERED").length || 0,
        cancelled: orders?.filter(o => o.status === "CANCELLED").length || 0,
      };

      // Fetch order items for top products
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_id, title_snapshot, quantity, line_total");

      // Aggregate by product
      const productStats: Record<string, { title: string; sales: number; revenue: number }> = {};
      orderItems?.forEach(item => {
        if (!item.product_id) return;
        if (!productStats[item.product_id]) {
          productStats[item.product_id] = { title: item.title_snapshot, sales: 0, revenue: 0 };
        }
        productStats[item.product_id].sales += item.quantity;
        productStats[item.product_id].revenue += item.line_total;
      });

      const topProducts = Object.entries(productStats)
        .map(([id, stats]) => ({ id, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Coupon usage stats
      const couponUsage: Record<string, number> = {};
      orders?.forEach(o => {
        if (o.coupon_code) {
          couponUsage[o.coupon_code] = (couponUsage[o.coupon_code] || 0) + 1;
        }
      });

      const couponStats = Object.entries(couponUsage)
        .map(([code, uses]) => ({ code, uses }))
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 5);

      // Referral stats
      const { data: referrals } = await supabase
        .from("referrals")
        .select("id, referrer_user_id, reward_status");

      const uniqueReferrers = new Set(referrals?.map(r => r.referrer_user_id) || []);
      const earnedRewards = referrals?.filter(r => r.reward_status === "EARNED").length || 0;

      return {
        totalRevenue,
        totalOrders: orders?.length || 0,
        todaysSales,
        pendingOrders: ordersByStatus.pending,
        ordersByStatus,
        topProducts,
        couponStats,
        referralStats: {
          totalReferrals: referrals?.length || 0,
          earnedRewards,
          activeReferrers: uniqueReferrers.size,
        },
      } as DashboardStats;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
