import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user already exists
        const users = await db.users.findAll();
        const existingUser = users.find((u: any) => u.email === email);

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Create User
        // Default role to Admin for this platform
        const userData = {
            name,
            email,
            password,
            role: "Admin",
            created_at: new Date().toISOString()
        };

        const newUser = await db.users.create(userData);

        // Create Member entry to ensure they appear in member lists
        const memberData = {
            name,
            email,
            phone: "", // Optional or empty for now
            status: "active",
            joined_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString()
        };

        await db.members.create(memberData);

        return NextResponse.json({ success: true, user: newUser });

    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}
