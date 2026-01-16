"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageCircle, X } from "lucide-react";
import clsx from "clsx";

interface Notification {
    id: string;
    fromName: string;
    content: string;
}

export function ChatNotifications() {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userMap, setUserMap] = useState<Record<string, string>>({});

    // 1. Get User ID from cookies and fetch Member names
    useEffect(() => {
        // Parse user_id from document.cookie
        const match = document.cookie.match(new RegExp('(^| )user_id=([^;]+)'));
        if (match) {
            setUserId(match[2]);
        }

        // Fetch members to map IDs to Names
        fetch('/api/members')
            .then(res => res.json())
            .then(data => {
                const map: Record<string, string> = {};
                data.forEach((m: any) => {
                    map[m.id] = m.name;
                });
                setUserMap(map);
            })
            .catch(err => console.error("Failed to fetch members for notifications", err));
    }, []);

    // 2. Subscribe to Supabase Realtime
    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel('chat_notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `to=eq.${userId}`
                },
                (payload) => {
                    const newMessage = payload.new;
                    const fromId = newMessage.from;
                    const fromName = userMap[fromId] || "Someone";

                    // Show notification
                    const notifId = Math.random().toString(36).substring(7);
                    setNotification({
                        id: notifId,
                        fromName,
                        content: newMessage.content
                    });

                    // Auto hide after 5 seconds
                    setTimeout(() => {
                        setNotification(current => current?.id === notifId ? null : current);
                    }, 5000);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, userMap]);

    if (!notification) return null;

    return (
        <div className="fixed top-24 right-4 z-[2000] animate-in slide-in-from-right fade-in duration-300">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl rounded-2xl p-4 w-80 flex gap-4 items-start relative">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full shrink-0 text-blue-600 dark:text-blue-400">
                    <MessageCircle size={24} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{notification.fromName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{notification.content}</p>
                    <p className="text-xs text-gray-400 mt-1">Just now</p>
                </div>
                <button
                    onClick={() => setNotification(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
            {/* Simple audio ding */}
            <audio src="/sounds/notification.mp3" autoPlay className="hidden" />
        </div>
    );
}
