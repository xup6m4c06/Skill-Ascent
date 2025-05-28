'use client';
import type { Skill, PracticeEntry } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { LOCAL_STORAGE_SKILLS_KEY } from '@/lib/constants';
import { initialSkills } from '@/data/initialData';
import { v4 as uuidv4 } from 'uuid'; // Needs: npm install uuid && npm install @types/uuid -D

// This hook will be client-side only due to localStorage usage
export function useSkills() {
  const [skills, setSkills] = useLocalStorage<Skill[]>(LOCAL_STORAGE_SKILLS_KEY, initialSkills);

  const addSkill = (newSkillData: Omit<Skill, 'id' | 'createdAt' | 'practiceLog'>) => {
    const skillWithDefaults: Skill = {
      ...newSkillData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      practiceLog: [],
    };
    setSkills((prevSkills) => [...prevSkills, skillWithDefaults]);
    return skillWithDefaults;
  };

  const updateSkill = (skillId: string, updatedData: Partial<Omit<Skill, 'id' | 'createdAt' | 'practiceLog'>>) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === skillId ? { ...skill, ...updatedData } : skill
      )
    );
  };
  
  const deleteSkill = (skillId: string) => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== skillId));
  };

  const addPracticeEntry = (skillId: string, entryData: Omit<PracticeEntry, 'id'>) => {
    const newEntry: PracticeEntry = { ...entryData, id: uuidv4() };
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === skillId
          ? { ...skill, practiceLog: [...skill.practiceLog, newEntry] }
          : skill
      )
    );
    return newEntry;
  };

  const updatePracticeEntry = (skillId: string, entryId: string, updatedEntryData: Partial<PracticeEntry>) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === skillId
          ? {
              ...skill,
              practiceLog: skill.practiceLog.map((entry) =>
                entry.id === entryId ? { ...entry, ...updatedEntryData } : entry
              ),
            }
          : skill
      )
    );
  };

  const deletePracticeEntry = (skillId: string, entryId: string) => {
     setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === skillId
          ? { ...skill, practiceLog: skill.practiceLog.filter(entry => entry.id !== entryId) }
          : skill
      )
    );
  };
  
  const getSkillById = (skillId: string): Skill | undefined => {
    return skills.find(skill => skill.id === skillId);
  };

  return {
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    addPracticeEntry,
    updatePracticeEntry,
    deletePracticeEntry,
    getSkillById,
    setSkills // For direct manipulation if needed, e.g., reordering
  };
}
