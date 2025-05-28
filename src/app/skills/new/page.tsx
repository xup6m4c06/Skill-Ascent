
'use client';

import { AddSkillForm, type AddSkillFormValues } from '@/components/forms/AddSkillForm';
import { useSkills } from '@/lib/hooks/useSkills';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewSkillPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addSkill, loading: skillsLoading, error: skillsError } = useSkills(); // addSkill is now async
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/skills/new');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (values: AddSkillFormValues) => {
    try {
      const newSkill = await addSkill(values);
      toast({
        title: "Skill Added!",
        description: `"${newSkill.name}" has been successfully added.`,
        variant: 'default',
      });
      router.push('/skills');
    } catch (error) {
      toast({
        title: "Error Adding Skill",
        description: skillsError || "Could not add the skill. Please try again.",
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="text-center py-10">
        <p>Please <Link href="/login?redirect=/skills/new" className="underline">log in</Link> to add a new skill.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <AddSkillForm onSubmit={handleSubmit} isSubmitting={skillsLoading} />
    </div>
  );
}
