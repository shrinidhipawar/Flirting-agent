import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Crown, Users, Shield, UserCog, Menu } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';

type AppRole = 'user' | 'admin' | 'superadmin';

interface UserWithRole {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  created_at: string;
  role: AppRole;
}

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isSuperAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isSuperAdmin) {
        toast.error('Access denied. Super Admin privileges required.');
        navigate('/');
      } else {
        fetchUsers();
      }
    }
  }, [user, isSuperAdmin, authLoading, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (profiles) {
      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.user_id)
            .single();
          
          return {
            ...profile,
            role: (roleData?.role as AppRole) || 'user'
          };
        })
      );
      
      setUsers(usersWithRoles);
    }
    
    setLoading(false);
  };

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    setUpdatingRole(userId);
    
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);
    
    if (error) {
      toast.error('Failed to update role');
    } else {
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    }
    
    setUpdatingRole(null);
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'superadmin':
        return 'destructive';
      case 'admin':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    total: users.length,
    superadmins: users.filter(u => u.role === 'superadmin').length,
    admins: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isMobile ? 'ml-0' : isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <Crown className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
                  Super Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">Manage user roles and system access</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Total Users</span>
                    <span className="sm:hidden">Users</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card className="border-yellow-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="hidden sm:inline">Super Admins</span>
                    <span className="sm:hidden">Super</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold text-yellow-500">{stats.superadmins}</div>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Admins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stats.admins}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    <span className="hidden sm:inline">Regular Users</span>
                    <span className="sm:hidden">Regular</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold">{stats.regularUsers}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Role Management
                </CardTitle>
                <CardDescription>Assign and manage user roles across the platform</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">Joined</TableHead>
                      <TableHead>Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userItem) => (
                      <TableRow key={userItem.id}>
                        <TableCell className="font-medium">{userItem.full_name || 'N/A'}</TableCell>
                        <TableCell className="hidden sm:table-cell max-w-[150px] truncate">{userItem.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(userItem.role)} className="text-xs">
                            {userItem.role === 'superadmin' && <Crown className="h-3 w-3 mr-1" />}
                            {userItem.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                            <span className="hidden sm:inline">{userItem.role}</span>
                            <span className="sm:hidden">{userItem.role === 'superadmin' ? 'SA' : userItem.role === 'admin' ? 'A' : 'U'}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{new Date(userItem.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select
                            value={userItem.role}
                            onValueChange={(value: AppRole) => updateUserRole(userItem.user_id, value)}
                            disabled={updatingRole === userItem.user_id || userItem.user_id === user?.id}
                          >
                            <SelectTrigger className="w-[100px] sm:w-[140px]">
                              {updatingRole === userItem.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="superadmin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;