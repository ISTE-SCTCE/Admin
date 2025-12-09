import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST() {
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    if (email) {
        // Update database
        // @ts-ignore
        db.users.updateLastSeen(email);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
}
