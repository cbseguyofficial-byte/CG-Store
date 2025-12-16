import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaticPage } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function useStaticPage(slug: string) {
  return useQuery({
    queryKey: ["static-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("static_pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as StaticPage | null;
    },
    enabled: !!slug,
  });
}

export function useStaticPages() {
  return useQuery({
    queryKey: ["static-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("static_pages")
        .select("*")
        .order("slug");

      if (error) {
        throw error;
      }

      return data as StaticPage[];
    },
  });
}

export function useUpdateStaticPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, title, content }: { slug: string; title: string; content: string }) => {
      const { data, error } = await supabase
        .from("static_pages")
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq("slug", slug)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log audit
      if (user) {
        await supabase.from("audit_logs").insert({
          admin_user_id: user.id,
          action: "UPDATE_PAGE",
          entity_type: "PAGE",
          entity_id: slug,
          details: { title },
        });
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["static-pages"] });
      queryClient.invalidateQueries({ queryKey: ["static-page", data.slug] });
      toast.success("Page updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update page: ${error.message}`);
    },
  });
}
