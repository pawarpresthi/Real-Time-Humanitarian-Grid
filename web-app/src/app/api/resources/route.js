import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Resource } from '@/lib/models';

export async function GET() {
    try {
        await connectDB();
        const resources = await Resource.find({});
        return NextResponse.json(resources);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const newRes = await Resource.create(body);
        return NextResponse.json(newRes, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
    }
}
