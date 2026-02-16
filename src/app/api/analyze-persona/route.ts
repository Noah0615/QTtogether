import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: 'GEMINI_API_KEY is not set' },
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

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        character: { type: SchemaType.STRING },
                        reason: { type: SchemaType.STRING },
                        opening_message: { type: SchemaType.STRING },
                    },
                    required: ["character", "reason", "opening_message"],
                } as any,
            },
        });

        const prompt = `
        Analyze the following devotional text (QT) written by a user.
        Identify the spiritual tone, emotional state, and theological themes.
        Match the user with one of the following biblical figures who best resonates with their reflection:
        [David, Paul, Peter, John, Moses, Esther]

        - David: Emotional, honest about sin/struggle, passionate worshipper.
        - Paul: Logical, theological, mission-oriented, emphasizes grace/faith.
        - Peter: Impulsive, zealous, focused on restoration and growth.
        - John: Focuses on love, intimacy with God, light/darkness.
        - Moses: Leadership burden, intercession, intimacy with God's presence.
        - Esther: Courage in crisis, providence, standing for others.

        Provide the result in JSON format:
        - character: The matched name (e.g., "David")
        - reason: A one-sentence explanation of why they matched.
        - opening_message: A warm, personalized first message from that character to the user, reflecting the character's biblical personality and the user's specific content. (in Korean)

        User Content:
        """${content}"""
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonResponse = JSON.parse(responseText);

        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error('Gemini Analysis Error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze persona' },
            { status: 500 }
        );
    }
}
