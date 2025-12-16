import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Package, Truck, Mail, Download, Link as LinkIcon, Loader2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAdminOrderDetail, useVerifyPayment, useUpdateOrderStatus, useAddTrackingLink, useUpdateAdminNote } from "@/hooks/useAdminOrderDetail";
import { AddressSnapshot } from "@/lib/types";

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "DELIVERED": return "default";
    case "SHIPPED": return "default";
    case "CONFIRMED": return "secondary";
    case "PENDING_VERIFICATION": return "secondary";
    case "CANCELLED": return "destructive";
    default: return "secondary";
  }
};

const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [trackingUrl, setTrackingUrl] = useState("");
  const [courier, setCourier] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const { data: order, isLoading, error } = useAdminOrderDetail(id || "");
  const verifyPayment = useVerifyPayment();
  const updateStatus = useUpdateOrderStatus();
  const addTracking = useAddTrackingLink();
  const updateNote = useUpdateAdminNote();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-turquoise-surf" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load order: {error?.message || "Order not found"}</p>
        <Link to="/admin/orders" className="text-primary hover:underline mt-4 inline-block">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const address = order.address_snapshot as unknown as AddressSnapshot;
  const latestPayment = order.payments?.[0];
  const tracking = order.tracking_links?.[0];
  const hasPhysicalItems = order.order_items?.some(item => 
    item.format_snapshot === "PHYSICAL" || item.format_snapshot === "COMBO"
  );
  const hasDigitalItems = order.order_items?.some(item => 
    item.format_snapshot === "PDF" || item.format_snapshot === "COMBO"
  );

  const handleApprovePayment = () => {
    if (latestPayment) {
      verifyPayment.mutate({ 
        orderId: order.id, 
        paymentId: latestPayment.id, 
        action: "approve" 
      });
    }
  };

  const handleRejectPayment = () => {
    if (latestPayment && rejectReason.trim()) {
      verifyPayment.mutate({ 
        orderId: order.id, 
        paymentId: latestPayment.id, 
        action: "reject",
        rejectionReason: rejectReason 
      });
      setRejectDialogOpen(false);
      setRejectReason("");
    }
  };

  const handleUpdateTracking = () => {
    if (courier && trackingUrl) {
      addTracking.mutate({ orderId: order.id, courierName: courier, trackingUrl });
    }
  };

  const handleSaveNote = () => {
    updateNote.mutate({ orderId: order.id, note: adminNote });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/orders">
          <Button variant="ghost" size="icon" className="text-frosted-blue hover:text-light-cyan">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-light-cyan">{order.id}</h1>
          <p className="text-frosted-blue">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(order.status)}>
          {order.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.order_items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-deep-twilight/50 rounded-xl">
                    <div>
                      <p className="font-medium text-light-cyan">{item.title_snapshot}</p>
                      <p className="text-sm text-frosted-blue">{item.format_snapshot} × {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-light-cyan">₹{item.line_total}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Verification */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Payment Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestPayment ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-frosted-blue">Transaction ID</p>
                      <p className="font-mono text-light-cyan">{latestPayment.transaction_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-frosted-blue">Payment Status</p>
                      <Badge variant={latestPayment.status === "VERIFIED" ? "default" : latestPayment.status === "REJECTED" ? "destructive" : "secondary"}>
                        {latestPayment.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {latestPayment.payment_screenshot_url && (
                    <div className="p-4 bg-deep-twilight/50 rounded-xl">
                      <p className="text-sm text-frosted-blue mb-2">Payment Screenshot</p>
                      <a 
                        href={latestPayment.payment_screenshot_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-turquoise-surf hover:underline flex items-center gap-1"
                      >
                        View Screenshot <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}

                  {latestPayment.drive_link && (
                    <div className="p-4 bg-deep-twilight/50 rounded-xl">
                      <p className="text-sm text-frosted-blue mb-2">Drive Link</p>
                      <a 
                        href={latestPayment.drive_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-turquoise-surf hover:underline flex items-center gap-1"
                      >
                        View Drive Link <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}

                  {latestPayment.rejection_reason && (
                    <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                      <p className="text-sm text-red-400">Rejection Reason: {latestPayment.rejection_reason}</p>
                    </div>
                  )}

                  {latestPayment.status === "SUBMITTED" && (
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleApprovePayment} 
                        className="flex-1 gap-2"
                        disabled={verifyPayment.isPending}
                      >
                        <CheckCircle className="h-4 w-4" />
                        {verifyPayment.isPending ? "Processing..." : "Approve & Confirm Order"}
                      </Button>
                      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="flex-1 gap-2">
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-french-blue border-primary/20">
                          <DialogHeader>
                            <DialogTitle className="text-light-cyan">Reject Payment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label className="text-frosted-blue">Reason for Rejection</Label>
                              <Textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Payment not received, invalid transaction ID..."
                                className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                              />
                            </div>
                            <Button 
                              variant="destructive" 
                              onClick={handleRejectPayment} 
                              className="w-full"
                              disabled={!rejectReason.trim() || verifyPayment.isPending}
                            >
                              {verifyPayment.isPending ? "Processing..." : "Confirm Rejection"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-frosted-blue text-center py-4">No payment submitted yet</p>
              )}
            </CardContent>
          </Card>

          {/* Physical Delivery - Only show if has physical items */}
          {hasPhysicalItems && (
            <Card className="bg-french-blue/50 border-primary/20">
              <CardHeader>
                <CardTitle className="text-light-cyan flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tracking && (
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 mb-4">
                    <p className="text-sm text-green-400">
                      Current: {tracking.courier_name} - {tracking.status}
                    </p>
                    <a 
                      href={tracking.tracking_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-turquoise-surf hover:underline text-sm flex items-center gap-1"
                    >
                      Track Package <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-frosted-blue">Courier Name</Label>
                    <Select value={courier} onValueChange={setCourier}>
                      <SelectTrigger className="bg-deep-twilight/50 border-primary/20 text-light-cyan">
                        <SelectValue placeholder="Select courier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BlueDart">BlueDart</SelectItem>
                        <SelectItem value="Delhivery">Delhivery</SelectItem>
                        <SelectItem value="DTDC">DTDC</SelectItem>
                        <SelectItem value="India Post">India Post</SelectItem>
                        <SelectItem value="Ecom Express">Ecom Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-frosted-blue">Order Status</Label>
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => updateStatus.mutate({ orderId: order.id, status: value })}
                    >
                      <SelectTrigger className="bg-deep-twilight/50 border-primary/20 text-light-cyan">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Tracking Link</Label>
                  <Input
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://track.courier.com/..."
                    className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                  />
                </div>
                <Button 
                  onClick={handleUpdateTracking} 
                  className="gap-2"
                  disabled={!courier || !trackingUrl || addTracking.isPending}
                >
                  <LinkIcon className="h-4 w-4" />
                  {addTracking.isPending ? "Updating..." : "Update Tracking"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Admin Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.admin_note && (
                <div className="p-3 bg-deep-twilight/50 rounded-lg">
                  <p className="text-sm text-frosted-blue">Current Note:</p>
                  <p className="text-light-cyan">{order.admin_note}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-frosted-blue">Add/Update Note</Label>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Internal notes about this order..."
                  className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                />
              </div>
              <Button 
                onClick={handleSaveNote} 
                variant="outline"
                className="gap-2 border-primary/30"
                disabled={updateNote.isPending}
              >
                {updateNote.isPending ? "Saving..." : "Save Note"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium text-light-cyan">{order.profile?.full_name || "Unknown"}</p>
              <p className="text-frosted-blue">{order.profile?.email}</p>
              {order.profile?.phone && <p className="text-frosted-blue">{order.profile.phone}</p>}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-frosted-blue">
              <p className="font-medium text-light-cyan">{address?.name}</p>
              <p>{address?.address_line}</p>
              <p>{address?.city}, {address?.state}</p>
              <p>{address?.pincode}</p>
              {address?.phone && <p>Phone: {address.phone}</p>}
            </CardContent>
          </Card>

          {/* Discounts */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Discounts Applied</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-frosted-blue">Referral Code</span>
                {order.referral_code ? (
                  <span className="font-mono text-turquoise-surf">{order.referral_code}</span>
                ) : (
                  <span className="text-muted-foreground italic">None</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-frosted-blue">Coupon Code</span>
                {order.coupon_code ? (
                  <span className="font-mono text-turquoise-surf">{order.coupon_code}</span>
                ) : (
                  <span className="text-muted-foreground italic">None</span>
                )}
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-₹{order.discount_amount}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between text-frosted-blue">
                <span>Subtotal</span>
                <span>₹{order.total_amount}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-₹{order.discount_amount}</span>
                </div>
              )}
              <Separator className="bg-primary/20" />
              <div className="flex justify-between font-bold text-light-cyan">
                <span>Total</span>
                <span>₹{order.final_amount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
