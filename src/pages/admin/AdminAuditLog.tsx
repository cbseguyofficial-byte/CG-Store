import { ClipboardList, User, Package, Ticket, Settings, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const logs = [
  { id: "1", timestamp: "Dec 7, 2024 10:45 AM", admin: "Admin", action: "Order Status", description: "Changed order ORD-2024-004 status from Pending to Confirmed", icon: Package },
  { id: "2", timestamp: "Dec 7, 2024 10:30 AM", admin: "Admin", action: "Product Update", description: "Updated price for 'NCERT Physics Class 12' from ₹349 to ₹299", icon: FileText },
  { id: "3", timestamp: "Dec 7, 2024 09:15 AM", admin: "Admin", action: "Coupon Created", description: "Created new coupon 'WINTER25' with 25% discount", icon: Ticket },
  { id: "4", timestamp: "Dec 6, 2024 04:30 PM", admin: "Admin", action: "User Deactivated", description: "Deactivated user account: neha@email.com", icon: User },
  { id: "5", timestamp: "Dec 6, 2024 02:00 PM", admin: "Admin", action: "Settings Updated", description: "Updated UPI ID in payment settings", icon: Settings },
  { id: "6", timestamp: "Dec 6, 2024 11:45 AM", admin: "Admin", action: "Product Created", description: "Created new product 'Hindi Class 10 Complete'", icon: FileText },
  { id: "7", timestamp: "Dec 5, 2024 03:20 PM", admin: "Admin", action: "Order Rejected", description: "Rejected order ORD-2024-006 - Payment not received", icon: Package },
  { id: "8", timestamp: "Dec 5, 2024 10:00 AM", admin: "Admin", action: "Coupon Disabled", description: "Disabled coupon 'FLASH50' after reaching max uses", icon: Ticket },
];

const getActionColor = (action: string) => {
  if (action.includes("Created") || action.includes("Updated")) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (action.includes("Deleted") || action.includes("Rejected") || action.includes("Deactivated") || action.includes("Disabled")) return "bg-red-500/20 text-red-400 border-red-500/30";
  return "bg-primary/20 text-turquoise-surf border-primary/30";
};

const AdminAuditLog = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-light-cyan">Audit Log</h1>
        <p className="text-frosted-blue">Track admin activity and changes</p>
      </div>

      <Card className="bg-french-blue/50 border-primary/20">
        <CardHeader>
          <CardTitle className="text-light-cyan flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-primary/10">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-deep-twilight/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-deep-twilight/50">
                    <log.icon className="h-5 w-5 text-turquoise-surf" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <span className="text-xs text-frosted-blue">by {log.admin}</span>
                    </div>
                    <p className="text-sm text-light-cyan">{log.description}</p>
                    <p className="text-xs text-frosted-blue mt-1">{log.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditLog;
