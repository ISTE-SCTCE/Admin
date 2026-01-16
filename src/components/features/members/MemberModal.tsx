"use client";

import { X, User, Mail, Phone, Lock, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";

interface MemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: any;
}

export function MemberModal({ isOpen, onClose, onSubmit, initialData }: MemberModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Use default values if no initialData provided
    const defaultData = {
        name: "",
        email: "",
        phone: "",
        role: "Member",
        password: "",
        year: "",
        department: "",
        plan: "",
        forum: "",
        joined_date: new Date().toISOString().split('T')[0],
        membership_expiry: ""
    };

    const data = initialData || defaultData;

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const submitData = {
            id: initialData?.id, // Includes ID if editing
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            role: formData.get('role'),
            // Only include password if it's changing or new user
            ...(formData.get('password') ? { password: formData.get('password') } : {}),
            year: formData.get('year'),
            department: formData.get('department'),
            plan: formData.get('plan'),
            forum: formData.get('forum'),
            joined_date: formData.get('joined_date') || null,
            membership_expiry: formData.get('membership_expiry') || null
        };

        try {
            await onSubmit(submitData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save member');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-in fade-in zoom-in duration-200 h-[90vh] overflow-y-auto">
                <header className="px-6 py-4 border-b border-border flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-text-primary">{initialData ? 'Edit Member' : 'Add New Member'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-text-secondary transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                            <input
                                name="name"
                                required
                                defaultValue={data.name}
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                            <input
                                name="email"
                                type="email"
                                required
                                defaultValue={data.email}
                                placeholder="john@example.com"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    name="phone"
                                    defaultValue={data.phone}
                                    placeholder="123-456-7890"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Role</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <select
                                    name="role"
                                    required
                                    defaultValue={data.role}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none bg-white"
                                >
                                    <option value="Member">Member</option>
                                    <option value="Secretary">Secretary</option>
                                    <option value="Vice Chair">Vice Chair</option>
                                    <option value="Chair">Chair</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Year</label>
                            <select
                                name="year"
                                defaultValue={data.year}
                                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none bg-white"
                            >
                                <option value="">Select Year</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Department</label>
                            <select
                                name="department"
                                defaultValue={data.department}
                                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none bg-white"
                            >
                                <option value="">Select Dept</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="ME">ME</option>
                                <option value="CE">CE</option>
                                <option value="BT">BT</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Plan</label>
                            <select
                                name="plan"
                                defaultValue={data.plan}
                                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none bg-white"
                            >
                                <option value="">Select Plan</option>
                                <option value="One Year">One Year</option>
                                <option value="Two Year">Two Year</option>
                                <option value="Four Year">Four Year</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Forum</label>
                            <input
                                name="forum"
                                defaultValue={data.forum}
                                placeholder="SwaS / Main"
                                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Joined Date</label>
                            <input
                                name="joined_date"
                                type="date"
                                defaultValue={data.joined_date ? new Date(data.joined_date).toISOString().split('T')[0] : ''}
                                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Expiry Date</label>
                            <input
                                name="membership_expiry"
                                type="date"
                                defaultValue={data.membership_expiry ? new Date(data.membership_expiry).toISOString().split('T')[0] : ''}
                                className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Password {initialData && '(Leave blank to keep current)'}</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                            <input
                                name="password"
                                type="password"
                                required={!initialData} // Only required for new users
                                placeholder={initialData ? "Enter new password to change" : "Set initial password"}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3 sticky bottom-0 bg-white p-4 -mx-6 -mb-6 border-t border-border">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-text-secondary hover:bg-gray-50 rounded-lg font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
                            {isLoading ? 'Saving...' : (initialData ? 'Update Member' : 'Add Member')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
