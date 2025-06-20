'use client';

import React from 'react';
import WordCloudLib from 'react-d3-cloud';

export interface WordData {
  text: string;
  value: number;
}

export interface SkillWordCloudProps {
  data: WordData[];
  fontSizeMapper?: (word: WordData) => number;
  rotate?: (word: WordData) => number;
  width?: number;
  height?: number;
}

const defaultFontSizeMapper = (word: WordData): number =>
  word.value * 5 + 10;

const defaultRotate = (): number =>
  Math.random() > 0.5 ? 0 : 90;

const WordCloud = WordCloudLib as React.ComponentType<any>;

const SkillWordCloud: React.FC<SkillWordCloudProps> = ({
  data,
  fontSizeMapper = defaultFontSizeMapper,
  rotate = defaultRotate,
  width = 600,
  height = 400,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="w-full h-64 flex items-center justify-center text-muted-foreground text-sm italic"
      >
        No data available to generate word cloud.
      </div>
    );
  }

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        backgroundColor: '#f9fafb',
        border: '1px dashed #ccc',
        borderRadius: '0.5rem',
        padding: '1rem',
      }}
    >
      <WordCloud
        data={data}
        fontSizeMapper={fontSizeMapper}
        rotate={rotate}
        width={width}
        height={height}
      />
    </div>
  );
};

export default SkillWordCloud;
