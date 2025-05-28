
'use client';

import { useSkills } from '@/lib/hooks/useSkills';
import { useBadges } from '@/lib/hooks/useBadges';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Award, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

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
        <p>Please <Link href="/login?redirect=/achievements" className="underline">log in</Link> to view your achievements.</p>
      </div>
    );
  }

  if (skillsError || badgesError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTitle>Error Loading Achievements</AlertTitle>
        <AlertDescription>
          There was a problem loading your achievements data. Please try refreshing the page.
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
          <Award size={32} className="text-accent" /> Your Achievements
        </h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md mb-6">
          <TabsTrigger value="all">All Badges ({badges.length})</TabsTrigger>
          <TabsTrigger value="achieved">Achieved ({achievedBadges.length})</TabsTrigger>
          <TabsTrigger value="unachieved">To Earn ({unachievedBadges.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map(badge => (
                <BadgeDisplay key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <Card className="rounded-lg">
              <CardContent className="p-10 text-center text-muted-foreground">
                <Award size={48} className="mx-auto mb-4" />
                <p className="text-lg">No badges available at the moment.</p>
                 {badgesLoading && <p className="text-sm">Still loading badge definitions...</p>}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="achieved">
          {achievedBadges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievedBadges.map(badge => (
                <BadgeDisplay key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <Card className="rounded-lg">
              <CardContent className="p-10 text-center text-muted-foreground">
                <CheckCircle size={48} className="mx-auto mb-4 text-accent" />
                <p className="text-lg">You haven't earned any badges yet.</p>
                <p className="text-sm">Keep practicing to unlock them!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="unachieved">
          {unachievedBadges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unachievedBadges.map(badge => (
                <BadgeDisplay key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
             badges.length > 0 && unachievedBadges.length === 0 ? ( // Only show "all earned" if badges HAVE loaded
              <Card className="rounded-lg">
                 <CardContent className="p-10 text-center text-muted-foreground">
                  <Circle size={48} className="mx-auto mb-4 text-primary" />
                  <p className="text-lg">Congratulations!</p>
                  <p className="text-sm">You've earned all available badges!</p>
                </CardContent>
              </Card>
            ) : ( // Default empty state for "To Earn" if badges haven't loaded or none exist
              <Card className="rounded-lg">
                <CardContent className="p-10 text-center text-muted-foreground">
                  <Award size={48} className="mx-auto mb-4" />
                  <p className="text-lg">No badges left to earn or still loading.</p>
                </CardContent>
              </Card>
            )
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
