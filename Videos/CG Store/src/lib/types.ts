// Database types for the application
import { Database } from "@/integrations/supabase/types";

// Extract row types from database
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type Wishlist = Database["public"]["Tables"]["wishlists"]["Row"];
export type Referral = Database["public"]["Tables"]["referrals"]["Row"];
export type StaticPage = Database["public"]["Tables"]["static_pages"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type TrackingLink = Database["public"]["Tables"]["tracking_links"]["Row"];
export type DigitalFile = Database["public"]["Tables"]["digital_files"]["Row"];
export type ProductDigitalLink = Database["public"]["Tables"]["product_digital_links"]["Row"];
export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];

// Insert types
export type AddressInsert = Database["public"]["Tables"]["addresses"]["Insert"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"];
export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
export type WishlistInsert = Database["public"]["Tables"]["wishlists"]["Insert"];
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type CouponInsert = Database["public"]["Tables"]["coupons"]["Insert"];

// Update types
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type AddressUpdate = Database["public"]["Tables"]["addresses"]["Update"];

// Enums
export type ProductFormat = Database["public"]["Enums"]["product_format"];
export type ProductStatus = Database["public"]["Enums"]["product_status"];
export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type PaymentSubmissionStatus = Database["public"]["Enums"]["payment_submission_status"];
export type CouponType = Database["public"]["Enums"]["coupon_type"];
export type RewardStatus = Database["public"]["Enums"]["reward_status"];
export type TrackingStatus = Database["public"]["Enums"]["tracking_status"];
export type AppRole = Database["public"]["Enums"]["app_role"];

// Extended types with relations
export interface ProductWithImages extends Product {
  product_images: ProductImage[];
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { products?: Product | null })[];
  payments?: Payment[];
  tracking_links?: TrackingLink[];
}

export interface CartItem {
  product: ProductWithImages;
  quantity: number;
}

export interface AddressSnapshot {
  name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  label?: string;
}

// Checkout types
export interface CheckoutValidation {
  subtotal: number;
  discount: number;
  final_amount: number;
  coupon_valid: boolean;
  coupon_message?: string;
  items_valid: boolean;
  items_message?: string;
  is_referral_code?: boolean;
  referrer_user_id?: string;
}

export interface CreateOrderPayload {
  items: { product_id: string; quantity: number; format: string }[];
  address: AddressSnapshot;
  coupon_code?: string;
  notes?: string;
}

// User referral stats
export interface ReferralStats {
  referral_code: string;
  total_referred: number;
  successful_referrals: number;
  pending_rewards: number;
  earned_rewards: number;
}
