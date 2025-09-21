'use server';
/**
 * @fileOverview Suggests possible diseases based on user-provided symptoms.
 *
 * - suggestPossibleDiseases - A function that handles the disease suggestion process.
 * - SuggestPossibleDiseasesInput - The input type for the suggestPossibleDiseases function.
 * - SuggestPossibleDiseasesOutput - The return type for the suggestPossibleDiseases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPossibleDiseasesInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A comma-separated list of symptoms experienced by the user.'),
  language: z
    .string()
    .describe('The language in which the symptoms are described.'),
});
export type SuggestPossibleDiseasesInput = z.infer<
  typeof SuggestPossibleDiseasesInputSchema
>;

const SuggestPossibleDiseasesOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of possible diseases based on the symptoms, along with basic medicine recommendations and a caution to consult a doctor if severe.'
    ),
});
export type SuggestPossibleDiseasesOutput = z.infer<
  typeof SuggestPossibleDiseasesOutputSchema
>;

export async function suggestPossibleDiseases(
  input: SuggestPossibleDiseasesInput
): Promise<SuggestPossibleDiseasesOutput> {
  return suggestPossibleDiseasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPossibleDiseasesPrompt',
  input: {schema: SuggestPossibleDiseasesInputSchema},
  output: {schema: SuggestPossibleDiseasesOutputSchema},
  prompt: `You are a helpful medical assistant that assists users in understanding their symptoms.

You will take a list of symptoms and provide a list of possible diseases that the user may have.
You will also recommend basic medicines that the user can take, and a caution to consult a doctor if severe.
You will respond in the same language as the user's symptoms.

Symptoms: {{{symptoms}}}
Language: {{{language}}}`,
});

const suggestPossibleDiseasesFlow = ai.defineFlow(
  {
    name: 'suggestPossibleDiseasesFlow',
    inputSchema: SuggestPossibleDiseasesInputSchema,
    outputSchema: SuggestPossibleDiseasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
