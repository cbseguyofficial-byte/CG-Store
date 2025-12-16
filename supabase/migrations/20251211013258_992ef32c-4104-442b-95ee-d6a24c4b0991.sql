-- SECURITY FIX: Add RESTRICTIVE policies to require authentication for SELECT on sensitive tables
-- This prevents anonymous access to user data

-- 1. Profiles - Require auth for SELECT
CREATE POLICY "Require auth for profiles SELECT"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- 2. Addresses - Require auth for SELECT  
CREATE POLICY "Require auth for addresses SELECT"
ON public.addresses
FOR SELECT
TO anon
USING (false);

-- 3. Orders - Require auth for SELECT
CREATE POLICY "Require auth for orders SELECT"
ON public.orders
FOR SELECT
TO anon
USING (false);

-- 4. Payments - Require auth for SELECT
CREATE POLICY "Require auth for payments SELECT"
ON public.payments
FOR SELECT
TO anon
USING (false);

-- 5. Referrals - Require auth for SELECT
CREATE POLICY "Require auth for referrals SELECT"
ON public.referrals
FOR SELECT
TO anon
USING (false);

-- 6. Notifications - Require auth for SELECT
CREATE POLICY "Require auth for notifications SELECT"
ON public.notifications
FOR SELECT
TO anon
USING (false);

-- 7. Wishlists - Require auth for SELECT
CREATE POLICY "Require auth for wishlists SELECT"
ON public.wishlists
FOR SELECT
TO anon
USING (false);

-- 8. Order Items - Require auth for SELECT
CREATE POLICY "Require auth for order_items SELECT"
ON public.order_items
FOR SELECT
TO anon
USING (false);

-- 9. Tracking Links - Require auth for SELECT
CREATE POLICY "Require auth for tracking_links SELECT"
ON public.tracking_links
FOR SELECT
TO anon
USING (false);

-- 10. User Roles - Require auth for SELECT
CREATE POLICY "Require auth for user_roles SELECT"
ON public.user_roles
FOR SELECT
TO anon
USING (false);

-- 11. Audit Logs - Require auth for SELECT
CREATE POLICY "Require auth for audit_logs SELECT"
ON public.audit_logs
FOR SELECT
TO anon
USING (false);

-- 12. Digital Files - Require auth for SELECT
CREATE POLICY "Require auth for digital_files SELECT"
ON public.digital_files
FOR SELECT
TO anon
USING (false);

-- 13. Product Digital Links - Require auth for SELECT
CREATE POLICY "Require auth for product_digital_links SELECT"
ON public.product_digital_links
FOR SELECT
TO anon
USING (false);

-- FIX: Update notifications INSERT policy to restrict to service role or owner only
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System or self can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Add users can create referrals policy for checkout flow
CREATE POLICY "Authenticated users can create referrals"
ON public.referrals
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = referred_user_id);