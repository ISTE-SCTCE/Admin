"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Send, X, Loader2 } from "lucide-react";
import clsx from "clsx";

interface Message {
    id: number;
    from: string;
    to: string;
    content: string;
    timestamp: string;
}

interface ChatDrawerProps {
    member: any | null;
    isOpen: boolean;
    onClose: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ChatDrawer({ member, isOpen, onClose }: ChatDrawerProps) {
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Poll for messages every 1 second when open and member is selected
    const { data: messages, mutate } = useSWR<Message[]>(
        isOpen && member ? `/api/messages?targetId=${member.id}` : null,
        fetcher,
        { refreshInterval: 1000 }
    );

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !member) return;

        try {
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: member.id, content: input })
            });
            setInput("");
            mutate(); // Immediate refresh
        } catch (err) {
            console.error("Failed to send");
        }
    };

    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-surface shadow-2xl border-l border-border transform transition-transform z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-background">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full bg-gray-100" />
                        <span className={clsx(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                            member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        )} />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary">{member.name}</h3>
                        <p className="text-xs text-text-secondary capitalize">{member.status}</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-text-secondary">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 from-gray-50 to-white" ref={scrollRef}>
                {!messages ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                ) : messages.length === 0 ? (
                    <p className="text-center text-text-tertiary text-sm mt-10">Start the conversation with {member.name}</p>
                ) : (
                    messages.map((msg: any) => { // using any to accept isMine
                        const isMe = msg.isMine;
                        return (
                            <div key={msg.id} className={clsx("flex", isMe ? "justify-end" : "justify-start")}>
                                <div className={clsx(
                                    "max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm",
                                    isMe ? "bg-primary text-white" : "bg-white text-text-primary border border-gray-100"
                                )}>
                                    <p>{msg.content}</p>
                                    <span className={clsx("text-[10px] block text-right mt-1 opacity-70")}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 input-field rounded-full px-4 py-2 border border-border focus:border-primary focus:outline-none"
                    />
                    <button type="submit" className="p-2 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm" disabled={!input.trim()}>
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
