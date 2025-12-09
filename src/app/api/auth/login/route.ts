import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        console.log('Login attempt for:', email);

        // Check against DB (now async)
        const users = await db.users.findAll();

        console.log('Users found:', users.length);
        console.log('Looking for user with email:', email);

        const user = users.find((u: any) => u.email === email && u.password === password);

        if (user) {
            console.log('User found, setting cookies');
            // Set session cookie
            const cookieStore = await cookies();
            cookieStore.set("session", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            });

            // Set user name cookie for personalization
            cookieStore.set("user_name", user.name, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });

            // Set user email cookie for identification (hidden from client JS mostly if httpOnly, but we need it server side)
            cookieStore.set("user_email", user.email, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });

            // Set role for display
            cookieStore.set("user_role", user.role, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });

            return NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
        }

        console.log('No matching user found');
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
