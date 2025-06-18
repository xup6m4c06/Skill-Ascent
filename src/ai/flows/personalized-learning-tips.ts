// 'use server'
'use server';
/**
 * @fileOverview Personalized learning tips flow.
 *
 * This file defines a Genkit flow that provides personalized tips and learning resources
 * for a specific skill, based on the user's logged practice time and progress.
 *
 * @interface PersonalizedLearningTipsInput - The input type for the personalizedLearningTips function.
 * @interface PersonalizedLearningTipsOutput - The output type for the personalizedLearningTips function.
 * @function personalizedLearningTips - The main function that triggers the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedLearningTipsInputSchema = z.object({
  skillName: z.string().describe('The name of the skill.'),
  practiceTime: z.number().describe('The total practice time in minutes.'),
  progressLevel: z.string().describe('The current progress level of the skill (e.g., Beginner, Intermediate, Advanced).'),
  learningGoals: z.string().describe('The specific learning goals for the skill'),
});
export type PersonalizedLearningTipsInput = z.infer<typeof PersonalizedLearningTipsInputSchema>;

const PersonalizedLearningTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('An array of personalized tips for improving the skill.'),
  resources: z.array(z.string()).describe('An array of learning resource URLs or descriptions.'),
});
export type PersonalizedLearningTipsOutput = z.infer<typeof PersonalizedLearningTipsOutputSchema>;

export async function personalizedLearningTips(input: PersonalizedLearningTipsInput): Promise<PersonalizedLearningTipsOutput> {
  return personalizedLearningTipsFlow(input);
}

const personalizedLearningTipsPrompt = ai.definePrompt({
  name: 'personalizedLearningTipsPrompt',
  input: {schema: PersonalizedLearningTipsInputSchema},
  output: {schema: PersonalizedLearningTipsOutputSchema},
  model: 'gemini-1.5-pro', // Specify the model here
  prompt: `You are an expert learning resource curator. A user is trying to improve their "{{skillName}}" skill.

  They have practiced for {{practiceTime}} minutes and their current progress level is {{progressLevel}}.
  They are trying to accomplish the following learning goals: {{learningGoals}}.

  Provide a list of personalized tips and learning resources to help them improve their skills, optimize their learning, and improve faster.

  Format the response as a JSON object with "tips" and "resources" keys.  The "tips" key should be an array of strings.
  The "resources" key should be an array of strings, and can be URLs or descriptions.
  `,
});

const personalizedLearningTipsFlow = ai.defineFlow(
  {
    name: 'personalizedLearningTipsFlow',
    inputSchema: PersonalizedLearningTipsInputSchema,
    outputSchema: PersonalizedLearningTipsOutputSchema,
  },
  async input => {
    const {output} = await personalizedLearningTipsPrompt(input);
    return output!;
  }
);
