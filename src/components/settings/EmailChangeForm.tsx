'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const emailChangeFormSchema = z.object({
  newEmail: z.string().email({ message: 'Please enter a valid email address.' }),
});

type EmailChangeFormValues = z.infer<typeof emailChangeFormSchema>;

interface EmailChangeFormProps {
  onSubmit: (values: EmailChangeFormValues) => void;
  isSubmitting?: boolean;
}

export const EmailChangeForm: React.FC<EmailChangeFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const form = useForm<EmailChangeFormValues>({
    resolver: zodResolver(emailChangeFormSchema),
    defaultValues: {
      newEmail: '',
    },
  });

  function handleSubmit(values: EmailChangeFormValues) {
    // Placeholder onSubmit logic
    console.log('Email Change Form submitted:', values);
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Email Address</FormLabel>
              <FormControl>
                <Input placeholder="enter your new email" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <span className="mr-2 h-4 w-4 animate-spin" />}
          Update Email
        </Button>
      </form>
    </Form>
  );
};