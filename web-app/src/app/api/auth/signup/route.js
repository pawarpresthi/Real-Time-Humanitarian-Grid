import { NextResponse } from 'next/server';
import { addVolunteer, getVolunteers } from '@/lib/data';

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, password, orgName, phone } = body;

        const volunteers = getVolunteers();
        if (volunteers.some(v => v.username === username)) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        const newVolunteer = addVolunteer({ username, password, orgName, phone });
        return NextResponse.json(newVolunteer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
}
