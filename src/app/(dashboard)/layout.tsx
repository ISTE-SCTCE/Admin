import { Sidebar } from "@/components/Sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const user = {
        name: cookieStore.get("user_name")?.value || "Admin User",
        role: cookieStore.get("user_role")?.value || "Admin"
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar user={user} />
            <main className="flex-1 ml-[280px]">
                {children}
            </main>
        </div>
    );
}
