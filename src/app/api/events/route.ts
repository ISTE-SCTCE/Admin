import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    const events = await db.events.findAll();
    return NextResponse.json(events);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, date, type, description } = body;

        const newEvent = await db.events.create({
            title,
            date,
            type,
            description
        });

        return NextResponse.json(newEvent);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
