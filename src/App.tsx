import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Public Pages
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentConfirmPage from "./pages/PaymentConfirmPage";
import ReceiptPage from "./pages/ReceiptPage";
import AuthPage from "./pages/AuthPage";
import ReferralsInfoPage from "./pages/ReferralsInfoPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import EulaPage from "./pages/EulaPage";
import NotFound from "./pages/NotFound";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";

// Dashboard Pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import OrdersPage from "./pages/dashboard/OrdersPage";
import OrderDetailPage from "./pages/dashboard/OrderDetailPage";
import DownloadsPage from "./pages/dashboard/DownloadsPage";
import WishlistPage from "./pages/dashboard/WishlistPage";
import ReferralsPage from "./pages/dashboard/ReferralsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminReferrals from "./pages/admin/AdminReferrals";
import AdminContent from "./pages/admin/AdminContent";
import AdminFiles from "./pages/admin/AdminFiles";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAuditLog from "./pages/admin/AdminAuditLog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth fallback (Google Sign-In only) */}
              <Route path="/auth" element={<AuthPage />} />


            {/* Public pages with layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment/confirm" element={<PaymentConfirmPage />} />
              <Route path="/order/receipt/:id" element={<ReceiptPage />} />
              <Route path="/referrals" element={<ReferralsInfoPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/eula" element={<EulaPage />} />
            </Route>

            {/* Dashboard Routes - Protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="downloads" element={<DownloadsPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes - Protected with Admin check */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductEdit />} />
              <Route path="products/:id" element={<AdminProductEdit />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="referrals" element={<AdminReferrals />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="files" element={<AdminFiles />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="audit-log" element={<AdminAuditLog />} />
            </Route>

            {/* Error Pages */}
            <Route path="/error/500" element={<Error500 />} />
            <Route path="/error/503" element={<Error503 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
