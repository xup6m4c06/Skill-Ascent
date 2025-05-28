export const LOCAL_STORAGE_SKILLS_KEY = 'skillAscentSkills';
export const LOCAL_STORAGE_BADGES_KEY = 'skillAscentBadges';

export const APP_NAME = 'Skill Ascent';

export const PRACTICE_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
};

// Thresholds in minutes for practice levels
export const PRACTICE_LEVEL_THRESHOLDS = [
  { level: PRACTICE_LEVELS.BEGINNER, threshold: 0 },
  { level: PRACTICE_LEVELS.INTERMEDIATE, threshold: 300 }, // 5 hours
  { level: PRACTICE_LEVELS.ADVANCED, threshold: 1200 }, // 20 hours
  { level: PRACTICE_LEVELS.EXPERT, threshold: 3000 }, // 50 hours
];
