
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, StickyNote, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  date: z.date({ required_error: "A date for the practice session is required." }),
  duration: z.coerce.number().positive("Duration must be a positive number.").min(1, "Duration must be at least 1 minute."),
  notes: z.string().max(500, "Notes must be at most 500 characters.").optional(),
});

export type LogPracticeFormValues = z.infer<typeof formSchema>;

interface LogPracticeFormProps {
  onSubmit: (values: LogPracticeFormValues) => Promise<void> | void;
  defaultValues?: Partial<LogPracticeFormValues>;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export function LogPracticeForm({ onSubmit, defaultValues, isEditing = false, isSubmitting = false }: LogPracticeFormProps) {
  const form = useForm<LogPracticeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      date: new Date(),
      duration: undefined,
      notes: "",
    },
  });

  // Reset form if defaultValues change (e.g. for new entry after editing)
  // This is handled by `key` prop on the component instance in parent.

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-1"><CalendarIcon size={16}/> Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01") || isSubmitting
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1"><Clock size={16}/> Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 60" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1"><StickyNote size={16}/> Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Worked on chapter 3, practiced scales." {...field} rows={3} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
          {isEditing ? "Update Log" : "Log Practice"}
        </Button>
      </form>
    </Form>
  );
}
