# Profile Components

This directory contains reusable components for the user profile page.

## Components

### ProfileHeader
- Displays user avatar, name, email, and basic info
- Shows loading state with skeleton animation
- Handles error state when user data is not available
- Includes edit profile button

### ProfileStats
- Shows key statistics (study hours, lessons completed, etc.)
- Responsive grid layout
- Loading skeleton animation
- Gradient backgrounds with icons

### LearningProgress
- Displays progress bars for different subjects
- Shows completion percentages
- Color-coded progress bars
- Loading state support

### RecentActivity
- Lists recent study activities
- Shows subject, duration, and date
- Color-coded activity indicators
- Loading skeleton animation

### Achievements
- Displays earned and in-progress achievements
- Progress bars for incomplete achievements
- Achievement icons and descriptions
- Completion status indicators

### ProfileError
- Error state display component
- Retry functionality
- Clean error messaging
- Consistent styling with other components

## Usage

```tsx
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileStats } from "@/components/profile/ProfileStats"
// ... other imports

function ProfilePage() {
  const { user, stats, loading, error, refreshProfile } = useProfile()
  
  if (error) {
    return <ProfileError error={error} onRetry={refreshProfile} />
  }
  
  return (
    <div>
      <ProfileHeader user={user} loading={loading} onEditProfile={handleEdit} />
      <ProfileStats stats={stats} loading={loading} />
      {/* ... other components */}
    </div>
  )
}
```

## Data Flow

All components receive data from the `useProfile` hook, which:
1. Gets user data from localStorage or token
2. Provides mock data for development
3. Handles loading and error states
4. Can be extended to fetch real data from API

## Styling

Components use:
- Tailwind CSS for styling
- Consistent color schemes
- Loading animations with `animate-pulse`
- Responsive design patterns
- Shadow and gradient effects
