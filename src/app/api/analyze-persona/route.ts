import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

export async function POST(request: Request) {
    if (!apiKey) {
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

        const groq = new Groq({ apiKey });

        const prompt = `
        Analyze the following devotional text (QT).
        Match the user with one of these biblical figures:
        [David, Paul, Peter, John, Moses, Esther]

        - David: Emotional, honest, passionate worshipper.
        - Paul: Logical, theological, mission-oriented.
        - Peter: Impulsive, zealous, restoration.
        - John: Love, intimacy, light/darkness.
        - Moses: Leadership, intercession, humility.
        - Esther: Courage, providence, grace.

        Return ONLY a JSON object with this structure:
        {
            "character": "Name",
            "reason": "One sentence reason",
            "opening_message": "Warm greeting in Korean reflecting the character's tone"
        }

        User Content:
        """${content}"""
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a biblical persona analyzer. Output valid JSON." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            response_format: { type: "json_object" },
        });

        const jsonResponse = JSON.parse(completion.choices[0]?.message?.content || '{}');

        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error('Groq Analysis Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze persona' },
            { status: 500 }
        );
    }
}
