
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
import WordCloud from 'react-d3-cloud';


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

  // Initialize skillPracticeData as an empty array
  const skillPracticeData = skills
    ? skills.map(skill => {
      const value = getTotalPracticeTime(skill);
      // Ensure value is a number and greater than 0
      if (typeof value === 'number' && value > 0) {
        return {
          text: skill.name,
          value: value,
        };
      }
      return null; // Return null for skills with invalid practice time
    }).filter(skill => skill !== null) // Filter out null values
    : []; // Provide an empty array if skills is null or undefined

  console.log('Skill practice data for word cloud (before return):', skillPracticeData);

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
 {Array.isArray(skillPracticeData) && skillPracticeData.length > 0 ? (
            <div className="w-full h-[300px] flex justify-center items-center"> {/* Container for the word cloud - Added flex for centering */}
              {/* @ts-expect-error */}
              <WordCloud words={skillPracticeData as { text: string; value: number; }[]} />
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Not enough skill data with practice time to generate a word cloud.</p>
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
            <ul className="space-y-3 max-h-60 overflow-y-auto"> {/* Added max-height and overflow for long lists */}
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
