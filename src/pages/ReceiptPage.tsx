import { useParams, Link } from "react-router-dom";
import { Download, Home, Clock, BookOpen, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { AddressSnapshot } from "@/lib/types";

export default function ReceiptPage() {
  const { id } = useParams();
  const { profile } = useAuth();
  const { data: order, isLoading, error } = useOrder(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 py-8">
        <div className="container max-w-2xl">
          <Card variant="elevated">
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-muted/20 py-8">
        <div className="container max-w-2xl text-center">
          <Card variant="elevated" className="p-8">
            <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">We couldn't find this order.</p>
            <Link to="/dashboard/orders">
              <Button>View All Orders</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const address = order.address_snapshot as unknown as AddressSnapshot;
  const statusConfig = {
    PENDING_VERIFICATION: { label: "Pending Verification", icon: Clock, variant: "warning" as const },
    CONFIRMED: { label: "Confirmed", icon: CheckCircle, variant: "success" as const },
    SHIPPED: { label: "Shipped", icon: CheckCircle, variant: "default" as const },
    DELIVERED: { label: "Delivered", icon: CheckCircle, variant: "success" as const },
    CANCELLED: { label: "Cancelled", icon: Clock, variant: "destructive" as const },
  };

  const status = statusConfig[order.status] || statusConfig.PENDING_VERIFICATION;

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container max-w-2xl">
        <Card variant="elevated">
          <CardHeader className="text-center border-b border-border pb-6">
            {/* Logo */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-french-blue to-turquoise-surf">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">CBSE GUY</h1>
            <p className="text-muted-foreground">E-Receipt</p>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Order Info */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-semibold text-foreground">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium text-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Badge variant={status.variant} className="flex items-center gap-1">
                <status.icon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>

            <Separator />

            {/* Customer Info */}
            <div>
              <h3 className="mb-3 font-semibold text-foreground">Billing Details</h3>
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="font-medium text-foreground">{address?.name || profile?.full_name}</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                {address && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {address.address_line}, {address.city}, {address.state} - {address.pincode}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div>
              <h3 className="mb-3 font-semibold text-foreground">Order Items</h3>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium text-foreground">{item.title_snapshot}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ₹{item.price_snapshot}
                      </p>
                    </div>
                    <p className="font-medium text-foreground">₹{item.line_total}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.total_amount}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                  <span>-₹{order.discount_amount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-semibold">Total Paid</span>
                <span className="text-xl font-bold text-foreground">₹{order.final_amount}</span>
              </div>
            </div>

            <Separator />

            {/* Note */}
            <div className="rounded-xl bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">What's Next?</p>
                  <p className="text-sm text-muted-foreground">
                    {order.status === "PENDING_VERIFICATION"
                      ? "Your payment will now be manually verified. This usually takes 2-4 hours during business hours. Once verified, you'll receive your digital products via email."
                      : order.status === "CONFIRMED"
                      ? "Your order has been confirmed! Digital products will be delivered to your email shortly."
                      : order.status === "SHIPPED"
                      ? "Your order has been shipped! Track your delivery in the orders section."
                      : order.status === "DELIVERED"
                      ? "Your order has been delivered! Thank you for shopping with us."
                      : "If you have any questions, please contact our support."}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
              <Link to="/dashboard" className="flex-1">
                <Button className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}