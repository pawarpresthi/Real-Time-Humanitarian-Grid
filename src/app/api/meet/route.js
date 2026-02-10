
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// If users provide these env vars, we can do real API calls
// otherwise fallback to the client-side 'meet.new' shortcut
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

export async function POST(req) {
    try {
        // If not configured, return a flag to use client-side shortcut
        if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
            return NextResponse.json({
                meetLink: 'https://meet.google.com/new',
                mode: 'shortcut'
            });
        }

        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const body = await req.json(); // { summary, description }

        const event = {
            summary: body.summary || 'Emergency Assessment Meeting',
            description: body.description || 'Video assessment for disaster relief.',
            start: {
                dateTime: new Date().toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 mins
                timeZone: 'Asia/Kolkata',
            },
            conferenceData: {
                createRequest: {
                    requestId: `meet_${Date.now()}`,
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });

        return NextResponse.json({
            meetLink: response.data.hangoutLink,
            mode: 'api'
        });

    } catch (error) {
        console.error('G-Meet API Error:', error);
        // Fallback
        return NextResponse.json({
            meetLink: 'https://meet.google.com/new',
            mode: 'fallback'
        });
    }
}
