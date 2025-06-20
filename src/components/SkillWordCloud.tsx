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
  style?: React.CSSProperties;
  font?: string; // Add font prop
  fill?: (word: WordData) => string; // Add fill prop
}

const defaultFontSizeMapper = (word: WordData): number =>
  word.value * 20 + 20;

const defaultRotate = (): number => 0; // Set rotation to 0 degrees

const WordCloud = WordCloudLib as React.ComponentType<any>;

const SkillWordCloud: React.FC<SkillWordCloudProps> = ({
  data,
  fontSizeMapper = defaultFontSizeMapper,
  rotate = defaultRotate,
  width = 600,
  height = 400,
  style,
  font = 'Georgia, serif', // Add font prop with default
  fill, // Accept fill prop
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-muted-foreground text-sm italic"
      >
        No data available to generate word cloud.
      </div>
    );
  }

  return (
    <div style={{ width, height, position: 'relative', ...style }}>
      <WordCloud
        data={data}
        fontSizeMapper={fontSizeMapper}
        rotate={rotate}
        width={width}
        height={height}
        style={style}
        font={font}
        fill={fill} // Pass fill prop
      />
    </div>
  );
};

export default SkillWordCloud;
