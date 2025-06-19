'use client';

import React, { useState } from 'react';
import {
  updateProfile,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ProfileSettingsForm } from '@/components/settings/ProfileSettingsForm';
import { PasswordChangeForm } from '@/components/settings/PasswordChangeForm';
import { ThemeChangeButton } from '@/components/ThemeChangeButton';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const handleProfileUpdate = async (values: { displayName: string }) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not authenticated.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await updateProfile(user, { displayName: values.displayName });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: error.message || 'Could not update profile.',
        variant: 'destructive',
      });
    }
  };

  const handlePasswordChange = async (values: {
    currentPassword: string;
    newPassword: string;
  }) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not authenticated.',
        variant: 'destructive',
      });
      return;
    }

    setIsPasswordSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        values.currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, values.newPassword);
      toast({
        title: 'Success',
        description: 'Your password has been updated.',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      let errorMessage = 'Could not change password.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect current password.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        {/* Profile Information */}
        <section className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <ProfileSettingsForm onSubmit={handleProfileUpdate} />
        </section>

        {/* Password Change */}
        <section className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <PasswordChangeForm onSubmit={handlePasswordChange} isSubmitting={isPasswordSubmitting} />
        </section>

        {/* Email Change */}
        <section className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4">Email Change</h2>
          <p>Placeholder for form to change email address.</p>
        </section>

        {/* Account Deletion */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Account Deletion</h2>
          <p>Placeholder for option to delete account.</p>
        </section>
    </div>
  );
}

