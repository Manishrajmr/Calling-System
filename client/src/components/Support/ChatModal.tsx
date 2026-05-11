import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, X, ArrowLeft, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import axios from 'axios';

const ChatModal = ({ onClose }: { onClose: () => void }) => {
    const [view, setView] = useState('topics');
    const [topics, setTopics] = useState<any[]>([]);
    const [queries, setQueries] = useState<any[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<any>(null);
    const [selectedQuery, setSelectedQuery] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const API_BASE = "http://localhost:5000/api/support";

    useEffect(() => {
        axios.get(`${API_BASE}/topics`).then(res => setTopics(res.data));
    }, []);

    const handleTopicClick = (topic: any) => {
        setSelectedTopic(topic);
        axios.get(`${API_BASE}/topics/${topic.id}/queries`).then(res => {
            setQueries(res.data);
            setView('queries');
        });
    };

    return (
        <div className="absolute bottom-20 right-0 w-96 h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-6 duration-300">

            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <HelpCircle size={20} />
                    <span className="font-bold tracking-tight">Support Center</span>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg"><X size={20} /></button>
            </div>

            <div className="p-4 bg-white border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl focus:outline-none text-sm transition-all focus:ring-2 focus:ring-indigo-100"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {view === 'topics' && (
                    <div className="space-y-3">
                        {topics.map(topic => (
                            <button
                                key={topic.id}
                                onClick={() => handleTopicClick(topic)}
                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-100/50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                                        {topic.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-800 text-sm leading-tight">{topic.name}</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">{topic.total_queries || 0} Articles</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-0.5" />
                            </button>
                        ))}
                    </div>
                )}

                {view === 'queries' && (
                    <div className="space-y-3 animate-in slide-in-from-right-4 duration-200">
                        <button onClick={() => setView('topics')} className="flex items-center gap-1 text-indigo-600 font-bold text-xs mb-3 hover:bg-indigo-50 w-fit px-2 py-1 rounded-lg">
                            <ArrowLeft size={14} /> Back
                        </button>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">{selectedTopic?.name}</p>
                        {queries.map(q => (
                            <button
                                key={q.id}
                                onClick={() => { setSelectedQuery(q); setView('answer'); }}
                                className="w-full text-left p-4 rounded-xl hover:bg-gray-50 text-gray-700 text-sm border border-gray-100"
                            >
                                {q.question}
                            </button>
                        ))}
                    </div>
                )}

                {view === 'answer' && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                        <button onClick={() => setView('queries')} className="flex items-center gap-1 text-indigo-600 font-bold text-xs mb-3 hover:bg-indigo-50 w-fit px-2 py-1 rounded-lg">
                            <ArrowLeft size={14} /> Back
                        </button>
                        <h3 className="font-bold text-gray-900 text-lg leading-snug px-1">{selectedQuery?.question}</h3>
                        <div className="text-gray-600 text-sm leading-relaxed p-4 bg-gray-50 rounded-2xl border border-gray-100 whitespace-pre-wrap">
                            {selectedQuery?.answer}
                        </div>

                        <div className="pt-4 text-center">
                            <p className="text-xs text-gray-400 font-medium mb-4">Did this answer your question?</p>
                            <div className="flex justify-center gap-4">
                                <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600 transition-all">
                                    <div className="p-3 border rounded-2xl"><ThumbsUp size={18} /></div>
                                    <span className="text-[10px] font-bold">Yes</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500 transition-all">
                                    <div className="p-3 border rounded-2xl"><ThumbsDown size={18} /></div>
                                    <span className="text-[10px] font-bold">No</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-gray-50 border-t text-center">
                <p className="text-[10px] font-bold text-gray-400">Knowledge Base Help System</p>
            </div>
        </div>
    );
};

export default ChatModal;
