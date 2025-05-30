
'use client';

import { useSkills } from '@/lib/hooks/useSkills';
import { useBadges } from '@/lib/hooks/useBadges';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle, Circle, Loader2, Trophy, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AchievementsPage() {
  const { user, loading: authLoading } = useAuth();
  const { skills, loading: skillsLoading, error: skillsError } = useSkills();
  const { badges, loading: badgesLoading, error: badgesError } = useBadges({ skills, skillsLoading });
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/achievements');
    }
  }, [user, authLoading, router]);

  const isLoading = authLoading || (user && (skillsLoading || badgesLoading));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading achievements...</p>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="text-center py-10">
         <Trophy size={48} className="mx-auto text-muted-foreground mb-4 opacity-70" />
        <p className="text-lg text-muted-foreground mb-4">Please <Link href="/login?redirect=/achievements" className="underline text-primary hover:text-primary/80">log in</Link> to view your achievements.</p>
      </div>
    );
  }

  if (skillsError || badgesError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto shadow-lg rounded-lg">
        <AlertTitle>Error Loading Achievements</AlertTitle>
        <AlertDescription>
          <p>There was a problem loading your achievements data. Please try refreshing the page.</p>
          {skillsError && <p>Skills error: {skillsError}</p>}
          {badgesError && <p>Badges error: {badgesError}</p>}
        </AlertDescription>
      </Alert>
    );
  }

  const achievedBadges = badges.filter(b => b.achievedAt);
  const unachievedBadges = badges.filter(b => !b.achievedAt);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Trophy size={32} className="text-accent" /> Your Achievements
        </h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 sm:max-w-md mb-6 shadow-sm">
          <TabsTrigger value="all">All Badges ({badges.length})</TabsTrigger>
          <TabsTrigger value="achieved">Achieved ({achievedBadges.length})</TabsTrigger>
          <TabsTrigger value="unachieved">To Earn ({unachievedBadges.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {badges.map(badge => (
                <BadgeDisplay key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <Card className="rounded-lg shadow-md">
              <CardContent className="p-10 text-center text-muted-foreground">
                <Award size={56} className="mx-auto mb-4 opacity-70" />
                <p className="text-xl">No badges available yet.</p>
                <p className="text-md">New badges might be added in the future!</p>
                 {badgesLoading && <p className="text-sm mt-2">Still loading badge definitions...</p>}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="achieved">
          {achievedBadges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {achievedBadges.map(badge => (
                <BadgeDisplay key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <Card className="rounded-lg shadow-md">
              <CardContent className="p-10 text-center text-muted-foreground">
                <CheckCircle size={56} className="mx-auto mb-4 text-accent opacity-80" />
                <p className="text-xl">You haven't earned any badges yet.</p>
                <p className="text-md mb-6">Keep practicing your skills to unlock them!</p>
                <Button asChild variant="outline">
                  <Link href="/skills">Go to Skills</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="unachieved">
          {unachievedBadges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {unachievedBadges.map(badge => (
                <BadgeDisplay key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
             badges.length > 0 && unachievedBadges.length === 0 ? ( 
              <Card className="rounded-lg shadow-md bg-gradient-to-br from-accent/20 via-primary/10 to-background">
                 <CardContent className="p-10 text-center text-accent-foreground">
                  <Sparkles size={56} className="mx-auto mb-4 text-primary" />
                  <p className="text-2xl font-semibold">Congratulations!</p>
                  <p className="text-lg">You've earned all available badges!</p>
                  <p className="text-md mt-1">Master of Skills!</p>
                </CardContent>
              </Card>
            ) : ( 
              <Card className="rounded-lg shadow-md">
                <CardContent className="p-10 text-center text-muted-foreground">
                  <Award size={56} className="mx-auto mb-4 opacity-70" />
                  <p className="text-xl">No badges left to earn.</p>
                   <p className="text-md">All available badges are either achieved or none are defined yet.</p>
                </CardContent>
              </Card>
            )
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
