import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useAdminDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-turquoise-surf" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load dashboard data</p>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Total Revenue", 
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: "bg-green-500" 
    },
    { 
      label: "Total Orders", 
      value: String(stats?.totalOrders || 0), 
      icon: ShoppingCart, 
      color: "bg-primary" 
    },
    { 
      label: "Today's Sales", 
      value: `₹${(stats?.todaysSales || 0).toLocaleString()}`, 
      icon: TrendingUp, 
      color: "bg-turquoise-surf" 
    },
    { 
      label: "Pending Orders", 
      value: String(stats?.pendingOrders || 0), 
      icon: Clock, 
      color: "bg-yellow-500" 
    },
  ];

  const orderStats = [
    { label: "Pending", value: stats?.ordersByStatus.pending || 0, color: "text-yellow-500" },
    { label: "Confirmed", value: stats?.ordersByStatus.confirmed || 0, color: "text-primary" },
    { label: "Shipped", value: stats?.ordersByStatus.shipped || 0, color: "text-blue-green" },
    { label: "Delivered", value: stats?.ordersByStatus.delivered || 0, color: "text-green-500" },
    { label: "Cancelled", value: stats?.ordersByStatus.cancelled || 0, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-light-cyan">Dashboard Overview</h1>
        <p className="text-frosted-blue">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-french-blue/50 border-primary/20">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-frosted-blue">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-light-cyan mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 lg:p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <Card className="bg-french-blue/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-light-cyan">Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${stat.color.replace("text-", "bg-")}`} />
                    <span className="text-frosted-blue">{stat.label}</span>
                  </div>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best Sellers */}
        <Card className="bg-french-blue/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-light-cyan">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-turquoise-surf">#{index + 1}</span>
                      <span className="text-frosted-blue text-sm truncate max-w-[200px]">{product.title}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-light-cyan">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-frosted-blue">{product.sales} sold</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-frosted-blue text-center py-4">No sales data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Coupon Usage */}
        <Card className="bg-french-blue/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-light-cyan">Coupon Usage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.couponStats && stats.couponStats.length > 0 ? (
                stats.couponStats.map((coupon) => (
                  <div key={coupon.code} className="flex items-center justify-between p-3 bg-deep-twilight/50 rounded-lg">
                    <div>
                      <code className="text-turquoise-surf font-mono">{coupon.code}</code>
                      <p className="text-xs text-frosted-blue mt-1">{coupon.uses} uses</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-frosted-blue text-center py-4">No coupon usage yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Referral Summary */}
        <Card className="bg-french-blue/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-light-cyan">Referral Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-deep-twilight/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-turquoise-surf">{stats?.referralStats.totalReferrals || 0}</p>
                <p className="text-xs text-frosted-blue">Total Referrals</p>
              </div>
              <div className="p-4 bg-deep-twilight/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-400">{stats?.referralStats.earnedRewards || 0}</p>
                <p className="text-xs text-frosted-blue">Rewards Earned</p>
              </div>
              <div className="p-4 bg-deep-twilight/50 rounded-lg text-center col-span-2">
                <p className="text-2xl font-bold text-sky-aqua">{stats?.referralStats.activeReferrers || 0}</p>
                <p className="text-xs text-frosted-blue">Active Referrers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
