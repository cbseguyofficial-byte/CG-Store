import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Package, Clock, CheckCircle, XCircle, Truck, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/useOrders";

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
    case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
    case "SHIPPED": return "bg-primary/10 text-primary border-primary/20";
    case "CONFIRMED": return "bg-sky-aqua/10 text-blue-green border-sky-aqua/20";
    case "PENDING_VERIFICATION": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
    default: return "";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "PENDING_VERIFICATION": return "Pending";
    case "CONFIRMED": return "Confirmed";
    case "SHIPPED": return "Shipped";
    case "DELIVERED": return "Delivered";
    case "CANCELLED": return "Cancelled";
    default: return status;
  }
};

const OrdersPage = () => {
  const { data: orders, isLoading } = useOrders();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders?.filter(order => order.status.toLowerCase() === statusFilter.toUpperCase());

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="glass">
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <Skeleton className="h-20 w-48" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending_verification">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders?.map((order) => (
          <Card key={order.id} variant="glass" className="hover:shadow-card-hover transition-all">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{order.order_items.length} items</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{order.final_amount}</p>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </div>
                  </div>
                  
                  <Link to={`/dashboard/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!filteredOrders || filteredOrders.length === 0) && (
        <Card variant="glass">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === "all" 
                ? "You haven't placed any orders yet." 
                : "No orders match your current filter."}
            </p>
            {statusFilter !== "all" ? (
              <Button onClick={() => setStatusFilter("all")}>Clear Filter</Button>
            ) : (
              <Link to="/shop">
                <Button>Start Shopping</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdersPage;