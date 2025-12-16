import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Ticket, 
  UserPlus, 
  FileText, 
  FolderOpen, 
  Settings, 
  ClipboardList,
  Menu,
  X,
  ChevronRight,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const adminSidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Ticket, label: "Coupons", path: "/admin/coupons" },
  { icon: UserPlus, label: "Referrals", path: "/admin/referrals" },
  { icon: FileText, label: "Content", path: "/admin/content" },
  { icon: FolderOpen, label: "Files", path: "/admin/files" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
  { icon: ClipboardList, label: "Audit Log", path: "/admin/audit-log" },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-deep-twilight">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-french-blue border-b border-primary/20 px-4 py-3 flex items-center justify-between">
        <Link to="/admin" className="text-xl font-bold text-light-cyan">
          CBSE GUY Admin
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-light-cyan hover:bg-primary/20"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-french-blue border-r border-primary/20 transition-transform duration-300 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2 px-6 py-5 border-b border-primary/20">
            <Link to="/admin" className="text-xl font-bold text-light-cyan">
              CBSE GUY Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 mt-4 lg:mt-0 overflow-y-auto max-h-[calc(100vh-180px)]">
            {adminSidebarItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== "/admin" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-turquoise-surf text-deep-twilight shadow-button"
                      : "text-frosted-blue hover:bg-primary/20 hover:text-light-cyan"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <Link to="/">
              <Button variant="outline" className="w-full justify-start gap-3 border-primary/30 text-light-cyan hover:bg-primary/20">
                <LogOut className="h-4 w-4" />
                Exit Admin
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-frosted-blue hover:text-light-cyan hover:bg-primary/20"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-deep-twilight/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-deep-twilight/95">
          {/* Top bar */}
          <div className="sticky top-0 z-20 bg-deep-twilight/80 backdrop-blur-lg border-b border-primary/20 px-6 py-4 hidden lg:flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-light-cyan">Admin Panel</h1>
              <p className="text-sm text-frosted-blue">Manage your store</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-turquoise-surf/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-turquoise-surf" />
              </div>
              <span className="text-light-cyan text-sm font-medium">{profile?.full_name || 'Admin'}</span>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;