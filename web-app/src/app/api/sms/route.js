import { NextResponse } from 'next/server';
import { addRequest } from '@/lib/data';

// Simulates an SMS/USSD Gateway Webhook (like Twilio or a local GSM gateway)
// Format expected: "HELP [NAME] | [LOCATION] | [NEEDS] | [URGENCY]"
export async function POST(req) {
    try {
        const body = await req.json();
        const smsContent = body.text || body.Body; // Common fields for SMS gateways
        const from = body.from || body.From || 'Unknown SMS';

        if (!smsContent || !smsContent.toUpperCase().startsWith('HELP')) {
            return NextResponse.json({ message: 'Invalid SMS format. Start with HELP.' }, { status: 400 });
        }

        // Parse: HELP Ramesh | Gomti Nagar | Water | High
        const parts = smsContent.substring(4).split('|').map(p => p.trim());
        const name = parts[0] || 'SMS User';
        const location = parts[1] || 'Unknown Location';
        const needs = parts[2] ? parts[2].split(',').map(n => n.trim()) : ['General Aid'];
        const urgency = parts[3] || 'Standard';

        const newRequest = addRequest({
            name,
            location,
            needs,
            urgency,
            phone: from,
            source: 'SMS/USSD Fallback',
            language: 'English' // Assume English for SMS fallback or detect
        });

        // In a real app, you would send a reply SMS here
        console.log(`[SMS GATEWAY] New request created from ${from}: ${smsContent}`);

        return NextResponse.json({
            success: true,
            message: 'Emergency request logged via SMS. Help is on the way.',
            requestId: newRequest.id
        });
    } catch (error) {
        console.error('SMS Gateway Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
