import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { password } = body;

    if (!password) {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // 0. Check Master Password
    const MASTER_PASSWORD = '주는나의목자나는주의어린양';
    if (password === MASTER_PASSWORD) {
        const { error } = await supabaseAdmin.from('prayer_requests').delete().eq('id', id);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Deleted successfully by Master' });
    }

    // 1. Verify password (User)
    const { data: currentData, error: fetchError } = await supabase
        .from('prayer_requests')
        .select('password')
        .eq('id', id)
        .single();

    if (fetchError || !currentData) {
        return NextResponse.json({ error: 'Prayer request not found' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, currentData.password);
    if (!isValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 2. Delete
    const { error } = await supabaseAdmin.from('prayer_requests').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
}
