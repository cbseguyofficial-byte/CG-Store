import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishlistStore, useCartStore } from "@/store/store";
import { toast } from "sonner";

const WishlistPage = () => {
  const { items: wishlistProducts, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (product: typeof wishlistProducts[0]) => {
    addItem(product, 1);
    removeItem(product.id);
    toast.success("Moved to cart!");
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
    toast.success("Removed from wishlist");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">{wishlistProducts.length} items saved</p>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {wishlistProducts.map((product) => {
            const imageUrl = product.product_images?.[0]?.image_url || "/placeholder.svg";
            return (
              <Card key={product.id} variant="glass" className="hover:shadow-card-hover transition-all overflow-hidden">
                <div className="aspect-[4/3] bg-muted/50 relative">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {product.badges && product.badges.length > 0 && (
                    <Badge 
                      variant={product.badges[0] === "Best Seller" ? "bestseller" : product.badges[0].includes("New") ? "new" : "limited"} 
                      className="absolute top-2 left-2"
                    >
                      {product.badges[0]}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <Link to={`/product/${product.slug || product.id}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 min-h-[48px]">
                      {product.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-primary">₹{product.sale_price}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Badge variant="outline">Class {product.class}</Badge>
                    <Badge variant="secondary">{product.format}</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 gap-2" 
                      onClick={() => handleMoveToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Move to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleRemove(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card variant="glass">
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your Wishlist is Empty</h3>
            <p className="text-muted-foreground mb-4">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Button asChild>
              <Link to="/shop">Browse Books</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WishlistPage;
