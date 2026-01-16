import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // RBAC Check
        const cookieStore = await cookies();
        const userRole = cookieStore.get("user_role")?.value?.toLowerCase().trim() || "";

        // Allowed roles for editing: Chair, Vice Chair, Secretary (and Admin)
        const allowedRoles = ['chair', 'vice chair', 'secretary', 'admin'];
        const isAuthorized = allowedRoles.some(role => userRole.includes(role));

        if (!isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized: Only Chair, Vice Chair, and Secretary can edit members.' }, { status: 403 });
        }

        // Validate ID
        if (!id) {
            return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
        }

        // Update Member
        await db.members.update(parseInt(id), body);

        return NextResponse.json({ success: true, message: 'Member updated successfully' });

    } catch (error: any) {
        console.error('Error updating member:', error);
        return NextResponse.json({ error: error.message || 'Failed to update member' }, { status: 500 });
    }
}
