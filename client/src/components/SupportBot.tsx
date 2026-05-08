import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, X, MessageCircle, ArrowLeft, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import axios from 'axios';

const SupportBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('topics');
    const [topics, setTopics] = useState<any[]>([]);
    const [queries, setQueries] = useState<any[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<any>(null);
    const [selectedQuery, setSelectedQuery] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const API_BASE = "http://localhost:5000/api/support";

    useEffect(() => {
        if (isOpen && topics.length === 0) {
            axios.get(`${API_BASE}/topics`).then(res => setTopics(res.data));
        }
    }, [isOpen]);

    const handleTopicClick = (topic: any) => {
        setSelectedTopic(topic);
        axios.get(`${API_BASE}/topics/${topic.id}/queries`).then(res => {
            setQueries(res.data);
            setView('queries');
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.length > 2) {
            axios.get(`${API_BASE}/search?q=${val}`).then(res => {
                setQueries(res.data);
                setView('search');
            });
        } else if (val.length === 0) {
            setView('topics');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-indigo-700 transition-all transform hover:scale-110 active:scale-95"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            {isOpen && (
                <div className="absolute bottom-20 right-0 w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-indigo-600 p-6 text-white pb-10">
                        <h2 className="font-bold text-xl flex items-center gap-2">
                            <HelpCircle size={20} /> Maxpine Support
                        </h2>
                        <p className="text-indigo-100 text-xs mt-1">We typically reply in under a minute</p>
                    </div>

                    <div className="mx-4 -mt-6 bg-white rounded-xl shadow-lg border p-1 mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg focus:outline-none text-sm"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        {view === 'topics' && (
                            <div className="space-y-3">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Support Topics</p>
                                {topics.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => handleTopicClick(topic)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-indigo-50 border border-gray-50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg">
                                                {topic.name.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <span className="font-semibold text-gray-800 block text-sm">{topic.name}</span>
                                                <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                                                    {topic.total_queries || 0} Articles
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 translate-x-0 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {(view === 'queries' || view === 'search') && (
                            <div className="space-y-3">
                                <button onClick={() => setView('topics')} className="flex items-center gap-1 text-indigo-600 font-bold text-xs mb-2 hover:underline">
                                    <ArrowLeft size={14} /> Back to Categories
                                </button>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    {view === 'search' ? 'Search Results' : selectedTopic?.name}
                                </p>
                                {queries.length > 0 ? queries.map(q => (
                                    <button
                                        key={q.id}
                                        onClick={() => { setSelectedQuery(q); setView('answer'); }}
                                        className="w-full text-left p-4 rounded-xl hover:bg-gray-50 text-gray-700 text-sm border border-gray-100 shadow-sm transition-all"
                                    >
                                        {q.question}
                                    </button>
                                )) : <p className="text-sm text-gray-500 text-center py-10">No queries found.</p>}
                            </div>
                        )}

                        {view === 'answer' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <button onClick={() => setView('queries')} className="flex items-center gap-1 text-indigo-600 font-bold text-xs hover:underline">
                                    <ArrowLeft size={14} /> Back
                                </button>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">{selectedQuery?.question}</h3>
                                <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedQuery?.answer}
                                </div>

                                <div className="pt-6 border-t mt-4">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase text-center mb-4">Did this answer your question?</p>
                                    <div className="flex justify-center gap-6">
                                        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600 transition-colors">
                                            <div className="p-3 border rounded-full group-hover:border-indigo-600"><ThumbsUp size={18} /></div>
                                            <span className="text-[10px]">Yes</span>
                                        </button>
                                        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                                            <div className="p-3 border rounded-full"><ThumbsDown size={18} /></div>
                                            <span className="text-[10px]">No</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t text-center">
                        <p className="text-[10px] text-gray-400">Powered by Maxpine CRM v2.0</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportBot;
