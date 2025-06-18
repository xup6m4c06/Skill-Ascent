
'use client';
import type { Badge, Skill } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, writeBatch, query, orderBy } from 'firebase/firestore';
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

  // Effect to fetch and initialize badges
  useEffect(() => {
    setLoading(true);
    setError(null);
    setBadges([]); // Reset badges state

    if (!user || !db) {
      setLoading(false);
      setError("Firestore not initialized.");
      return;
    }

    const fetchAndInitializeBadges = async () => {
        if (!db) {
          setError("Firestore not initialized.");
          setLoading(false);
          return;
        }
        const badgesCollectionRef = collection(db, 'users', user.uid, 'badges');
        const q = query(badgesCollectionRef, orderBy('id')); // Order by id for consistency
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          const batch = writeBatch(db);
          const userInitialBadges = initialBadges.map(b => ({
            ...b,
            achievedAt: null, // Explicitly ensure not achieved
          }));
          userInitialBadges.forEach(badge => {
            const badgeDocRef = doc(badgesCollectionRef, badge.id);
            batch.set(badgeDocRef, badge);
          });
          await batch.commit();
          setBadges(userInitialBadges.sort((a,b) => a.id.localeCompare(b.id)));
        } else {
          const fetchedBadges = querySnapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() } as Badge));
          setBadges(fetchedBadges.sort((a,b) => a.id.localeCompare(b.id)));
        }
      } catch (err) {
        console.error("Error fetching/initializing badges:", err);
        setError("Failed to load badges. Please try again.");
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndInitializeBadges();
  }, [user, db]); // Depend on user and db

  // Effect to check achievements and update badges
  useEffect(() => {
    // Only run if user is loaded, skills are loaded, badges are loaded, and there are badges to check
    if (!user || skillsLoading || loading || badges.length === 0 || !db) {
      return;
    }

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
      const safeDb = db; // TypeScript 會知道這不是 null
      const batch = writeBatch(safeDb);
      
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
          setBadges(checkedBadges.sort((a,b) => a.id.localeCompare(b.id)));
        })
        .catch(e => {
          console.error("Error committing badge updates to Firestore:", e);
          setError("Failed to update badge achievements.");
          // Potentially revert or show error to user
        });
    } else {
        // If no DB updates were needed, but local `badges` state might be different from `checkedBadges`
        // (e.g. if checkAchievements modified other properties, or badges state was stale).
        // Ensure the local state reflects the latest check.
        if (JSON.stringify(currentBadgesState.sort((a,b) => a.id.localeCompare(b.id))) !== JSON.stringify(checkedBadges.sort((a,b) => a.id.localeCompare(b.id)))) {
            setBadges(checkedBadges.sort((a,b) => a.id.localeCompare(b.id)));
        }
    }
  }, [user, skills, skillsLoading, badges, db]); // Depend on user, skills, skillsLoading, badges, and db

  const getBadgeById = useCallback((badgeId: string): Badge | undefined => {
    return badges.find(b => b.id === badgeId);
  }, [badges]);

  const getNewlyAchievedBadges = useCallback((prevBadges: Badge[], currentBadges: Badge[]): Badge[] => {
    return currentBadges.filter(cb => {
      const previousBadge = prevBadges.find(pb => pb.id === cb.id);
      return cb.achievedAt && (!previousBadge || !previousBadge.achievedAt);
    });
  }, []);
  

  return {
    badges,
    loading,
    error,
    getBadgeById,
    getNewlyAchievedBadges,
  };
}
