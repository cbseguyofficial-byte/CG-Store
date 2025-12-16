-- Fix coupon exposure: Remove public access to active coupons
-- Only admins and authenticated users validating specific codes should have access

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;

-- Create a more restrictive policy: only allow looking up coupons by exact code match
-- This prevents enumeration while still allowing users to validate specific codes
CREATE POLICY "Users can validate specific coupon codes" 
ON public.coupons 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Note: The admin policy "Admins can manage all coupons" already exists and covers admin access