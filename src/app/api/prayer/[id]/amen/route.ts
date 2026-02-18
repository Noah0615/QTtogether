import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST: Increment amen_count
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Use RPC or atomic update if possible, but for now specific update
    // Supabase JS doesn't have a simple 'increment' helper without RPC, but we can read-then-write or use custom SQL.
    // However, simpler way for this MVP: Just update. 
    // Wait, to be safe against race conditions, RPC is best. 
    // But since I cannot create RPC easily from here without user running SQL, 
    // I will try to fetch first then update (optimistic) or just rely on client sending +1? No, server side.

    // Let's first fetch current count
    const { data: current, error: fetchError } = await supabase
        .from('prayer_requests')
        .select('amen_count')
        .eq('id', id)
        .single();

    if (fetchError || !current) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const { data, error } = await supabase
        .from('prayer_requests')
        .update({ amen_count: current.amen_count + 1 })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
