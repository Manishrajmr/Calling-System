import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, Upload, CheckCircle, Brain, Database } from 'lucide-react';
import axios from 'axios';

const FAQCreateModal = ({ onClose }: { onClose: () => void }) => {
    const [mode, setMode] = useState<'manual' | 'import'>('manual');
    const [topicName, setTopicName] = useState('');
    const [items, setItems] = useState([{ question: '', answer: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const addItem = () => setItems([...items, { question: '', answer: '' }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...items];
        (newItems as any)[index][field] = value;
        setItems(newItems);
    };

    const API_BASE = "http://localhost:5000/api/support";

    const handleBulkSubmit = async () => {
        if (!topicName || items.some(i => !i.question || !i.answer)) {
            alert("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(`${API_BASE}/bulk`, { topicName, items });
            setSuccess(true);
            setTimeout(onClose, 2000);
        } catch (err) {
            alert("Failed to save FAQs");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // UI Mock for parsing
        alert(`File "${file.name}" selected. System will parse this ${file.type.includes('pdf') ? 'PDF' : 'CSV'} and extract Q&A pairs automatically.`);
        // Real implementation would use FileReader or a backend endpoint
    };

    return (
        <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">

                {/* Header */}
                <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Database size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Knowledge Base Manager</h2>
                            <p className="text-indigo-100 text-xs">Create or import FAQs for your CRM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X /></button>
                </div>

                {/* Content Wrapper */}
                <div className="flex-1 overflow-y-auto flex">

                    {/* Sidebar Nav */}
                    <div className="w-48 bg-gray-50 border-r p-4 space-y-2 hidden md:block">
                        <button
                            onClick={() => setMode('manual')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'manual' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            <Plus size={18} /> Manual
                        </button>
                        <button
                            onClick={() => setMode('import')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'import' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            <Upload size={18} /> Import Data
                        </button>
                    </div>

                    <div className="flex-1 p-8">
                        {success ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                                <p className="text-gray-500">Your knowledge base has been updated.</p>
                            </div>
                        ) : mode === 'manual' ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Knowledge Topic</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Inbound Logistics"
                                        className="w-full mt-2 bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 font-medium"
                                        value={topicName}
                                        onChange={e => setTopicName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Question & Answer Pairs</label>
                                        <button onClick={addItem} className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:bg-indigo-50 px-3 py-1 rounded-full transition-all">
                                            <Plus size={14} /> Add Another
                                        </button>
                                    </div>

                                    {items.map((item, idx) => (
                                        <div key={idx} className="p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-indigo-100 transition-all space-y-4 relative group">
                                            {items.length > 1 && (
                                                <button
                                                    onClick={() => removeItem(idx)}
                                                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                            <input
                                                type="text"
                                                placeholder="Question"
                                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                value={item.question}
                                                onChange={e => updateItem(idx, 'question', e.target.value)}
                                            />
                                            <textarea
                                                placeholder="Answer"
                                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                                                value={item.answer}
                                                onChange={e => updateItem(idx, 'answer', e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col space-y-8">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-900">Import Knowledge</h3>
                                    <p className="text-gray-500 text-sm mt-1">Upload files to automatically generate FAQs</p>
                                </div>

                                <div className="flex-1 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-12 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.csv,.doc,.docx"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileUpload}
                                    />
                                    <div className="w-16 h-16 bg-white text-indigo-600 rounded-2xl shadow-md flex items-center justify-center mb-4">
                                        <FileText size={28} />
                                    </div>
                                    <p className="font-bold text-gray-700">Drop your file here</p>
                                    <p className="text-xs text-gray-400 mt-1">Supports PDF, CSV, DOCX (Max 10MB)</p>
                                </div>

                                <div className="p-5 bg-indigo-50 rounded-2xl flex gap-4 items-start">
                                    <Brain className="text-indigo-600 shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="text-sm font-bold text-indigo-900">AI-Powered Parsing</p>
                                        <p className="text-xs text-indigo-700 leading-relaxed">Our AI models will analyze your document, identify key questions, and propose relevant answers for your review.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
                    {mode === 'manual' && (
                        <button
                            onClick={handleBulkSubmit}
                            disabled={isSubmitting}
                            className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 disabled:bg-gray-300 transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Knowledge Base'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FAQCreateModal;
