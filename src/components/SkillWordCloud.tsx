'use client';

import React from 'react';
import WordCloud from 'react-wordcloud';
import type { Options } from 'react-wordcloud';

interface SkillWordCloudProps {
  skillsData: { name: string; value: number }[];
}

export const SkillWordCloud: React.FC<SkillWordCloudProps> = ({ skillsData }) => {
  const words = skillsData.map(skill => ({
    text: skill.name,
    value: skill.value,
  }));

  const options: Options = {
    rotations: 2,
    rotationAngles: [-90, 0],
    // Add more options as needed, e.g., colors, font sizes, etc.
    // See react-wordcloud documentation for full list of options:
    // https://github.com/chrisrzhou/react-wordcloud/blob/main/README.md#options
  };

  if (words.length === 0) {
    return <p className="text-muted-foreground text-center">Not enough skill data to generate a word cloud.</p>;
  }

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <WordCloud words={words} options={options} />
    </div>
  );
};