import { AppointExecomModal } from "@/components/features/members/AppointExecomModal";
import { MessageCircle, MoreVertical, Search, Filter, Edit2, Shield } from "lucide-react";

// ... existing imports

export default function MembersPage() {
    // ... existing state
    const [appointModalOpen, setAppointModalOpen] = useState(false);
    const [appointingMember, setAppointingMember] = useState<Member | null>(null);

    // ... existing effects & fetchFunctions

    async function handleAppointExecom(role: string) {
        if (!appointingMember) return;

        try {
            const res = await fetch(`/api/members/${appointingMember.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role })
            });

            if (!res.ok) throw new Error("Failed to appoint member");

            fetchMembers();
            setAppointModalOpen(false);
            setAppointingMember(null);
        } catch (error) {
            console.error(error);
            alert("Failed to appoint member. Please try again.");
        }
    }

    // ... existing filtering logic

    const canEdit = ['chair', 'vice chair', 'secretary', 'admin'].includes(currentUserRole);
    const isChair = currentUserRole === 'chair';

    return (
        <div className="p-8 relative">
            {/* ... Header & Tabs ... */}

            {loading ? (
                <div className="text-center py-20 text-text-tertiary">Loading members...</div>
            ) : isTableView ? (
                <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            {/* ... thead ... */}
                            <tbody className="divide-y divide-border">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                                        {/* ... other tds ... */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {isChair && !['chair', 'vice chair', 'secretary'].includes(member.role.toLowerCase()) && (
                                                    <button
                                                        onClick={() => {
                                                            setAppointingMember(member);
                                                            setAppointModalOpen(true);
                                                        }}
                                                        className="p-2 hover:bg-amber-50 text-text-secondary hover:text-amber-600 rounded-lg transition-colors"
                                                        title="Appoint as Execom"
                                                    >
                                                        <Shield size={18} />
                                                    </button>
                                                )}
                                                {canEdit && (
                                                    <button
                                                        onClick={() => handleEditClick(member)}
                                                        className="p-2 hover:bg-blue-50 text-text-secondary hover:text-primary rounded-lg transition-colors"
                                                        title="Edit Member"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                )}
                                                {/* ... Chat button ... */}
                                            </div>
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
                            <div className="absolute top-4 right-4 flex gap-2">
                                {isChair && !['chair', 'vice chair', 'secretary'].includes(member.role.toLowerCase()) && (
                                    <button
                                        onClick={() => {
                                            setAppointingMember(member);
                                            setAppointModalOpen(true);
                                        }}
                                        className="text-text-tertiary hover:text-amber-600 transition-colors"
                                        title="Appoint Execom"
                                    >
                                        <Shield size={18} />
                                    </button>
                                )}
                                {/* ... Edit & More buttons ... */}
                            </div>
                            {/* ... Card Content ... */}
                        </div>
                    ))}
                </div>
            )}

            {/* ... ChatDrawer ... */}

            <MemberModal
                isOpen={memberModalOpen}
                onClose={() => {
                    setMemberModalOpen(false);
                    setEditingMember(null);
                }}
                onSubmit={handleMemberSubmit}
                initialData={editingMember}
            />

            <AppointExecomModal
                isOpen={appointModalOpen}
                onClose={() => {
                    setAppointModalOpen(false);
                    setAppointingMember(null);
                }}
                onSubmit={handleAppointExecom}
                memberName={appointingMember?.name || ""}
            />
        </div>
    );
}
