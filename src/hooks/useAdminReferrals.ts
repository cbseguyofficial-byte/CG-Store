import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminReferral {
  id: string;
  referrer_user_id: string;
  referred_user_id: string;
  referral_code_used: string;
  order_id: string | null;
  reward_status: "PENDING" | "EARNED" | "REDEEMED";
  created_at: string;
  updated_at: string;
  referrer_profile?: {
    full_name: string;
    email: string;
  } | null;
  referred_profile?: {
    full_name: string;
    email: string;
  } | null;
}

export function useAdminReferrals() {
  return useQuery({
    queryKey: ["admin-referrals"],
    queryFn: async (): Promise<AdminReferral[]> => {
      // Fetch referrals
      const { data: referrals, error } = await supabase
        .from("referrals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for referrers and referred users
      const userIds = new Set<string>();
      referrals?.forEach((ref) => {
        userIds.add(ref.referrer_user_id);
        userIds.add(ref.referred_user_id);
      });

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", Array.from(userIds));

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      return (referrals || []).map((ref) => ({
        ...ref,
        referrer_profile: profileMap.get(ref.referrer_user_id) || null,
        referred_profile: profileMap.get(ref.referred_user_id) || null,
      }));
    },
  });
}

export function useAdminReferralStats() {
  return useQuery({
    queryKey: ["admin-referral-stats"],
    queryFn: async () => {
      const { data: referrals, error } = await supabase
        .from("referrals")
        .select("reward_status");

      if (error) throw error;

      const total = referrals?.length || 0;
      const successful = referrals?.filter((r) => r.reward_status === "EARNED" || r.reward_status === "REDEEMED").length || 0;
      const pending = referrals?.filter((r) => r.reward_status === "PENDING").length || 0;
      
      // Assuming ₹50 per successful referral
      const rewardsGiven = successful * 50;
      
      return {
        total,
        successful,
        pending,
        rewardsGiven,
      };
    },
  });
}
