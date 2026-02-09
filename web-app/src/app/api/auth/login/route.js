import { NextResponse } from 'next/server';
import { getVolunteers } from '@/lib/data';

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, password } = body;

        // Default credentials for demo
        if (username === 'ngo_admin' && password === 'suraksha2024') {
            return NextResponse.json({ username, orgName: 'Helping Hands NGO' });
        }
        if (username === 'volunteer' && password === 'help123') {
            return NextResponse.json({ username, orgName: 'Volunteer User' });
        }

        const volunteers = getVolunteers();
        const user = volunteers.find(v => v.username === username && v.password === password);

        if (user) {
            return NextResponse.json({ username: user.username, orgName: user.orgName });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
