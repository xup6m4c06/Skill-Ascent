'use client';
import { useSkills } from '@/lib/hooks/useSkills';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Loader2 } from 'lucide-react';
import { getTotalPracticeTime, formatDuration } from '@/lib/helpers';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';


const SkillWordCloud = dynamic(() => import('@/components/SkillWordCloud'), {
  ssr: false,
});

// Define a color mapping function based on word value
const getColorByValue = (word: { text: string; value: number }): string => {
  // We'll calculate the max practice time within the component or pass it down
  // For now, a simple example mapping value to a shade of gray
  const shade = Math.max(0, 200 - Math.floor(word.value * 0.5)); // Adjust multiplier for desired range
  return `rgb(${shade}, ${shade}, ${shade})`;
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
        <p>
          Please <Link href="/login?redirect=/analysis" className="underline">log in</Link> to view your analysis.
        </p>
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

  const skillPracticeData = (skills || [])
    .map(skill => {
      const value = getTotalPracticeTime(skill);
      if (typeof value === 'number' && value > 0) {
        return {
          text: skill.name,
          value: value,
        };
      }
      return null;
    })
    .filter(skillData => skillData !== null) as Array<{ text: string; value: number }>;
 
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <BarChart3 size={32} className="text-accent" />
          Data Analysis
        </h1>
      </div>

 <Card className="shadow-lg rounded-lg w-full">
        <CardHeader>
          <CardTitle>Skill Word Cloud</CardTitle>
          <CardDescription>Visual representation of skills based on practice time.</CardDescription>
        </CardHeader>
        <CardContent>
          {skillPracticeData.length > 0 ? (
            <div className="w-full h-64 flex items-center justify-center">
              <SkillWordCloud data={skillPracticeData} 
                fontSizeMapper={(word) => word.value * 20 + 20}
              />
            </div>

          ) : (
            <p className="text-muted-foreground text-center py-4">No practice time logged for word cloud analysis.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Practice Time Distribution</CardTitle>
          <CardDescription>Overview of time invested in each skill.</CardDescription>
        </CardHeader>
        <CardContent>
          {skills && skills.length > 0 ? (
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {skills.map(skill => {
                const time = getTotalPracticeTime(skill);
                return (
                  <li key={skill.id} className="p-3 bg-secondary/30 rounded-md">
                    <div className="w-full flex justify-between items-center">
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
