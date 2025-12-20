import {
  Bell,
  Package,
  CheckCircle,
  XCircle,
  Gift,
  BookOpen,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";

const getIcon = (type: string) => {
  switch (type) {
    case "ORDER_CONFIRMED":
      return <Package className="h-5 w-5 text-primary" />;
    case "ORDER_SHIPPED":
      return <Package className="h-5 w-5 text-blue-green" />;
    case "ORDER_DELIVERED":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "ORDER_CANCELLED":
      return <XCircle className="h-5 w-5 text-destructive" />;
    case "REFERRAL_EARNED":
      return <Gift className="h-5 w-5 text-turquoise-surf" />;
    case "NEW_PRODUCT":
      return <BookOpen className="h-5 w-5 text-sky-aqua" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};

const NotificationsPage = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount =
    notifications?.filter((n) => !n.is_read).length ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount} unread notifications
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* List */}
      {notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              variant="glass"
              className={`transition-all ${
                !n.is_read ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-xl ${
                      !n.is_read ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{n.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {n.message}
                        </p>
                      </div>

                      {!n.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markRead.mutate(n.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(n.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {!n.is_read && (
                        <Badge variant="default" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="glass">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No notifications
            </h3>
            <p className="text-muted-foreground">
              You’re all caught up 🎉
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;
