import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { password } = await request.json();

    // Fetch the record's password hash
    const { data, error } = await supabase
        .from('qt_logs')
        .select('password, content, media_url')
        .eq('id', id)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, data.password);

    if (isValid) {
        return NextResponse.json({
            content: data.content,
            media_url: data.media_url
        });
    } else {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
}
