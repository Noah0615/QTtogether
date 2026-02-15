import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

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

    // 2. Delete
    const { error } = await supabase.from('qt_logs').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
}
