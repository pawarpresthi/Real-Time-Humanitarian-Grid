
import { NextResponse } from 'next/server';
import { getResources, addResource } from '@/lib/data';

export async function GET() {
    const resources = getResources();
    return NextResponse.json(resources);
}

export async function POST(req) {
    const body = await req.json();
    const newRes = addResource(body);
    return NextResponse.json(newRes, { status: 201 });
}
