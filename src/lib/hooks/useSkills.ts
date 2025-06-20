
'use client';
import type { Skill, PracticeEntry } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  query,
  orderBy,
  Timestamp, // For potential future use with Firestore Timestamps
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export function useSkills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize state based on conditions
    setSkills([]); // Start with an empty array
    setLoading(user && db ? true : false); // Only show loading if user and db are available
    setError(db ? null : "Firestore is not initialized."); // Set error if db is not initialized initially

    if (!user || !db) return; // Exit if user or db are not available
    setError(null);
    const skillsCollectionRef = collection(db, 'users', user.uid, 'skills');
    // Optionally, order skills by creation date or name
    const q = query(skillsCollectionRef, orderBy('createdAt', 'desc'));

    getDocs(q)
      .then((querySnapshot) => {
        const fetchedSkills = querySnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data();
          // Ensure practiceLog is an array, even if undefined in Firestore
            const practiceLog = Array.isArray(data.practiceLog)
              ? data.practiceLog.map((entry: any) => ({
                  ...entry,
                  date: entry.date instanceof Timestamp ? entry.date.toDate().toISOString() : entry.date,
                }))
              : [];

            // Convert Firestore Timestamp for createdAt to ISO string if it exists
            const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt;

            return {
              id: docSnapshot.id,
              ...data,
              createdAt,
              practiceLog,
          } as Skill;
        });
        console.log('Fetched skills:', fetchedSkills);
        setSkills(fetchedSkills);
      })
      .catch((err) => {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills. Please try again.");
        setSkills([]);
      })
      .finally(() => {
        setLoading(false);
 });
  }, [user]);

  const addSkill = useCallback(async (newSkillData: Omit<Skill, 'id' | 'createdAt' | 'practiceLog'>) => {
    if (!user) {
      setError("User not authenticated to add skill.");
      throw new Error("User not authenticated");
    }
    if (!db) {
 setError("Firestore is not initialized.");
      throw new Error("User not authenticated");
    }
    setLoading(true);
    const skillWithDefaults: Omit<Skill, 'id'> = {
      ...newSkillData,
      createdAt: new Date().toISOString(),
      practiceLog: [],
    };
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'skills'), skillWithDefaults);
      const newSkill = { ...skillWithDefaults, id: docRef.id };
      setSkills((prev) => [newSkill, ...prev]); // Add to start for optimistic UI, assuming sort by createdAt desc
      setError(null);
      return newSkill;
    } catch (err) {
      console.error("Error adding skill:", err);
      setError("Failed to add skill.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateSkill = useCallback(async (skillId: string, updatedData: Partial<Omit<Skill, 'id' | 'createdAt' | 'practiceLog'>>) => {
    if (!user) {
      setError("User not authenticated to update skill.");
      throw new Error("User not authenticated");
    }
    if (!db) {
 setError("Firestore is not initialized.");
      throw new Error("User not authenticated");
    }
    setLoading(true);
    const skillDocRef = doc(db, 'users', user.uid, 'skills', skillId);
    try {
      await updateDoc(skillDocRef, updatedData);
      setSkills((prev) =>
        prev.map((s) => (s.id === skillId ? { ...s, ...updatedData } : s))
      );
      setError(null);
    } catch (err) {
      console.error("Error updating skill:", err);
      setError("Failed to update skill.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteSkill = useCallback(async (skillId: string) => {
    if (!user) {
      setError("User not authenticated to delete skill.");
      throw new Error("User not authenticated");
    }
    if (!db) {
 setError("Firestore is not initialized.");
      throw new Error("User not authenticated");
    }
    setLoading(true);
    const skillDocRef = doc(db, 'users', user.uid, 'skills', skillId);
    try {
      await deleteDoc(skillDocRef);
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      setError(null);
    } catch (err) {
      console.error("Error deleting skill:", err);
      setError("Failed to delete skill.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addPracticeEntry = useCallback(async (skillId: string, entryData: Omit<PracticeEntry, 'id'>) => {
    if (!user) {
      setError("User not authenticated to add practice entry.");
      throw new Error("User not authenticated");
    }
    if (!db) {
 setError("Firestore is not initialized.");
      throw new Error("User not authenticated");
    }
    setLoading(true);
    const skillDocRef = doc(db, 'users', user.uid, 'skills', skillId);
    const newEntry: PracticeEntry = {
      id: uuidv4(),
      date: new Date(entryData.date).toISOString(),
      duration: entryData.duration,
      notes: entryData.notes ?? null, // Explicitly set notes to null if undefined
    };
    try {
      console.log('Adding practice entry to Firestore:', newEntry); // Added console log
      await updateDoc(skillDocRef, {
        practiceLog: arrayUnion(newEntry),
      });
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill.id === skillId
            ? { ...skill, practiceLog: [...(skill.practiceLog || []), newEntry].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }
            : skill
        )
      );
      setError(null);
      return newEntry;
    } catch (err) {
      console.error("Error adding practice entry:", err);
      setError("Failed to add practice entry.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePracticeEntry = useCallback(async (skillId: string, entryId: string, updatedEntryData: Partial<Omit<PracticeEntry, 'id'>>) => {
    if (!user) {
      setError("User not authenticated to update practice entry.");
      throw new Error("User not authenticated");
    }
    if (!db) {
 setError("Firestore is not initialized.");
      throw new Error("User not authenticated");
    }
    setLoading(true);
    const skillDocRef = doc(db, 'users', user.uid, 'skills', skillId);
    const skillToUpdate = skills.find((s) => s.id === skillId);
    if (!skillToUpdate) throw new Error("Skill not found");

    const updatedLog = (skillToUpdate.practiceLog || []).map((entry) =>
      entry.id === entryId ? { ...entry, ...updatedEntryData, date: new Date(updatedEntryData.date || entry.date).toISOString() } : entry
    ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    try {
      await updateDoc(skillDocRef, { practiceLog: updatedLog });
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill.id === skillId ? { ...skill, practiceLog: updatedLog } : skill
        )
      );
      setError(null);
    } catch (err) {
      console.error("Error updating practice entry:", err);
      setError("Failed to update practice entry.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, skills]);

  const deletePracticeEntry = useCallback(async (skillId: string, entryId: string) => {
    if (!user) {
      setError("User not authenticated to delete practice entry.");
      throw new Error("User not authenticated");
    }
    if (!db) {
      setError("Firestore is not initialized.");
      throw new Error("User not authenticated");
    }
    setLoading(true);
    const skillDocRef = doc(db, 'users', user.uid, 'skills', skillId);
    const skillToUpdate = skills.find((s) => s.id === skillId);
    if (!skillToUpdate) throw new Error("Skill not found");

    const updatedLog = (skillToUpdate.practiceLog || []).filter(
      (entry) => entry.id !== entryId
    );
    try {
      await updateDoc(skillDocRef, { practiceLog: updatedLog });
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill.id === skillId ? { ...skill, practiceLog: updatedLog } : skill
        )
      );
      setError(null);
    } catch (err) {
      console.error("Error deleting practice entry:", err);
      setError("Failed to delete practice entry.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, skills]);

  const getSkillById = useCallback((skillId: string): Skill | undefined => {
    return skills.find(skill => skill.id === skillId);
  }, [skills]);

  return {
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    addPracticeEntry,
    updatePracticeEntry,
    deletePracticeEntry,
    getSkillById,
    loading,
    error,
    // setSkills is removed as direct manipulation is discouraged with Firestore backend
  };
}
