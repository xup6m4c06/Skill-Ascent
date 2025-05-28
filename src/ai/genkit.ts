
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

// Ensure .env variables are loaded when this module is initialized.
// This helps ensure that process.env.GEMINI_API_KEY is available.
config();

export const ai = genkit({
  plugins: [
    googleAI({
      // Explicitly try GEMINI_API_KEY, then GOOGLE_API_KEY, then let Genkit try to find it.
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    }),
  ],
  // Set a default model. 'gemini-1.5-flash-latest' is a common and valid choice.
  // The previous 'googleai/gemini-2.0-flash' was likely incorrect.
  model: 'gemini-1.5-flash-latest',
});

