import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
    label: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
    icon: LucideIcon;
    iconBgClass: string; // Tailwind class or style for gradient
}

export function StatCard({ label, value, change, isPositive, icon: Icon, iconBgClass }: StatCardProps) {
    return (
        <div className="bg-surface p-6 rounded-xl shadow-md flex gap-4 transition-all hover:-translate-y-1 hover:shadow-xl">
            <div
                className={clsx("w-14 h-14 rounded-lg flex items-center justify-center shrink-0 text-white", iconBgClass)}
            >
                <Icon size={24} strokeWidth={2} />
            </div>
            <div className="flex-1">
                <div className="text-sm text-text-secondary mb-1">{label}</div>
                <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
                {change && (
                    <div className={clsx("text-xs font-medium", isPositive ? "text-success" : "text-text-secondary")}>
                        {change}
                    </div>
                )}
            </div>
        </div>
    );
}
