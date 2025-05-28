'use client';

import { useSkills } from '@/lib/hooks/useSkills';
import { useBadges } from '@/lib/hooks/useBadges';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Award, CheckCircle, Circle } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AchievementsPage() {
  const { skills } = useSkills(); // Skills are needed to calculate badge achievement status
  const { badges } = useBadges(skills);

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
            <Card className="rounded-lg">
               <CardContent className="p-10 text-center text-muted-foreground">
                <Circle size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-lg">Congratulations!</p>
                <p className="text-sm">You've earned all available badges!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
