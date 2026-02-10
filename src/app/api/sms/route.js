import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Request } from '@/lib/models';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const smsContent = body.text || body.Body;
        const from = body.from || body.From || 'Unknown SMS';

        if (!smsContent || !smsContent.toUpperCase().startsWith('HELP')) {
            return NextResponse.json({ message: 'Invalid SMS format. Start with HELP.' }, { status: 400 });
        }

        const parts = smsContent.substring(4).split('|').map(p => p.trim());
        const name = parts[0] || 'SMS User';
        const location = parts[1] || 'Unknown Location';
        const needs = parts[2] ? parts[2].split(',').map(n => n.trim()) : ['General Aid'];
        const urgency = parts[3] || 'Standard';

        const newRequest = await Request.create({
            name,
            location,
            needs,
            urgency,
            phone: from,
            source: 'SMS/USSD Fallback',
            language: 'English',
            coords: { lat: 0, lng: 0 } // SMS fallback might not have coordinates
        });

        console.log(`[SMS GATEWAY] New request created from ${from}: ${smsContent}`);

        return NextResponse.json({
            success: true,
            message: 'Emergency request logged via SMS. Help is on the way.',
            requestId: newRequest._id
        });
    } catch (error) {
        console.error('SMS Gateway Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
