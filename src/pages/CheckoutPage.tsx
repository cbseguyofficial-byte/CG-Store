import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/store/store";
import { useAddresses } from "@/hooks/useAddresses";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { items, getTotal } = useCartStore();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
      setSelectedAddress(defaultAddr.id);
    }
  }, [addresses]);

  const subtotal = getTotal();
  const total = subtotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      return;
    }
    
    // Store checkout data in sessionStorage for payment page
    const selectedAddr = addresses?.find(a => a.id === selectedAddress);
    const checkoutData = {
      items: items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        format: item.format,
      })),
      address: selectedAddr ? {
        name: selectedAddr.name,
        phone: selectedAddr.phone,
        address_line: selectedAddr.address_line,
        city: selectedAddr.city,
        state: selectedAddr.state,
        pincode: selectedAddr.pincode,
        label: selectedAddr.label,
      } : {
        name: formData.name,
        phone: formData.phone,
        address_line: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      subtotal,
      total,
    };
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    navigate("/payment");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-foreground">No items to checkout</h2>
          <Link to="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Saved Addresses */}
              {addressesLoading ? (
                <Card variant="default">
                  <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </CardContent>
                </Card>
              ) : addresses && addresses.length > 0 && (
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Saved Addresses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => setSelectedAddress(addr.id)}
                        className={cn(
                          "w-full text-left rounded-xl border-2 p-4 transition-all",
                          selectedAddress === addr.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">{addr.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-sm text-muted-foreground">{addr.phone}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                    <Link to="/dashboard/profile">
                      <Button variant="outline" type="button" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Address
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* New Address Form */}
              {(!addresses || addresses.length === 0) && (
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address Line</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street, Apartment 4B"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New Delhi"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="Delhi"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          placeholder="110001"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Terms */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  I accept the{" "}
                  <Link to="/eula" className="text-primary hover:underline">EULA</Link>,{" "}
                  <Link to="/terms-and-conditions" className="text-primary hover:underline">Terms & Conditions</Link>, and{" "}
                  <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                </Label>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card variant="elevated" className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => {
                      const imageUrl = item.product.product_images?.[0]?.image_url || "/placeholder.svg";
                      return (
                        <div key={item.product.id} className="flex gap-3">
                          <img
                            src={imageUrl}
                            alt={item.product.title}
                            className="h-16 w-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-1">{item.product.title}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-bold">₹{item.product.sale_price * item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total */}
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold">₹{total}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!acceptTerms || (!selectedAddress && !formData.address)}
                  >
                    Proceed to Payment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
