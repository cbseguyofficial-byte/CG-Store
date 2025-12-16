import { Link } from "react-router-dom";
import { ShoppingBag, Download, Users, TrendingUp, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total Orders", value: "12", icon: ShoppingBag, color: "bg-primary" },
  { label: "Digital Downloads", value: "8", icon: Download, color: "bg-turquoise-surf" },
  { label: "Referral Rewards", value: "₹250", icon: Users, color: "bg-sky-aqua" },
  { label: "Savings", value: "₹1,450", icon: TrendingUp, color: "bg-blue-green" },
];

const recentOrders = [
  { id: "ORD-2024-001", date: "Dec 5, 2024", total: "₹599", status: "Delivered", items: 2 },
  { id: "ORD-2024-002", date: "Dec 3, 2024", total: "₹1,299", status: "Shipped", items: 3 },
  { id: "ORD-2024-003", date: "Nov 28, 2024", total: "₹449", status: "Confirmed", items: 1 },
  { id: "ORD-2024-004", date: "Nov 25, 2024", total: "₹899", status: "Pending", items: 2 },
  { id: "ORD-2024-005", date: "Nov 20, 2024", total: "₹699", status: "Delivered", items: 1 },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Delivered": return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Shipped": return <Package className="h-4 w-4 text-primary" />;
    case "Confirmed": return <Clock className="h-4 w-4 text-sky-aqua" />;
    case "Pending": return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Cancelled": return <XCircle className="h-4 w-4 text-destructive" />;
    default: return null;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Delivered": return "default";
    case "Shipped": return "secondary";
    case "Confirmed": return "outline";
    case "Pending": return "outline";
    case "Cancelled": return "destructive";
    default: return "default";
  }
};

const DashboardHome = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} variant="glass" className={`stagger-${index + 1}`}>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 lg:p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link to="/dashboard/orders">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Items</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2">
                      <Link to={`/dashboard/orders/${order.id}`} className="text-sm font-medium text-primary hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground hidden sm:table-cell">{order.date}</td>
                    <td className="py-3 px-2 text-sm">{order.items}</td>
                    <td className="py-3 px-2 text-sm font-medium">{order.total}</td>
                    <td className="py-3 px-2">
                      <Badge variant={getStatusVariant(order.status) as any} className="gap-1">
                        {getStatusIcon(order.status)}
                        <span className="hidden sm:inline">{order.status}</span>
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="interactive" className="group">
          <Link to="/dashboard/downloads">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Download Center</h3>
                <p className="text-sm text-muted-foreground">Access your digital books</p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card variant="interactive" className="group">
          <Link to="/dashboard/referrals">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-turquoise-surf/10 group-hover:bg-turquoise-surf/20 transition-colors">
                <Users className="h-6 w-6 text-turquoise-surf" />
              </div>
              <div>
                <h3 className="font-semibold">Invite Friends</h3>
                <p className="text-sm text-muted-foreground">Earn rewards for referrals</p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card variant="interactive" className="group">
          <Link to="/shop">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sky-aqua/10 group-hover:bg-sky-aqua/20 transition-colors">
                <ShoppingBag className="h-6 w-6 text-sky-aqua" />
              </div>
              <div>
                <h3 className="font-semibold">Browse Books</h3>
                <p className="text-sm text-muted-foreground">Explore our collection</p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
