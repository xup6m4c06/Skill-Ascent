
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSkills } from "@/lib/hooks/useSkills";
import Link from "next/link";
import { PlusCircle, Edit3, Trash2, BookOpen, Target, Clock, Loader2 } from "lucide-react";
import { formatDuration, getTotalPracticeTime, calculateProgress } from "@/lib/helpers";
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
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SkillsPage() {
  const { user, loading: authLoading } = useAuth();
  const { skills, deleteSkill, loading: skillsLoading, error: skillsError } = useSkills();
  const { toast } = useToast();
  const router = useRouter();

   useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/skills');
    }
  }, [user, authLoading, router]);

  const handleDeleteSkill = async (skillId: string, skillName: string) => {
    try {
      await deleteSkill(skillId);
      toast({
        title: "Skill Deleted",
        description: `"${skillName}" has been removed.`,
        variant: "destructive",
      });
    } catch (error) {
       toast({
        title: "Error Deleting Skill",
        description: `Could not delete "${skillName}". Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  if (authLoading || (user && skillsLoading)) {
     return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
         <p className="ml-4 text-muted-foreground">Loading skills...</p>
      </div>
    );
  }

  if (!user && !authLoading) {
     // This case should be handled by the useEffect redirect, but as a fallback:
    return (
      <div className="text-center py-10">
        <p>Please <Link href="/login?redirect=/skills" className="underline">log in</Link> to manage your skills.</p>
      </div>
    );
  }
  
  if (skillsError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTitle>Error Loading Skills</AlertTitle>
        <AlertDescription>
          There was a problem loading your skills data: {skillsError}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <BookOpen size={32} className="text-accent" /> Manage Your Skills
        </h1>
        <Button asChild size="lg">
          <Link href="/skills/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Skill
          </Link>
        </Button>
      </div>

      {skills && skills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const totalTime = getTotalPracticeTime(skill);
            const progress = calculateProgress(totalTime, skill.targetPracticeTime);
            return (
              <Card key={skill.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
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
                <CardContent className="flex-grow space-y-3">
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
                <CardFooter className="flex justify-between items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/skills/${skill.id}`}>
                      <Edit3 className="mr-2 h-4 w-4" /> View/Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the skill "{skill.name}" and all its practice logs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteSkill(skill.id, skill.name)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="rounded-lg">
          <CardContent className="p-10 text-center">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">You haven't added any skills yet.</p>
            <p className="text-sm text-muted-foreground mb-6">Click the button above to start tracking a new skill!</p>
             <Button asChild>
                <Link href="/skills/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Skill
                </Link>
              </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
