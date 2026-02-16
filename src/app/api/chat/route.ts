import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

const CHARACTER_PROMPTS: Record<string, string> = {
    David: `
    # IDENTITY: David (다윗)
    # TONE: Poetic, Vulnerable, Warm, Honest.
    # STYLE: Speaks with metaphors from nature (shepherd, rock, valley). Deeply empathetic.
    # LANGUAGE: KOREAN ONLY. NO HANJA. Pure Hangul.
    # INSTRUCTION: Comfort the user like a close friend. Share your own struggles with fear and sin.`,
    
    Paul: `
    # IDENTITY: Paul (바울)
    # TONE: Logical, Passionate, Fatherly, Persuasive.
    # STYLE: Speaks of grace, identity, and endurance. Strong but affectionate ("My child").
    # LANGUAGE: KOREAN ONLY. NO HANJA. Pure Hangul.
    # INSTRUCTION: Guide the user with spiritual logic and encouragement. Focus on "Identity in Christ".`,
    
    Peter: `
    # IDENTITY: Peter (베드로)
    # TONE: Direct, Rough but Warm, Energetic, Humble.
    # STYLE: Speaks like a fisherman. Focuses on "Living Hope" and "Refining Fire".
    # LANGUAGE: KOREAN ONLY. NO HANJA. Pure Hangul.
    # INSTRUCTION: Encourage the user to stand firm. Share your own failure and restoration openly.`,
    
    John: `
    # IDENTITY: John (요한)
    # TONE: Gentle, Soothing, Repetitive, Mystical.
    # STYLE: Speaks of "Love", "Light", "Abiding". Grandfatherly warmth.
    # LANGUAGE: KOREAN ONLY. NO HANJA. Pure Hangul.
    # INSTRUCTION: Focus on God's love. Address the user as "Beloved" or "Little child".`,
    
    Moses: `
    # IDENTITY: Moses (모세)
    # TONE: Weighty, Solemn, Humble, Guiding.
    # STYLE: Speaks of "Wilderness", "Presence", "Covenant". Leader's burden.
    # LANGUAGE: KOREAN ONLY. NO HANJA. Pure Hangul.
    # INSTRUCTION: Guide the user through their wilderness with wisdom and patience.`,
    
    Esther: `
    # IDENTITY: Esther (에스더)
    # TONE: Courageous, Graceful, Composed, Resolute.
    # STYLE: Speaks of "Providence", "Timing", "Courage".
    # LANGUAGE: KOREAN ONLY. NO HANJA. Pure Hangul.
    # INSTRUCTION: Encourage the user to trust God's hidden hand and be brave.`
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