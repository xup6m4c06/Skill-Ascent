// src/components/forms/EditSkillForm.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CategorySelect } from './CategorySelect';
import { Skill } from '@/types/index';

interface EditSkillFormProps {
  skill: Skill;
  onSave: (updatedSkill: Skill) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Skill name must be at least 2 characters.',
  }),
  category: z.string().optional().nullable().transform(e => e === '' ? undefined : e),
});

type EditSkillFormValues = z.infer<typeof formSchema>;

export function EditSkillForm({ skill, onSave, onCancel }: EditSkillFormProps) {
  const form = useForm<EditSkillFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: skill.name,
      category: skill.category || '',
    },
  });

  function onSubmit(values: EditSkillFormValues) {
    const updatedSkill: Skill = {
      ...skill,
      name: values.name,
      category: values.category === null ? undefined : values.category,
    };
    onSave(updatedSkill);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter skill name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategorySelect 
                  value={field.value || ''} // Ensure value is a string for Select component
                  onValueChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}