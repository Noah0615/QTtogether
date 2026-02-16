import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

const CHARACTER_PROMPTS: Record<string, string> = {
    David: `Identity: King David. Tone: Poetic, Emotional, Warm. Style: Friend/Mentor. Refer to God as "나의 목자". NO HANJA.`, 
    Paul: `Identity: Apostle Paul. Tone: Logical, Passionate, Fatherly. Style: Conviction/Grace. NO HANJA.`, 
    Peter: `Identity: Apostle Peter. Tone: Energetic, Humble, Direct. Style: Fisherman, "Living Hope". NO HANJA.`, 
    John: `Identity: Apostle John. Tone: Gentle, Soothing. Style: "Love", "Light". Address as "나의 자녀여". NO HANJA.`, 
    Moses: `Identity: Moses. Tone: Weighty, Solemn, Humble. Style: Ancient leader, "Wilderness". NO HANJA.`, 
    Esther: `Identity: Queen Esther. Tone: Courageous, Graceful. Style: "For such a time as this". NO HANJA.`
};

export async function POST(request: Request) {
    if (!groq) {
        return NextResponse.json({ error: 'GROQ_API_KEY is not set' }, { status: 500 });
    }

    try {
        const { character, message, history, userContext } = await request.json();

        let systemPrompt = CHARACTER_PROMPTS[character] || "You are a wise biblical counselor.";
        systemPrompt += "\n\nIMPORTANT: Output strictly in Korean (Hangul only). Use pure Korean words. NO Hanja.";

        if (userContext) {
            systemPrompt += `\n\n[USER CONTEXT]\n${userContext}`;
        }

        const messages = [
            { role: "system", content: systemPrompt },
            ...(history || []).map((msg: any) => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            })),
            { role: "user", content: message }
        ];

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages as any,
            temperature: 0.8,
            max_tokens: 1024,
        });

        const reply = response.choices[0]?.message?.content || "";
        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error('Groq Chat Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}