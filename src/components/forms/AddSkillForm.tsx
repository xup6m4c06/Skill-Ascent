
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Target, Brain, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Skill name must be at least 2 characters.")
    .max(50, "Skill name must be at most 50 characters."),
  targetPracticeTime: z.coerce
    .number()
    .optional()
    .refine((val) => val === undefined || val > 0, {
      message: "Target time must be a positive number.",
    }),
  learningGoals: z
    .string()
    .max(500, "Learning goals must be at most 500 characters.")
    .optional(),
});


export type AddSkillFormValues = z.infer<typeof formSchema>;

interface AddSkillFormProps {
  onSubmit: (values: AddSkillFormValues) => Promise<void> | void;
  defaultValues?: Partial<AddSkillFormValues>;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export function AddSkillForm({ onSubmit, defaultValues, isEditing = false, isSubmitting = false }: AddSkillFormProps) {
  const form = useForm<AddSkillFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      targetPracticeTime: undefined,
      learningGoals: "",
    },
  });

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <BookOpen size={28} className="text-accent"/> {isEditing ? "Edit Skill" : "Add New Skill"}
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update the details of your skill." : "Define a new skill you want to develop and track."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><BookOpen size={16}/> Skill Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Python Programming" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetPracticeTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><Target size={16}/> Target Practice Time (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50 (in hours)" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormDescription>
                    Set a goal for how many hours you want to practice this skill.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="learningGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><Brain size={16}/> Learning Goals (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Build a web app, understand data structures" {...field} rows={3} disabled={isSubmitting} />
                  </FormControl>
                   <FormDescription>
                    Describe what you want to achieve with this skill.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              {isEditing ? "Save Changes" : "Add Skill"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
