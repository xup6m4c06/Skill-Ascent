
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

// Ensure .env variables are loaded, especially for server-side Genkit
config();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY, // Use GEMINI_API_KEY if set, otherwise fallback to GOOGLE_API_KEY or default discovery
    }),
  ],
  model: 'googleai/gemini-2.0-flash', // This seems to be an invalid model name, should be like 'gemini-1.5-flash' or 'gemini-pro'
});
