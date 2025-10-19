"use client"

import { 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { User } from "@/Types"

interface ProfileHeaderProps {
  user: User | null;
  loading: boolean;
  onEditProfile?: () => void;
}

export function ProfileHeader({ user, loading, onEditProfile }: ProfileHeaderProps) {
  if (loading) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/30 rounded-2xl animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-8 w-64 bg-white/30 rounded animate-pulse"></div>
                <div className="h-6 w-48 bg-white/30 rounded animate-pulse"></div>
                <div className="flex gap-3">
                  <div className="h-8 w-32 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="h-8 w-24 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="h-8 w-28 bg-white/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="h-12 w-32 bg-white/30 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-red-600"></div>
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
              <p className="opacity-90">Please log in again to view your profile</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'student':
        return 'Student';
      case 'teacher':
        return 'Teacher';
      case 'admin':
        return 'Administrator';
      default:
        return 'User';
    }
  };

  const getJoinDate = () => {
    // Mock join date - in real app, this would come from user data
    return 'Jan 2024';
  };

  const getLocation = () => {
    // Mock location - in real app, this would come from user data
    return 'Ho Chi Minh, VN';
  };

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
      <div className="relative p-8 text-white">
        <div className="flex items-center justify-between">
          {/* Left side - Avatar and Info */}
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-white rounded-lg flex items-center justify-center">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* User Info */}
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-lg opacity-90">{getRoleDisplayName(user.role)}</p>
              </div>
              
              {/* Info Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{getLocation()}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined {getJoinDate()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Edit Button */}
          <Button 
            onClick={onEditProfile}
            className="bg-white/25 hover:bg-white/35 text-white border-0 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
