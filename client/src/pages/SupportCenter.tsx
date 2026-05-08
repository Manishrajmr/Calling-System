import { useState, useEffect, useRef } from 'react';
import { Save, Trash2, FileText, Upload, CheckCircle, Database, Brain, Send, User, Bot, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const SupportCenter = () => {
    const [activeTab, setActiveTab] = useState<'browse' | 'manage'>('browse');
    const [topics, setTopics] = useState<any[]>([]);

    // Chat State for Browse Tab
    const [messages, setMessages] = useState<any[]>([
        { id: 1, role: 'bot', type: 'text', content: 'Welcome to Maxpine Support! I see that you are exploring our CRM.' },
        { id: 2, role: 'bot', type: 'options', content: 'How may I help you?', optionsType: 'topics' }
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
        // Add User Message
        const userMsg = { id: Date.now(), role: 'user', type: 'text', content: type === 'topic' ? item.name : item.question };
        setMessages(prev => [...prev, userMsg]);

        if (type === 'topic') {
            // Fetch queries for this topic
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
            // Show answer for the query
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

        // Mock bot response for free text
        setTimeout(() => {
            const botMsg = { id: Date.now() + 1, role: 'bot', type: 'text', content: "I'm currently a rule-based assistant. Please select one of the topics below for specific help:" };
            const optionsMsg = { id: Date.now() + 2, role: 'bot', type: 'options', content: 'Available Topics:', optionsType: 'topics' };
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
            alert(`Succesfully imported ${response.data.count} FAQs from ${file.name}`);
            fetchTopics();
            setActiveTab('browse');
        } catch (err: any) {
            alert("Import failed: " + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
            e.target.value = ''; // Reset input
        }
    };

    // Manage logic (same as before)
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
            const response = await axios.post(`${API_BASE}/bulk`, { topicName: mgmtTopicName, items: mgmtItems });
            console.log("Creation success:", response.data);
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
            console.error("Creation failed:", errMsg);
            alert("Failed to save FAQs: " + errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col font-sans">

            {/* Header - Flipkart Style */}
            <div className="bg-white border-b px-8 py-3 flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#2874f0] rounded-full flex items-center justify-center text-white shadow-md">
                        <ShoppingBag size={22} fill="white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[#212121]">Maxpine Support</h1>
                        <p className="text-[10px] text-gray-500 font-medium">Customer Assistance</p>
                    </div>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'browse' ? 'bg-[#2874f0] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Support Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('manage')}
                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'manage' ? 'bg-[#2874f0] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        FAQ Management
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 md:p-8 overflow-hidden h-[calc(100vh-64px)]">

                {activeTab === 'browse' ? (
                    <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden border border-gray-200 relative mb-4">

                        {/* Chat Messages flow */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f5f7f9] custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-[#2874f0] border shadow-sm'}`}>
                                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                        </div>
                                        <div className="space-y-2">
                                            {msg.type === 'text' ? (
                                                <div className={`p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#2874f0] text-white rounded-tr-none' : 'bg-white text-[#212121] rounded-tl-none border border-gray-100'}`}>
                                                    {msg.content}
                                                    <p className="text-[9px] mt-2 opacity-50 text-right">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            ) : (
                                                <div className="bg-white border rounded-xl overflow-hidden shadow-sm max-w-xs animate-in slide-in-from-bottom-2 duration-300">
                                                    <div className="p-4 border-b bg-gray-50/50">
                                                        <p className="text-xs font-bold text-gray-700">{msg.content}</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        {msg.optionsType === 'topics' ? (
                                                            topics.map(t => (
                                                                <button
                                                                    key={t.id}
                                                                    onClick={() => handleOptionClick('topic', t)}
                                                                    className="px-4 py-3 text-left text-sm text-[#2874f0] font-medium border-b hover:bg-indigo-50 transition-colors last:border-0"
                                                                >
                                                                    {t.name}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            msg.data && msg.data.length > 0 ? (
                                                                msg.data.map((q: any) => (
                                                                    <button
                                                                        key={q.id}
                                                                        onClick={() => handleOptionClick('query', q)}
                                                                        className="px-4 py-3 text-left text-sm text-[#2874f0] font-medium border-b hover:bg-indigo-50 transition-colors last:border-0"
                                                                    >
                                                                        {q.question}
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <div className="px-4 py-3 text-xs text-gray-500 italic">No FAQs available for this topic yet.</div>
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
                        <div className="p-4 bg-white border-t flex gap-3 items-center">
                            <form onSubmit={handleSendMessage} className="flex-1 flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Write a Message..."
                                    className="flex-1 px-5 py-3 bg-gray-100 rounded-full focus:outline-none text-sm transition-all focus:ring-2 focus:ring-indigo-100 outline-none"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                <button type="submit" className="w-12 h-12 bg-[#2874f0] text-white rounded-full flex items-center justify-center hover:bg-[#1a5cbd] transition-all shadow-md active:scale-90">
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                        {/* Manage UI stays similar but styled to match */}
                        <div className="flex-1 bg-white rounded-lg shadow-sm border p-8 overflow-y-auto custom-scrollbar">
                            {success ? (
                                <div className="h-full py-20 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Knowledge Updated</h3>
                                    <p className="text-gray-500 font-medium mt-2">New FAQs are live in the chat browser.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
                                            <Database size={20} />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">FAQ & Topic Creator</h2>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">New or Existing Topic</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                list="existing-topics"
                                                placeholder="e.g. Leads, Deals, or Call Management"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-[#2874f0] outline-none text-gray-900 font-medium transition-all"
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
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Faq Content</label>
                                            <button onClick={addItem} className="text-[#2874f0] text-xs font-bold hover:bg-indigo-50 px-3 py-1 rounded-full transition-all">
                                                + Add More
                                            </button>
                                        </div>
                                        {mgmtItems.map((item, idx) => (
                                            <div key={idx} className="p-5 bg-gray-50 rounded-2xl space-y-3 relative border border-gray-100">
                                                {mgmtItems.length > 1 && (
                                                    <button onClick={() => removeItem(idx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                                <input
                                                    type="text"
                                                    placeholder="Question"
                                                    className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2874f0] outline-none shadow-sm"
                                                    value={item.question}
                                                    onChange={e => updateItem(idx, 'question', e.target.value)}
                                                />
                                                <textarea
                                                    placeholder="Detailed Solution..."
                                                    className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#2874f0] outline-none h-24 resize-none shadow-sm"
                                                    value={item.answer}
                                                    onChange={e => updateItem(idx, 'answer', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleBulkSubmit}
                                        disabled={isSubmitting}
                                        className="w-full bg-[#2874f0] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-[#1a5cbd] transition-all"
                                    >
                                        {isSubmitting ? 'Syncing...' : 'Save to Library'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar with Import */}
                        <div className="w-full lg:w-80 space-y-6 overflow-y-auto">
                            <div className="bg-[#212121] rounded-lg p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
                                    <Upload size={18} className="text-[#2874f0]" /> Smart Import
                                </h3>
                                <p className="text-gray-400 text-[11px] leading-relaxed mb-6">
                                    Upload a PDF or CSV file. We will extract relevant questions and answers automatically.
                                </p>
                                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".pdf,.csv"
                                        onChange={handleFileUpload}
                                    />
                                    <FileText className="mx-auto mb-3 text-gray-500 group-hover:text-[#2874f0] transition-colors" size={28} />
                                    <p className="font-bold text-xs">Drop manual here</p>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase">PDF, CSV</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-gray-800">
                                    <Brain size={18} className="text-[#2874f0]" /> Best Practices
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-[11px] text-gray-500">
                                        <span className="text-[#2874f0] font-bold">✓</span>
                                        Keep questions short and specific.
                                    </li>
                                    <li className="flex gap-3 text-[11px] text-gray-500">
                                        <span className="text-[#2874f0] font-bold">✓</span>
                                        Use bullet points for complex answers.
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
