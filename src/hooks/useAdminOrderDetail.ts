import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OrderWithItems, Payment, TrackingLink } from "@/lib/types";

interface OrderDetailData extends OrderWithItems {
  profile?: {
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
}

export function useAdminOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      // Fetch order with items, payments, and tracking
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (*)
          ),
          payments (*),
          tracking_links (*)
        `)
        .eq("id", orderId)
        .maybeSingle();

      if (orderError) throw orderError;
      if (!order) throw new Error("Order not found");

      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", order.user_id)
        .maybeSingle();

      return {
        ...order,
        profile,
      } as OrderDetailData;
    },
    enabled: !!orderId,
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      paymentId, 
      action, 
      rejectionReason 
    }: { 
      orderId: string; 
      paymentId: string; 
      action: "approve" | "reject"; 
      rejectionReason?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (action === "approve") {
        // Update payment status
        const { error: paymentError } = await supabase
          .from("payments")
          .update({
            status: "VERIFIED",
            verified_at: new Date().toISOString(),
            verified_by_admin_id: user.id,
          })
          .eq("id", paymentId);

        if (paymentError) throw paymentError;

        // Update order status
        const { error: orderError } = await supabase
          .from("orders")
          .update({
            status: "CONFIRMED",
            payment_status: "PAID",
          })
          .eq("id", orderId);

        if (orderError) throw orderError;

        // Log audit
        await supabase.from("audit_logs").insert({
          admin_user_id: user.id,
          action: "VERIFY_PAYMENT",
          entity_type: "payment",
          entity_id: paymentId,
          details: { order_id: orderId, action: "approved" },
        });

      } else {
        // Reject payment
        const { error: paymentError } = await supabase
          .from("payments")
          .update({
            status: "REJECTED",
            rejection_reason: rejectionReason,
            verified_at: new Date().toISOString(),
            verified_by_admin_id: user.id,
          })
          .eq("id", paymentId);

        if (paymentError) throw paymentError;

        // Cancel order
        const { error: orderError } = await supabase
          .from("orders")
          .update({
            status: "CANCELLED",
            payment_status: "FAILED",
          })
          .eq("id", orderId);

        if (orderError) throw orderError;

        // Log audit
        await supabase.from("audit_logs").insert({
          admin_user_id: user.id,
          action: "REJECT_PAYMENT",
          entity_type: "payment",
          entity_id: paymentId,
          details: { order_id: orderId, action: "rejected", reason: rejectionReason },
        });
      }
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success(action === "approve" ? "Payment verified and order confirmed" : "Payment rejected and order cancelled");
    },
    onError: (error) => {
      toast.error(`Failed to process payment: ${error.message}`);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("orders")
        .update({ status: status as any })
        .eq("id", orderId);

      if (error) throw error;

      // Log audit
      await supabase.from("audit_logs").insert({
        admin_user_id: user.id,
        action: "UPDATE_ORDER_STATUS",
        entity_type: "order",
        entity_id: orderId,
        details: { new_status: status },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });
}

export function useAddTrackingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      courierName, 
      trackingUrl 
    }: { 
      orderId: string; 
      courierName: string; 
      trackingUrl: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if tracking already exists
      const { data: existing } = await supabase
        .from("tracking_links")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("tracking_links")
          .update({
            courier_name: courierName,
            tracking_url: trackingUrl,
            status: "SHIPPED",
          })
          .eq("order_id", orderId);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from("tracking_links")
          .insert({
            order_id: orderId,
            courier_name: courierName,
            tracking_url: trackingUrl,
            status: "SHIPPED",
          });

        if (error) throw error;
      }

      // Update order status to shipped
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status: "SHIPPED" })
        .eq("id", orderId);

      if (orderError) throw orderError;

      // Log audit
      await supabase.from("audit_logs").insert({
        admin_user_id: user.id,
        action: "ADD_TRACKING",
        entity_type: "order",
        entity_id: orderId,
        details: { courier: courierName, url: trackingUrl },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Tracking information updated");
    },
    onError: (error) => {
      toast.error(`Failed to update tracking: ${error.message}`);
    },
  });
}

export function useUpdateAdminNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, note }: { orderId: string; note: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ admin_note: note })
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
      toast.success("Admin note saved");
    },
    onError: (error) => {
      toast.error(`Failed to save note: ${error.message}`);
    },
  });
}
