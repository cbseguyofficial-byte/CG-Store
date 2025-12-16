import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

export function useStaticPages() {
  return useQuery({
    queryKey: ["static-pages"],
    queryFn: async (): Promise<StaticPage[]> => {
      const { data, error } = await supabase
        .from("static_pages")
        .select("*")
        .order("slug");

      if (error) throw error;
      return data || [];
    },
  });
}

export function useStaticPage(slug: string) {
  return useQuery({
    queryKey: ["static-page", slug],
    queryFn: async (): Promise<StaticPage | null> => {
      const { data, error } = await supabase
        .from("static_pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useUpdateStaticPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, content, title }: { slug: string; content: string; title?: string }) => {
      // Check if page exists
      const { data: existing } = await supabase
        .from("static_pages")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("static_pages")
          .update({ content, title: title || slug, updated_at: new Date().toISOString() })
          .eq("slug", slug);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("static_pages")
          .insert({ slug, content, title: title || slug });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["static-pages"] });
      queryClient.invalidateQueries({ queryKey: ["static-page"] });
      toast.success("Content saved successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to save content: ${error.message}`);
    },
  });
}
