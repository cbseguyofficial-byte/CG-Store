import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Referral, ReferralStats } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

export function useReferralStats() {
  const { user, profile } = useAuth();

  return useQuery({
    queryKey: ["referral-stats", user?.id],
    enabled: !!user && !!profile,
    queryFn: async (): Promise<ReferralStats> => {
      const { data, error } = await supabase
        .from("referrals")
        .select("reward_status")
        .eq("referrer_user_id", user!.id);

      if (error) throw error;

      const total = data.length;
      const earned = data.filter(
        r => r.reward_status === "EARNED" || r.reward_status === "REDEEMED"
      ).length;
      const pending = data.filter(r => r.reward_status === "PENDING").length;

      return {
        referral_code: profile!.referral_code,
        total_referred: total,
        successful_referrals: earned,
        pending_rewards: pending,
        earned_rewards: earned,
      };
    },
  });
}

export function useReferrals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["referrals", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data as Referral[];
    },
  });
}
