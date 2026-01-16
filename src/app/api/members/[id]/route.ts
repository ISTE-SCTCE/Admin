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

        // 1. Fetch existing member to get the current email
        const currentMember = await db.members.findById(parseInt(id));

        if (!currentMember) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        // 2. Update Member
        await db.members.update(parseInt(id), body);

        // 3. Sync changes to Users table
        // We use the OLD email to find the user, then update them.
        // If email itself is changing, we still look up by old email.
        const userUpdates: any = {};
        if (body.role) userUpdates.role = body.role;
        if (body.name) userUpdates.name = body.name;
        if (body.password) userUpdates.password = body.password;
        if (body.email && body.email !== currentMember.email) userUpdates.email = body.email;

        if (Object.keys(userUpdates).length > 0) {
            try {
                await db.users.update(currentMember.email, userUpdates);
            } catch (err) {
                console.error('Failed to sync user data:', err);
                // We don't fail the whole request, but logging is important.
                // In a real app, transactional integrity might be needed.
            }
        }

        return NextResponse.json({ success: true, message: 'Member and User updated successfully' });

    } catch (error: any) {
        console.error('Error updating member:', error);
        return NextResponse.json({ error: error.message || 'Failed to update member' }, { status: 500 });
    }
}
