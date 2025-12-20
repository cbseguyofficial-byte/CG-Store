import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Referral, ReferralStats } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

export function useReferralStats() {
  const { user, profile, isLoading } = useAuth();

  return useQuery({
    queryKey: ["referral-stats", user?.id, profile?.referral_code],
    enabled: !!user && !!profile && !isLoading,

    queryFn: async (): Promise<ReferralStats> => {
      // At this point profile is GUARANTEED
      const { data: referrals, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_user_id", user!.id);

      if (error) throw error;

      return {
        referral_code: profile!.referral_code,
        total_referred: referrals.length,
        successful_referrals: referrals.filter(
          r => r.reward_status === "EARNED" || r.reward_status === "REDEEMED"
        ).length,
        pending_rewards: referrals.filter(
          r => r.reward_status === "PENDING"
        ).length,
        earned_rewards: referrals.filter(
          r => r.reward_status === "EARNED"
        ).length,
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
