import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    cookieStore.delete("user_name");
    cookieStore.delete("user_role"); // We will add this to login

    return NextResponse.json({ success: true });
}
