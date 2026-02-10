import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Volunteer } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { username, password } = body;

        // Default credentials for legacy/demo purposes (optional, better to migrate these to DB)
        if (username === 'ngo_admin' && password === 'suraksha2024') {
            return NextResponse.json({ username, orgName: 'Helping Hands NGO' });
        }

        const user = await Volunteer.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return NextResponse.json({ username: user.username, orgName: user.orgName });
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
