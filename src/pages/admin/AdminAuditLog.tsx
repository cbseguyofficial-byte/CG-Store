import { useEffect, useState } from "react";
import {
  ClipboardList,
  User,
  Package,
  Ticket,
  Settings,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const getActionColor = (action: string) => {
  if (action.includes("Created") || action.includes("Updated"))
    return "bg-green-500/20 text-green-400 border-green-500/30";
  if (
    action.includes("Deleted") ||
    action.includes("Rejected") ||
    action.includes("Deactivated") ||
    action.includes("Disabled")
  )
    return "bg-red-500/20 text-red-400 border-red-500/30";
  return "bg-primary/20 text-turquoise-surf border-primary/30";
};

const getIcon = (entityType: string) => {
  switch (entityType) {
    case "order":
      return Package;
    case "product":
      return FileText;
    case "coupon":
      return Ticket;
    case "user":
      return User;
    case "settings":
      return Settings;
    default:
      return ClipboardList;
  }
};

const AdminAuditLog = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("audit_logs")
      .select(
        `
        *,
        profiles:admin_user_id (
          full_name,
          email
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setLogs(data);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-light-cyan">Audit Log</h1>
        <p className="text-frosted-blue">
          Track admin activity and changes
        </p>
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
            {logs.map((log) => {
              const Icon = getIcon(log.entity_type);
              const timestamp = new Date(
                log.created_at
              ).toLocaleString();

              const adminName =
                log.profiles?.full_name ||
                log.profiles?.email ||
                "Admin";

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-deep-twilight/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-deep-twilight/50">
                      <Icon className="h-5 w-5 text-turquoise-surf" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={getActionColor(log.action)}
                        >
                          {log.action}
                        </Badge>

                        <span className="text-xs text-frosted-blue">
                          by {adminName}
                        </span>
                      </div>

                      <p className="text-sm text-light-cyan">
                        {log.details?.description ||
                          `${log.action} on ${log.entity_type}`}
                      </p>

                      <p className="text-xs text-frosted-blue mt-1">
                        {timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {logs.length === 0 && (
              <div className="p-6 text-center text-frosted-blue">
                No activity yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditLog;