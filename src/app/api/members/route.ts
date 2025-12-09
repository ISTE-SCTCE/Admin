import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const currentEmail = cookieStore.get("user_email")?.value;

    // Get all users (to check last_seen)
    const users = await db.users.findAll();
    const members = await db.members.findAll();

    // Threshold for "Active" is 5 minutes
    const FIVE_MINUTES = 5 * 60 * 1000;
    const now = new Date().getTime();

    const enrichedMembers = members
        .filter((member: any) => member.email !== currentEmail) // Filter out self
        .map((member: any) => {
            const user = users.find((u: any) => u.email === member.email);
            let status = 'offline';

            if (user && user.last_seen) {
                const lastSeen = new Date(user.last_seen).getTime();
                if (now - lastSeen < FIVE_MINUTES) {
                    status = 'active';
                } else {
                    status = 'offline';
                }
            }

            // If user explicitly set "busy" or something else in members.json, we might want to respect it?
            // For now, let's override with calculated presence unless manually set to something specific?
            // The prompt asked for "active or offline when logged in".
            // So simpler: if active recently -> active, else offline.

            return { ...member, status };
        });

    return NextResponse.json(enrichedMembers);
}
