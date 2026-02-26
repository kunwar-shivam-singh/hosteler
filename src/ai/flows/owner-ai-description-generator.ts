'use server';
/**
 * @fileOverview An AI agent for owners to generate property descriptions and suggest amenities.
 *
 * - generatePropertyDescriptionAndAmenities - A function that handles the AI generation process.
 * - OwnerAIDescriptionGeneratorInput - The input type for the generatePropertyDescriptionAndAmenities function.
 * - OwnerAIDescriptionGeneratorOutput - The return type for the generatePropertyDescriptionAndAmenities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OwnerAIDescriptionGeneratorInputSchema = z.object({
  pgName: z.string().describe('The name of the PG/Hostel.'),
  city: z.string().describe('The city where the property is located.'),
  area: z.string().describe('The area/locality of the property.'),
  address: z.string().describe('The full address of the property.'),
  rent: z.number().describe('The monthly rent of the property.'),
  roomTypes: z.array(z.string()).describe('Available room types (e.g., Single, Double, Triple sharing).'),
  contactNumber: z.string().describe('Contact number for the owner.'),
  availableBeds: z.number().describe('Number of available beds.'),
});
export type OwnerAIDescriptionGeneratorInput = z.infer<typeof OwnerAIDescriptionGeneratorInputSchema>;

const OwnerAIDescriptionGeneratorOutputSchema = z.object({
  description: z.string().describe('A compelling, SEO-friendly property description.'),
  amenities: z.array(z.string()).describe('A list of suggested amenities relevant to the property.'),
});
export type OwnerAIDescriptionGeneratorOutput = z.infer<typeof OwnerAIDescriptionGeneratorOutputSchema>;

export async function generatePropertyDescriptionAndAmenities(input: OwnerAIDescriptionGeneratorInput): Promise<OwnerAIDescriptionGeneratorOutput> {
  return ownerAIDescriptionGeneratorFlow(input);
}

const ownerAIDescriptionPrompt = ai.definePrompt({
  name: 'ownerAIDescriptionPrompt',
  input: {schema: OwnerAIDescriptionGeneratorInputSchema},
  output: {schema: OwnerAIDescriptionGeneratorOutputSchema},
  prompt: `You are a professional real estate copywriter specializing in PG/Hostel listings. Your goal is to create an attractive, compelling, and SEO-friendly property description and suggest relevant amenities based on the provided details.

Use the following property details:
PG/Hostel Name: {{{pgName}}}
City: {{{city}}}
Area: {{{area}}}
Address: {{{address}}}
Monthly Rent: {{{rent}}}
Room Types: {{#each roomTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Contact Number: {{{contactNumber}}}
Available Beds: {{{availableBeds}}}

Craft a detailed and engaging description highlighting the best features, location advantages, and overall living experience. Then, suggest a list of 5-10 common and appealing amenities for such a property, formatted as a JSON array of strings.
`,
});

const ownerAIDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'ownerAIDescriptionGeneratorFlow',
    inputSchema: OwnerAIDescriptionGeneratorInputSchema,
    outputSchema: OwnerAIDescriptionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await ownerAIDescriptionPrompt(input);
    return output!;
  }
);
