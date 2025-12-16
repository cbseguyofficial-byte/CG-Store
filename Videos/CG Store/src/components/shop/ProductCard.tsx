import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductWithImages } from "@/lib/types";
import { useCartStore, useWishlistStore } from "@/store/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ProductWithImages;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist!");
    }
  };

  const getBadgeVariant = (badge: string) => {
    if (badge.toLowerCase().includes("best")) return "bestseller";
    if (badge.toLowerCase().includes("new")) return "new";
    if (badge.toLowerCase().includes("limit")) return "limited";
    return "secondary";
  };

  const discount = product.mrp > 0 ? Math.round(((product.mrp - product.sale_price) / product.mrp) * 100) : 0;
  const imageUrl = product.product_images?.[0]?.image_url || "/placeholder.svg";

  return (
    <Link to={`/product/${product.slug || product.id}`}>
      <Card
        variant="interactive"
        className={cn(
          "group overflow-hidden animate-fade-in",
          `stagger-${Math.min(index + 1, 5)}`
        )}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.badges?.map((badge) => (
              <Badge key={badge} variant={getBadgeVariant(badge)}>
                {badge}
              </Badge>
            ))}
            {discount > 0 && (
              <Badge variant="success">-{discount}%</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={cn(
              "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-md transition-all hover:scale-110",
              isWishlisted && "bg-red-50 text-red-500"
            )}
          >
            <Heart
              className={cn("h-5 w-5", isWishlisted && "fill-current")}
            />
          </button>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button
              onClick={handleAddToCart}
              className="w-full shadow-lg"
              size="sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-1 flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              Class {product.class}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.format}
            </Badge>
          </div>
          
          <h3 className="mb-1 font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          <p className="mb-2 text-xs text-muted-foreground line-clamp-1">
            {product.subject} • {product.board}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              ₹{product.sale_price}
            </span>
            {product.mrp > product.sale_price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
