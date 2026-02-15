'use client';
import { X, Trash2, Edit2 } from 'lucide-react';
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

                <div className="p-8 overflow-y-auto flex-1 bg-white">
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
