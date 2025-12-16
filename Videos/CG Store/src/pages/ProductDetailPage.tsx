import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star, Truck, Shield, Download, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import { useCartStore, useWishlistStore } from "@/store/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/shop/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const faqs = [
  {
    question: "Is this book printable?",
    answer: "PDFs are protected and not printable. However, you can read them on any device with our PDF viewer.",
  },
  {
    question: "When will I get access?",
    answer: "After your payment is verified (usually within 2-4 hours), you'll receive the download link via email.",
  },
  {
    question: "Can I get a refund?",
    answer: "Due to the digital nature of our products, we don't offer refunds. Please preview the table of contents before purchase.",
  },
  {
    question: "Is the content updated for 2025?",
    answer: "Yes! All our books are updated according to the latest CBSE syllabus for the 2024-25 academic year.",
  },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id || "");
  const { data: relatedProducts } = useRelatedProducts(
    product?.id || "",
    product?.class || "",
    product?.subject || ""
  );
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 pb-16">
        <div className="border-b border-border/40 bg-card">
          <div className="container py-4">
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-[3/4] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/shop">
          <Button className="mt-4">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const images = product.product_images?.map((img) => img.image_url) || [];
  const discount = product.mrp - product.sale_price;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity} x ${product.title} added to cart!`);
  };

  const handleToggleWishlist = () => {
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

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      {/* Breadcrumb */}
      <div className="border-b border-border/40 bg-card">
        <div className="container py-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card variant="default" className="overflow-hidden">
              <div className="aspect-[3/4] relative">
                <img
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {product.badges?.map((badge) => (
                    <Badge key={badge} variant={getBadgeVariant(badge)}>
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
            
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "h-20 w-16 overflow-hidden rounded-xl border-2 transition-all",
                      selectedImage === index
                        ? "border-primary shadow-card"
                        : "border-transparent hover:border-border"
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline">Class {product.class}</Badge>
                <Badge variant="outline">{product.subject}</Badge>
                <Badge variant="outline">{product.board}</Badge>
              </div>
              
              <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
                {product.title}
              </h1>
              <p className="text-muted-foreground">{product.subtitle}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-foreground">₹{product.sale_price}</span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.mrp}</span>
                  <Badge variant="success">Save ₹{discount}</Badge>
                </>
              )}
            </div>

            {/* Format */}
            <div>
              <h4 className="mb-3 font-semibold text-foreground">Format</h4>
              <div className="flex gap-3">
                <button className={cn(
                  "flex items-center gap-2 rounded-xl border-2 px-4 py-3 transition-all",
                  product.format === "PDF" ? "border-primary bg-primary/5" : "border-border"
                )}>
                  <Download className="h-5 w-5" />
                  <span>PDF</span>
                </button>
                <button className={cn(
                  "flex items-center gap-2 rounded-xl border-2 px-4 py-3 transition-all",
                  product.format === "PHYSICAL" ? "border-primary bg-primary/5" : "border-border"
                )}>
                  <Truck className="h-5 w-5" />
                  <span>Hardcopy</span>
                </button>
                <button className={cn(
                  "flex items-center gap-2 rounded-xl border-2 px-4 py-3 transition-all",
                  product.format === "COMBO" ? "border-primary bg-primary/5" : "border-border"
                )}>
                  <Shield className="h-5 w-5" />
                  <span>Combo</span>
                </button>
              </div>
            </div>

            {/* Stock */}
            <div>
              {product.stock_count !== null && product.stock_count > 0 ? (
                <p className="text-sm text-emerald-600 font-medium">
                  ✓ In stock ({product.stock_count} available)
                </p>
              ) : product.format === "PDF" ? (
                <p className="text-sm text-emerald-600 font-medium">
                  ✓ Digital product - Always available
                </p>
              ) : (
                <p className="text-sm text-destructive font-medium">Out of stock</p>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center rounded-xl border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-12 w-12 items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-12 w-12 items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button size="lg" onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                variant={isWishlisted ? "secondary" : "outline"}
                size="lg"
                onClick={handleToggleWishlist}
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-current text-red-500")} />
              </Button>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="glass">{tag}</Badge>
                ))}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div>
                <h4 className="mb-3 font-semibold text-foreground">Description</h4>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Curator's Note */}
            <Card variant="gradient">
              <CardContent className="p-4">
                <h4 className="mb-2 font-semibold text-foreground">📝 Curator's Note</h4>
                <p className="text-sm text-muted-foreground">
                  This book has been specially curated by our team of subject experts and top scorers. 
                  It covers the complete syllabus with detailed explanations and is perfect for both 
                  board exams and competitive preparation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Card key={index} variant="default">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-foreground">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="border-t border-border px-4 py-3">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Related Books</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}