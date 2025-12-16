import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client for secure access
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { couponCode, subtotal } = await req.json();

    console.log(`[validate-coupon] Validating coupon: ${couponCode}, subtotal: ${subtotal}`);

    if (!couponCode) {
      return new Response(
        JSON.stringify({
          subtotal,
          discount: 0,
          final_amount: subtotal,
          coupon_valid: false,
          items_valid: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch coupon securely using service role key
    const { data: coupon, error } = await supabaseAdmin
      .from("coupons")
      .select("id, code, type, value, max_discount, min_cart_value, starts_at, expires_at, is_active, is_referral_code, owner_user_id")
      .eq("code", couponCode.toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error(`[validate-coupon] Database error:`, error);
      return new Response(
        JSON.stringify({
          subtotal,
          discount: 0,
          final_amount: subtotal,
          coupon_valid: false,
          coupon_message: "Error validating coupon",
          items_valid: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!coupon) {
      console.log(`[validate-coupon] Coupon not found: ${couponCode}`);
      return new Response(
        JSON.stringify({
          subtotal,
          discount: 0,
          final_amount: subtotal,
          coupon_valid: false,
          coupon_message: "Invalid coupon code",
          items_valid: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      console.log(`[validate-coupon] Coupon expired: ${couponCode}`);
      return new Response(
        JSON.stringify({
          subtotal,
          discount: 0,
          final_amount: subtotal,
          coupon_valid: false,
          coupon_message: "Coupon has expired",
          items_valid: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check start date
    if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
      console.log(`[validate-coupon] Coupon not yet active: ${couponCode}`);
      return new Response(
        JSON.stringify({
          subtotal,
          discount: 0,
          final_amount: subtotal,
          coupon_valid: false,
          coupon_message: "Coupon is not yet active",
          items_valid: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check minimum cart value
    if (coupon.min_cart_value && subtotal < Number(coupon.min_cart_value)) {
      console.log(`[validate-coupon] Min cart value not met: ${subtotal} < ${coupon.min_cart_value}`);
      return new Response(
        JSON.stringify({
          subtotal,
          discount: 0,
          final_amount: subtotal,
          coupon_valid: false,
          coupon_message: `Minimum cart value of ₹${coupon.min_cart_value} required`,
          items_valid: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "PERCENT") {
      discount = (subtotal * Number(coupon.value)) / 100;
      if (coupon.max_discount && discount > Number(coupon.max_discount)) {
        discount = Number(coupon.max_discount);
      }
    } else {
      discount = Number(coupon.value);
    }

    discount = Math.min(discount, subtotal);

    console.log(`[validate-coupon] Coupon valid! Discount: ${discount}`);

    return new Response(
      JSON.stringify({
        subtotal,
        discount,
        final_amount: subtotal - discount,
        coupon_valid: true,
        coupon_message: `Coupon applied! You save ₹${discount}`,
        items_valid: true,
        is_referral_code: coupon.is_referral_code,
        referrer_user_id: coupon.owner_user_id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[validate-coupon] Unexpected error:`, error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        coupon_valid: false,
        discount: 0,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
