
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSkills } from '@/lib/hooks/useSkills';
import { useBadges } from '@/lib/hooks/useBadges'; // Pass skills and loading state
import { AddSkillForm, type AddSkillFormValues } from '@/components/forms/AddSkillForm';
import { LogPracticeForm, type LogPracticeFormValues } from '@/components/forms/LogPracticeForm';
import { PersonalizedLearningPlan } from '@/components/PersonalizedLearningPlan';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { formatDuration, getTotalPracticeTime, calculateProgress, getSkillProgressLevel } from '@/lib/helpers';
import { ArrowLeft, Edit3, Trash2, CalendarDays, Clock, StickyNote, PlusCircle, BookOpen, Target, Brain, Award, BarChartHorizontalBig, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import type { PracticeEntry, Skill } from '@/types';
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
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function SkillDetailPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId as string;
  
  const { user, loading: authLoading } = useAuth();
  const { 
    skills, 
    getSkillById, 
    updateSkill, 
    addPracticeEntry, 
    deletePracticeEntry, 
    updatePracticeEntry,
    loading: skillsHookLoading, // Renamed to avoid conflict
    error: skillsError 
  } = useSkills();
  
  // Memoize skill to prevent re-renders if skills array reference changes but content for this skillId doesn't
  const skill = useMemo(() => getSkillById(skillId), [skillId, skills, getSkillById]);

  const { badges, loading: badgesLoading, error: badgesError } = useBadges({ skills, skillsLoading: skillsHookLoading });
  const { toast } = useToast();

  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [editingLogEntry, setEditingLogEntry] = useState<PracticeEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/skills/${skillId}`);
    }
  }, [user, authLoading, router, skillId]);


  const isLoading = authLoading || skillsHookLoading || (user && !skill && skillsHookLoading); // skill might be undefined during initial load

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading skill details...</p>
      </div>
    );
  }

  if (!user && !authLoading) {
     return (
      <div className="text-center py-10">
        <p>Please <Link href={`/login?redirect=/skills/${skillId}`} className="underline">log in</Link> to view this skill.</p>
      </div>
    );
  }
  
  if (skillsError) {
     return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTitle>Error Loading Skill</AlertTitle>
        <AlertDescription>
          There was a problem loading skill data: {skillsError}
           <Button asChild variant="outline" className="mt-4 ml-auto block">
            <Link href="/skills"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Skills</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!skill && !skillsHookLoading) { // Ensure not to show "not found" while still loading
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
  
  // This check is only valid if skill is loaded
  if (!skill) return null; // Should be covered by loading or error state, but as a safeguard


  const totalTime = getTotalPracticeTime(skill);
  const progressPercentage = calculateProgress(totalTime, skill.targetPracticeTime);
  const progressLevel = getSkillProgressLevel(totalTime);

  const handleUpdateSkill = async (values: AddSkillFormValues) => {
    setIsSubmitting(true);
    try {
      await updateSkill(skillId, values);
      toast({ title: "Skill Updated", description: `"${values.name}" has been updated.` });
      setIsEditingSkill(false);
    } catch (e) {
      toast({ title: "Error updating skill", description: (e as Error).message || "Could not update skill.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogPractice = async (values: LogPracticeFormValues) => {
    setIsSubmitting(true);
    try {
      if(editingLogEntry) {
        await updatePracticeEntry(skillId, editingLogEntry.id, { ...values, date: values.date.toISOString() });
        toast({ title: "Practice Log Updated", description: `Log entry for ${new Date(values.date).toLocaleDateString()} updated.`});
        setEditingLogEntry(null);
      } else {
        await addPracticeEntry(skillId, { ...values, date: values.date.toISOString() });
        toast({ title: "Practice Logged!", description: `${formatDuration(values.duration)} for "${skill.name}" logged.` });
      }
    } catch (e) {
      toast({ title: "Error logging practice", description: (e as Error).message || "Could not log practice.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      // Reset form if it's a new entry (by key change or explicit reset if using react-hook-form's reset)
    }
  };
  
  const handleDeleteLogEntry = async (entryId: string) => {
    setIsSubmitting(true);
    try {
      await deletePracticeEntry(skillId, entryId);
      toast({ title: "Log Entry Deleted", description: "The practice log entry has been removed.", variant: "destructive" });
    } catch (e) {
      toast({ title: "Error deleting log", description: (e as Error).message || "Could not delete log entry.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLearningGoals = async (goals: string) => {
    // This function is called onBlur from PersonalizedLearningPlan's textarea
    // We only want to save if the goal actually changed from what's in the skill object
    if (skill.learningGoals !== goals) {
        try {
            await updateSkill(skillId, { learningGoals: goals });
            // Optionally, provide a subtle toast for this auto-save like action
            // toast({ title: "Learning goals updated", duration: 2000 });
        } catch (e) {
            toast({ title: "Error updating goals", description: (e as Error).message || "Could not save learning goals.", variant: "destructive" });
        }
    }
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
          isSubmitting={isSubmitting}
        />
      ) : (
        <Card className="shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="bg-primary/10 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
                <BookOpen size={32} className="text-accent"/> {skill.name}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsEditingSkill(true)} disabled={isSubmitting}>
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
                key={editingLogEntry ? editingLogEntry.id : 'new'}
                onSubmit={handleLogPractice}
                defaultValues={editingLogEntry ? {
                  date: new Date(editingLogEntry.date),
                  duration: editingLogEntry.duration,
                  notes: editingLogEntry.notes
                } : { date: new Date() }}
                isEditing={!!editingLogEntry}
                isSubmitting={isSubmitting}
              />
              {editingLogEntry && (
                <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setEditingLogEntry(null)} disabled={isSubmitting}>
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
          {skill.practiceLog && skill.practiceLog.length > 0 ? (
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
                {skill.practiceLog.map((entry) => ( // practiceLog is already sorted by useSkills hook
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatDuration(entry.duration)}</TableCell>
                    <TableCell className="max-w-xs truncate">{entry.notes || '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="icon" onClick={() => setEditingLogEntry(entry)} disabled={isSubmitting}>
                          <Edit3 className="h-4 w-4" />
                       </Button>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={isSubmitting}>
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
                            <AlertDialogAction onClick={() => handleDeleteLogEntry(entry.id)} disabled={isSubmitting}>
                              {isSubmitting && editingLogEntry?.id !== entry.id ? <Loader2 className="animate-spin mr-2"/> : null} Delete
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
