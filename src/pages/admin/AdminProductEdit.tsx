import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    price: "",
    mrp: "",
    class: "",
    subject: "",
    board: "CBSE",
    format: "",
    tags: "",
    badges: "",
    inStock: true,
    stockCount: "100",
    status: "",
    adminNote: "",
  });

  const [images, setImages] = useState<string[]>([]);

  /* ---------------- LOAD PRODUCT IF EDIT ---------------- */

  useEffect(() => {
    if (!isNew && id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Failed to load product");
      setLoading(false);
      return;
    }

    setFormData({
      title: data.title || "",
      subtitle: data.subtitle || "",
      description: data.description || "",
      price: data.sale_price?.toString() || "",
      mrp: data.mrp?.toString() || "",
      class: data.class || "",
      subject: data.subject || "",
      board: data.board || "CBSE",
      format: data.format || "",
      tags: data.tags?.join(", ") || "",
      badges: data.badges?.join(", ") || "",
      inStock: data.stock_count > 0,
      stockCount: data.stock_count?.toString() || "0",
      status: data.status || "",
      adminNote: "",
    });

    setLoading(false);
  };

  /* ---------------- SAVE PRODUCT ---------------- */

  const handleSave = async () => {
    if (!formData.title || !formData.price || !formData.mrp) {
      toast.error("Please fill required fields");
      return;
    }

    const slug = formData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

const payload = {
  slug,
  title: formData.title,
  subtitle: formData.subtitle,
  description: formData.description,
  mrp: Number(formData.mrp),
  sale_price: Number(formData.price),
  class: formData.class,
  subject: formData.subject,
  board: formData.board,

  // 🔥 FIX ENUMS HERE
  format: formData.format.toUpperCase(), 
  status: formData.status.toUpperCase(),

  tags: formData.tags
    ? formData.tags.split(",").map((t) => t.trim())
    : [],
  badges: formData.badges
    ? formData.badges.split(",").map((b) => b.trim())
    : [],
  stock_count: formData.inStock ? Number(formData.stockCount) : 0,
  updated_at: new Date().toISOString(),
};
    setLoading(true);

    if (isNew) {
      const { error } = await supabase.from("products").insert(payload);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Product created successfully");
    } else {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id);

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Product updated successfully");
    }

    setLoading(false);
    navigate("/admin/products");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/products">
          <Button variant="ghost" size="icon" className="text-frosted-blue hover:text-light-cyan">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-light-cyan">
            {isNew ? "Add New Product" : "Edit Product"}
          </h1>
          <p className="text-frosted-blue">Fill in the product details</p>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={loading}>
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Product"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-frosted-blue">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="NCERT Physics Class 12"
                  className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-frosted-blue">Subtitle</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Complete Solutions with Diagrams"
                  className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-frosted-blue">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed product description..."
                  rows={4}
                  className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-frosted-blue">MRP (₹)</Label>
                  <Input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="499"
                    className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Sale Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="299"
                    className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classification */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Classification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Class</Label>
                  <Select value={formData.class} onValueChange={(v) => setFormData({ ...formData, class: v })}>
                    <SelectTrigger className="bg-deep-twilight/50 border-primary/20 text-light-cyan">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {["8", "9", "10", "11", "12", "11-12"].map((c) => (
                        <SelectItem key={c} value={c}>Class {c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Subject</Label>
                  <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                    <SelectTrigger className="bg-deep-twilight/50 border-primary/20 text-light-cyan">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Physics", "Chemistry", "Mathematics", "Biology", "English", "Hindi", "Social Science", "Computer Science"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Board</Label>
                  <Select value={formData.board} onValueChange={(v) => setFormData({ ...formData, board: v })}>
                    <SelectTrigger className="bg-deep-twilight/50 border-primary/20 text-light-cyan">
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                      <SelectItem value="State Board">State Board</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Format</Label>
                  <Select value={formData.format} onValueChange={(v) => setFormData({ ...formData, format: v })}>
                    <SelectTrigger className="bg-deep-twilight/50 border-primary/20 text-light-cyan">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="PHYSICAL">Physical</SelectItem>
                      <SelectItem value="COMBO">Combo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Tags (comma separated)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="NCERT, Board Exam, JEE"
                    className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Badges</Label>
                  <Input
                    value={formData.badges}
                    onChange={(e) => setFormData({ ...formData, badges: e.target.value })}
                    placeholder="Best Seller, New 2025"
                    className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center">
                <Upload className="h-12 w-12 text-frosted-blue mx-auto mb-4" />
                <p className="text-frosted-blue mb-2">Drag and drop images here</p>
                <Button variant="outline" className="border-primary/30 text-light-cyan">
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-frosted-blue">Product Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="bg-deep-twilight/50 border-primary/20 text-light-cyan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="UNLISTED">Unlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-frosted-blue">In Stock</Label>
                <Switch
                  checked={formData.inStock}
                  onCheckedChange={(c) => setFormData({ ...formData, inStock: c })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-frosted-blue">Stock Count</Label>
                <Input
                  type="number"
                  value={formData.stockCount}
                  onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                  className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                />
              </div>
            </CardContent>
          </Card>

          {/* Digital File */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Digital File</CardTitle>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger className="bg-deep-twilight/50 border-primary/20 text-light-cyan">
                  <SelectValue placeholder="Select from library" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file1">physics_class12_v1.pdf</SelectItem>
                  <SelectItem value="file2">chemistry_guide.pdf</SelectItem>
                  <SelectItem value="file3">math_formulas.pdf</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Admin Note */}
          <Card className="bg-french-blue/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-light-cyan">Admin Note</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.adminNote}
                onChange={(e) => setFormData({ ...formData, adminNote: e.target.value })}
                placeholder="Internal notes about this product..."
                rows={4}
                className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProductEdit;
