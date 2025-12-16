import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Copy, EyeOff, Eye, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminProducts, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { toast } from "sonner";

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading, error } = useAdminProducts({ search: searchQuery || undefined });
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleDuplicate = (id: string) => {
    toast.info("Duplicate feature coming soon");
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "UNLISTED" : "PUBLISHED";
    updateProduct.mutate({ id, updates: { status: newStatus as any } });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-turquoise-surf" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-cyan">Products</h1>
          <p className="text-frosted-blue">Manage your product catalog ({products?.length || 0} total)</p>
        </div>
        <Link to="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-frosted-blue" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-french-blue/50 border-primary/20 text-light-cyan placeholder:text-frosted-blue"
        />
      </div>

      {/* Products Table */}
      <Card className="bg-french-blue/50 border-primary/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Product</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden md:table-cell">Price</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden lg:table-cell">Format</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="border-b border-primary/10 hover:bg-deep-twilight/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-10 rounded-lg bg-deep-twilight/50 overflow-hidden">
                            {product.product_images?.[0]?.image_url ? (
                              <img 
                                src={product.product_images[0].image_url} 
                                alt={product.title} 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-light-cyan text-sm">{product.title}</p>
                            <p className="text-xs text-frosted-blue">Class {product.class} • {product.subject}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <p className="font-medium text-light-cyan">₹{product.sale_price}</p>
                        <p className="text-xs text-frosted-blue line-through">₹{product.mrp}</p>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <Badge variant="outline" className="text-turquoise-surf border-turquoise-surf/30">
                          {product.format}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={product.status === "PUBLISHED" ? "default" : "secondary"}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Link to={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-frosted-blue hover:text-light-cyan">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-frosted-blue hover:text-light-cyan"
                            onClick={() => handleDuplicate(product.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-frosted-blue hover:text-light-cyan"
                            onClick={() => handleToggleStatus(product.id, product.status)}
                          >
                            {product.status === "PUBLISHED" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-frosted-blue hover:text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-frosted-blue">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;