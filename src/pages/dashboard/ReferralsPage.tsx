import { useState } from "react";
import { Users, Gift, Copy, Check, TrendingUp, Percent, Share2 } from "lucide-react";
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (statsLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  const rewardPerReferral = 50; // ₹50 per successful referral

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Referral Dashboard</h1>
        <p className="text-muted-foreground">Invite friends and earn rewards</p>
      </div>

      {/* Referral Code Section */}
      <Card variant="gradient" className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
              <div className="flex items-center gap-2">
                <code className="text-2xl lg:text-3xl font-bold text-primary tracking-wider">
                  {stats?.referral_code || "Loading..."}
                </code>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleCopy(stats?.referral_code || "")}
                  disabled={!stats?.referral_code}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Your Referral Link</p>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="bg-card font-mono text-sm" />
                <Button onClick={() => handleCopy(referralLink)} className="shrink-0 gap-2" disabled={!referralLink}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total_referred || 0}</p>
                <p className="text-xs text-muted-foreground">Total Invited</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.successful_referrals || 0}</p>
                <p className="text-xs text-muted-foreground">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-500/10">
                <Percent className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pending_rewards || 0}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-turquoise-surf/10">
                <Gift className="h-5 w-5 text-turquoise-surf" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(stats?.earned_rewards || 0) * rewardPerReferral}</p>
                <p className="text-xs text-muted-foreground">Total Rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>How Referrals Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h4 className="font-semibold mb-1">Share Your Code</h4>
              <p className="text-sm text-muted-foreground">
                Share your unique referral code or link with friends
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-turquoise-surf text-deep-twilight flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h4 className="font-semibold mb-1">Friend Makes Purchase</h4>
              <p className="text-sm text-muted-foreground">
                When they buy using your code, they get 10% off
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-sky-aqua text-deep-twilight flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h4 className="font-semibold mb-1">Earn Rewards</h4>
              <p className="text-sm text-muted-foreground">
                You earn ₹{rewardPerReferral} credit for each successful referral
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referred Users Table */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Referred Users</CardTitle>
        </CardHeader>
        <CardContent>
          {referralsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : referrals && referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 text-sm">
                        {new Date(referral.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={
                          referral.reward_status === "EARNED" || referral.reward_status === "REDEEMED" 
                            ? "default" 
                            : "secondary"
                        }>
                          {referral.reward_status === "EARNED" ? "Successful" : 
                           referral.reward_status === "REDEEMED" ? "Redeemed" : "Pending"}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 font-medium text-green-600">
                        {referral.reward_status === "EARNED" || referral.reward_status === "REDEEMED" 
                          ? `₹${rewardPerReferral}` 
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No referrals yet. Share your code to start earning!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsPage;