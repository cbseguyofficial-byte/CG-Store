import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuditLog } from "@/lib/types";

interface AuditLogFilters {
  action?: string;
  entity_type?: string;
  limit?: number;
}

export function useAuditLogs(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: async () => {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.action) {
        query = query.eq("action", filters.action);
      }

      if (filters?.entity_type) {
        query = query.eq("entity_type", filters.entity_type);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      } else {
        query = query.limit(100);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as AuditLog[];
    },
  });
}
