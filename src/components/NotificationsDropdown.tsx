"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Megaphone, AlertCircle, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

interface Announcement {
    id: number;
    title: string;
    content: string;
    author: string;
    priority: 'low' | 'normal' | 'high';
    created_at: string;
}

export function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            fetchAnnouncements();
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/announcements');
            const data = await res.json();
            setAnnouncements(data.slice(0, 5)); // Show only latest 5
        } catch (error) {
            console.error('Failed to fetch announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return <AlertCircle className="text-red-500" size={16} />;
            case 'low':
                return <Info className="text-blue-500" size={16} />;
            default:
                return <AlertTriangle className="text-yellow-500" size={16} />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-50 border-l-red-500';
            case 'low':
                return 'bg-blue-50 border-l-blue-500';
            default:
                return 'bg-yellow-50 border-l-yellow-500';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl font-semibold hover:bg-background transition-colors cursor-pointer text-text-primary relative"
            >
                <Bell size={18} />
                Notifications
                {announcements.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {announcements.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-surface border border-border rounded-2xl shadow-xl z-50 max-h-[500px] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h3 className="font-bold text-text-primary">Notifications</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-text-tertiary hover:text-text-primary"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-text-tertiary">
                                Loading notifications...
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="p-8 text-center text-text-tertiary">
                                <Bell size={48} className="mx-auto mb-3 opacity-50" />
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {announcements.map((announcement) => (
                                    <div
                                        key={announcement.id}
                                        className={clsx(
                                            "p-4 hover:bg-background transition-colors border-l-4",
                                            getPriorityColor(announcement.priority)
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                {getPriorityIcon(announcement.priority)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-text-primary mb-1 truncate">
                                                    {announcement.title}
                                                </h4>
                                                <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                                                    {announcement.content}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-text-tertiary">
                                                    <span>By {announcement.author}</span>
                                                    <span>
                                                        {new Date(announcement.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {announcements.length > 0 && (
                        <div className="p-3 border-t border-border">
                            <Link
                                href="/announcements"
                                onClick={() => setIsOpen(false)}
                                className="block text-center text-sm text-primary hover:underline font-medium"
                            >
                                View all announcements
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
