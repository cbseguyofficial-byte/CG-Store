import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { OrderWithItems, CreateOrderPayload, CheckoutValidation } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function useOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as OrderWithItems[];
    },
    enabled: !!user,
  });
}

export function useOrder(orderId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
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
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as OrderWithItems | null;
    },
    enabled: !!user && !!orderId,
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: async ({ 
      couponCode, 
      subtotal 
    }: { 
      couponCode: string; 
      subtotal: number;
    }): Promise<CheckoutValidation> => {
      if (!couponCode) {
        return {
          subtotal,
          discount: 0,
          final_amount: subtotal,
          coupon_valid: false,
          items_valid: true,
        };
      }

      // Use secure edge function for coupon validation
      const { data, error } = await supabase.functions.invoke('validate-coupon', {
        body: { couponCode, subtotal }
      });

      if (error) {
        console.error('Coupon validation error:', error);
        return {
          subtotal,
          discount: 0,
          final_amount: subtotal,
          coupon_valid: false,
          coupon_message: "Error validating coupon",
          items_valid: true,
        };
      }

      return {
        subtotal,
        discount: data.discount || 0,
        final_amount: data.final_amount || subtotal,
        coupon_valid: data.coupon_valid || false,
        coupon_message: data.coupon_message,
        items_valid: true,
        is_referral_code: data.is_referral_code,
        referrer_user_id: data.referrer_user_id,
      };
    },
  });
}

export function useCreateOrder() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      if (!user) {
        throw new Error("You must be logged in to create an order");
      }

      // Generate order ID
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderId = `ORD-${datePart}-${randomPart}`;

      // Get products for order
      const productIds = payload.items.map(item => item.product_id);
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (productsError || !products) {
        throw new Error("Failed to fetch products");
      }

      // Calculate totals
      let subtotal = 0;
      const orderItems = payload.items.map(item => {
        const product = products.find(p => p.id === item.product_id);
        if (!product) throw new Error(`Product ${item.product_id} not found`);
        
        const lineTotal = product.sale_price * item.quantity;
        subtotal += lineTotal;

        return {
          order_id: orderId,
          product_id: item.product_id,
          title_snapshot: product.title,
          price_snapshot: product.sale_price,
          quantity: item.quantity,
          line_total: lineTotal,
          format_snapshot: item.format || product.format,
        };
      });

      // Apply coupon discount
      let discount = 0;
      if (payload.coupon_code) {
        const { data: coupon } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", payload.coupon_code.toUpperCase())
          .eq("is_active", true)
          .maybeSingle();

        if (coupon) {
          if (coupon.type === "PERCENT") {
            discount = (subtotal * coupon.value) / 100;
            if (coupon.max_discount && discount > coupon.max_discount) {
              discount = coupon.max_discount;
            }
          } else {
            discount = coupon.value;
          }
          discount = Math.min(discount, subtotal);
        }
      }

      const finalAmount = subtotal - discount;

      // Check if coupon is a referral code
      let referralRecordId = null;
      if (payload.coupon_code) {
        const { data: referralCoupon } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", payload.coupon_code.toUpperCase())
          .eq("is_referral_code", true)
          .eq("is_active", true)
          .maybeSingle();

        if (referralCoupon && referralCoupon.owner_user_id && referralCoupon.owner_user_id !== user.id) {
          // Create referral record
          const { data: referral, error: referralError } = await supabase
            .from("referrals")
            .insert({
              referrer_user_id: referralCoupon.owner_user_id,
              referred_user_id: user.id,
              referral_code_used: payload.coupon_code.toUpperCase(),
              order_id: orderId,
              reward_status: "PENDING",
            })
            .select()
            .single();

          if (!referralError && referral) {
            referralRecordId = referral.id;
          }
        }
      }

      // Create order
      const { error: orderError } = await supabase.from("orders").insert([{
        id: orderId,
        user_id: user.id,
        status: "PENDING_VERIFICATION" as const,
        payment_status: "PENDING" as const,
        total_amount: subtotal,
        discount_amount: discount,
        final_amount: finalAmount,
        coupon_code: payload.coupon_code?.toUpperCase() ?? null,
        referral_code: payload.coupon_code?.toUpperCase() ?? null,
        referral_record_id: referralRecordId ?? null,
        address_snapshot: JSON.parse(JSON.stringify(payload.address)) as Json,
        notes: payload.notes ?? null,
      }]);

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Create notification
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "ORDER_CREATED",
        title: "Order Placed Successfully",
        message: `Your order ${orderId} has been placed and is pending payment verification.`,
      });

      return { orderId, finalAmount };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(`Order ${data.orderId} created successfully!`);
    },
    onError: (error) => {
      toast.error(`Failed to create order: ${error.message}`);
    },
  });
}

