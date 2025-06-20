// @ts-nocheck
'use client';

import * as React from 'react';
import { ComponentType } from 'react';
export interface SkillWordCloudProps {
  data: Array<{ text: string; value: number }>;
  fontSizeMapper?: (word: { text: string; value: number }) => number;
  rotate?: number;
  width?: number;
  height?: number;
}
import WordCloud from 'react-d3-cloud';

const defaultFontSizeMapper = (word: { text: string; value: number }) =>
  Math.sqrt(word.value) * 10;

const defaultRotate = 0;

const SkillWordCloud = ({
  data,
  fontSizeMapper = defaultFontSizeMapper,
  rotate = defaultRotate,
  width = 600,
  height = 400,
}: SkillWordCloudProps) => {
  return (
    <WordCloud
      // @ts-ignore
      data={data}
      fontSizeMapper={fontSizeMapper}
      rotate={rotate}
      width={width}
      height={height}
    />
  );
};

export default SkillWordCloud;
