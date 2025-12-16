import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, Link as LinkIcon, ArrowRight, FileImage, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCartStore } from "@/store/store";
import { useSubmitPayment } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const clearCart = useCartStore((state) => state.clearCart);
  const submitPayment = useSubmitPayment();
  
  const [transactionId, setTransactionId] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get orderId from location state (passed from checkout)
  const orderId = location.state?.orderId;

  if (!orderId) {
    return (
      <div className="min-h-screen bg-muted/20 py-8">
        <div className="container max-w-xl text-center">
          <Card variant="elevated" className="p-8">
            <h2 className="text-xl font-bold mb-4">No Order Found</h2>
            <p className="text-muted-foreground mb-4">Please complete checkout first.</p>
            <Button onClick={() => navigate("/cart")}>Go to Cart</Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId) {
      toast.error("Please enter the transaction ID");
      return;
    }

    if (!selectedFile && !driveLink) {
      toast.error("Please upload a screenshot or provide a Google Drive link");
      return;
    }

    setIsUploading(true);

    try {
      let screenshotUrl: string | undefined;

      // Upload screenshot if selected
      if (selectedFile && user) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}/${orderId}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-screenshots')
          .upload(fileName, selectedFile);

        if (uploadError) {
          throw new Error("Failed to upload screenshot");
        }

        const { data: urlData } = supabase.storage
          .from('payment-screenshots')
          .getPublicUrl(fileName);

        screenshotUrl = urlData.publicUrl;
      }

      // Submit payment
      await submitPayment.mutateAsync({
        orderId,
        transactionId,
        screenshotUrl,
        driveLink: driveLink || undefined,
      });

      clearCart();
      navigate(`/order/receipt/${orderId}`);
    } catch (error) {
      console.error("Payment submission error:", error);
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container max-w-xl">
        <Card variant="elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Confirm Your Payment</CardTitle>
            <CardDescription>
              Please provide the payment details for verification
            </CardDescription>
            <p className="text-sm font-mono text-primary mt-2">Order: {orderId}</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction ID */}
              <div>
                <Label htmlFor="transactionId">Transaction ID / UPI Reference</Label>
                <Input
                  id="transactionId"
                  placeholder="e.g., 123456789012"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter the UPI reference number from your payment app
                </p>
              </div>

              {/* Screenshot Upload */}
              <div>
                <Label>Payment Screenshot</Label>
                <div className="mt-2">
                  <label
                    htmlFor="screenshot"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50 hover:bg-muted/50"
                  >
                    {selectedFile ? (
                      <div className="text-center">
                        <FileImage className="mx-auto h-12 w-12 text-primary" />
                        <p className="mt-2 font-medium text-foreground">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 font-medium text-foreground">Upload Screenshot</p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-4 text-sm text-muted-foreground">OR</span>
                </div>
              </div>

              {/* Google Drive Link */}
              <div>
                <Label htmlFor="driveLink">Google Drive Link</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="driveLink"
                    placeholder="https://drive.google.com/..."
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Paste a Google Drive link to your payment screenshot
                </p>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" size="lg" disabled={isUploading || submitPayment.isPending}>
                {isUploading || submitPayment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit & View Receipt
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}