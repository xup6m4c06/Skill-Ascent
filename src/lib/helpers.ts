import type { Skill, PracticeEntry } from '@/types';
import { PRACTICE_LEVELS, PRACTICE_LEVEL_THRESHOLDS } from './constants';

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function getTotalPracticeTime(skill: Skill): number {
  return skill.practiceLog.reduce((total, entry) => total + entry.duration, 0);
}

export function calculateProgress(current: number, target?: number): number {
  if (!target || target === 0) return 0;
  return Math.min((current / (target * 60)) * 100, 100); // target is in hours, current in minutes
}

export function getSkillProgressLevel(totalPracticeMinutes: number): string {
  let currentLevel = PRACTICE_LEVELS.BEGINNER;
  for (let i = PRACTICE_LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalPracticeMinutes >= PRACTICE_LEVEL_THRESHOLDS[i].threshold) {
      currentLevel = PRACTICE_LEVEL_THRESHOLDS[i].level;
      break;
    }
  }
  return currentLevel;
}

export const getIcon = (iconName: keyof typeof import('lucide-react')) => {
  // Dynamically import lucide-react icons or use a map
  // For simplicity, we'll assume direct usage in components for now
  // This is a placeholder for a more robust icon fetching mechanism if needed
  const LucideIcons = require('lucide-react');
  return LucideIcons[iconName] || LucideIcons.HelpCircle;
};
