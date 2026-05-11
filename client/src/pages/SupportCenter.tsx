import { useState, useEffect, useRef } from 'react';
import { Save, Trash2, FileText, Upload, CheckCircle, Database, Brain, Send, User, Bot, Sparkles, ArrowLeft, MessageSquare, Settings } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SupportCenter = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'browse' | 'manage'>('browse');
    const [topics, setTopics] = useState<any[]>([]);

    // Chat State for Browse Tab
    const [messages, setMessages] = useState<any[]>([
        { id: 1, role: 'bot', type: 'text', content: '👋 Welcome to Maxpine Support! I\'m your AI assistant.' },
        { id: 2, role: 'bot', type: 'options', content: 'What can I help you with today?', optionsType: 'topics' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Manage State
    const [mgmtTopicName, setMgmtTopicName] = useState('');
    const [mgmtItems, setMgmtItems] = useState([{ question: '', answer: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const API_BASE = "http://localhost:5000/api/support";

    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchTopics = () => {
        axios.get(`${API_BASE}/topics`)
            .then(res => setTopics(res.data || []))
            .catch(err => console.error(err));
    };

    const handleOptionClick = async (type: 'topic' | 'query', item: any) => {
        const userMsg = { id: Date.now(), role: 'user', type: 'text', content: type === 'topic' ? item.name : item.question };
        setMessages(prev => [...prev, userMsg]);

        if (type === 'topic') {
            try {
                const res = await axios.get(`${API_BASE}/topics/${item.id}/queries`);
                const botMsg = {
                    id: Date.now() + 1,
                    role: 'bot',
                    type: 'options',
                    content: `Here are some questions regarding ${item.name}:`,
                    optionsType: 'queries',
                    data: res.data
                };
                setMessages(prev => [...prev, botMsg]);
            } catch (err) {
                console.error(err);
            }
        } else {
            const botMsg = {
                id: Date.now() + 1,
                role: 'bot',
                type: 'text',
                content: item.answer
            };
            const followUp = {
                id: Date.now() + 2,
                role: 'bot',
                type: 'options',
                content: 'Need help with anything else?',
                optionsType: 'topics'
            };
            setMessages(prev => [...prev, botMsg, followUp]);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', type: 'text', content: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        setTimeout(() => {
            const botMsg = { id: Date.now() + 1, role: 'bot', type: 'text', content: "I'm currently a rule-based AI. Please select one of the core topics below:" };
            const optionsMsg = { id: Date.now() + 2, role: 'bot', type: 'options', content: 'What can I help you with today?', optionsType: 'topics' };
            setMessages(prev => [...prev, botMsg, optionsMsg]);
        }, 1000);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsSubmitting(true);
        try {
            const response = await axios.post(`${API_BASE}/import-manual`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(`Successfully imported FAQs from ${file.name}`);
            fetchTopics();
            setActiveTab('browse');
        } catch (err: any) {
            alert("Import failed: " + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
            e.target.value = '';
        }
    };

    const addItem = () => setMgmtItems([...mgmtItems, { question: '', answer: '' }]);
    const removeItem = (index: number) => setMgmtItems(mgmtItems.filter((_, i) => i !== index));
    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...mgmtItems];
        (newItems as any)[index][field] = value;
        setMgmtItems(newItems);
    };

    const handleBulkSubmit = async () => {
        if (!mgmtTopicName || mgmtItems.some(i => !i.question || !i.answer)) {
            alert("Please fill in all fields");
            return;
        }
        setIsSubmitting(true);
        try {
            await axios.post(`${API_BASE}/bulk`, { topicName: mgmtTopicName, items: mgmtItems });
            setSuccess(true);
            fetchTopics();
            setTimeout(() => {
                setSuccess(false);
                setMgmtTopicName('');
                setMgmtItems([{ question: '', answer: '' }]);
                setActiveTab('browse');
            }, 2000);
        } catch (err: any) {
            const errMsg = err.response?.data?.error || err.message;
            alert("Failed to save FAQs: " + errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col font-sans text-gray-200 relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Header */}
            <div className="px-8 py-5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors mr-2">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Maxpine Support</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] text-emerald-400 font-medium">AI Assistant Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex bg-[#1E1E1E] p-1.5 rounded-full border border-white/5">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'browse' ? 'bg-[#00D67D] text-black shadow-[0_0_15px_rgba(0,214,125,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <MessageSquare size={16} /> Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('manage')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'manage' ? 'bg-[#00D67D] text-black shadow-[0_0_15px_rgba(0,214,125,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Settings size={16} /> Manage
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 md:p-8 relative z-10 h-[calc(100vh-80px)]">

                {activeTab === 'browse' ? (
                    <div className="bg-[#1A1A1A] rounded-2xl flex-1 flex flex-col overflow-hidden border border-white/5 shadow-2xl relative">

                        {/* Header of Chat Area */}
                        <div className="p-4 border-b border-white/5 bg-[#1A1A1A] flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Support Assistant</h3>
                                <p className="text-[10px] text-emerald-500">Powered by AI • Instant Responses</p>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#00D67D] text-black' : 'bg-[#151515] border border-white/5 text-emerald-500 shadow-md'}`}>
                                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                        </div>
                                        <div className="space-y-3">
                                            {msg.type === 'text' ? (
                                                <div className={`p-4 rounded-xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#00D67D] text-black rounded-tr-sm' : 'bg-[#252525] border border-white/5 text-gray-200 rounded-tl-sm'}`}>
                                                    {msg.content}
                                                    <p className={`text-[9px] mt-2 text-right ${msg.role === 'user' ? 'text-black/60' : 'text-gray-500'}`}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            ) : (
                                                <div className="bg-[#252525] border border-white/5 rounded-xl overflow-hidden shadow-lg max-w-sm animate-in zoom-in-95 duration-300">
                                                    <div className="p-4 border-b border-white/5">
                                                        <p className="text-sm font-bold text-white">{msg.content}</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        {msg.optionsType === 'topics' ? (
                                                            topics.map(t => (
                                                                <button
                                                                    key={t.id}
                                                                    onClick={() => handleOptionClick('topic', t)}
                                                                    className="px-4 py-3.5 text-left text-sm text-[#00D67D] font-medium border-b border-white/5 hover:bg-white/5 transition-colors last:border-0 flex justify-between items-center group"
                                                                >
                                                                    {t.name}
                                                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                                                                </button>
                                                            ))
                                                        ) : (
                                                            msg.data && msg.data.length > 0 ? (
                                                                msg.data.map((q: any) => (
                                                                    <button
                                                                        key={q.id}
                                                                        onClick={() => handleOptionClick('query', q)}
                                                                        className="px-4 py-3.5 text-left text-sm text-[#00D67D] font-medium border-b border-white/5 hover:bg-white/5 transition-colors last:border-0 flex justify-between items-center group"
                                                                    >
                                                                        {q.question}
                                                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <div className="px-4 py-4 text-xs text-gray-500 italic text-center">No FAQs available yet.</div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#1A1A1A] border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="flex gap-3 items-center w-full relative">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 px-6 py-4 bg-[#252525] border border-white/5 rounded-2xl focus:outline-none text-sm text-white transition-all focus:border-[#00D67D] outline-none placeholder:text-gray-500"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                <button type="submit" disabled={!inputValue.trim()} className="absolute right-2 w-12 h-12 bg-[#00D67D] text-black rounded-xl flex items-center justify-center hover:bg-[#00E586] transition-all disabled:opacity-50 disabled:cursor-not-allowed group">
                                    <Send size={18} className="translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden animate-in fade-in duration-500">
                        {/* Manage Form */}
                        <div className="flex-1 bg-[#1A1A1A] rounded-2xl shadow-xl border border-white/5 p-8 overflow-y-auto custom-scrollbar">
                            {success ? (
                                <div className="h-full py-20 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-[#00D67D]/10 text-[#00D67D] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,214,125,0.2)]">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Knowledge Base Updated</h3>
                                    <p className="text-gray-400 mt-2 text-sm">Your AI is now updated with the latest FAQs.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                                            <Database size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white tracking-wide">FAQ & Topic Creator</h2>
                                            <p className="text-xs text-gray-500">Add questions and answers to your knowledge base</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Topic Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                list="existing-topics"
                                                placeholder="e.g. Leads, Deals, Call Management"
                                                className="w-full bg-[#252525] border border-white/5 rounded-xl px-5 py-4 focus:bg-[#303030] focus:border-[#00D67D] focus:ring-1 focus:ring-[#00D67D] outline-none text-white text-sm transition-all placeholder:text-gray-600"
                                                value={mgmtTopicName}
                                                onChange={e => setMgmtTopicName(e.target.value)}
                                            />
                                            <datalist id="existing-topics">
                                                {topics.map(t => (
                                                    <option key={t.id} value={t.name} />
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Q&A Pairs</label>
                                            <button onClick={addItem} className="text-[#00D67D] text-xs font-bold hover:text-emerald-400 transition-colors flex items-center gap-1">
                                                + Add More
                                            </button>
                                        </div>
                                        {mgmtItems.map((item, idx) => (
                                            <div key={idx} className="p-6 bg-[#252525] rounded-2xl space-y-4 relative border border-white/5 group hover:border-white/10 transition-all">
                                                {mgmtItems.length > 1 && (
                                                    <button onClick={() => removeItem(idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                                <input
                                                    type="text"
                                                    placeholder="Question"
                                                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-5 py-3.5 text-sm focus:border-[#00D67D] outline-none text-white transition-all placeholder:text-gray-600"
                                                    value={item.question}
                                                    onChange={e => updateItem(idx, 'question', e.target.value)}
                                                />
                                                <textarea
                                                    placeholder="Detailed answer..."
                                                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-5 py-3.5 text-sm focus:border-[#00D67D] outline-none h-28 resize-none text-white transition-all placeholder:text-gray-600 custom-scrollbar"
                                                    value={item.answer}
                                                    onChange={e => updateItem(idx, 'answer', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleBulkSubmit}
                                        disabled={isSubmitting}
                                        className="w-full bg-[#00D67D] text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,214,125,0.2)] hover:bg-[#00E586] hover:shadow-[0_0_30px_rgba(0,214,125,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save to Knowledge Base'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebars */}
                        <div className="w-full lg:w-[350px] space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                                <h3 className="font-bold mb-3 flex items-center gap-2 text-sm text-white">
                                    <Upload size={16} className="text-[#00D67D]" /> Smart Import
                                </h3>
                                <p className="text-gray-400 text-[11px] leading-relaxed mb-6">
                                    Upload a PDF or CSV file. We'll extract relevant Q&A pairs automatically.
                                </p>
                                <div className="border border-dashed border-white/20 rounded-2xl p-8 text-center bg-[#252525] hover:border-[#00D67D] hover:bg-[#2A2A2A] transition-all cursor-pointer relative group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".pdf,.csv"
                                        onChange={handleFileUpload}
                                    />
                                    <FileText className="mx-auto mb-3 text-gray-500 group-hover:text-[#00D67D] transition-colors" size={24} />
                                    <p className="font-bold text-xs text-white">Drop your file here</p>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase">PDF, CSV</p>
                                </div>
                            </div>

                            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
                                <h3 className="font-bold mb-5 flex items-center gap-2 text-sm text-white">
                                    <Database size={16} className="text-[#00D67D]" /> Best Practices
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-3 text-[11px] text-gray-400 items-start">
                                        <span className="text-[#00D67D]">✓</span>
                                        Keep questions short and specific.
                                    </li>
                                    <li className="flex gap-3 text-[11px] text-gray-400 items-start">
                                        <span className="text-[#00D67D]">✓</span>
                                        Use bullet points for complex answers.
                                    </li>
                                    <li className="flex gap-3 text-[11px] text-gray-400 items-start">
                                        <span className="text-[#00D67D]">✓</span>
                                        Group related FAQs under one topic.
                                    </li>
                                    <li className="flex gap-3 text-[11px] text-gray-400 items-start">
                                        <span className="text-[#00D67D]">✓</span>
                                        Review imported content for accuracy.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportCenter;
