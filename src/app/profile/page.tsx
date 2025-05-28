'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, Settings } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <UserCircle size={32} className="text-accent" /> User Profile
        </h1>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Settings size={64} className="mx-auto text-muted-foreground mb-6" />
          <p className="text-xl text-muted-foreground">Profile page is under construction.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Soon you'll be able to manage your preferences and view your overall statistics here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
