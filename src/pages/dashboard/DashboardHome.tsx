import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Download,
  Users,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardHome } from "@/hooks/useDashboardHome";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "SHIPPED":
      return <Package className="h-4 w-4 text-primary" />;
    case "CONFIRMED":
      return <Clock className="h-4 w-4 text-sky-aqua" />;
    case "PENDING_VERIFICATION":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "SHIPPED":
      return "secondary";
    case "CONFIRMED":
      return "outline";
    case "PENDING_VERIFICATION":
      return "outline";
    case "CANCELLED":
      return "destructive";
    default:
      return "default";
  }
};

export default function DashboardHome() {
  const { data, isLoading } = useDashboardHome();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mt-2" />
            ) : (
              <p className="text-3xl font-bold mt-1">{data?.totalOrders ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Digital Downloads</p>
            <p className="text-3xl font-bold mt-1 text-muted-foreground">—</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Referral Rewards</p>
            <p className="text-3xl font-bold mt-1 text-muted-foreground">—</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Savings</p>
            <p className="text-3xl font-bold mt-1 text-muted-foreground">—</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link to="/dashboard/orders">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : data?.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              You haven’t placed any orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm text-muted-foreground">
                      Order ID
                    </th>
                    <th className="hidden sm:table-cell text-left py-3 px-2 text-sm text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-2 text-sm text-muted-foreground">
                      Items
                    </th>
                    <th className="text-left py-3 px-2 text-sm text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left py-3 px-2 text-sm text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border/50 hover:bg-muted/50"
                    >
                      <td className="py-3 px-2">
                        <Link
                          to={`/dashboard/orders/${order.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {order.id}
                        </Link>
                      </td>
                      <td className="hidden sm:table-cell py-3 px-2 text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-sm">{order.items}</td>
                      <td className="py-3 px-2 text-sm font-medium">
                        ₹{order.final_amount}
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={getStatusVariant(order.status) as any}
                          className="gap-1"
                        >
                          {getStatusIcon(order.status)}
                          <span className="hidden sm:inline">
                            {order.status.replace("_", " ")}
                          </span>
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="interactive">
          <Link to="/dashboard/downloads">
            <CardContent className="p-6 flex items-center gap-4">
              <Download className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Download Center</h3>
                <p className="text-sm text-muted-foreground">
                  Access your digital books
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card variant="interactive">
          <Link to="/dashboard/referrals">
            <CardContent className="p-6 flex items-center gap-4">
              <Users className="h-6 w-6 text-turquoise-surf" />
              <div>
                <h3 className="font-semibold">Invite Friends</h3>
                <p className="text-sm text-muted-foreground">
                  Earn referral rewards
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card variant="interactive">
          <Link to="/shop">
            <CardContent className="p-6 flex items-center gap-4">
              <ShoppingBag className="h-6 w-6 text-sky-aqua" />
              <div>
                <h3 className="font-semibold">Browse Books</h3>
                <p className="text-sm text-muted-foreground">
                  Explore our collection
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
