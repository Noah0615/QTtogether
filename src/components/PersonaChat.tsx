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
            <div className="mt-8 bg-white border border-indigo-100 rounded-2xl shadow-lg overflow-hidden flex flex-col h-[500px]">
                {/* Header */}
                <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center mr-3 text-xl shadow-inner">
                            {analysis.character === 'David' ? '👑' :
                                analysis.character === 'Paul' ? '📜' :
                                    analysis.character === 'Peter' ? '⚓' :
                                        analysis.character === 'John' ? '❤️' :
                                            analysis.character === 'Moses' ? '⛰️' :
                                                analysis.character === 'Esther' ? '👸' : '🕊️'}
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900">{analysis.character}와의 대화</h3>
                            <p className="text-xs text-indigo-600 truncate max-w-[200px]">{analysis.reason}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setChatOpen(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-indigo-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {chatLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex space-x-1 items-center">
                                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-0"></div>
                                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-150"></div>
                                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-300"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
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
        <div className="mt-8 pt-8 border-t border-dashed border-gray-200">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 text-center relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={100} className="text-indigo-500" />
                </div>

                <div className="relative z-10">
                    <h3 className="text-lg font-bold text-indigo-900 mb-2 font-serif">나의 묵상 페르소나 찾기</h3>
                    <p className="text-sm text-indigo-700/80 mb-6 leading-relaxed">
                        내가 쓴 묵상 글을 분석해서,<br />
                        나와 가장 닮은 성경 인물을 찾아 대화해보세요.
                    </p>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-sm border border-indigo-100 hover:bg-indigo-50 hover:shadow hover:-translate-y-0.5 transition-all text-sm group-hover:border-indigo-200 w-full md:w-auto"
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
