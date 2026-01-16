"use client";

import { X, Shield } from "lucide-react";
import { useState } from "react";

interface AppointExecomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (role: string) => Promise<void>;
    memberName: string;
}

export function AppointExecomModal({ isOpen, onClose, onSubmit, memberName }: AppointExecomModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState("Secretary");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await onSubmit(selectedRole);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to appoint member');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <header className="px-6 py-4 border-b border-border flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <Shield className="text-primary" size={20} />
                        Appoint Execom
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-text-secondary transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-text-secondary">
                        Appoint <strong>{memberName}</strong> to an Executive Committee position.
                        <br />
                        <span className="text-xs text-amber-600 mt-1 block">This will grant them administrative privileges.</span>
                    </p>

                    {error && (
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Select Position</label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none bg-white font-medium"
                        >
                            <option value="Secretary">Secretary</option>
                            <option value="Vice Chair">Vice Chair</option>
                            <option value="Chair">Chair</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-text-secondary hover:bg-gray-50 rounded-lg font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
                            {isLoading ? 'Confirm' : 'Appoint'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
