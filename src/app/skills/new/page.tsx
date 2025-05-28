'use client';

import { AddSkillForm, type AddSkillFormValues } from '@/components/forms/AddSkillForm';
import { useSkills } from '@/lib/hooks/useSkills';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function NewSkillPage() {
  const router = useRouter();
  const { addSkill } = useSkills();
  const { toast } = useToast();

  const handleSubmit = (values: AddSkillFormValues) => {
    const newSkill = addSkill(values);
    toast({
      title: "Skill Added!",
      description: `"${newSkill.name}" has been successfully added.`,
      variant: 'default',
    });
    router.push('/skills');
  };

  return (
    <div className="container mx-auto py-8">
      <AddSkillForm onSubmit={handleSubmit} />
    </div>
  );
}
