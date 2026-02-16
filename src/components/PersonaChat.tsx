'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, MessageCircle, X } from 'lucide-react';

interface PersonaAnalysis {
    character: string;
    reason: string;
    opening_message: string;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface PersonaChatProps {
    content: string; // The user's QT content to analyze
}

export default function PersonaChat({ content }: PersonaChatProps) {
    const [analysis, setAnalysis] = useState<PersonaAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, chatOpen]);

    const getCharacterFileName = (name: string) => {
        if (!name) return 'David'; // Default fallback
        const cleanName = name.trim();
        // Capitalize first letter, lowercase the rest
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
    };

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/analyze-persona', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to analyze');
            }

            const data = await res.json();
            setAnalysis(data);
            setMessages([{ role: 'assistant', content: data.opening_message }]);
            setChatOpen(true);
        } catch (error: any) {
            console.error(error);
            alert(error.message || '분석에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || chatLoading || !analysis) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setChatLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    character: analysis.character,
                    message: userMessage,
                    history: messages.map(m => ({ role: m.role, content: m.content })),
                    userContext: content // Pass the QT content for context
                }),
            });

            if (!res.ok) throw new Error('Failed to send message');

            const data = await res.json();
            setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: 'assistant', content: "죄송합니다. 잠시 연결이 원활하지 않네요. 다시 말씀해 주시겠어요?" }]);
        } finally {
            setChatLoading(false);
        }
    };

    if (chatOpen && analysis) {
        return (
            <div className="mt-8 bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 rounded-2xl shadow-lg overflow-hidden flex flex-col h-[500px]">
                {/* Header */}
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 border-b border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 mr-3 shadow-md relative bg-white dark:bg-gray-800">
                            <img
                                src={`/personas/${getCharacterFileName(analysis.character)}.png`}
                                alt={analysis.character}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                    if (e.currentTarget.parentElement) {
                                        e.currentTarget.parentElement.innerHTML = '🕊️';
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900 dark:text-indigo-200">{analysis.character}와의 대화</h3>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">{analysis.reason}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setChatOpen(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-950/50 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-200 dark:border-indigo-700 mr-2 shadow-sm shrink-0 bg-white dark:bg-gray-800 hidden sm:block">
                                    <img
                                        src={`/personas/${getCharacterFileName(analysis.character)}.png`}
                                        alt={analysis.character}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {chatLoading && (
                        <div className="flex justify-start items-end">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-200 dark:border-indigo-700 mr-2 shadow-sm shrink-0 bg-white dark:bg-gray-800 hidden sm:block">
                                <img
                                    src={`/personas/${getCharacterFileName(analysis.character)}.png`}
                                    alt={analysis.character}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex space-x-1 items-center">
                                <div className="w-2 h-2 bg-indigo-300 dark:bg-indigo-500 rounded-full animate-bounce delay-0"></div>
                                <div className="w-2 h-2 bg-indigo-300 dark:bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                                <div className="w-2 h-2 bg-indigo-300 dark:bg-indigo-500 rounded-full animate-bounce delay-300"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm"
                        disabled={chatLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || chatLoading}
                        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="mt-8 pt-8 border-t border-dashed border-gray-200 dark:border-gray-800">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800 text-center relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={100} className="text-indigo-500" />
                </div>

                <div className="relative z-10">
                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-2 font-serif">나의 묵상 페르소나 찾기</h3>
                    <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 mb-6 leading-relaxed">
                        내가 쓴 묵상 글을 분석해서,<br />
                        나와 가장 닮은 성경 인물을 찾아 대화해보세요.
                    </p>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 font-bold rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:shadow hover:-translate-y-0.5 transition-all text-sm group-hover:border-indigo-200 w-full md:w-auto"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent mr-2"></div>
                                분석 중...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} className="mr-2 text-indigo-500 group-hover:rotate-12 transition-transform" />
                                성경 인물 매칭하기
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