export function useSubmitPayment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      transactionId,
      screenshotUrl,
      driveLink,
    }: {
      orderId: string;
      transactionId: string;
      screenshotUrl?: string;
      driveLink?: string;
    }) => {
      if (!user) {
        throw new Error("You must be logged in");
      }

      const { error } = await supabase.from("payments").insert({
        order_id: orderId,
        transaction_id: transactionId,
        payment_screenshot_url: screenshotUrl,
        drive_link: driveLink,
        status: "SUBMITTED",
      });

      if (error) {
        throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Payment submitted for verification!");
    },
    onError: (error) => {
      toast.error(`Failed to submit payment: ${error.message}`);
    },
  });
}

// Admin hooks
type OrderStatus = "PENDING_VERIFICATION" | "CONFIRMED" | "CANCELLED" | "SHIPPED" | "DELIVERED";

export function useAdminOrders(filters?: { status?: OrderStatus; search?: string }) {
  return useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: async () => {
      let query = supabase
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
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.search) {
        query = query.or(`id.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as OrderWithItems[];
    },
  });
}

export function useAdminOrder(orderId: string) {
  return useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
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

      if (error) {
        throw error;
      }

      return data as OrderWithItems | null;
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
      decision,
      reason,
      adminId,
    }: {
      orderId: string;
      paymentId: string;
      decision: "APPROVE" | "REJECT";
      reason?: string;
      adminId: string;
    }) => {
      if (decision === "APPROVE") {
        // Update payment
        await supabase
          .from("payments")
          .update({
            status: "VERIFIED",
            verified_by_admin_id: adminId,
            verified_at: new Date().toISOString(),
          })
          .eq("id", paymentId);

        // Update order
        await supabase
          .from("orders")
          .update({
            status: "CONFIRMED",
            payment_status: "PAID",
          })
          .eq("id", orderId);

        // Get order for user notification
        const { data: order } = await supabase
          .from("orders")
          .select("user_id, referral_record_id")
          .eq("id", orderId)
          .single();

        if (order) {
          // Create notification
          await supabase.from("notifications").insert({
            user_id: order.user_id,
            type: "ORDER_CONFIRMED",
            title: "Order Confirmed!",
            message: `Your order ${orderId} has been confirmed and is being processed.`,
          });

          // Update referral status if exists
          if (order.referral_record_id) {
            await supabase
              .from("referrals")
              .update({ reward_status: "EARNED" })
              .eq("id", order.referral_record_id);
          }
        }

        // Log audit
        await supabase.from("audit_logs").insert({
          admin_user_id: adminId,
          action: "VERIFY_PAYMENT",
          entity_type: "ORDER",
          entity_id: orderId,
          details: { decision: "APPROVE" },
        });
      } else {
        // Update payment
        await supabase
          .from("payments")
          .update({
            status: "REJECTED",
            rejection_reason: reason,
            verified_by_admin_id: adminId,
            verified_at: new Date().toISOString(),
          })
          .eq("id", paymentId);

        // Update order
        await supabase
          .from("orders")
          .update({
            status: "CANCELLED",
            payment_status: "FAILED",
            admin_note: reason,
          })
          .eq("id", orderId);

        // Get order for user notification
        const { data: order } = await supabase
          .from("orders")
          .select("user_id")
          .eq("id", orderId)
          .single();

        if (order) {
          await supabase.from("notifications").insert({
            user_id: order.user_id,
            type: "ORDER_CANCELLED",
            title: "Order Cancelled",
            message: `Your order ${orderId} was cancelled. Reason: ${reason}`,
          });
        }

        // Log audit
        await supabase.from("audit_logs").insert({
          admin_user_id: adminId,
          action: "REJECT_PAYMENT",
          entity_type: "ORDER",
          entity_id: orderId,
          details: { decision: "REJECT", reason },
        });
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
      toast.success("Payment verification updated");
    },
    onError: (error) => {
      toast.error(`Failed to verify payment: ${error.message}`);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      adminId,
    }: {
      orderId: string;
      status: string;
      adminId: string;
    }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: status as "PENDING_VERIFICATION" | "CONFIRMED" | "CANCELLED" | "SHIPPED" | "DELIVERED" })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      // Log audit
      await supabase.from("audit_logs").insert({
        admin_user_id: adminId,
        action: "UPDATE_ORDER_STATUS",
        entity_type: "ORDER",
        entity_id: orderId,
        details: { new_status: status },
      });

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
      toast.success("Order status updated");
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });
}
