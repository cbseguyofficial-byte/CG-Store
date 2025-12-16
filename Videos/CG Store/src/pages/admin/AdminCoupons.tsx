import { useState } from "react";
import { Plus, Edit, Trash2, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAdminCoupons, useCreateCoupon, useToggleCouponStatus, useDeleteCoupon } from "@/hooks/useCoupons";
import { useAuth } from "@/contexts/AuthContext";

const AdminCoupons = () => {
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENT" as "PERCENT" | "FLAT",
    value: "",
    minCart: "",
    maxDiscount: "",
    maxUses: "",
    startDate: "",
    endDate: "",
    active: true,
  });

  const { data: coupons, isLoading, error } = useAdminCoupons();
  const createCoupon = useCreateCoupon();
  const toggleStatus = useToggleCouponStatus();
  const deleteCoupon = useDeleteCoupon();

  const handleSave = () => {
    if (!user) return;
    
    createCoupon.mutate({
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: Number(formData.value),
      min_cart_value: formData.minCart ? Number(formData.minCart) : null,
      max_discount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      usage_limit_total: formData.maxUses ? Number(formData.maxUses) : null,
      starts_at: formData.startDate || null,
      expires_at: formData.endDate || null,
      is_active: formData.active,
    }, {
      onSuccess: () => {
        setShowDialog(false);
        setFormData({
          code: "",
          type: "PERCENT",
          value: "",
          minCart: "",
          maxDiscount: "",
          maxUses: "",
          startDate: "",
          endDate: "",
          active: true,
        });
      },
    });
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    if (!user) return;
    toggleStatus.mutate({ id, isActive: !currentStatus });
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    if (confirm("Are you sure you want to delete this coupon?")) {
      deleteCoupon.mutate(id);
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
        <p className="text-destructive">Failed to load coupons: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-cyan">Coupons</h1>
          <p className="text-frosted-blue">Manage discount codes ({coupons?.length || 0} total)</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-french-blue border-primary/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-light-cyan">Create Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-frosted-blue">Coupon Code</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="DISCOUNT20"
                  className="bg-deep-twilight/50 border-primary/20 text-light-cyan font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v) => setFormData({ ...formData, type: v as "PERCENT" | "FLAT" })}
                  >
                    <SelectTrigger className="bg-deep-twilight/50 border-primary/20 text-light-cyan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENT">Percentage</SelectItem>
                      <SelectItem value="FLAT">Flat Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Value</Label>
                  <Input
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === "PERCENT" ? "20" : "50"}
                    className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Min Cart Value (₹)</Label>
                  <Input
                    value={formData.minCart}
                    onChange={(e) => setFormData({ ...formData, minCart: e.target.value })}
                    placeholder="299"
                    className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Max Discount (₹)</Label>
                  <Input
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="100"
                    className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-frosted-blue">Max Uses (0 = unlimited)</Label>
                <Input
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="100"
                  className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-frosted-blue">Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-frosted-blue">End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-frosted-blue">Active</Label>
                <Switch
                  checked={formData.active}
                  onCheckedChange={(c) => setFormData({ ...formData, active: c })}
                />
              </div>
              <Button 
                onClick={handleSave} 
                className="w-full"
                disabled={createCoupon.isPending || !formData.code || !formData.value}
              >
                {createCoupon.isPending ? "Creating..." : "Create Coupon"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Coupons Table */}
      <Card className="bg-french-blue/50 border-primary/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Code</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden md:table-cell">Min Cart</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden sm:table-cell">Validity</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons && coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-primary/10 hover:bg-deep-twilight/30 transition-colors">
                      <td className="py-4 px-4">
                        <code className="text-turquoise-surf font-mono font-bold">{coupon.code}</code>
                        {coupon.is_referral_code && (
                          <Badge variant="outline" className="ml-2 text-xs">Referral</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="text-sky-aqua border-sky-aqua/30">
                          {coupon.type}: {coupon.type === "PERCENT" ? `${coupon.value}%` : `₹${coupon.value}`}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-frosted-blue hidden md:table-cell">
                        {coupon.min_cart_value ? `₹${coupon.min_cart_value}` : "None"}
                      </td>
                      <td className="py-4 px-4 text-frosted-blue text-sm hidden sm:table-cell">
                        {coupon.expires_at 
                          ? new Date(coupon.expires_at).toLocaleDateString() 
                          : "Unlimited"}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={coupon.is_active ? "default" : "secondary"}>
                          {coupon.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-frosted-blue hover:text-light-cyan"
                            onClick={() => handleToggleStatus(coupon.id, coupon.is_active)}
                          >
                            {coupon.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-frosted-blue hover:text-destructive"
                            onClick={() => handleDelete(coupon.id)}
                            disabled={coupon.is_referral_code}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-frosted-blue">
                      No coupons found
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

export default AdminCoupons;