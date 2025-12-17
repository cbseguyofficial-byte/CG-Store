import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Download,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/useOrders";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id!);

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  /* ---------------- NOT FOUND ---------------- */
  if (!order) {
    return (
      <Card variant="glass">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Order not found.</p>
        </CardContent>
      </Card>
    );
  }

  const address = order.address_snapshot as any;

  const isPhysical = order.order_items.some(
    (i) => i.format_snapshot === "PHYSICAL"
  );

  const isDigital = order.order_items.some(
    (i) => i.format_snapshot === "PDF"
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold">{order.id}</h1>
          <p className="text-muted-foreground">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-IN")}
          </p>
        </div>

        <Badge variant="secondary" className="ml-auto">
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl"
                >
                  <div className="h-16 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title_snapshot}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.format_snapshot} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.line_total}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Physical Tracking */}
          {isPhysical && order.tracking_links?.length > 0 && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Courier: {order.tracking_links[0].courier_name}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <a
                    href={order.tracking_links[0].tracking_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Track Package
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Digital Downloads */}
          {isDigital && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Digital Downloads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.order_items
                  .filter((i) => i.format_snapshot === "PDF")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                    >
                      <p className="font-medium">{item.title_snapshot}</p>
                      <Button size="sm" disabled>
                        <Download className="h-4 w-4 mr-2" />
                        Available after verification
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* Summary */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount_amount}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.final_amount}</span>
              </div>
              <Badge variant="outline" className="w-full justify-center">
                {order.payment_status}
              </Badge>
            </CardContent>
          </Card>

          {/* Address */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{address.name}</p>
              <p>{address.address_line}</p>
              <p>
                {address.city}, {address.state} - {address.pincode}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {address.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {address.email}
              </div>
            </CardContent>
          </Card>

          {/* Admin Note */}
          {order.admin_note && (
            <Card variant="gradient">
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-1">
                  Note from CBSE GUY:
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.admin_note}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
