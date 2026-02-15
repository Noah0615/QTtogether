'use client';
import { X, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { QTLog } from '@/lib/supabase';

interface QTDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    log: QTLog | null;
    content: string; // Decrypted or public content
    onDeleteRequest: () => void;
    onEditRequest: () => void;
}

export default function QTDetailModal({ isOpen, onClose, log, content, onDeleteRequest, onEditRequest }: QTDetailModalProps) {
    if (!isOpen || !log) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b bg-gray-50/50 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md mr-2 uppercase tracking-wide">Writer</span>
                            {log.nickname}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 ml-1">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {log.media_url && (
                        <div className="mb-6 rounded-xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100">
                            {log.media_url.includes('youtube') || log.media_url.includes('youtu.be') ? (
                                <a
                                    href={log.media_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block relative group"
                                >
                                    <img
                                        src={`https://img.youtube.com/vi/${log.media_url.split('v=')[1]?.split('&')[0] || log.media_url.split('/').pop()}/0.jpg`}
                                        alt="YouTube Thumbnail"
                                        className="w-full aspect-video object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center backdrop-blur-md">
                                        YouTube에서 보기 <ExternalLink size={12} className="ml-1.5" />
                                    </div>
                                </a>
                            ) : (
                                <img src={log.media_url} alt="Attached" className="w-full h-auto object-contain" />
                            )}
                        </div>
                    )}
                    <div className="prose prose-amber max-w-none whitespace-pre-wrap text-gray-700 leading-loose text-lg font-light break-words">
                        {content}
                    </div>

                    {log.bible_verse && (
                        <div className="mt-10 pt-6 border-t border-gray-100 flex items-start text-sm text-gray-500 italic">
                            <div className="w-1 h-4 bg-amber-400 rounded-full mr-3 shrink-0 mt-1" />
                            "{log.bible_verse}"
                        </div>
                    )}
                </div>

                <div className="p-5 border-t bg-gray-50 rounded-b-2xl flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={onDeleteRequest}
                            className="flex items-center px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors text-sm font-bold"
                        >
                            <Trash2 size={16} className="mr-2" />
                            삭제
                        </button>
                        <button
                            onClick={onEditRequest}
                            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors text-sm font-bold"
                        >
                            <Edit2 size={16} className="mr-2" />
                            수정
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm transition-all"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
