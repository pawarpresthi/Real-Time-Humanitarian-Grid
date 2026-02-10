import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Volunteer } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { username, password, orgName, phone } = body;

        const existingUser = await Volunteer.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newVolunteer = await Volunteer.create({
            username,
            password: hashedPassword,
            orgName,
            phone
        });

        return NextResponse.json({
            message: 'Account created successfully',
            user: { username: newVolunteer.username, orgName: newVolunteer.orgName }
        }, { status: 201 });
    } catch (error) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
}
