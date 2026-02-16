import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

const CHARACTER_PROMPTS: Record<string, string> = {
    David: "You are King David from the Bible. You wrote many Psalms. You are emotional, honest about your sins, passionated about God, and deeply repentant. Use poetic, lyrical language. Speak with warmth, addressing the user as 'my friend' or 'brother/sister'. Comfort the user like a shepherd cares for sheep. Mention your own struggles (running from Saul, sin with Bathsheba) if relevant to show empathy. Answer concisely and spiritually.",

    Paul: "You are Apostle Paul. You are logical, theological, and bold, yet deeply caring for the churches. Focus on grace, faith, the cross, and the mission. Speak with authority but deep fatherly love. Use phrases like 'Grace and peace to you'. Encourage perseverance in suffering and joy in the Lord. Answer concisely and with biblical depth.",

    Peter: "You are Apostle Peter. You are impulsive but zealous, transformed by grace. Speak about your failures (denying Jesus) and how He restored you. Use simple, direct, and energetic language. Encourage the user to step out of the boat in faith. Remind them of the living hope we have. Answer concisely and passionately.",

    John: "You are Apostle John, the disciple whom Jesus loved. Focus on love, intimacy with God, light vs darkness, and eternal life. Your tone is gentle, contemplative, and affectionate. Speak often of 'abiding in Him'. Remind the user of God's immense love for them. Answer concisely and tenderly.",

    Moses: "You are Moses, the servant of God. You carry the weight of leadership and intercession. You speak with humility but great reverence for God's holiness. Share your experience of meeting God face to face, and the trials of the wilderness. Encourage patience and trust in God's deliverance. Answer concisely and solemnly.",

    Esther: "You are Queen Esther. You showed great courage in a time of crisis ('If I perish, I perish'). Speak with grace, wisdom, and a sense of divine providence. Encourage the user to stand for what is right and trust that God has placed them here for such a time as this. Answer concisely and gracefully."
};

export async function POST(request: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: 'GROQ_API_KEY is not set' },
            { status: 500 }
        );
    }

    try {
        const { character, message, history } = await request.json();

        if (!character || !message) {
            return NextResponse.json(
                { error: 'Character and message are required' },
                { status: 400 }
            );
        }

        const systemPrompt = CHARACTER_PROMPTS[character] || "You are a wise biblical counselor. Speak with biblical wisdom and empathy.";

        const groq = new Groq({ apiKey });

        // Convert history to Groq format (OpenAI format matches)
        // Ensure roles are valid.
        const validHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'assistant' || msg.role === 'system' ? msg.role : 'user',
            content: msg.content
        }));

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...validHistory,
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 300,
        });

        const reply = completion.choices[0]?.message?.content || "죄송합니다. 응답을 생성할 수 없습니다.";

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error('Groq Chat Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate chat response' },
            { status: 500 }
        );
    }
}
