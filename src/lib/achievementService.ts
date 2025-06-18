import type { Skill, Badge, PracticeEntry } from '@/types';

export function checkAchievements(skills: Skill[], badges: Badge[]): Badge[] {
  const updatedBadges = badges.map(badge => ({ ...badge })); // Create a mutable copy

  const totalPracticeTimeAllSkills = skills.reduce(
    (total, skill) => total + skill.practiceLog.reduce((skillTotal, entry) => skillTotal + entry.duration, 0),
    0
  );

  const uniquePracticeDays = new Set<string>();
  skills.forEach(skill => {
    skill.practiceLog.forEach(entry => {
      uniquePracticeDays.add(new Date(entry.date).toLocaleDateString());
    });
  });

  for (const badge of updatedBadges) {
    if (badge.achievedAt) continue; // Already achieved

    let achieved = false;
    switch (badge.criteriaType) {
      case 'skillCount':
        if (skills.length >= badge.criteriaValue) {
          achieved = true;
        }
        break;
      case 'totalPracticeTime':
        if (totalPracticeTimeAllSkills >= badge.criteriaValue) {
          achieved = true;
        }
        break;
      case 'skillSpecificPracticeTime':
        const skill = skills.find(s => s.id === badge.skillId);
        if (skill) {
          const skillPracticeTime = skill.practiceLog.reduce((total, entry) => total + entry.duration, 0);
          if (skillPracticeTime >= badge.criteriaValue) {
            achieved = true;
          }
        }
        break;
      case 'logFrequency':
        if (badge.skillId) { // Number of logs for a specific skill
          const targetSkill = skills.find(s => s.id === badge.skillId);
          if (targetSkill && targetSkill.practiceLog.length >= badge.criteriaValue) {
            achieved = true;
          }
        } else { // Number of unique days with logs across all skills
          if (uniquePracticeDays.size >= badge.criteriaValue) {
            achieved = true;
          }
        }
        break;
    }

    if (achieved) {
      badge.achievedAt = new Date();
    } else {
      badge.achievedAt = null;
    }
  }
  return updatedBadges;
}
