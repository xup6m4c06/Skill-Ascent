'use client';

import { useState, useEffect } from 'react';
import type { Skill } from '@/types';
import { personalizedLearningTips, PersonalizedLearningTipsInput, PersonalizedLearningTipsOutput } from '@/ai/flows/personalized-learning-tips';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FormDescription } from "@/components/ui/form"; // Import FormDescription
import { Label } from '@/components/ui/label';
import { Loader2, Wand2, Lightbulb, BookOpenCheck } from 'lucide-react';
import { getTotalPracticeTime, getSkillProgressLevel } from '@/lib/helpers';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PersonalizedLearningPlanProps {
  skill: Skill;
  onUpdateLearningGoals: (goals: string) => void;
}

export function PersonalizedLearningPlan({ skill, onUpdateLearningGoals }: PersonalizedLearningPlanProps) {
  const [learningGoals, setLearningGoals] = useState(skill.learningGoals || '');
  const [tipsOutput, setTipsOutput] = useState<PersonalizedLearningTipsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLearningGoals(skill.learningGoals || '');
  }, [skill.learningGoals]);

  const handleGenerateTips = async () => {
    setIsLoading(true);
    setError(null);
    setTipsOutput(null);

    // Update skill with current learning goals before generating tips
    onUpdateLearningGoals(learningGoals); 

    const totalPracticeMinutes = getTotalPracticeTime(skill);
    const progressLevel = getSkillProgressLevel(totalPracticeMinutes);

    const input: PersonalizedLearningTipsInput = {
      skillName: skill.name,
      practiceTime: totalPracticeMinutes,
      progressLevel: progressLevel,
      learningGoals: learningGoals || "General improvement",
    };

    try {
      const output = await personalizedLearningTips(input);
      setTipsOutput(output);
    } catch (e) {
      console.error("Error generating learning tips:", e);
      setError("Failed to generate learning tips. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
          <Wand2 size={24} className="text-accent" />
          Personalized Learning Plan
        </CardTitle>
        <CardDescription>
          Get AI-powered tips and resources to accelerate your learning for "{skill.name}".
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="learning-goals" className="text-base font-medium mb-2 block">Your Learning Goals for {skill.name}</Label>
          <Textarea
            id="learning-goals"
            placeholder="e.g., Understand advanced concepts, prepare for an exam, build a specific project..."
            value={learningGoals}
            onChange={(e) => setLearningGoals(e.target.value)}
            onBlur={() => onUpdateLearningGoals(learningGoals)}
            rows={3}
            className="mb-3"
          />
          <p className="text-xs text-muted-foreground">Clearly defining your goals helps the AI provide more relevant advice. This will be saved with your skill.</p>
        </div>
        <Button onClick={handleGenerateTips} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Tips & Resources
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {tipsOutput && (
          <div className="space-y-6 mt-6 pt-6 border-t">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Lightbulb size={20} className="text-accent" />
                Personalized Tips:
              </h3>
              {tipsOutput.tips.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 pl-2">
                  {tipsOutput.tips.map((tip, index) => (
                    <li key={`tip-${index}`} className="text-sm leading-relaxed">{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No specific tips generated. Try refining your goals.</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpenCheck size={20} className="text-accent" />
                Suggested Resources:
              </h3>
              {tipsOutput.resources.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 pl-2">
                {tipsOutput.resources.map((resource, index) => (
                  <li key={`resource-${index}`} className="text-sm leading-relaxed">
                    {resource.startsWith('http') ? (
                      <a href={resource} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {resource}
                      </a>
                    ) : (
                      resource
                    )}
                  </li>
                ))}
              </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No specific resources generated. Try refining your goals.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
