import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// GET: List recent prayer requests
export async function GET() {
    const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Limit to 50 recent requests

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// POST: Create a new prayer request
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nickname, password, content } = body;

        // Validation
        if (!nickname || !password || !content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        if (password.length !== 4) {
            return NextResponse.json({ error: 'Password must be 4 digits' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into DB
        const { data, error } = await supabase
            .from('prayer_requests')
            .insert([
                {
                    nickname,
                    password: hashedPassword,
                    content,
                },
            ])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
