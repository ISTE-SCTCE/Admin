import { NavigationDock } from "@/components/features/layout/NavigationDock";
import { BubbleMenu } from "@/components/ui/BubbleMenu";
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

    const menuItems = [
        { label: 'Dashboard', href: '/', rotation: -5, hoverStyles: { bgColor: '#3b82f6', textColor: '#fff' } },
        { label: 'Members', href: '/members', rotation: 5, hoverStyles: { bgColor: '#10b981', textColor: '#fff' } },
        { label: 'Events', href: '/events', rotation: -5, hoverStyles: { bgColor: '#f59e0b', textColor: '#fff' } },
        { label: 'Budget', href: '/budget', rotation: 5, hoverStyles: { bgColor: '#ef4444', textColor: '#fff' } },
        { label: 'Announcements', href: '/announcements', rotation: -3, hoverStyles: { bgColor: '#8b5cf6', textColor: '#fff' } },
        { label: 'Reports', href: '/reports', rotation: 3, hoverStyles: { bgColor: '#ec4899', textColor: '#fff' } },
        { label: 'Settings', href: '/settings', rotation: -5, hoverStyles: { bgColor: '#6b7280', textColor: '#fff' } },
    ];

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Desktop Navigation */}
            <div className="hidden md:block">
                <NavigationDock user={user} />
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <BubbleMenu
                    logo={<span className="font-bold text-xl tracking-tighter">ISTE</span>}
                    items={menuItems}
                    useFixedPosition={true}
                    className="top-4"
                />
            </div>

            <main className="container mx-auto px-4 md:px-0">
                {children}
            </main>
        </div>
    );
}
