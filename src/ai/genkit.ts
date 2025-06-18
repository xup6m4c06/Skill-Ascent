import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';

config();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
      models: ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro'], // ✅ 額外註冊你要用的
    }),
  ],
  //model: 'gemini-1.5-pro', // ✅ 預設主模型
});
