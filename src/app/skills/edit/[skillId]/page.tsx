'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming your Firestore instance is exported from here
import { Skill } from '@/types/index';
import { EditSkillForm } from '@/components/forms/EditSkillForm';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId as string;

  const [skill, setSkill] = React.useState<Skill | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSkill = async () => {
      try {
        if (!db) { // Check if db is null
          setError('Firestore is not initialized.');
          setLoading(false);
          return; // Exit if db is null
        }
        console.log('skillId:', skillId, 'db:', db);
        const skillRef = doc(db, 'skills', skillId); // 'skills' is your collection name
        const docSnap = await getDoc(skillRef);

        if (docSnap.exists()) {
          setSkill({ id: docSnap.id, ...docSnap.data() } as Skill);
        } else {
          setError('Skill not found.');
        }
      } catch (err: any) {
        console.error("Error fetching skill:", err);
        setError('Failed to load skill.');
      } finally {
        setLoading(false);
      }
    };

    if (skillId) {
      fetchSkill();
    }
  }, [skillId]);

  const handleSave = async (updatedSkill: Skill) => {
    try {
      if (!db) { // Check if db is null
        setError('Firestore is not initialized.');
        return; // Exit if db is null
      }
      console.log('skillId:', skillId, 'db:', db);
      const skillRef = doc(db, 'skills', skillId);
      // Prepare data for update, excluding the id
      const { id, ...dataToUpdate } = updatedSkill;
      await updateDoc(skillRef, dataToUpdate);
      router.push('/skills'); // Navigate back to skills list after saving
    } catch (err: any) {
      console.error("Error updating skill:", err);
      setError('Failed to save skill changes.'); // Set error state for feedback
      // Optionally, show a toast notification for the error
    }
  };

  const handleCancel = () => {
    router.back(); // Go back to the previous page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading skill data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!skill) {
    // This case should ideally be covered by the error state if skill not found,
    // but as a fallback, you might render a message or redirect
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Skill data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Skill: {skill.name}</h1>
      <div className="max-w-xl mx-auto">
        <EditSkillForm skill={skill} onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  );
}