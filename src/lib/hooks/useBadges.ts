
'use client';
import type { Badge, Skill } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, writeBatch, query, orderBy, Firestore } from 'firebase/firestore';
import { initialBadges } from '@/data/initialData';
import { checkAchievements } from '@/lib/achievementService';
import { Timestamp } from 'firebase/firestore';

interface UseBadgesProps {
  skills: Skill[];
  skillsLoading: boolean;
}

export function useBadges({ skills, skillsLoading }: UseBadgesProps) {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch and initialize badges and check achievements
  useEffect(() => {
    if (!user) {
      setBadges([]);
      setLoading(false);
      return;
    }
    if (!db) {
      setError("Firestore not initialized.");
      setLoading(false);
      return;
    }

    let safeDb: Firestore; // Declare safeDb here

    const fetchAndInitializeBadges = async () => {
      if (!db || !user) return; // Should not happen due to checks above, but good practice

      safeDb = db; // Assign db to safeDb here

      try {
        const badgesCollectionRef = collection(safeDb, 'users', user.uid, 'badges'); // Use safeDb here
        const q = query(badgesCollectionRef, orderBy('id')); // Order by id for consistency
        const querySnapshot = await getDocs(q);

        let fetchedBadges: Badge[];
        const batch = writeBatch(safeDb); // Declare batch here

        if (querySnapshot.empty) {
          const userInitialBadges = initialBadges.map(b => ({
            ...b,
            achievedAt: null, // Explicitly ensure not achieved
          }));
          userInitialBadges.forEach(badge => {
            const badgeDocRef = doc(safeDb, 'users', user.uid, 'badges', badge.id); // Use safeDb here
            batch.set(badgeDocRef, badge);
          });
          await batch.commit();
          fetchedBadges = userInitialBadges;
        } else {
          fetchedBadges = querySnapshot.docs.map(docSnapshot => {
            const data = docSnapshot.data();
            return {
              id: docSnapshot.id,
              ...data,
              achievedAt: data.achievedAt instanceof Timestamp ? data.achievedAt.toDate() : data.achievedAt,
            } as Badge;
          });
        }

        setBadges(fetchedBadges.sort((a, b) => a.id.localeCompare(b.id)));

      } catch (err: any) {
        console.error("Error fetching/initializing badges:", err);
        setError("Failed to load badges. Please try again.");
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };

    if (db) { // Assign db to safeDb if it's not null
      fetchAndInitializeBadges();
    }
  }, [user, db]); // Depend only on user and db for initial fetch

  // Effect to check achievements and update badges in Firestore
  useEffect(() => {
    // setLoading(true); // Avoid setting loading true here to prevent flickering when skills/badges load sequentially
    setError(null);

    const currentBadgesState = badges; // Current badges from Firestore/local state
    const checkedBadges = checkAchievements(skills, [...currentBadgesState]); // Pass a copy

    const badgesToUpdateInFirestore: Badge[] = [];
    for (const cb of checkedBadges) {
      const originalBadge = currentBadgesState.find(b => b.id === cb.id);
      if (cb.achievedAt && (!originalBadge || originalBadge.achievedAt !== cb.achievedAt)) {
        badgesToUpdateInFirestore.push(cb);
      }
    }

    if (badgesToUpdateInFirestore.length > 0) {
      // Explicitly check if user and db are available before performing Firestore write
      if (user && db) {
        const safeDb: Firestore = db;
        const batch = writeBatch(safeDb); // Declare batch here

        badgesToUpdateInFirestore.forEach(badgeToUpdate => {
          const badgeDocRef = doc(safeDb, 'users', user.uid, 'badges', badgeToUpdate.id);

          batch.update(badgeDocRef, {
            achievedAt: badgeToUpdate.achievedAt
            ? Timestamp.fromDate(new Date(badgeToUpdate.achievedAt))
            : null,
          });
        });

        batch.commit()
          .then(() => {
            // Update local state with the full result from checkAchievements
            // This ensures local state is consistent with what was evaluated.
            setBadges(checkedBadges.sort((a, b) => a.id.localeCompare(b.id)));
          })
          .catch(e => {
            console.error("Error committing badge updates to Firestore:", e);
            setError("Failed to update badge achievements.");
            // Potentially revert or show error to user
          });
      }
    } else {
        // If no DB updates were needed, but local `badges` state might be different from `checkedBadges`
        // (e.g. if checkAchievements modified other properties, or badges state was stale).
        // Ensure the local state reflects the latest check.
        if (JSON.stringify(currentBadgesState.sort((a, b) => a.id.localeCompare(b.id))) !== JSON.stringify(checkedBadges.sort((a, b) => a.id.localeCompare(b.id)))) {
          setBadges(checkedBadges.sort((a, b) => a.id.localeCompare(b.id)));
 }
    }
  }, [user, skills, skillsLoading, badges, db, setLoading, setError]); // Depend on user, skills, skillsLoading, badges, db, and state setters

  const getBadgeById = useCallback((badgeId: string): Badge | undefined => {
    if (!user) {
      console.warn("Attempted to get badge by id without authenticated user.");
      return undefined;
    }
    return badges.find(b => b.id === badgeId); // This assumes badges state is accurate based on user.uid
  }, [user, badges]); // Depend on user and badges

  const getNewlyAchievedBadges = useCallback((prevBadges: Badge[], currentBadges: Badge[]): Badge[] => {
    if (!user) {
      console.warn("Attempted to get newly achieved badges without authenticated user.");
      return [];
    }
    return currentBadges.filter(cb => {
      const previousBadge = prevBadges.find(pb => pb.id === cb.id);
      return cb.achievedAt && (!previousBadge || !previousBadge.achievedAt);
    });
  }, [user]); // Depend on user
  

  return {
    badges,
    loading,
    error,
    getBadgeById,
    getNewlyAchievedBadges,
  };
}
