
import OpenAI from 'openai';

// This check is important to fail fast if the key is obviously not set.
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
  // If using mock, we don't need to throw an error, as no real API call will be made.
  if (process.env.USE_MOCK_AI !== 'true') {
    throw new Error('The OPENAI_API_KEY environment variable is not set or is still a placeholder. Please add your key to the .env file to use the AI features.');
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPT_TEMPLATE = `You are a professional resume expert.

Task:
1. Rewrite the resume to match the job description
2. Add strong action words
3. Optimize for ATS systems
4. Suggest missing skills
5. Give ATS match score (0–100)

Return format:

--- Optimized Resume ---
...

--- Missing Skills ---
...

--- ATS Score ---
...

---

Resume:
{resumeText}

Job Description:
{jobDescriptionText}
`;

const MOCK_RESPONSE = `--- Optimized Resume ---
**Mock Response:** This is a sample tailored resume generated locally to bypass API rate limits.
Leveraged cutting-edge technologies like React and Node.js to architect and deliver high-performance, scalable web applications. Proactively mentored junior engineers, fostering a culture of growth and knowledge-sharing. Championed the adoption of agile methodologies and CI/CD best practices, resulting in a 40% improvement in deployment efficiency.

--- Missing Skills ---
- Mock Skill 1
- Mock Skill 2
- Mock Skill 3

--- ATS Score ---
95
`;


/**
 * Generates a tailored resume using the OpenAI API.
 * @param resumeText The user's original resume content.
 * @param jobDescriptionText The job description to tailor the resume for.
 * @returns A promise that resolves to the raw string response from the AI.
 */
export async function generateResume(resumeText: string, jobDescriptionText: string): Promise<string> {
  // Return a mock response if the environment variable is set
  if (process.env.USE_MOCK_AI === 'true') {
    console.log("USE_MOCK_AI is enabled. Returning a mock response to bypass API rate limits.");
    // Simulate a short network delay for a better user experience
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_RESPONSE;
  }

  const prompt = PROMPT_TEMPLATE
    .replace('{resumeText}', resumeText)
    .replace('{jobDescriptionText}', jobDescriptionText);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    return content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Check if it's an OpenAI API error to provide more specific feedback.
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw new Error('Authentication failed. The OpenAI API key is invalid or has been revoked. Please check your .env file.');
      }
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. You have hit your usage limit for the OpenAI API. Please check your plan and billing details.');
      }
       if (error.status >= 500) {
        throw new Error('OpenAI service is currently unavailable. Please try again later.');
      }
    }
    // For other errors, re-throw the generic message.
    throw new Error('Failed to communicate with OpenAI. Please check your network connection.');
  }
}
