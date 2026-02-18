'use client';
import { useState, useEffect } from 'react';
import { X, Check, Image as ImageIcon, Link as LinkIcon, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { QTLog, supabase } from '@/lib/supabase';

interface WriteModalProps {
    isOpen: boolean;
    onClose: () => void;
    verse: string;
    onSuccess: () => void;
    initialData?: QTLog;
    initialContent?: string;
}

export default function WriteModal({ isOpen, onClose, verse, onSuccess, initialData, initialContent }: WriteModalProps) {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [userVerse, setUserVerse] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    // Media State
    const [mediaType, setMediaType] = useState<'none' | 'image' | 'youtube'>('none');
    const [mediaUrl, setMediaUrl] = useState(''); // Stores final URL (or YouTube input)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setNickname(initialData.nickname);
                setUserVerse(initialData.bible_verse || '');
                setContent(initialContent || initialData.content);
                setIsPublic(initialData.is_public);

                if (initialData.media_url) {
                    setMediaUrl(initialData.media_url);
                    if (initialData.media_url.includes('youtube') || initialData.media_url.includes('youtu.be')) {
                        setMediaType('youtube');
                    } else {
                        setMediaType('image');
                        setPreviewUrl(initialData.media_url);
                    }
                } else {
                    setMediaType('none');
                    setMediaUrl('');
                    setPreviewUrl(null);
                }
            } else {
                setNickname('');
                setPassword('');
                setUserVerse('');
                setContent('');
                setIsPublic(true);
                setMediaType('none');
                setMediaUrl('');
                setPreviewUrl(null);
                setSelectedFile(null);
            }
        }
    }, [isOpen, initialData, initialContent]);

    // Handle File Selection (for Image)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setMediaUrl(''); // Clear URL if file selected
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    // Helper: Upload File to Supabase Storage
    const uploadFile = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('qt_uploads')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('qt_uploads')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            let finalMediaUrl = mediaUrl;

            // Upload Image if file selected
            if (mediaType === 'image' && selectedFile) {
                finalMediaUrl = await uploadFile(selectedFile);
            } else if (mediaType === 'none') {
                finalMediaUrl = '';
            }

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
                    bible_verse: userVerse || verse,
                    media_url: finalMediaUrl,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save');
            }

            // Cleanup
            if (previewUrl && !initialData?.media_url) URL.revokeObjectURL(previewUrl);

            setNickname('');
            setPassword('');
            setUserVerse('');
            setContent('');
            setIsPublic(true);
            setMediaType('none');
            setMediaUrl('');
            setPreviewUrl(null);
            setSelectedFile(null);

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
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border dark:border-gray-800">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{initialData ? '묵상 수정하기' : '묵상 기록하기'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                    {/* Inspiration Verse Display */}
                    <div className="mb-6 text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 flex items-start">
                        <div className="w-1 h-10 bg-amber-400 dark:bg-amber-500 rounded-full mr-3 shrink-0"></div>
                        <div>
                            <span className="block font-bold text-amber-800 dark:text-amber-500 mb-1 text-xs uppercase tracking-wider">오늘의 묵상 주제</span>
                            {verse.split(' - ')[0]}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">오늘 묵상한 말씀</label>
                            <input
                                type="text"
                                value={userVerse}
                                onChange={(e) => setUserVerse(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-400 dark:text-gray-100"
                                placeholder="예) 요한복음 3장 16절"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">닉네임</label>
                            <input
                                type="text"
                                required
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all dark:text-gray-100"
                                placeholder="Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">비밀번호</label>
                            <input
                                type="password"
                                required
                                minLength={4}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all tracking-widest dark:text-gray-100 placeholder-gray-400"
                                placeholder="4자 이상"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">나눔 내용</label>
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl h-32 resize-none focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all leading-relaxed dark:text-gray-100"
                            placeholder="오늘 받은 은혜를 나누어 주세요..."
                        />
                    </div>

                    {/* Media Attachment */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">미디어 첨부 (선택)</label>
                        <div className="flex gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => { setMediaType('none'); setMediaUrl(''); setPreviewUrl(null); setSelectedFile(null); }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mediaType === 'none' ? 'bg-gray-800 text-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                없음
                            </button>
                            <button
                                type="button"
                                onClick={() => setMediaType('image')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center ${mediaType === 'image' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                <ImageIcon size={14} className="mr-1.5" /> 이미지
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMediaType('youtube'); setPreviewUrl(null); setSelectedFile(null); }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center ${mediaType === 'youtube' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                <LinkIcon size={14} className="mr-1.5" /> 유튜브
                            </button>
                        </div>

                        {mediaType === 'image' && (
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-amber-300 dark:hover:border-amber-600 transition-colors bg-gray-50 dark:bg-gray-800">
                                {previewUrl ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black/5">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer block py-4">
                                        <Upload className="mx-auto text-gray-400 dark:text-gray-500 mb-2" size={24} />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">클릭하여 이미지 업로드</span>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                )}
                            </div>
                        )}

                        {mediaType === 'youtube' && (
                            <input
                                type="text"
                                value={mediaUrl}
                                onChange={(e) => setMediaUrl(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400 dark:text-gray-100"
                                placeholder="YouTube 영상 링크를 입력하세요 (예: https://youtu.be/...)"
                            />
                        )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="text-sm">
                            <span className="block font-bold text-gray-700 dark:text-gray-300">공개 설정</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">{isPublic ? '모든 사람이 볼 수 있습니다' : '비밀번호를 입력해야 볼 수 있습니다'}</span>
                        </div>
                        <label className="flex items-center cursor-pointer select-none group relative">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`block w-12 h-7 rounded-full transition-colors duration-300 ease-in-out ${isPublic ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ease-in-out ${isPublic ? 'transform translate-x-5' : ''}`}></div>
                        </label>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl flex justify-end gap-3 backdrop-blur-sm">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-bold rounded-xl transition-all"
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
