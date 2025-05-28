
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Settings, Mail, LogOut, Loader2, ShieldAlert } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <UserCircle size={32} className="text-accent" /> User Profile
        </h1>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.displayName || 'User'}</CardTitle>
          {user.email && (
            <CardDescription className="flex items-center gap-1 text-base">
              <Mail size={16} className="text-muted-foreground" /> {user.email}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings size={20} /> Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Account settings management is not yet implemented.
              </p>
              {/* Placeholder for future settings */}
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert size={20} /> Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your skills and achievements are currently stored in your browser's local storage.
                Future updates will allow you to store this data securely in the cloud, linked to your account.
              </p>
            </CardContent>
          </Card>

          <Button onClick={handleSignOut} variant="destructive" className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
