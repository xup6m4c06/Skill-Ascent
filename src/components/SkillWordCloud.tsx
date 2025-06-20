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
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'], // Example colors
    deterministic: false, // Example deterministic setting
    enableOptimizations: true, // Example optimization setting
    enableTooltip: true, // Example tooltip setting
    fontFamily: 'impact', // Example font family
    fontSizes: [20, 60], // Example font size range
    fontStyle: 'normal', // Example font style
    fontWeight: 'normal', // Example font weight
    padding: 1, // Example padding
    rotations: 2,
    rotationAngles: [-90, 0],
    scale: 'sqrt', // Example scale type
          svgAttributes: {}, // Added to satisfy Options type
          textAttributes: {}, // Added to satisfy Options type
          transitionDuration: 1000, // Added to satisfy Options type
    spiral: 'archimedean', // Example spiral type
    tooltipOptions: { zIndex: 1000 }, // Example tooltip options
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