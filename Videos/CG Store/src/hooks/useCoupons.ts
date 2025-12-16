import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Coupon, CouponInsert } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function useAdminCoupons() {
  return useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as Coupon[];
    },
  });
}

export function useCreateCoupon() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coupon: Omit<CouponInsert, "id">) => {
      const { data, error } = await supabase
        .from("coupons")
        .insert({
          ...coupon,
          code: coupon.code.toUpperCase(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log audit
      if (user) {
        await supabase.from("audit_logs").insert({
          admin_user_id: user.id,
          action: "CREATE_COUPON",
          entity_type: "COUPON",
          entity_id: data.id,
          details: { code: data.code },
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create coupon: ${error.message}`);
    },
  });
}

export function useUpdateCoupon() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Coupon> }) => {
      const { data, error } = await supabase
        .from("coupons")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log audit
      if (user) {
        await supabase.from("audit_logs").insert({
          admin_user_id: user.id,
          action: "UPDATE_COUPON",
          entity_type: "COUPON",
          entity_id: id,
          details: updates,
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update coupon: ${error.message}`);
    },
  });
}

export function useToggleCouponStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("coupons")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Log audit
      if (user) {
        await supabase.from("audit_logs").insert({
          admin_user_id: user.id,
          action: isActive ? "ACTIVATE_COUPON" : "DEACTIVATE_COUPON",
          entity_type: "COUPON",
          entity_id: id,
          details: { is_active: isActive },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon status updated");
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });
}

export function useDeleteCoupon() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Log audit
      if (user) {
        await supabase.from("audit_logs").insert({
          admin_user_id: user.id,
          action: "DELETE_COUPON",
          entity_type: "COUPON",
          entity_id: id,
          details: {},
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete coupon: ${error.message}`);
    },
  });
}
