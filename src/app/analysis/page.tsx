
'use client';
import { useSkills } from '@/lib/hooks/useSkills';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Cloud, Loader2 } from 'lucide-react';
import { getTotalPracticeTime, formatDuration } from '@/lib/helpers';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

// Placeholder for Word Cloud Component
const SkillWordCloudPlaceholder = ({ skillsData }: { skillsData: { name: string, value: number }[] }) => {
  if (skillsData.length === 0) {
    return <p className="text-muted-foreground">Not enough skill data to generate a word cloud.</p>;
  }
  return (
    <div className="p-6 border border-dashed rounded-lg bg-muted/20 text-center">
      <Cloud size={48} className="mx-auto text-primary mb-4" />
      <p className="text-lg font-semibold">Skill Word Cloud</p>
      <p className="text-sm text-muted-foreground">
        This is where a word cloud visualizing your skills based on practice time would appear.
      </p>
      <div className="mt-4 space-x-2">
        {skillsData.slice(0, 5).map(skill => (
          <span key={skill.name} className="inline-block bg-primary/20 text-primary px-2 py-1 rounded-md text-xs">
            {skill.name} ({formatDuration(skill.value)})
          </span>
        ))}
      </div>
    </div>
  );
};


export default function AnalysisPage() {
  const { user, loading: authLoading } = useAuth();
  const { skills, loading: skillsLoading, error: skillsError } = useSkills();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/analysis');
    }
  }, [user, authLoading, router]);

  const isLoading = authLoading || (user && skillsLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading analysis data...</p>
      </div>
    );
  }
  
  if (!user && !authLoading) {
     return (
      <div className="text-center py-10">
        <p>Please <Link href="/login?redirect=/analysis" className="underline">log in</Link> to view your analysis.</p>
      </div>
    );
  }

  if (skillsError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTitle>Error Loading Analysis Data</AlertTitle>
        <AlertDescription>
          There was a problem loading your skills data for analysis: {skillsError}
        </AlertDescription>
      </Alert>
    );
  }

  const skillPracticeData = skills.map(skill => ({
    name: skill.name,
    value: getTotalPracticeTime(skill), // value typically represents frequency or importance
  })).filter(skill => skill.value > 0);


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <BarChart3 size={32} className="text-accent" /> Data Analysis
        </h1>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Skill Focus</CardTitle>
          <CardDescription>A visual representation of your skills based on practice time.</CardDescription>
        </CardHeader>
        <CardContent>
          <SkillWordCloudPlaceholder skillsData={skillPracticeData} />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Practice Time Distribution</CardTitle>
          <CardDescription>Overview of time invested in each skill.</CardDescription>
        </CardHeader>
        <CardContent>
          {skills && skills.length > 0 ? (
            <ul className="space-y-3">
              {skills.map(skill => {
                const time = getTotalPracticeTime(skill);
                return (
                  <li key={skill.id} className="p-3 bg-secondary/30 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-primary font-semibold">{formatDuration(time)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No skills with practice time logged yet.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
