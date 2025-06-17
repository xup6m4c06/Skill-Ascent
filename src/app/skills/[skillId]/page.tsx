
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
import { ArrowLeft, Edit3, Trash2, CalendarDays, Clock, StickyNote, PlusCircle, BookOpen, Target, Brain, Award, BarChartHorizontalBig, Loader2, History } from 'lucide-react';
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


  const isLoading = authLoading || skillsHookLoading || (user && !skill && skillsHookLoading); 

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
        <p>Please <Link href={`/login?redirect=/skills/${skillId}`} className="underline text-primary hover:text-primary/80">log in</Link> to view this skill.</p>
      </div>
    );
  }
  
  if (skillsError) {
     return (
       <Alert variant="destructive" className="max-w-2xl mx-auto shadow-lg rounded-lg">
         <AlertTitle>Error Loading Skill</AlertTitle>
         <AlertDescription>
           <p>There was a problem loading skill data: {skillsError}</p>
            <Button asChild variant="outline" className="mt-4 ml-auto block">
             <Link href="/skills" legacyBehavior passHref>
                <a>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Skills
                </a>
             </Link>
           </Button>
         </AlertDescription>
       </Alert>
     );
  }
  
  if (!skill && !skillsHookLoading) { 
    return (
      <div className="text-center py-10">
        <BookOpen size={48} className="mx-auto text-muted-foreground mb-4 opacity-70" />
        <h2 className="text-2xl font-semibold text-destructive">Skill not found</h2>
        <p className="text-muted-foreground mt-2 mb-6">The skill you are looking for does not exist or has been deleted.</p>
        <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg">
          <Link href="/skills" legacyBehavior passHref>
            <a>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Skills
            </a>
          </Link>
        </Button>
      </div>
    );
  }
  
  if (!skill) return null; 


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
    if (skill.learningGoals !== goals) {
        try {
            await updateSkill(skillId, { learningGoals: goals });
        } catch (e) {
            toast({ title: "Error updating goals", description: (e as Error).message || "Could not save learning goals.", variant: "destructive" });
        }
    }
  };

  const skillSpecificBadges = badges.filter(b => b.skillId === skillId && b.achievedAt);

  return (
    <div className="space-y-10">
      <Button variant="outline" size="sm" onClick={() => router.push('/skills')} className="mb-0 shadow-sm hover:shadow-md">
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
        <Card className="shadow-xl rounded-lg overflow-hidden border border-primary/20">
          <CardHeader className="bg-primary/10 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
                <BookOpen size={30} className="text-accent shrink-0"/> <span className="break-all">{skill.name}</span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsEditingSkill(true)} disabled={isSubmitting} className="shadow-sm hover:shadow-md">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Skill
              </Button>
            </div>
            <CardDescription className="mt-1 text-muted-foreground text-base">
              Current Level: <span className="font-semibold text-primary">{progressLevel}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-primary"><BarChartHorizontalBig size={20} className="text-accent"/>Progress Summary</h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2"><Clock size={16} className="text-muted-foreground"/> Total practice: <span className="font-medium text-foreground">{formatDuration(totalTime)}</span></p>
                {skill.targetPracticeTime && skill.targetPracticeTime > 0 ? (
                  <>
                    <p className="flex items-center gap-2"><Target size={16} className="text-muted-foreground"/> Target: <span className="font-medium text-foreground">{formatDuration(skill.targetPracticeTime * 60)}</span></p>
                    <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% of target achieved`} className="h-3 rounded-full" />
                    <p className="text-xs text-right text-muted-foreground">{progressPercentage.toFixed(0)}% of target achieved</p>
                  </>
                ) : (
                     <p className="flex items-center gap-2 text-muted-foreground italic"><Target size={16}/> No target time set.</p>
                )}
              </div>
            </div>
             {skill.learningGoals && (
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-primary"><Brain size={20} className="text-accent"/>Learning Goals</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/30 p-3 rounded-md">{skill.learningGoals}</p>
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
          <Card className="shadow-xl rounded-lg border border-primary/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                <PlusCircle size={22} className="text-accent" />
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
                <Button variant="outline" size="sm" className="w-full mt-4 shadow-sm hover:shadow-md" onClick={() => setEditingLogEntry(null)} disabled={isSubmitting}>
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
      
      <Card className="shadow-xl rounded-lg border border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            <History size={22} className="text-accent" /> Practice History
          </CardTitle>
           <CardDescription>
            A record of all your practice sessions for "{skill.name}".
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skill.practiceLog && skill.practiceLog.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Date</TableHead>
                    <TableHead className="min-w-[100px]">Duration</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skill.practiceLog.map((entry) => ( 
                    <TableRow key={entry.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell>{formatDuration(entry.duration)}</TableCell>
                      <TableCell className="max-w-xs whitespace-pre-wrap break-words">{entry.notes || <span className="text-muted-foreground italic">No notes</span>}</TableCell>
                      <TableCell className="text-right space-x-1">
                         <Button variant="ghost" size="icon" onClick={() => setEditingLogEntry(entry)} disabled={isSubmitting} title="Edit log">
                            <Edit3 className="h-4 w-4 text-blue-600" />
                         </Button>
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" disabled={isSubmitting} title="Delete log">
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
                              <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteLogEntry(entry.id)} 
                                disabled={isSubmitting && editingLogEntry?.id !== entry.id}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {isSubmitting && editingLogEntry?.id !== entry.id ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : null} Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <CalendarDays size={40} className="mx-auto mb-3 opacity-70" />
              <p className="text-lg">No practice logged for this skill yet.</p>
              <p className="text-sm">Log your first session above to start tracking your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
