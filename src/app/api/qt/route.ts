import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { checkContent } from '@/lib/moderation';
export async function GET() {
    const { data, error } = await supabase
        .from('qt_logs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Hide content for private posts
    const sanitizedData = data.map((log) => ({
        ...log,
        password: null, // Never return password hash
        content: log.is_public ? log.content : '', // Clear content if private
        media_url: log.is_public ? log.media_url : null, // Clear media if private
    }));

    return NextResponse.json(sanitizedData);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nickname, password, content, is_public, bible_verse, media_url } = body;

        // Validation
        if (!nickname || !password || !content || password.length < 4) {
            return NextResponse.json(
                { error: 'Missing required fields or password too short (min 4 chars)' },
                { status: 400 }
            );
        }

        if (is_public) {
            const { flagged, categories } = await checkContent(content);
            if (flagged) {
                return NextResponse.json(
                    { error: `부적절한 내용이 감지되어 등록할 수 없습니다: ${categories.join(', ')}` },
                    { status: 400 }
                );
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('qt_logs')
            .insert([
                {
                    nickname,
                    password: hashedPassword,
                    content,
                    is_public,
                    bible_verse,
                    media_url,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error(error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
