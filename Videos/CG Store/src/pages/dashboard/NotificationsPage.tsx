import { Bell, Package, CheckCircle, XCircle, Gift, BookOpen, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const initialNotifications = [
  {
    id: 1,
    type: "order_confirmed",
    title: "Order Confirmed",
    message: "Your order ORD-2024-001 has been confirmed and is being processed.",
    date: "Dec 5, 2024",
    read: false,
  },
  {
    id: 2,
    type: "order_shipped",
    title: "Order Shipped",
    message: "Your order ORD-2024-002 has been shipped via BlueDart. Track your package now!",
    date: "Dec 4, 2024",
    read: false,
  },
  {
    id: 3,
    type: "referral_success",
    title: "Referral Reward Earned!",
    message: "Your friend Rahul used your referral code. You've earned ₹50 credit!",
    date: "Dec 3, 2024",
    read: true,
  },
  {
    id: 4,
    type: "new_book",
    title: "New Book Available",
    message: "CBSE Class 12 Biology - 2025 Edition is now available. Check it out!",
    date: "Dec 1, 2024",
    read: true,
  },
  {
    id: 5,
    type: "order_delivered",
    title: "Order Delivered",
    message: "Your order ORD-2024-003 has been delivered successfully.",
    date: "Nov 30, 2024",
    read: true,
  },
  {
    id: 6,
    type: "order_cancelled",
    title: "Order Cancelled",
    message: "Your order ORD-2024-006 has been cancelled. Refund will be processed within 5-7 days.",
    date: "Nov 15, 2024",
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "order_confirmed": return <Package className="h-5 w-5 text-primary" />;
    case "order_shipped": return <Package className="h-5 w-5 text-blue-green" />;
    case "order_delivered": return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "order_cancelled": return <XCircle className="h-5 w-5 text-destructive" />;
    case "referral_success": return <Gift className="h-5 w-5 text-turquoise-surf" />;
    case "new_book": return <BookOpen className="h-5 w-5 text-sky-aqua" />;
    default: return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            variant="glass" 
            className={`transition-all hover:shadow-card-hover ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl ${!notification.read ? "bg-primary/10" : "bg-muted"}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{notification.date}</span>
                    {!notification.read && <Badge variant="default" className="text-xs">New</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card variant="glass">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! New notifications will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;
