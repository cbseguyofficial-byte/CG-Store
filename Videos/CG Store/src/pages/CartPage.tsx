import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/store";
import { toast } from "sonner";
import { useValidateCoupon } from "@/hooks/useOrders";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  
  const validateCoupon = useValidateCoupon();

  const subtotal = getTotal();
  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    const result = await validateCoupon.mutateAsync({
      couponCode: couponCode.trim(),
      subtotal,
    });
    
    if (result.coupon_valid) {
      setDiscount(result.discount);
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success(result.coupon_message || "Coupon applied!");
    } else {
      toast.error(result.coupon_message || "Invalid coupon code");
    }
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    toast.info("Coupon removed");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">Add some books to get started!</p>
          <Link to="/shop">
            <Button size="lg">
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const imageUrl = item.product.product_images?.[0]?.image_url || "/placeholder.svg";
              return (
                <Card key={item.product.id} variant="default">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Link to={`/product/${item.product.slug || item.product.id}`} className="shrink-0">
                        <img
                          src={imageUrl}
                          alt={item.product.title}
                          className="h-32 w-24 rounded-xl object-cover"
                        />
                      </Link>
                      
                      <div className="flex-1">
                        <Link to={`/product/${item.product.slug || item.product.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Class {item.product.class} • {item.product.subject} • {item.format}
                        </p>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-border">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="flex h-9 w-9 items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="flex h-9 w-9 items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold text-foreground">
                                ₹{item.product.sale_price * item.quantity}
                              </p>
                              {item.product.mrp > item.product.sale_price && (
                                <p className="text-sm text-muted-foreground line-through">
                                  ₹{item.product.mrp * item.quantity}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                removeItem(item.product.id);
                                toast.info("Item removed from cart");
                              }}
                            >
                              <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <Card variant="elevated" className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Coupon Code
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-emerald-600">{appliedCoupon}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleApplyCoupon}
                        disabled={validateCoupon.isPending}
                      >
                        {validateCoupon.isPending ? "..." : "Apply"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-foreground">₹{total}</span>
                  </div>
                </div>

                {/* Actions */}
                <Link to="/checkout">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link to="/shop" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
