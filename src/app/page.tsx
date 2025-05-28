'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSkills } from "@/lib/hooks/useSkills";
import { useBadges } from "@/lib/hooks/useBadges";
import { SkillCard } from "@/components/SkillCard";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import Link from "next/link";
import { PlusCircle, TrendingUp, Award } from "lucide-react";
import { formatDuration, getTotalPracticeTime } from "@/lib/helpers";

export default function DashboardPage() {
  const { skills } = useSkills();
  const { badges } = useBadges(skills);

  const totalPracticeTimeAllSkills = skills.reduce(
    (total, skill) => total + getTotalPracticeTime(skill),
    0
  );

  const recentlyAchievedBadges = badges
    .filter(b => b.achievedAt)
    .sort((a, b) => new Date(b.achievedAt!).getTime() - new Date(a.achievedAt!).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <TrendingUp size={32} className="text-accent" /> Your Dashboard
          </h1>
          <Button asChild size="lg">
            <Link href="/skills/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Skill
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary/30 rounded-md">
              <p className="text-sm text-muted-foreground">Total Skills</p>
              <p className="text-2xl font-semibold">{skills.length}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-md">
              <p className="text-sm text-muted-foreground">Total Practice Time</p>
              <p className="text-2xl font-semibold">{formatDuration(totalPracticeTimeAllSkills)}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-md">
              <p className="text-sm text-muted-foreground">Badges Earned</p>
              <p className="text-2xl font-semibold">{badges.filter(b => b.achievedAt).length}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
          <Award size={28} className="text-accent" /> Recently Achieved Badges
        </h2>
        {recentlyAchievedBadges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyAchievedBadges.map(badge => (
              <BadgeDisplay key={badge.id} badge={badge} />
            ))}
          </div>
        ) : (
          <Card className="rounded-lg">
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>No badges achieved yet. Keep practicing!</p>
              <Button variant="link" asChild className="mt-2">
                <Link href="/achievements">View all badges</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Your Skills</h2>
        {skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <Card className="rounded-lg">
            <CardContent className="p-10 text-center">
              <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No skills defined yet.</p>
              <p className="text-sm text-muted-foreground mb-6">Start your journey by adding a skill you want to develop.</p>
              <Button asChild>
                <Link href="/skills/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Skill
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
