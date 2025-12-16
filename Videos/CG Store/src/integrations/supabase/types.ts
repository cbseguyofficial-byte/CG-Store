export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          city: string
          created_at: string
          id: string
          is_default: boolean
          label: string
          name: string
          phone: string
          pincode: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line: string
          city: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          name: string
          phone: string
          pincode: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line?: string
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          name?: string
          phone?: string
          pincode?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          is_referral_code: boolean
          max_discount: number | null
          min_cart_value: number | null
          owner_user_id: string | null
          starts_at: string | null
          type: Database["public"]["Enums"]["coupon_type"]
          updated_at: string
          usage_limit_per_user: number | null
          usage_limit_total: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_referral_code?: boolean
          max_discount?: number | null
          min_cart_value?: number | null
          owner_user_id?: string | null
          starts_at?: string | null
          type?: Database["public"]["Enums"]["coupon_type"]
          updated_at?: string
          usage_limit_per_user?: number | null
          usage_limit_total?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_referral_code?: boolean
          max_discount?: number | null
          min_cart_value?: number | null
          owner_user_id?: string | null
          starts_at?: string | null
          type?: Database["public"]["Enums"]["coupon_type"]
          updated_at?: string
          usage_limit_per_user?: number | null
          usage_limit_total?: number | null
          value?: number
        }
        Relationships: []
      }
      digital_files: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          format_snapshot: string
          id: string
          line_total: number
          order_id: string
          price_snapshot: number
          product_id: string | null
          quantity: number
          title_snapshot: string
        }
        Insert: {
          created_at?: string
          format_snapshot: string
          id?: string
          line_total: number
          order_id: string
          price_snapshot: number
          product_id?: string | null
          quantity?: number
          title_snapshot: string
        }
        Update: {
          created_at?: string
          format_snapshot?: string
          id?: string
          line_total?: number
          order_id?: string
          price_snapshot?: number
          product_id?: string | null
          quantity?: number
          title_snapshot?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_snapshot: Json
          admin_note: string | null
          coupon_code: string | null
          created_at: string
          discount_amount: number
          final_amount: number
          id: string
          notes: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          referral_code: string | null
          referral_record_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address_snapshot: Json
          admin_note?: string | null
          coupon_code?: string | null
          created_at?: string
          discount_amount?: number
          final_amount: number
          id: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          referral_code?: string | null
          referral_record_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address_snapshot?: Json
          admin_note?: string | null
          coupon_code?: string | null
          created_at?: string
          discount_amount?: number
          final_amount?: number
          id?: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          referral_code?: string | null
          referral_record_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_referral_record_id_fkey"
            columns: ["referral_record_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          drive_link: string | null
          id: string
          order_id: string
          payment_screenshot_url: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["payment_submission_status"]
          submitted_at: string
          transaction_id: string
          verified_at: string | null
          verified_by_admin_id: string | null
        }
        Insert: {
          drive_link?: string | null
          id?: string
          order_id: string
          payment_screenshot_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["payment_submission_status"]
          submitted_at?: string
          transaction_id: string
          verified_at?: string | null
          verified_by_admin_id?: string | null
        }
        Update: {
          drive_link?: string | null
          id?: string
          order_id?: string
          payment_screenshot_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["payment_submission_status"]
          submitted_at?: string
          transaction_id?: string
          verified_at?: string | null
          verified_by_admin_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_digital_links: {
        Row: {
          created_at: string
          digital_file_id: string
          id: string
          note: string | null
          product_id: string
        }
        Insert: {
          created_at?: string
          digital_file_id: string
          id?: string
          note?: string | null
          product_id: string
        }
        Update: {
          created_at?: string
          digital_file_id?: string
          id?: string
          note?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_digital_links_digital_file_id_fkey"
            columns: ["digital_file_id"]
            isOneToOne: false
            referencedRelation: "digital_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_digital_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          product_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          product_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badges: string[] | null
          board: string
          class: string
          created_at: string
          description: string | null
          format: Database["public"]["Enums"]["product_format"]
          id: string
          mrp: number
          sale_price: number
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          stock_count: number | null
          subject: string
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          badges?: string[] | null
          board?: string
          class: string
          created_at?: string
          description?: string | null
          format?: Database["public"]["Enums"]["product_format"]
          id?: string
          mrp: number
          sale_price: number
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          stock_count?: number | null
          subject: string
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          badges?: string[] | null
          board?: string
          class?: string
          created_at?: string
          description?: string | null
          format?: Database["public"]["Enums"]["product_format"]
          id?: string
          mrp?: number
          sale_price?: number
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          stock_count?: number | null
          subject?: string
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          referral_code: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          referral_code?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          referral_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          referral_code_used: string
          referred_user_id: string
          referrer_user_id: string
          reward_status: Database["public"]["Enums"]["reward_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          referral_code_used: string
          referred_user_id: string
          referrer_user_id: string
          reward_status?: Database["public"]["Enums"]["reward_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          referral_code_used?: string
          referred_user_id?: string
          referrer_user_id?: string
          reward_status?: Database["public"]["Enums"]["reward_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      static_pages: {
        Row: {
          content: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tracking_links: {
        Row: {
          courier_name: string
          id: string
          order_id: string
          status: Database["public"]["Enums"]["tracking_status"]
          tracking_url: string
          updated_at: string
        }
        Insert: {
          courier_name: string
          id?: string
          order_id: string
          status?: Database["public"]["Enums"]["tracking_status"]
          tracking_url: string
          updated_at?: string
        }
        Update: {
          courier_name?: string
          id?: string
          order_id?: string
          status?: Database["public"]["Enums"]["tracking_status"]
          tracking_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_links_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_id: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      coupon_type: "FLAT" | "PERCENT"
      order_status:
        | "PENDING_VERIFICATION"
        | "CONFIRMED"
        | "CANCELLED"
        | "SHIPPED"
        | "DELIVERED"
      payment_status: "PENDING" | "PAID" | "FAILED"
      payment_submission_status: "SUBMITTED" | "VERIFIED" | "REJECTED"
      product_format: "PDF" | "PHYSICAL" | "COMBO"
      product_status: "PUBLISHED" | "UNLISTED" | "DRAFT"
      reward_status: "PENDING" | "EARNED" | "REDEEMED"
      tracking_status: "PACKED" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      coupon_type: ["FLAT", "PERCENT"],
      order_status: [
        "PENDING_VERIFICATION",
        "CONFIRMED",
        "CANCELLED",
        "SHIPPED",
        "DELIVERED",
      ],
      payment_status: ["PENDING", "PAID", "FAILED"],
      payment_submission_status: ["SUBMITTED", "VERIFIED", "REJECTED"],
      product_format: ["PDF", "PHYSICAL", "COMBO"],
      product_status: ["PUBLISHED", "UNLISTED", "DRAFT"],
      reward_status: ["PENDING", "EARNED", "REDEEMED"],
      tracking_status: ["PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"],
    },
  },
} as const
