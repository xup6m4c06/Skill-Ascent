
'use client';
import type { Skill } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTotalPracticeTime, formatDuration, calculateProgress } from '@/lib/helpers';
import { BookOpen, Target, Clock, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const totalTime = getTotalPracticeTime(skill);
  const progress = calculateProgress(totalTime, skill.targetPracticeTime);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg flex flex-col h-full overflow-hidden border border-transparent hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            <BookOpen size={22} className="text-accent shrink-0" />
            <span className="break-words">{skill.name}</span>
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Added on {new Date(skill.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={16} className="shrink-0" />
          <span>Total practice: {formatDuration(totalTime)}</span>
        </div>
        {skill.targetPracticeTime && skill.targetPracticeTime > 0 ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target size={16} className="shrink-0" />
              <span>Target: {formatDuration(skill.targetPracticeTime * 60)}</span>
            </div>
            <Progress value={progress} aria-label={`${progress.toFixed(0)}% of target practice time`} className="w-full h-2 rounded-full" />
            <p className="text-xs text-right text-muted-foreground">{progress.toFixed(0)}% complete</p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">No target time set.</div>
        )}
      </CardContent>
      <CardFooter className="mt-auto pt-4 border-t border-border/50">
        <Button asChild variant="outline" size="sm" className="w-full hover:bg-accent/10 hover:border-accent transition-colors">
          <Link href={`/skills/${skill.id}`} legacyBehavior passHref>
            <a>
              <Edit3 className="mr-2 h-4 w-4" />
              View Details & Log Practice
            </a>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
