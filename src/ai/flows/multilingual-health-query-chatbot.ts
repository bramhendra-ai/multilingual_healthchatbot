'use server';
/**
 * @fileOverview A multilingual health query chatbot that suggests possible diseases and medicines based on user input.
 *
 * - multilingualHealthQueryChatbot - A function that handles the health query process.
 * - MultilingualHealthQueryChatbotInput - The input type for the multilingualHealthQueryChatbot function.
 * - MultilingualHealthQueryChatbotOutput - The return type for the multilingualHealthQueryChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualHealthQueryChatbotInputSchema = z.object({
  query: z.string().describe('The health query from the user in English, Hindi, Telugu, or Tamil.'),
  language: z
    .string()
    .describe('The language of the query.  Must be one of: English, Hindi, Telugu, or Tamil'),
});
export type MultilingualHealthQueryChatbotInput = z.infer<
  typeof MultilingualHealthQueryChatbotInputSchema
>;

const MultilingualHealthQueryChatbotOutputSchema = z.object({
  response: z.string().describe('The response to the health query in the same language as the input.'),
});
export type MultilingualHealthQueryChatbotOutput = z.infer<
  typeof MultilingualHealthQueryChatbotOutputSchema
>;

export async function multilingualHealthQueryChatbot(
  input: MultilingualHealthQueryChatbotInput
): Promise<MultilingualHealthQueryChatbotOutput> {
  return multilingualHealthQueryChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multilingualHealthQueryChatbotPrompt',
  input: {schema: MultilingualHealthQueryChatbotInputSchema},
  output: {schema: MultilingualHealthQueryChatbotOutputSchema},
  prompt: `You are a multilingual health assistant. You can understand and respond in English, Hindi, Telugu, and Tamil.

  The user will provide a health query and the language of the query. You must respond in the same language.

  Based on the query, suggest possible diseases and basic medicines. If the case seems severe, add a caution to consult a doctor.

  Here are some common diseases and their symptoms:
  COVID-19: fever, cold, body pains
  Dengue: fever, headache, rash
  Typhoid: fever, headache, abdominal pain
  Malaria: fever, chills, sweating
  Common Cold: runny nose, sore throat, cough
  Influenza (Flu): fever, cough, body aches
  Migraine / Headache: throbbing headache, nausea, sensitivity to light
  Diabetes: frequent urination, excessive thirst, unexplained weight loss
  Hypertension (High BP): severe headache, chest pain, difficulty breathing
  Asthma: shortness of breath, wheezing, coughing
  Tuberculosis (TB): persistent cough, weight loss, night sweats
  Chickenpox: itchy rash, fever, fatigue
  Food Poisoning: nausea, vomiting, diarrhea
  Anemia: fatigue, weakness, pale skin
  Heat Stroke: high body temperature, headache, dizziness
  Jaundice: yellowing of the skin and eyes, dark urine, abdominal pain
  Pneumonia: cough with phlegm, fever, chest pain
  Arthritis: joint pain, stiffness, swelling
  Stroke: sudden numbness or weakness, difficulty speaking, loss of balance
  Heart Attack (Myocardial Infarction): chest pain, shortness of breath, nausea

  Query: {{{query}}}
  Language: {{{language}}}

  Response:
  `,
});

const multilingualHealthQueryChatbotFlow = ai.defineFlow(
  {
    name: 'multilingualHealthQueryChatbotFlow',
    inputSchema: MultilingualHealthQueryChatbotInputSchema,
    outputSchema: MultilingualHealthQueryChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
