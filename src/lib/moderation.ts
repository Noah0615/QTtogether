import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

// Initialize OpenAI client only if API key is present
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function checkContent(text: string): Promise<{ flagged: boolean; categories: string[] }> {
    if (!openai) {
        console.warn('OPENAI_API_KEY is not set. Skipping moderation.');
        return { flagged: false, categories: [] };
    }

    try {
        const response = await openai.moderations.create({
            model: "omni-moderation-latest",
            input: text,
        });

        const result = response.results[0];

        if (result.flagged) {
            const categories = Object.keys(result.categories).filter(
                (key) => (result.categories as any)[key] === true
            );
            return { flagged: true, categories };
        }

        return { flagged: false, categories: [] };
    } catch (error) {
        console.error('OpenAI Moderation API Error:', error);
        // Fail open or closed based on policy? 
        // Failing open (allowing content) if API fails might be safer for UX if key is missing/limit reached,
        // but failing closed is safer for moderation. 
        // Here we'll return false to avoid blocking users if API has issues, but log checks.
        return { flagged: false, categories: [] };
    }
}
