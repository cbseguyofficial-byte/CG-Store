import { useState } from "react";
import { Search, Eye, UserCheck, UserX, Users, Shield, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAdminUsers, useToggleAdminRole } from "@/hooks/useAdminUsers";
import { toast } from "sonner";

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users, isLoading, error } = useAdminUsers(searchQuery || undefined);
  const toggleAdminRole = useToggleAdminRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-turquoise-surf" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load users: {error.message}</p>
      </div>
    );
  }

  const selectedUser = users?.find(u => u.id === selectedUserId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-cyan">Users</h1>
          <p className="text-frosted-blue">Manage registered users ({users?.length || 0} total)</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-frosted-blue" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-french-blue/50 border-primary/20 text-light-cyan placeholder:text-frosted-blue"
        />
      </div>

      {/* Users Table */}
      <Card className="bg-french-blue/50 border-primary/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">User</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden md:table-cell">Phone</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Referral Code</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue hidden lg:table-cell">Joined</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-frosted-blue">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-primary/10 hover:bg-deep-twilight/30 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium text-light-cyan">{user.full_name}</p>
                        <p className="text-xs text-frosted-blue">{user.email}</p>
                      </td>
                      <td className="py-4 px-4 text-frosted-blue hidden md:table-cell">
                        {user.phone || "—"}
                      </td>
                      <td className="py-4 px-4">
                        {user.referral_code ? (
                          <code className="text-xs text-turquoise-surf bg-deep-twilight/50 px-2 py-1 rounded">
                            {user.referral_code}
                          </code>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-frosted-blue text-sm hidden lg:table-cell">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-frosted-blue hover:text-light-cyan"
                                onClick={() => setSelectedUserId(user.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-french-blue border-primary/20 max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-light-cyan">User Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4 pt-4">
                                  <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-deep-twilight flex items-center justify-center overflow-hidden">
                                      {selectedUser.avatar_url ? (
                                        <img src={selectedUser.avatar_url} alt="" className="h-full w-full object-cover" />
                                      ) : (
                                        <Users className="h-8 w-8 text-turquoise-surf" />
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-bold text-light-cyan">{selectedUser.full_name}</h3>
                                      <p className="text-sm text-frosted-blue">{selectedUser.email}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 bg-deep-twilight/50 rounded-lg">
                                      <p className="text-frosted-blue">Phone</p>
                                      <p className="text-light-cyan">{selectedUser.phone || "Not provided"}</p>
                                    </div>
                                    <div className="p-3 bg-deep-twilight/50 rounded-lg">
                                      <p className="text-frosted-blue">Referral Code</p>
                                      <p className="text-light-cyan font-mono">{selectedUser.referral_code || "—"}</p>
                                    </div>
                                    <div className="p-3 bg-deep-twilight/50 rounded-lg col-span-2">
                                      <p className="text-frosted-blue">Member Since</p>
                                      <p className="text-light-cyan">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-frosted-blue">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
