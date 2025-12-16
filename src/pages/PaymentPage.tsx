import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/store";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { getTotal } = useCartStore();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canContinue, setCanContinue] = useState(false);

  const total = getTotal();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Enable continue button after 30 seconds
    const enableTimer = setTimeout(() => {
      setCanContinue(true);
    }, 30000);

    return () => {
      clearInterval(timer);
      clearTimeout(enableTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleContinue = () => {
    navigate("/payment/confirm");
  };

  // Demo: enable button after 3 seconds for testing
  useEffect(() => {
    const quickEnable = setTimeout(() => {
      setCanContinue(true);
    }, 3000);
    return () => clearTimeout(quickEnable);
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container max-w-xl">
        <Card variant="elevated">
          <CardHeader className="text-center">
            <Badge variant="accent" className="mx-auto mb-4">
              <Clock className="mr-1 h-3 w-3" />
              Complete within {formatTime(timeLeft)}
            </Badge>
            <CardTitle className="text-2xl">Pay via UPI</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Amount */}
            <div className="text-center">
              <p className="text-muted-foreground">Amount to Pay</p>
              <p className="text-4xl font-bold text-foreground">₹{total}</p>
            </div>

            {/* QR Code */}
            <Card variant="gradient" className="p-8">
              <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-2xl bg-card border-2 border-dashed border-border">
                <div className="text-center">
                  <QrCode className="mx-auto h-32 w-32 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">QR Code</p>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <div className="rounded-xl bg-muted/50 p-4">
              <h4 className="mb-3 font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Payment Instructions
              </h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">1.</span>
                  Open any UPI app (GPay, PhonePe, Paytm, etc.)
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">2.</span>
                  Scan the QR code above
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">3.</span>
                  Enter the exact amount: ₹{total}
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">4.</span>
                  Complete the payment within 5 minutes
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">5.</span>
                  Click "Continue" after successful payment
                </li>
              </ol>
            </div>

            {/* Timer Warning */}
            {timeLeft < 60 && timeLeft > 0 && (
              <div className="rounded-xl bg-destructive/10 p-4 text-center">
                <p className="text-sm font-medium text-destructive">
                  ⚠️ Less than a minute remaining!
                </p>
              </div>
            )}

            {timeLeft === 0 && (
              <div className="rounded-xl bg-destructive/10 p-4 text-center">
                <p className="text-sm font-medium text-destructive">
                  ⏰ Time expired! Please restart the checkout process.
                </p>
              </div>
            )}

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={!canContinue || timeLeft === 0}
              className="w-full"
              size="lg"
            >
              {canContinue ? (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                "Please wait..."
              )}
            </Button>

            {!canContinue && (
              <p className="text-center text-xs text-muted-foreground">
                Button will be enabled in a few seconds after initiating payment
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
