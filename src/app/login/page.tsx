
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, ExternalLink } from 'lucide-react'; // Using ExternalLink for Google icon idea
import { AppLogo } from '@/components/AppLogo';

// A simple SVG for Google G icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.83 0-5.22-1.9-6.08-4.4H2.29v2.84C4.09 20.98 7.72 23 12 23z" fill="#34A853"/>
    <path d="M5.92 14.41c-.21-.66-.33-1.36-.33-2.09s.12-1.43.33-2.09V7.48H2.29C1.46 9.05 1 10.76 1 12.5s.46 3.45 1.29 5.02l3.63-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.72 1 4.09 3.02 2.29 5.76l3.63 2.84C6.78 6.24 9.17 5.38 12 5.38z" fill="#EA4335"/>
  </svg>
);


export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/'); // Redirect to dashboard if already logged in
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // router.push('/'); // onAuthStateChanged will trigger redirect from useEffect
    } catch (error) {
      console.error('Login failed:', error);
      // Display error to user, e.g., using a toast notification
    }
  };

  if (loading || user) {
    // Show loading or let useEffect handle redirect
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-fit">
              <AppLogo size="lg" />
            </div>
            <CardTitle className="text-2xl">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-sm shadow-xl rounded-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-2 w-fit">
            <AppLogo size="lg" />
          </div>
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to Skill Ascent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={handleSignIn} className="w-full" size="lg" disabled={loading}>
            <GoogleIcon />
            <span className="ml-2">Sign in with Google</span>
          </Button>
          {/* You can add more login options here, e.g., email/password */}
        </CardContent>
      </Card>
    </div>
  );
}
