'use client';
import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { QTLog } from '@/lib/supabase';

interface WriteModalProps {
    isOpen: boolean;
    onClose: () => void;
    verse: string; // "Reference - Verse text"
    onSuccess: () => void;
    initialData?: QTLog; // If editing
    initialContent?: string; // Decrypted content if private
}

export default function WriteModal({ isOpen, onClose, verse, onSuccess, initialData, initialContent }: WriteModalProps) {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [userVerse, setUserVerse] = useState(''); // User's custom verse input
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setNickname(initialData.nickname);
                setUserVerse(initialData.bible_verse || '');
                setContent(initialContent || initialData.content);
                setIsPublic(initialData.is_public);
                // Password intentionally left blank for verification
            } else {
                setNickname('');
                setPassword('');
                setUserVerse(''); // Empty for new entry
                setContent('');
                setIsPublic(true);
            }
        }
    }, [isOpen, initialData, initialContent]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const url = initialData ? `/api/qt/${initialData.id}` : '/api/qt';
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nickname,
                    password,
                    content,
                    is_public: isPublic,
                    bible_verse: userVerse || verse, // Fallback to daily verse only if empty? Or just userVerse? Let's use userVerse. User asked for input. If empty, maybe save empty? Or save Today's Word? Let's save userVerse.
                    // Actually, if user leaves it empty, maybe fallback to Today's word?
                    // User said "allow input". I'll default to empty.
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save');
            }

            setNickname('');
            setPassword('');
            setUserVerse('');
            setContent('');
            setIsPublic(true);
            onSuccess();
            onClose();
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Failed to save. Please check your password.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-xl font-bold text-gray-800">{initialData ? '묵상 수정하기' : '묵상 기록하기'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                    {/* Inspiration Verse Display - Optional helpers */}
                    <div className="mb-6 text-sm text-gray-600 bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start">
                        <div className="w-1 h-10 bg-amber-400 rounded-full mr-3 shrink-0"></div>
                        <div>
                            <span className="block font-bold text-amber-800 mb-1 text-xs uppercase tracking-wider">오늘의 묵상 주제</span>
                            {verse.split(' - ')[0]} {/* Show Reference part if possible, or full string */}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">오늘 묵상한 말씀</label>
                            <input
                                type="text"
                                value={userVerse}
                                onChange={(e) => setUserVerse(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-400"
                                placeholder="예) 요한복음 3장 16절"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">닉네임</label>
                            <input
                                type="text"
                                required
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
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
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all tracking-widest"
                                placeholder="••••"
                                inputMode="numeric"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">나눔 내용</label>
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-48 resize-none focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all leading-relaxed"
                            placeholder="오늘 받은 은혜를 나누어 주세요..."
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-sm">
                            <span className="block font-bold text-gray-700">공개 설정</span>
                            <span className="text-gray-500 text-xs">{isPublic ? '모든 사람이 볼 수 있습니다' : '비밀번호를 입력해야 볼 수 있습니다'}</span>
                        </div>
                        <label className="flex items-center cursor-pointer select-none group relative">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`block w-12 h-7 rounded-full transition-colors duration-300 ease-in-out ${isPublic ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ease-in-out ${isPublic ? 'transform translate-x-5' : ''}`}></div>
                        </label>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-5 border-t bg-gray-50/50 rounded-b-2xl flex justify-end gap-3 backdrop-blur-sm">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 font-bold rounded-xl transition-all"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center transform active:scale-[0.98]"
                    >
                        {loading ? '저장 중...' : (
                            <>
                                <Check size={18} className="mr-2" />
                                {initialData ? '수정하기' : '기록하기'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
