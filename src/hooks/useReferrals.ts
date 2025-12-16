import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Referral, ReferralStats } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

export function useReferralStats() {
  const { user, profile } = useAuth();

  return useQuery({
    queryKey: ["referral-stats", user?.id],
    queryFn: async (): Promise<ReferralStats> => {
      if (!user || !profile) {
        return {
          referral_code: "",
          total_referred: 0,
          successful_referrals: 0,
          pending_rewards: 0,
          earned_rewards: 0,
        };
      }

      // Get all referrals where user is the referrer
      const { data: referrals, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_user_id", user.id);

      if (error) {
        throw error;
      }

      const stats: ReferralStats = {
        referral_code: profile.referral_code || "",
        total_referred: referrals?.length || 0,
        successful_referrals: referrals?.filter(r => r.reward_status === "EARNED" || r.reward_status === "REDEEMED").length || 0,
        pending_rewards: referrals?.filter(r => r.reward_status === "PENDING").length || 0,
        earned_rewards: referrals?.filter(r => r.reward_status === "EARNED").length || 0,
      };

      return stats;
    },
    enabled: !!user && !!profile,
  });
}

export function useReferrals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["referrals", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as Referral[];
    },
    enabled: !!user,
  });
}

// Admin hook
export function useAdminReferrals() {
  return useQuery({
    queryKey: ["admin-referrals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referrals")
        .select(`
          *,
          referrer:profiles!referrer_user_id (*),
          referred:profiles!referred_user_id (*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
