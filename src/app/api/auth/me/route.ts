import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const email = cookieStore.get("user_email")?.value;
        const role = cookieStore.get("user_role")?.value;
        const name = cookieStore.get("user_name")?.value;

        if (!email) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        return NextResponse.json({
            email,
            role,
            name
        });
    } catch (error) {
        console.error('Error fetching current user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
