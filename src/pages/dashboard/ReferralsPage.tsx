import { useState } from "react";
import {
  Users,
  Gift,
  Copy,
  Check,
  TrendingUp,
  Percent,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useReferralStats, useReferrals } from "@/hooks/useReferrals";

const ReferralsPage = () => {
  const { data: stats, isLoading: statsLoading } = useReferralStats();
  const { data: referrals, isLoading: referralsLoading } = useReferrals();
  const [copied, setCopied] = useState(false);

  const referralLink = stats?.referral_code
    ? `${window.location.origin}/shop?ref=${stats.referral_code}`
    : "";

  const rewardPerReferral = 50;

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Referral Dashboard</h1>
        <p className="text-muted-foreground">
          Invite friends and earn rewards
        </p>
      </div>

      {/* Referral Code */}
      <Card variant="gradient">
        <CardContent className="p-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Your Referral Code
            </p>
            <div className="flex items-center gap-2">
              <code className="text-2xl font-bold text-primary">
                {stats?.referral_code}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(stats?.referral_code || "")}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Referral Link
            </p>
            <div className="flex gap-2">
              <Input readOnly value={referralLink} />
              <Button onClick={() => handleCopy(referralLink)}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Invited" value={stats?.total_referred} />
        <StatCard icon={TrendingUp} label="Successful" value={stats?.successful_referrals} />
        <StatCard icon={Percent} label="Pending" value={stats?.pending_rewards} />
        <StatCard
          icon={Gift}
          label="Rewards"
          value={`₹${(stats?.earned_rewards || 0) * rewardPerReferral}`}
        />
      </div>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Referred Users</CardTitle>
        </CardHeader>
        <CardContent>
          {referralsLoading ? (
            <Skeleton className="h-24" />
          ) : referrals?.length === 0 ? (
            <div className="text-center py-10">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No referrals yet. Share your code to start earning.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Reward</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map(ref => (
                  <tr key={ref.id} className="border-b">
                    <td className="py-2">
                      {new Date(ref.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td>
                      <Badge>
                        {ref.reward_status === "EARNED"
                          ? "Successful"
                          : "Pending"}
                      </Badge>
                    </td>
                    <td className="font-medium text-green-600">
                      {ref.reward_status === "EARNED"
                        ? `₹${rewardPerReferral}`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xl font-bold">{value ?? 0}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReferralsPage;
