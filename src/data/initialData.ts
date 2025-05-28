import type { Skill, Badge } from '@/types';
import { Lightbulb, Star, Target, Zap, BookOpen, CalendarDays, TrendingUp } from 'lucide-react';

export const initialSkills: Skill[] = [
  {
    id: '1',
    name: 'TypeScript Programming',
    createdAt: new Date().toISOString(),
    practiceLog: [
      { id: 'p1', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), duration: 60, notes: 'Learned about interfaces.' },
      { id: 'p2', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), duration: 90, notes: 'Practiced with generics.' },
    ],
    targetPracticeTime: 50, // hours
    learningGoals: "Master advanced TypeScript features and build a full-stack application.",
  },
  {
    id: '2',
    name: 'Public Speaking',
    createdAt: new Date().toISOString(),
    practiceLog: [],
    targetPracticeTime: 20, // hours
    learningGoals: "Deliver confident and engaging presentations.",
  },
];

export const initialBadges: Badge[] = [
  {
    id: 'b1',
    name: 'First Step',
    description: 'You defined your first skill!',
    iconName: 'Lightbulb',
    criteriaType: 'skillCount',
    criteriaValue: 1,
  },
  {
    id: 'b2',
    name: 'Hour of Power',
    description: 'Logged 1 hour of practice in total.',
    iconName: 'Star',
    criteriaType: 'totalPracticeTime',
    criteriaValue: 60, // minutes
  },
  {
    id: 'b3',
    name: 'Dedicated Learner',
    description: 'Logged 5 hours of practice in total.',
    iconName: 'Target',
    criteriaType: 'totalPracticeTime',
    criteriaValue: 300, // minutes
  },
  {
    id: 'b4',
    name: 'TypeScript Novice',
    description: 'Logged 1 hour in TypeScript Programming.',
    iconName: 'Zap',
    criteriaType: 'skillSpecificPracticeTime',
    criteriaValue: 60, // minutes
    skillId: '1', // Matches TypeScript Programming skill id
  },
  {
    id: 'b5',
    name: 'Consistent Practice',
    description: 'Logged practice on 3 different days.',
    iconName: 'CalendarDays',
    criteriaType: 'logFrequency', // Number of unique days with logs
    criteriaValue: 3,
  },
  {
    id: 'b6',
    name: 'Skill Streaker',
    description: 'Logged practice 5 times for a single skill.',
    iconName: 'TrendingUp',
    criteriaType: 'logFrequency', // Number of logs for a specific skill
    criteriaValue: 5,
    skillId: '1', // Example for TypeScript
  },
];
