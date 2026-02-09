import { NextResponse } from 'next/server';
import { getRequests, completeRequest } from '@/lib/data';

export async function POST(req) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const success = completeRequest(id);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }
    } catch (e) {
        return NextResponse.json({ error: 'Failed to complete request' }, { status: 500 });
    }
}
