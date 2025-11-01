'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ArrowLeft, User, Mail, Calendar, AlertCircle, CheckCircle, Clock, Target, Award, TrendingUp, BarChart, Calendar as CalendarIcon, Zap, Clock3 } from 'lucide-react';
import { UserProfile } from '@/Types';
import userService from '@/service/userService';
import { getUserMetricsById } from '@/features/admin/api/admin';
import { UserMetrics } from '@/features/admin/types/user.types';

// Metric Card Component
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  description,
  small = false
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  description: string;
  small?: boolean;
}) => (
  <div className={`${small ? 'p-3' : 'p-4'} bg-muted/50 rounded-lg`}>
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="text-muted-foreground">{icon}</div>
    </div>
    <div className="mt-2">
      <p className={`${small ? 'text-xl' : 'text-2xl'} font-bold`}>{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>({
    fullName: '',
    email: '',
    userName: '',
    phoneNumber: null,
    address: '',
    isActive: true,
    profilePictureUrl: '',
  });
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const fetchUserMetrics = useCallback(async () => {
    if (!id) return;
    
    try {
      setMetricsLoading(true);
      const metricsData = await getUserMetricsById(id as string, timeRange);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching user metrics:', error);
      toast.error('Failed to load user metrics');
    } finally {
      setMetricsLoading(false);
    }
  }, [id, timeRange]);

  const fetchUser = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const userData = await userService.getUserProfile(id as string);
      setUser(userData);
      setFormData({
        fullName: userData.fullName,
        email: userData.email,
        userName: userData.userName,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        isActive: userData.isActive,
        profilePictureUrl: userData.profilePictureUrl,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user data');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchUserMetrics();
    }
  }, [id, router, fetchUser, fetchUserMetrics]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!id) return;
    
    try {
      setSaving(true);
      await userService.updateUserProfile(id as string, {
        ...formData,
      });
      
      toast.success('User updated successfully');
      setEditing(false);
      //setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status: boolean) => {
    if (!user) return;
    
    try {
      await userService.updateUserStatus(user.id, status);
      toast.success(`User status updated to ${status}`);
      const updatedUser = await userService.getUserProfile(user.id);
      setUser(updatedUser);
      setFormData(prev => ({
        ...prev,
        isActive: status,
      }));
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    const status = isActive ? 'active' : 'inactive';
    const statusMap = {
      active: { bg: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { bg: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { bg: 'bg-gray-100', icon: null };
    const Icon = statusInfo.icon || null;

    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg}`}>
        {Icon && <Icon className="h-3 w-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">User not found</h3>
        <p className="text-muted-foreground mt-2">The requested user could not be found.</p>
        <Button className="mt-4" onClick={() => router.push('/admin/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/users')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <h1 className="text-2xl font-bold">
            {user.fullName}
          </h1>
          <p className="text-muted-foreground">User ID: {user.id}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center space-x-2">
            {!editing ? (
              <>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
                <Select
                  value={user.isActive ? 'active' : 'inactive'}
                  onValueChange={(value: 'active' | 'inactive') =>
                    handleStatusChange(value === 'active')
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    if (user) {
                      setFormData({
                        fullName: user.fullName,
                        email: user.email,
                        userName: user.userName,
                        phoneNumber: user.phoneNumber || '',
                        address: user.address || '',
                        isActive: user.isActive,
                        profilePictureUrl: user.profilePictureUrl || '',
                      });
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>User Information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {user.fullName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 flex items-center justify-center">
                      <span className="text-muted-foreground">#</span>
                    </div>
                    <span className="text-sm">ID: {user.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Edit Profile</CardDescription>
                <CardDescription>Status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Account Status</div>
                    {getStatusBadge(user.isActive)}
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Last Updated</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(user.updatedAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Send Password Reset
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View Activity Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-600">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update user information and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userName">Username</Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"></Input>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    placeholder="Enter address"></Input>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>
                    Detailed metrics and statistics for this user
                  </CardDescription>
                </div>
                <Select 
                  value={timeRange}
                  onValueChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last 7 days</SelectItem>
                    <SelectItem value="month">Last 30 days</SelectItem>
                    <SelectItem value="year">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="text-center py-8">
                  <p>Loading metrics...</p>
                </div>
              ) : metrics ? (
                <div className="space-y-6">
                  {/* Focus Metrics */}
                  <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Clock3 className="mr-2 h-5 w-5 text-blue-500" />
                          Focus Metrics
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <MetricCard 
                            title="Total Focus Hours" 
                            value={metrics.totalFocusHours.toFixed(1)} 
                            icon={<Clock className="h-5 w-5" />}
                            description={`${metrics.avgFocusPerDay.toFixed(1)}h avg/day`}
                          />
                          <MetricCard 
                            title="Sessions" 
                            value={metrics.totalSessions.toString()} 
                            icon={<Clock className="h-5 w-5" />}
                            description={`${(metrics.totalFocusHours / Math.max(1, metrics.totalSessions)).toFixed(1)}h avg/session`}
                          />
                          <MetricCard 
                            title="Active Days" 
                            value={metrics.activeDays.toString()} 
                            icon={<CalendarIcon className="h-5 w-5" />}
                            description={`${((metrics.activeDays / (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365)) * 100).toFixed(0)}% active`}
                          />
                          <MetricCard 
                            title="Engagement" 
                            value={`${metrics.engagementRatePercent}%`} 
                            icon={<TrendingUp className="h-5 w-5" />}
                            description="Engagement rate"
                          />
                        </div>
                      </div>

                      {/* Productivity Metrics */}
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Target className="mr-2 h-5 w-5 text-green-500" />
                          Productivity
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <MetricCard 
                            title="Schedules" 
                            value={metrics.totalSchedules.toString()} 
                            icon={<CalendarIcon className="h-5 w-5" />}
                            description={`${metrics.completedSchedules} completed`}
                          />
                          <MetricCard 
                            title="Completion Rate" 
                            value={`${metrics.completionRate}%`} 
                            icon={<BarChart className="h-5 w-5" />}
                            description="Of scheduled tasks"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <MetricCard 
                              title="Current Streak" 
                              value={metrics.currentStreak.toString()} 
                              icon={<Zap className="h-5 w-5 text-yellow-500" />}
                              description="days"
                              small={true}
                            />
                            <MetricCard 
                              title="Best Streak" 
                              value={metrics.longestStreak.toString()} 
                              icon={<Award className="h-5 w-5 text-purple-500" />}
                              description="days"
                              small={true}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Achievements */}
                      {metrics.recentAchievements.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <Award className="mr-2 h-5 w-5 text-yellow-500" />
                            Recent Achievements ({metrics.unlockedAchievements} total)
                          </h3>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {metrics.recentAchievements.map((achievement, index) => (
                              <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg">
                                <Award className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                                <span className="text-sm">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Focus Chart */}
                      {metrics.focusChart.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-4">Focus Hours Over Time</h3>
                          <div className="h-64 bg-muted/50 rounded-lg p-4 flex items-end gap-1">
                            {metrics.focusChart.map((data, index) => (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div 
                                  className="w-full bg-blue-500 rounded-t-sm transition-all duration-300"
                                  style={{ height: `${Math.min(100, (data.focusHours / Math.max(...metrics.focusChart.map(d => d.focusHours))) * 100)}%` }}
                                />
                                <div className="text-xs mt-1 text-muted-foreground">
                                  {format(new Date(data.date), 'MMM d')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No activity data available for this user</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage user account settings and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Account Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Control the user&apos;s access to the platform
                    </p>
                  </div>
                  <Select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onValueChange={(value) =>
                      handleSelectChange('isActive', value === 'active')
                    }
                    disabled={!editing}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Danger Zone</h4>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium text-red-800">Delete Account</h5>
                        <p className="text-sm text-red-600">
                          Permanently delete this user&apos;s account and all associated data
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
