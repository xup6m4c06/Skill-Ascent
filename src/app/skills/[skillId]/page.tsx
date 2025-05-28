'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSkills } from '@/lib/hooks/useSkills';
import { useBadges } from '@/lib/hooks/useBadges';
import { AddSkillForm, type AddSkillFormValues } from '@/components/forms/AddSkillForm';
import { LogPracticeForm, type LogPracticeFormValues } from '@/components/forms/LogPracticeForm';
import { PersonalizedLearningPlan } from '@/components/PersonalizedLearningPlan';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { formatDuration, getTotalPracticeTime, calculateProgress, getSkillProgressLevel } from '@/lib/helpers';
import { ArrowLeft, Edit3, Trash2, CalendarDays, Clock, StickyNote, PlusCircle, BookOpen, Target, Brain, Award, BarChartHorizontalBig } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PracticeEntry } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SkillDetailPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId as string;
  
  const { skills, getSkillById, updateSkill, addPracticeEntry, deletePracticeEntry, updatePracticeEntry } = useSkills();
  const { badges } = useBadges(skills);
  const { toast } = useToast();

  const [skill, setSkill] = useState(getSkillById(skillId));
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [editingLogEntry, setEditingLogEntry] = useState<PracticeEntry | null>(null);

  useEffect(() => {
    setSkill(getSkillById(skillId));
  }, [skillId, skills, getSkillById]);

  if (!skill) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-destructive">Skill not found</h2>
        <p className="text-muted-foreground mt-2">The skill you are looking for does not exist or has been deleted.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/skills"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Skills</Link>
        </Button>
      </div>
    );
  }

  const totalTime = getTotalPracticeTime(skill);
  const progressPercentage = calculateProgress(totalTime, skill.targetPracticeTime);
  const progressLevel = getSkillProgressLevel(totalTime);

  const handleUpdateSkill = (values: AddSkillFormValues) => {
    updateSkill(skillId, values);
    toast({ title: "Skill Updated", description: `"${values.name}" has been updated.` });
    setIsEditingSkill(false);
  };

  const handleLogPractice = (values: LogPracticeFormValues) => {
    if(editingLogEntry) {
      updatePracticeEntry(skillId, editingLogEntry.id, { ...values, date: values.date.toISOString() });
      toast({ title: "Practice Log Updated", description: `Log entry for ${new Date(values.date).toLocaleDateString()} updated.`});
      setEditingLogEntry(null);
    } else {
      addPracticeEntry(skillId, { ...values, date: values.date.toISOString() });
      toast({ title: "Practice Logged!", description: `${formatDuration(values.duration)} for "${skill.name}" logged.` });
    }
  };
  
  const handleDeleteLogEntry = (entryId: string) => {
    deletePracticeEntry(skillId, entryId);
    toast({ title: "Log Entry Deleted", description: "The practice log entry has been removed.", variant: "destructive" });
  };

  const handleUpdateLearningGoals = (goals: string) => {
    updateSkill(skillId, { learningGoals: goals });
    // Toast is optional here as it's part of AI feature interaction
  };

  const skillSpecificBadges = badges.filter(b => b.skillId === skillId && b.achievedAt);

  return (
    <div className="space-y-8">
      <Button variant="outline" size="sm" onClick={() => router.push('/skills')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Skills
      </Button>

      {isEditingSkill ? (
        <AddSkillForm 
          onSubmit={handleUpdateSkill} 
          defaultValues={{ name: skill.name, targetPracticeTime: skill.targetPracticeTime, learningGoals: skill.learningGoals }} 
          isEditing 
        />
      ) : (
        <Card className="shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="bg-primary/10 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
                <BookOpen size={32} className="text-accent"/> {skill.name}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsEditingSkill(true)}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Skill Details
              </Button>
            </div>
            <CardDescription className="mt-1 text-muted-foreground">
              Current Level: <span className="font-semibold text-primary">{progressLevel}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-1 flex items-center gap-1"><BarChartHorizontalBig size={20}/>Progress Summary</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-1"><Clock size={16}/> Total practice: <span className="font-medium">{formatDuration(totalTime)}</span></p>
                {skill.targetPracticeTime && (
                  <>
                    <p className="flex items-center gap-1"><Target size={16}/> Target: <span className="font-medium">{formatDuration(skill.targetPracticeTime * 60)}</span></p>
                    <Progress value={progressPercentage} className="h-3 rounded-full" />
                    <p className="text-xs text-right">{progressPercentage.toFixed(0)}% of target achieved</p>
                  </>
                )}
              </div>
            </div>
             {skill.learningGoals && (
              <div>
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-1"><Brain size={20}/>Learning Goals</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{skill.learningGoals}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {skillSpecificBadges.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
             <Award size={28} className="text-accent" /> Badges for {skill.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {skillSpecificBadges.map(badge => (
              <BadgeDisplay key={badge.id} badge={badge} />
            ))}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                <PlusCircle size={24} className="text-accent" />
                {editingLogEntry ? "Edit Practice Log" : "Log New Practice"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LogPracticeForm 
                key={editingLogEntry ? editingLogEntry.id : 'new'} // Re-mount form when editingLogEntry changes
                onSubmit={handleLogPractice}
                defaultValues={editingLogEntry ? {
                  date: new Date(editingLogEntry.date),
                  duration: editingLogEntry.duration,
                  notes: editingLogEntry.notes
                } : { date: new Date() }}
                isEditing={!!editingLogEntry}
              />
              {editingLogEntry && (
                <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setEditingLogEntry(null)}>
                  Cancel Edit
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <PersonalizedLearningPlan skill={skill} onUpdateLearningGoals={handleUpdateLearningGoals} />
        </div>
      </div>
      
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            <CalendarDays size={24} className="text-accent" /> Practice History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {skill.practiceLog.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skill.practiceLog.slice().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatDuration(entry.duration)}</TableCell>
                    <TableCell className="max-w-xs truncate">{entry.notes || '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="icon" onClick={() => setEditingLogEntry(entry)}>
                          <Edit3 className="h-4 w-4" />
                       </Button>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Log Entry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this practice log from {new Date(entry.date).toLocaleDateString()}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteLogEntry(entry.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No practice logged for this skill yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
