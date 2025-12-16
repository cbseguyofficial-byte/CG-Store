import { Users, Gift, TrendingUp, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminReferrals, useAdminReferralStats } from "@/hooks/useAdminReferrals";

const AdminReferrals = () => {
  const { data: referrals, isLoading, error } = useAdminReferrals();
  const { data: stats, isLoading: statsLoading } = useAdminReferralStats();

  const statsData = [
    { label: "Total Referrals", value: stats?.total || 0, icon: Users, color: "bg-primary" },
    { label: "Successful", value: stats?.successful || 0, icon: TrendingUp, color: "bg-green-500" },
    { label: "Pending", value: stats?.pending || 0, icon: Clock, color: "bg-yellow-500" },
    { label: "Rewards Given", value: `₹${stats?.rewardsGiven || 0}`, icon: Gift, color: "bg-turquoise-surf" },
  ];

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-turquoise-surf" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load referrals: {error.message}</p>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "EARNED":
      case "REDEEMED":
        return "default";
      case "PENDING":
        return "secondary";
      default:
        return "destructive";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-light-cyan">Referrals</h1>
        <p className="text-frosted-blue">Track referral performance ({referrals?.length || 0} total)</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.label} className="bg-french-blue/50 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-light-cyan">{stat.value}</p>
                  <p className="text-xs text-frosted-blue">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referrals Table */}
      <Card className="bg-french-blue/50 border-primary/20">
        <CardHeader>
          <CardTitle className="text-light-cyan">Referral History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Referrer</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden md:table-cell">Referred User</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden lg:table-cell">Code Used</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden lg:table-cell">Order ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals && referrals.length > 0 ? (
                  referrals.map((ref) => (
                    <tr key={ref.id} className="border-b border-primary/10 hover:bg-deep-twilight/30 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium text-light-cyan">
                          {ref.referrer_profile?.full_name || "Unknown"}
                        </p>
                        <p className="text-xs text-frosted-blue">
                          {ref.referrer_profile?.email || ref.referrer_user_id.slice(0, 8)}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-frosted-blue hidden md:table-cell">
                        <p className="font-medium text-light-cyan">
                          {ref.referred_profile?.full_name || "Unknown"}
                        </p>
                        <p className="text-xs text-frosted-blue">
                          {ref.referred_profile?.email || ref.referred_user_id.slice(0, 8)}
                        </p>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <code className="text-turquoise-surf font-mono text-sm">{ref.referral_code_used}</code>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        {ref.order_id ? (
                          <code className="text-turquoise-surf font-mono text-sm">{ref.order_id}</code>
                        ) : (
                          <span className="text-frosted-blue text-sm">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getStatusVariant(ref.reward_status)}>
                          {ref.reward_status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-frosted-blue text-sm hidden sm:table-cell">
                        {new Date(ref.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-frosted-blue">
                      No referrals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReferrals;
