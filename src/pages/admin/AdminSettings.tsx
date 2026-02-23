import { useState } from "react";
import { Save, CreditCard, Upload, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    upiId: "cbseguy@upi",
    paymentInstructions: "1. Scan the QR code above using any UPI app\n2. Enter the exact amount shown\n3. Complete the payment within 5 minutes\n4. Note down the transaction ID",
    siteName: "CBSE GUY",
    supportEmail: "support@cbseguy.com",
    supportPhone: "+91 98765 43210",
  });

  const handleSave = () => {
    toast.success("Settings saved (demo)");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-light-cyan">Settings</h1>
          <p className="text-frosted-blue">Configure store settings</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Settings */}
        <Card className="bg-french-blue/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-light-cyan flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-frosted-blue">UPI ID</Label>
              <Input
                value={settings.upiId}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                placeholder="yourname@upi"
                className="bg-deep-twilight/50 border-primary/20 text-light-cyan font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-frosted-blue">QR Code</Label>
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center">
                <Upload className="h-8 w-8 text-frosted-blue mx-auto mb-2" />
                <p className="text-sm text-frosted-blue mb-2">Upload QR Code Image</p>
                <Button variant="outline" size="sm" className="border-primary/30 text-light-cyan">
                  Browse
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-frosted-blue">Payment Instructions</Label>
              <Textarea
                value={settings.paymentInstructions}
                onChange={(e) => setSettings({ ...settings, paymentInstructions: e.target.value })}
                rows={5}
                className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
              />
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card className="bg-french-blue/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-light-cyan flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-frosted-blue">Site Name</Label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-frosted-blue">Logo</Label>
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center">
                <Upload className="h-8 w-8 text-frosted-blue mx-auto mb-2" />
                <p className="text-sm text-frosted-blue mb-2">Upload Logo Image</p>
                <Button variant="outline" size="sm" className="border-primary/30 text-light-cyan">
                  Browse
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-frosted-blue">Support Email</Label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-frosted-blue">Support Phone</Label>
              <Input
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="bg-deep-twilight/50 border-primary/20 text-light-cyan"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
