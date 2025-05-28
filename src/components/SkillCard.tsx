'use client';
import type { Skill } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTotalPracticeTime, formatDuration, calculateProgress } from '@/lib/helpers';
import { BookOpen, Target, Clock } from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const totalTime = getTotalPracticeTime(skill);
  const progress = calculateProgress(totalTime, skill.targetPracticeTime);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            <BookOpen size={24} className="text-accent" />
            {skill.name}
          </CardTitle>
        </div>
        <CardDescription>
          Added on {new Date(skill.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={16} />
          <span>Total practice: {formatDuration(totalTime)}</span>
        </div>
        {skill.targetPracticeTime && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target size={16} />
              <span>Target: {formatDuration(skill.targetPracticeTime * 60)}</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-xs text-right text-muted-foreground">{progress.toFixed(0)}% complete</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/skills/${skill.id}`}>View Details & Log Practice</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
