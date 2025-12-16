import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Eye, Package, Clock, CheckCircle, Truck, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminOrders } from "@/hooks/useOrders";

type OrderStatus = "PENDING_VERIFICATION" | "CONFIRMED" | "CANCELLED" | "SHIPPED" | "DELIVERED";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "DELIVERED": return <CheckCircle className="h-4 w-4" />;
    case "SHIPPED": return <Truck className="h-4 w-4" />;
    case "CONFIRMED": return <Package className="h-4 w-4" />;
    case "PENDING_VERIFICATION": return <Clock className="h-4 w-4" />;
    case "CANCELLED": return <XCircle className="h-4 w-4" />;
    default: return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "SHIPPED": return "bg-primary/20 text-turquoise-surf border-primary/30";
    case "CONFIRMED": return "bg-sky-aqua/20 text-sky-aqua border-sky-aqua/30";
    case "PENDING_VERIFICATION": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "CANCELLED": return "bg-red-500/20 text-red-400 border-red-500/30";
    default: return "";
  }
};

const getPaymentColor = (status: string) => {
  switch (status) {
    case "PAID": return "default";
    case "PENDING": return "secondary";
    case "FAILED": return "destructive";
    default: return "secondary";
  }
};

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: orders, isLoading, error } = useAdminOrders({
    status: statusFilter !== "all" ? statusFilter as OrderStatus : undefined,
    search: searchQuery || undefined,
  });

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
        <p className="text-destructive">Failed to load orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-cyan">Orders</h1>
          <p className="text-frosted-blue">Manage customer orders ({orders?.length || 0} total)</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[180px] bg-french-blue/50 border-primary/20 text-light-cyan"
          />
          <Filter className="h-4 w-4 text-frosted-blue" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-french-blue/50 border-primary/20 text-light-cyan">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="PENDING_VERIFICATION">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="bg-french-blue/50 border-primary/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Order ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden md:table-cell">Items</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Total</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden lg:table-cell">Payment</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden sm:table-cell">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-primary/10 hover:bg-deep-twilight/30 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium text-turquoise-surf">{order.id}</p>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <p className="text-xs text-frosted-blue">{order.order_items?.length || 0} items</p>
                      </td>
                      <td className="py-4 px-4 font-bold text-light-cyan">₹{order.final_amount}</td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.replace("_", " ")}
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <Badge variant={getPaymentColor(order.payment_status)}>
                          {order.payment_status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-frosted-blue text-sm hidden sm:table-cell">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <Link to={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1 text-frosted-blue hover:text-light-cyan">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-frosted-blue">
                      No orders found
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

export default AdminOrders;