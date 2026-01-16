"use client";

import { useEffect, useState } from "react";
import { MessageCircle, MoreVertical, Search, Filter } from "lucide-react";
import clsx from "clsx";
import { ChatDrawer } from "@/components/features/members/ChatDrawer";
import { MemberModal } from "@/components/features/members/MemberModal";

// Define Member type locally for now or import from shared types
interface Member {
    id: number;
    name: string;
    role: string;
    status: 'active' | 'offline' | 'busy';
    avatar: string;
    email: string;
    year?: string;
    department?: string;
    plan?: string;
    forum?: string;
    joined_date?: string;
    membership_expiry?: string;
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [memberModalOpen, setMemberModalOpen] = useState(false);
    const [isTableView, setIsTableView] = useState(true); // Default to table for detailed view

    useEffect(() => {
        fetchMembers();
        const interval = setInterval(async () => {
            await fetch('/api/auth/heartbeat', { method: 'POST' });
            fetchMembers();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    async function fetchMembers() {
        try {
            const res = await fetch('/api/members');
            const data = await res.json();
            setMembers(data);
        } catch (err) {
            console.error("Failed to fetch members");
            async function handleAddMember(data: any) {
                const res = await fetch('/api/members', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || 'Failed to add member');
                }

                fetchMembers(); // Refresh list
            }

            const filteredMembers = members.filter(member => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                return (
                    member.name.toLowerCase().includes(query) ||
                    member.role.toLowerCase().includes(query) ||
                    member.department?.toLowerCase().includes(query) ||
                    member.year?.toLowerCase().includes(query)
                );
            });

            return (
                <div className="p-8 relative">
                    <header className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-text-primary">Team Members</h1>
                            <p className="text-text-secondary">Manage your team and memberships.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsTableView(!isTableView)}
                                className="px-4 py-2 border border-border rounded-xl font-medium text-text-secondary hover:bg-surface transition-colors"
                            >
                                {isTableView ? "Grid View" : "Table View"}
                            </button>
                            <button className="btn-primary" onClick={() => setMemberModalOpen(true)}>Add Member</button>
                        </div>
                    </header>

                    {/* Filters */}
                    <div className="mb-6 flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, role, dept..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface focus:border-primary focus:outline-none"
                            />
                        </div>
                        <button className="p-2.5 border border-border rounded-xl bg-surface hover:bg-gray-50 text-text-secondary">
                            <Filter size={20} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-text-tertiary">Loading members...</div>
                    ) : isTableView ? (
                        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-border text-xs uppercase text-text-secondary font-semibold">
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Dept / Year</th>
                                            <th className="px-6 py-4">Plan / Forum</th>
                                            <th className="px-6 py-4">Membership</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <img
                                                                src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                                                                alt={member.name}
                                                                className="w-10 h-10 rounded-full object-cover bg-gray-100"
                                                            />
                                                            <span className={clsx(
                                                                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                                                                member.status === 'active' ? 'bg-green-500' :
                                                                    member.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                                                            )} />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-text-primary">{member.name}</div>
                                                            <div className="text-xs text-text-secondary">{member.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-text-secondary">
                                                    <div className="text-text-primary font-medium">{member.department || '-'}</div>
                                                    <div className="text-xs">{member.year || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-text-secondary">
                                                    <div className="text-text-primary font-medium">{member.plan || '-'}</div>
                                                    <div className="text-xs">{member.forum || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="text-text-primary">
                                                        {member.joined_date ? new Date(member.joined_date).toLocaleDateString() : '-'}
                                                    </div>
                                                    {member.membership_expiry && (
                                                        <div className="text-xs text-red-500">
                                                            Exp: {new Date(member.membership_expiry).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedMember(member)}
                                                        className="p-2 hover:bg-blue-50 text-text-secondary hover:text-primary rounded-lg transition-colors"
                                                        title="Chat"
                                                    >
                                                        <MessageCircle size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMembers.map((member) => (
                                <div key={member.id} className="bg-surface p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow group relative">
                                    <div className="absolute top-4 right-4 text-text-tertiary cursor-pointer hover:text-text-primary">
                                        <MoreVertical size={20} />
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative mb-4">
                                            <img
                                                src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                                                alt={member.name}
                                                className="w-20 h-20 rounded-full bg-gray-100 object-cover"
                                            />
                                            <span className={clsx(
                                                "absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white",
                                                member.status === 'active' ? 'bg-green-500' :
                                                    member.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                                            )} title={member.status} />
                                        </div>

                                        <h3 className="text-lg font-bold text-text-primary">{member.name}</h3>
                                        <p className="text-sm text-primary font-medium mb-1">{member.role}</p>
                                        <p className="text-xs text-text-secondary mb-4">{member.email}</p>

                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-left w-full bg-gray-50 p-3 rounded-lg mb-4">
                                            <div>
                                                <span className="text-text-tertiary block">Dept</span>
                                                <span className="font-medium">{member.department || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-text-tertiary block">Year</span>
                                                <span className="font-medium">{member.year || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-text-tertiary block">Plan</span>
                                                <span className="font-medium">{member.plan || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-text-tertiary block">Expires</span>
                                                <span className="font-medium">{member.membership_expiry ? new Date(member.membership_expiry).toLocaleDateString() : '-'}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full">
                                            <button
                                                onClick={() => setSelectedMember(member)}
                                                className="flex-1 py-2 px-4 rounded-xl bg-blue-50 text-primary font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <MessageCircle size={18} />
                                                Chat
                                            </button>
                                            <button className="py-2 px-4 rounded-xl border border-border text-text-secondary font-medium hover:bg-gray-50 transition-colors">
                                                Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    ))}
                </div>
            )
        }

        {/* Chat Drawer */ }
        <ChatDrawer
            member={selectedMember}
            isOpen={!!selectedMember}
            onClose={() => setSelectedMember(null)}
        />

        {/* Member Modal */ }
        <MemberModal
            isOpen={memberModalOpen}
            onClose={() => setMemberModalOpen(false)}
            onSubmit={handleAddMember}
        />
            </div >
            );
    }
