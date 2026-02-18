import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { checkContent } from '@/lib/moderation';
// PUT: Update log
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { nickname, password, content, is_public, bible_verse, media_url } = body;

    // 1. Verify password
    const { data: currentData, error: fetchError } = await supabase
        .from('qt_logs')
        .select('password')
        .eq('id', id)
        .single();

    if (fetchError || !currentData) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, currentData.password);
    if (!isValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (is_public) {
        const { flagged, categories } = await checkContent(content);
        if (flagged) {
            return NextResponse.json(
                { error: `부적절한 내용이 감지되어 수정할 수 없습니다: ${categories.join(', ')}` },
                { status: 400 }
            );
        }
    }

    // 2. Update
    const { data, error } = await supabase
        .from('qt_logs')
        .update({ nickname, content, is_public, bible_verse, media_url })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// DELETE: Remove log
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { password } = body;

    // 0. Check Master Password
    const MASTER_PASSWORD = '주는나의목자나는주의어린양';
    if (password === MASTER_PASSWORD) {
        const { error } = await supabase.from('qt_logs').delete().eq('id', id);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Deleted successfully by Master' });
    }

    // 1. Verify password (User)
    const { data: currentData, error: fetchError } = await supabase
        .from('qt_logs')
        .select('password')
        .eq('id', id)
        .single();

    if (fetchError || !currentData) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, currentData.password);
    if (!isValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 2. Delete
    const { error } = await supabase.from('qt_logs').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
}
