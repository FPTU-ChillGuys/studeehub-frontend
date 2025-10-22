'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ArrowLeft, Save, User, Lock, Mail, Calendar, Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { UserProfile } from '@/Types';
import userService from '@/service/userService';

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userName: '',
    phoneNumber: '',
    address: '',
    isActive: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserProfile(id as string);
        const userData = response;
        setUser(userData);
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          userName: userData.userName || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          isActive: userData.isActive
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user data');
        router.push('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Call API to update user
      const response = await userService.updateUserProfile(id as string, {
        fullName: formData.fullName,
        email: formData.email,
        userName: formData.userName,
        phoneNumber: formData.phoneNumber || null,
        address: formData.address,
        isActive: formData.isActive
      });
      
      toast.success('User updated successfully');
      setEditing(false);
      // Refresh user data
      const userData = await userService.getUserProfile(id as string);
      setUser(userData);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status: 'active' | 'inactive' | 'suspended') => {
    if (!user) return;
    
    try {
      await userService.updateUserStatus(user.id, status);
      toast.success(`User status updated to ${status}`);
      const updatedUser = await userService.getUserProfile(user.id);
      setUser(updatedUser);
      setFormData({
        ...formData,
        isActive: status === 'active',
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { bg: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { bg: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      suspended: { bg: 'red-100 text-red-800', icon: XCircle },
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
    <div className="space-y-6">
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
        <div className="flex items-center space-x-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
              <Select
                value={user.status}
                onValueChange={(value: 'active' | 'inactive' | 'suspended') =>
                  handleStatusChange(value)
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
                  // Reset form data
                  if (user) {
                    setFormData({
                      fullName: user.fullName || '',
                      email: user.email,
                      userName: user.userName || '',
                      phoneNumber: user.phoneNumber || '',
                      address: user.address || '',
                      notes: '',
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
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">{user.role}</span>
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
                <CardDescription>Status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Account Status</div>
                    {getStatusBadge(user.isActive ? 'active' : 'inactive')}
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Email Verified</div>
                    {user.emailVerified ? (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600">
                        <AlertCircle className="h-3 w-3 mr-1" /> Not Verified
                      </Badge>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Last Login</div>
                    <div className="text-sm text-muted-foreground">
                      {user.lastLoginAt
                        ? format(new Date(user.lastLoginAt), 'MMM d, yyyy h:mm a')
                        : 'Never'}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleSelectChange('role', value)
                      }
                      disabled={!editing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Admin Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add private notes about this user..."
                    className="min-h-[100px]"
                    disabled={!editing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Recent actions and events for this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Activity logs will appear here</p>
              </div>
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
                    value={formData.isActive}
                    onValueChange={(value) =>
                      handleSelectChange('status', value)
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
