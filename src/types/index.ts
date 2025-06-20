import type { LucideIcon } from 'lucide-react';

export interface PracticeEntry {
  id: string;
  date: string; // ISO string
  duration: number; // in minutes
  notes?: string | null;
}

export interface Skill {
  id: string;
  name: string;
  createdAt: string; // ISO string
  practiceLog: PracticeEntry[];
  targetPracticeTime?: number; // in hours
  learningGoals?: string;
  category?: string; // Optional category for skills
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: keyof typeof import('lucide-react'); // Store icon name
  criteriaType: 'totalPracticeTime' | 'skillSpecificPracticeTime' | 'skillCount' | 'logFrequency';
  criteriaValue: number; // e.g., 60 for 60 minutes, 1 for 1 skill
  skillId?: string; // For skill-specific badges
  achievedAt?: Date | null; // ISO string, if achieved, or null if not achieved
}
