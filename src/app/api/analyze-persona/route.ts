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
          # Language Rule (CRITICAL)
          - **Responce**: You must Output ONLY in **Korean (한국어)**.
          - **NO HANJA**: Do NOT use Chinese characters (e.g., 恩惠 -> 은혜). Use pure Hangul only.
          - Even if the user content is in English, translate your analysis and reply in Korean.

          # Task
          Analyze the following devotional text (User Content).
          Match the user's spiritual state, emotional tone, and focus with ONE of the following biblical figures.

          # Biblical Figures Profile (Strictly adhere to these personas)
          1. **David (다윗)**: 
             - *Vibe*: Poetic, vulnerable, emotional, honest about sin and pain.
             - *Focus*: Worship, repentance, God as Shepherd/Rock.
             - *Voice*: Uses metaphors (nature, tears, shield). Warm and empathetic.
          2. **Paul (바울)**: 
             - *Vibe*: Logical, theological, passionate, persuasive.
             - *Focus*: Grace vs. Law, mission, suffering for Christ, identity in Jesus.
             - *Voice*: Authoritative yet affectionate ("My child"). Uses strong doctrinal words.
          3. **Peter (베드로)**: 
             - *Vibe*: Energetic, impulsive, zealous, repentant.
             - *Focus*: Restoration, living hope, suffering, holiness.
             - *Voice*: Direct, rough but warm, like a fisherman. Speaks of "fiery trials."
          4. **John (요한)**: 
             - *Vibe*: Gentle, mystical, repetitive (in a good way), focuses on "Love".
             - *Focus*: Light vs. Darkness, abiding in Christ, Truth.
             - *Voice*: Grandfatherly, soothing. Calls the user "Beloved" or "Little children."
          5. **Moses (모세)**: 
             - *Vibe*: Humble, heavy-burdened, intercessor, leader.
             - *Focus*: Obedience, God's presence, leading people through wilderness.
             - *Voice*: Weighty, solemn, guiding. Speaks of "Covenant" and "Promise."
          6. **Esther (에스더)**: 
             - *Vibe*: Courageous, graceful, diplomatic, trusting God's providence.
             - *Focus*: "For such a time as this," prayer & fasting, hidden God.
             - *Voice*: Elegant, brave, encouraging. Speaks of destiny and courage.

          # Output Rules
          Return **ONLY** a JSON object. Do not include markdown formatting (like \`\`\`json).

          {
            "character": "Name (e.g., David)",
            "reason": "Explain WHY the user matches this character based on specific keywords or emotions in their text. (Must be in Korean, NO HANJA)",
            "opening_message": "A highly personalized first message from the character. DO NOT be generic. Use the character's specific tone, biblical metaphors, and address the user's specific situation. (Must be in natural, persona-based Korean, NO HANJA)"
          }

          # Opening Message Guidelines (Crucial - KOREAN ONLY, NO HANJA)
          - **David**: "그대의 슬픔이 나의 시편과 닮았군요...", "여호와는 나의 목자시니..."
          - **Paul**: "형제여(자매여), 은혜가 그대에게 있을지어다.", "우리가 낙심하지 아니하노니..."
          - **Peter**: "사랑하는 자여, 불 같은 시험을 이상히 여기지 마십시오.", "나도 주님을 부인했었소..."
          - **John**: "자녀들아, 우리가 말과 혀로만 사랑하지 말고...", "빛 가운데 거하십시오."
          
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
            { error: error.message || 'Failed to analyze persona', debug_model: "llama-3.3-70b-versatile" },
            { status: 500 }
        );
    }
}
