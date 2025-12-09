import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetIdStr = searchParams.get('targetId');

    if (!targetIdStr) {
        return NextResponse.json([]);
    }
    const targetId = parseInt(targetIdStr);

    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    if (!email) {
        return NextResponse.json([]);
    }

    // Find current user id
    const users = await db.users.findAll();
    const currentUser = users.find((u: any) => u.email === email);

    if (!currentUser) return NextResponse.json([]);

    const currentUserId = currentUser.id;
    const allMessages = await db.messages.findAll();

    // Filter messages between current user and target
    const filtered = allMessages.filter((m: any) =>
        (m.from === currentUserId && m.to === targetId) ||
        (m.from === targetId && m.to === currentUserId) ||
        // Legacy support for 'admin' messages if migrating
        (m.from === 'admin' && m.to === targetId && currentUser.role === 'Admin') ||
        (m.from === targetId && m.to === 'admin' && currentUser.role === 'Admin')
    ).map((m: any) => ({
        ...m,
        isMine: m.from === currentUserId || (m.from === 'admin' && currentUser.role === 'Admin')
    }));

    return NextResponse.json(filtered);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { to, content } = body;

        const cookieStore = await cookies();
        const email = cookieStore.get("user_email")?.value;

        const users = await db.users.findAll();
        const currentUser = users.find((u: any) => u.email === email);

        if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const newMsg = await db.messages.create({
            from: currentUser.id,
            to,
            content
        });

        return NextResponse.json(newMsg);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }
}
