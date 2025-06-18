// src/components/forms/ProfileSettingsForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form'; // Assuming you're using react-hook-form
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui button
import { Input } from '@/components/ui/input'; // Assuming shadcn/ui input
import { Label } from '@/components/ui/label'; // Assuming shadcn/ui label
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // Assuming shadcn/ui form

// Define the shape of the form data
interface ProfileSettingsFormValues {
  displayName: string;
  // Add other profile fields here (e.g., bio, website, etc.)
}

interface ProfileSettingsFormProps {
  defaultValues?: ProfileSettingsFormValues;
  onSubmit: (values: ProfileSettingsFormValues) => void;
  isSubmitting?: boolean;
}

export const ProfileSettingsForm: React.FC<ProfileSettingsFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<ProfileSettingsFormValues>({
    defaultValues,
    // Add validation schema here if using a validation library like Zod
  });

  // This is where the form submission logic will be handled by the parent component
  const handleSubmit = (values: ProfileSettingsFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Your display name" {...field} />
              </FormControl>
              {/* Add form description if needed */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add other profile fields here */}
        {/*
        <FormField
          control={form.control}
          name="bio" // Example of another field
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        */}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </Form>
  );
};