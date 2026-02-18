'use client';
import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PrayerWriteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PrayerWriteModal({ isOpen, onClose, onSuccess }: PrayerWriteModalProps) {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch('/api/prayer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname, password, content }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to submit');
            }

            setNickname('');
            setPassword('');
            setContent('');
            onSuccess();
            onClose();
            router.refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border-2 border-indigo-100">
                <div className="flex items-center justify-between p-5 border-b bg-indigo-50/50 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-indigo-900">기도제목 나누기</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                        <X size={20} className="text-indigo-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">닉네임</label>
                            <input
                                type="text"
                                required
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                                placeholder="Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호 (4자리)</label>
                            <input
                                type="password"
                                required
                                maxLength={4}
                                value={password}
                                onChange={(e) => setPassword(e.target.value.replace(/[^0-9]/g, ''))}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all tracking-widest text-gray-900 placeholder-gray-400"
                                placeholder="••••"
                                inputMode="numeric"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">기도 내용</label>
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-40 resize-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all leading-relaxed placeholder-gray-400 text-gray-900"
                            placeholder="함께 기도하고 싶은 내용을 적어주세요..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '등록 중...' : (
                                <>
                                    <Send size={18} className="mr-2" />
                                    기도 부탁하기
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
