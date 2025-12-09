"use client";

import { X, Calendar as CalendarIcon, Type, AlignLeft, Clock } from "lucide-react";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    selectedDate: Date | null;
}

export function EventModal({ isOpen, onClose, onSubmit, selectedDate }: EventModalProps) {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            title: formData.get('title'),
            date: formData.get('date'),
            type: formData.get('type'),
            description: formData.get('description')
        };
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-in fade-in zoom-in duration-200">
                <header className="px-6 py-4 border-b border-border flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-text-primary">Add New Event</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-text-secondary transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Event Title</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                            <input
                                name="title"
                                required
                                placeholder="e.g. Quarterly Meeting"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    name="date"
                                    type="date"
                                    required
                                    defaultValue={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                            <select name="type" className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none bg-white">
                                <option value="meeting">Meeting</option>
                                <option value="workshop">Workshop</option>
                                <option value="social">Social</option>
                                <option value="deadline">Deadline</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 text-text-tertiary" size={18} />
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="Add details..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary hover:bg-gray-50 rounded-lg font-medium">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm">
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
