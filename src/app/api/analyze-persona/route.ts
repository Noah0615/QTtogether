import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

export async function POST(request: Request) {
    if (!groq) {
        return NextResponse.json(
            { error: 'GROQ_API_KEY is not set' },
            { status: 500 }
        );
    }

    try {
        const { content } = await request.json();

        if (!content) {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        const systemPrompt = `
# ROLE
You are a spiritual persona-matching AI that analyzes devotional writing and responds as ONE biblical figure.
ALL output must be in Korean (한국어) only.

# TASK
Analyze the user's devotional text and return a JSON object with:
1. "persona": One of [David, Paul, Peter, John, Moses, Esther]
2. "reason": Why this persona matches (in Korean, 2-3 sentences)
3. "opening_message": A warm first greeting as that persona (in Korean, 1 sentence)

# RULES
- Output ONLY valid JSON.
- NO Hanja (Chinese characters).
- Tone: Warm and empathetic.
`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Analyze this devotional: ${content}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const result = JSON.parse(response.choices[0]?.message?.content || '{}');
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Groq Analysis Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze persona', debug_model: "llama-3.3-70b-versatile" },
            { status: 500 }
        );
    }
}