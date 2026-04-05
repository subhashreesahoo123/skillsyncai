'use server';

import { generateResume } from '@/lib/ai';
import pdf from 'pdf-parse';

// These types were previously in the Genkit flow file.
// Redefined here to ensure the UI component remains compatible.
export interface TailorResumeForJobInput {
  resumeText: string;
  jobDescriptionText: string;
}

export interface TailorResumeForJobOutput {
  tailoredResumeText: string;
  keywordAnalysis: {
    matched: string[];
    missing: string[];
  };
  strengths: string[];
  suggestions: string[];
  atsScore: number;
}

/**
 * Parses the structured string response from the OpenAI API.
 * @param responseText The raw string response from the AI.
 * @returns A structured object matching the TailorResumeForJobOutput interface.
 */
function parseAIResponse(responseText: string): TailorResumeForJobOutput {
    const tailoredResumeText = responseText.split('--- Optimized Resume ---')[1]?.split('--- Missing Skills ---')[0]?.trim() || '';
    const missingSkillsRaw = responseText.split('--- Missing Skills ---')[1]?.split('--- ATS Score ---')[0]?.trim();
    const atsScoreRaw = responseText.split('--- ATS Score ---')[1]?.trim();

    const missing = missingSkillsRaw ? missingSkillsRaw.split('\n').map(s => s.replace(/^- /, '').trim()).filter(Boolean) : [];
    const score = parseInt(atsScoreRaw || '0', 10);

    return {
        tailoredResumeText,
        atsScore: isNaN(score) ? 0 : score,
        keywordAnalysis: {
            matched: [], // Not provided by the new prompt, default to empty.
            missing: missing,
        },
        strengths: [], // Not provided by the new prompt, default to empty.
        suggestions: [], // Not provided by the new prompt, default to empty.
    };
}

/**
 * Server action to tailor a resume using the OpenAI API.
 * @param input An object containing the resume and job description text.
 * @returns A promise that resolves to the structured AI output.
 */
export async function tailorResume(
  input: TailorResumeForJobInput
): Promise<TailorResumeForJobOutput> {
  try {
    const rawResponse = await generateResume(input.resumeText, input.jobDescriptionText);
    const result = parseAIResponse(rawResponse);
    return result;
  } catch (error) {
    console.error('Error in tailorResume server action:', error);
    if (error instanceof Error) {
        // Re-throw the original, more user-friendly error message from the AI service.
        throw new Error(error.message);
    }
    throw new Error('An unknown error occurred during resume tailoring.');
  }
}

/**
 * Server action to parse text from an uploaded PDF file.
 * @param formData The form data containing the uploaded file.
 * @returns A promise that resolves to the extracted text content.
 */
export async function parsePdf(formData: FormData): Promise<string> {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file uploaded.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);
    return data.text;
}
