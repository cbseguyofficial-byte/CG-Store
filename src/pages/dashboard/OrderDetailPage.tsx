import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Clock, CheckCircle, Truck, Download, MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mockOrderDetails = {
  id: "ORD-2024-002",
  date: "Dec 3, 2024",
  status: "Shipped",
  paymentStatus: "Paid",
  total: "₹1,299",
  subtotal: "₹1,499",
  discount: "₹200",
  type: "Physical",
  items: [
    { name: "CBSE Class 12 Physics - Complete Guide", format: "Hardcopy", price: "₹599", qty: 1 },
    { name: "CBSE Class 12 Chemistry - Comprehensive Notes", format: "Hardcopy", price: "₹499", qty: 1 },
    { name: "CBSE Class 12 Mathematics - Formula Book", format: "Hardcopy", price: "₹401", qty: 1 },
  ],
  shipping: {
    name: "John Doe",
    address: "123 Student Lane, Sector 15",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    phone: "+91 98765 43210",
    email: "john@example.com",
  },
  tracking: {
    courier: "BlueDart",
    trackingId: "BD1234567890",
    trackingLink: "https://bluedart.com/track",
  },
  timeline: [
    { status: "Placed", date: "Dec 3, 2024 10:30 AM", completed: true },
    { status: "Confirmed", date: "Dec 3, 2024 11:45 AM", completed: true },
    { status: "Shipped", date: "Dec 4, 2024 2:00 PM", completed: true },
    { status: "Out for Delivery", date: "Expected Dec 7, 2024", completed: false },
    { status: "Delivered", date: "-", completed: false },
  ],
  adminNote: "Your order has been shipped! Expected delivery in 3-5 business days.",
};

const OrderDetailPage = () => {
  const { id } = useParams();

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
          <h1 className="text-2xl font-bold">{id || mockOrderDetails.id}</h1>
          <p className="text-muted-foreground">Placed on {mockOrderDetails.date}</p>
        </div>
        <Badge variant="secondary" className="ml-auto">{mockOrderDetails.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                    <div className="h-16 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.format} × {item.qty}</p>
                    </div>
                    <p className="font-semibold">{item.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline (for Physical) */}
          {mockOrderDetails.type === "Physical" && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {mockOrderDetails.timeline.map((step, index) => (
                    <div key={index} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {step.completed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        {index < mockOrderDetails.timeline.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-2 ${step.completed ? "bg-primary" : "bg-border"}`} />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className={`font-medium ${step.completed ? "" : "text-muted-foreground"}`}>{step.status}</p>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Info */}
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Courier: {mockOrderDetails.tracking.courier}</p>
                    <p className="font-mono text-sm">{mockOrderDetails.tracking.trackingId}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Track Package
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Digital Downloads (if Digital) */}
          {(mockOrderDetails.type === "Digital" || mockOrderDetails.type === "Combo") && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Digital Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockOrderDetails.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">PDF Format</p>
                      </div>
                      <Button size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{mockOrderDetails.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{mockOrderDetails.discount}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{mockOrderDetails.total}</span>
              </div>
              <Badge variant="outline" className="w-full justify-center mt-2">
                {mockOrderDetails.paymentStatus}
              </Badge>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{mockOrderDetails.shipping.name}</p>
              <p className="text-muted-foreground">{mockOrderDetails.shipping.address}</p>
              <p className="text-muted-foreground">
                {mockOrderDetails.shipping.city}, {mockOrderDetails.shipping.state} - {mockOrderDetails.shipping.pincode}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground pt-2">
                <Phone className="h-4 w-4" />
                {mockOrderDetails.shipping.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {mockOrderDetails.shipping.email}
              </div>
            </CardContent>
          </Card>

          {/* Admin Note */}
          {mockOrderDetails.adminNote && (
            <Card variant="gradient">
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-1">Note from CBSE GUY:</p>
                <p className="text-sm text-muted-foreground">{mockOrderDetails.adminNote}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
