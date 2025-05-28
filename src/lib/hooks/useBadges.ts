'use client';
import type { Badge, Skill } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { LOCAL_STORAGE_BADGES_KEY } from '@/lib/constants';
import { initialBadges } from '@/data/initialData';
import { checkAchievements } from '@/lib/achievementService';
import { useEffect, useCallback } from 'react';

export function useBadges(skills: Skill[]) {
  const [badges, setBadges] = useLocalStorage<Badge[]>(LOCAL_STORAGE_BADGES_KEY, initialBadges);

  const updateAchievedBadges = useCallback(() => {
    const newlyCheckedBadges = checkAchievements(skills, badges);
    // Only update if there's a change to avoid infinite loops if skills/badges are deps elsewhere
    if (JSON.stringify(newlyCheckedBadges) !== JSON.stringify(badges)) {
      setBadges(newlyCheckedBadges);
    }
  }, [skills, badges, setBadges]);

  useEffect(() => {
    updateAchievedBadges();
  }, [skills, updateAchievedBadges]); // Re-check badges when skills change

  return {
    badges,
    getBadgeById: (badgeId: string): Badge | undefined => badges.find(b => b.id === badgeId),
    getNewlyAchievedBadges: (prevBadges: Badge[], currentBadges: Badge[]): Badge[] => {
      return currentBadges.filter(cb => !cb.achievedAt !== !prevBadges.find(pb => pb.id === cb.id)?.achievedAt && cb.achievedAt);
    }
  };
}
