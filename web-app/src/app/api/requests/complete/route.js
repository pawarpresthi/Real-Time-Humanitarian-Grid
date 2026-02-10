import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Request } from '@/lib/models';

export async function POST(req) {
    try {
        await connectDB();
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const request = await Request.findByIdAndUpdate(id, { status: 'Completed' }, { new: true });

        if (request) {
            return NextResponse.json({ success: true, request });
        } else {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }
    } catch (e) {
        console.error("Completion error:", e);
        return NextResponse.json({ error: 'Failed to complete request' }, { status: 500 });
    }
}
