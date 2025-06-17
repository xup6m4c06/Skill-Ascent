
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSkills } from "@/lib/hooks/useSkills";
import { useBadges } from "@/lib/hooks/useBadges";
import { SkillCard } from "@/components/SkillCard";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import Link from "next/link";
import { PlusCircle, TrendingUp, Award, LogIn, BookOpen, Loader2, ListChecks, BarChartBig, ShieldCheck } from "lucide-react";
import { formatDuration, getTotalPracticeTime } from "@/lib/helpers";
import { useAuth } from "@/hooks/useAuth";
import { AppLogo } from "@/components/AppLogo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { skills, loading: skillsLoading, error: skillsError } = useSkills();
  const { badges, loading: badgesLoading, error: badgesError } = useBadges({ skills, skillsLoading });

  if (authLoading || (user && (skillsLoading || badgesLoading))) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4">
        <div className="mb-8">
          <AppLogo size="lg" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Skill Ascent!</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md">
          Track your skills, log your practice, and watch your abilities soar.
          Sign in to get started on your journey of self-improvement.
        </p>
        <Button asChild size="lg">
          <Link href="/login" legacyBehavior>
            <LogIn className="mr-2 h-5 w-5" /> Sign In to Continue
          </Link>
        </Button>
      </div>
    );
  }
  
  if (skillsError || badgesError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-8 shadow-lg rounded-lg">
        <AlertTitle>Error Loading Dashboard</AlertTitle>
        <AlertDescription>
          There was a problem loading your dashboard data. Please try refreshing the page.
          {skillsError && <p>Skills error: {skillsError}</p>}
          {badgesError && <p>Badges error: {badgesError}</p>}
        </AlertDescription>
      </Alert>
    );
  }

  // Logged-in user dashboard content:
  const totalPracticeTimeAllSkills = skills.reduce(
    (total, skill) => total + getTotalPracticeTime(skill),
    0
  );

  const recentlyAchievedBadges = badges
    .filter(b => b.achievedAt)
    .sort((a, b) => new Date(b.achievedAt!).getTime() - new Date(a.achievedAt!).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <TrendingUp size={32} className="text-accent" /> Your Dashboard
          </h1>
          <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/skills/new" legacyBehavior>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Skill
            </Link>
          </Button>
        </div>

        <Card className="shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-xl">Overall Progress</CardTitle>
            <CardDescription>
              Hello, {user.displayName || user.email}! Here's your current progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <Card className="bg-secondary/30 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-2 flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Skills Tracked</CardTitle>
                <ListChecks className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent className="p-2">
                <div className="text-2xl font-bold">{skills.length}</div>
              </CardContent>
            </Card>
             <Card className="bg-secondary/30 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-2 flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Practice Time</CardTitle>
                <BarChartBig className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent className="p-2">
                <div className="text-2xl font-bold">{formatDuration(totalPracticeTimeAllSkills)}</div>
              </CardContent>
            </Card>
             <Card className="bg-secondary/30 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-2 flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
                <ShieldCheck className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent className="p-2">
                <div className="text-2xl font-bold">{badges.filter(b => b.achievedAt).length}</div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
          <Award size={28} className="text-accent" /> Recently Achieved Badges
        </h2>
        {recentlyAchievedBadges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyAchievedBadges.map(badge => (
              <BadgeDisplay key={badge.id} badge={badge} />
            ))}
          </div>
        ) : (
          <Card className="rounded-lg shadow-md">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Award size={40} className="mx-auto mb-3 text-accent opacity-70" />
              <p className="text-lg">No badges achieved recently.</p>
              <p className="text-sm">Keep practicing to unlock new achievements!</p>
              <Button variant="link" asChild className="mt-2 text-primary">
                <Link href="/achievements">View all badges</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
         <BookOpen size={28} className="text-accent" /> Your Skills
        </h2>
        {skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <Card className="rounded-lg shadow-md">
            <CardContent className="p-10 text-center">
              <BookOpen size={56} className="mx-auto text-muted-foreground mb-4 opacity-70" />
              <p className="text-xl text-muted-foreground mb-2">No skills defined yet.</p>
              <p className="text-md text-muted-foreground mb-6">Start your journey by adding a skill you want to develop.</p>
              <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/skills/new" legacyBehavior>
                  <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Skill
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
