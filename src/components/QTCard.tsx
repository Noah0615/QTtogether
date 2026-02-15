import { Lock } from 'lucide-react';
import { QTLog } from '@/lib/supabase';

interface QTCardProps {
    log: QTLog;
    onClick: () => void;
}

export default function QTCard({ log, onClick }: QTCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white/70 backdrop-blur-md border border-white/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1 active:scale-[0.99] duration-200"
        >
            <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-gray-800 group-hover:text-amber-700 transition-colors">{log.nickname}</span>
                <span className="text-xs text-gray-400 font-medium">
                    {new Date(log.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '')}
                </span>
            </div>

            <div className="text-gray-600 line-clamp-3 min-h-[3rem] text-sm leading-relaxed">
                {!log.is_public ? (
                    <div className="flex items-center justify-center h-12 text-gray-400 bg-gray-50 rounded-lg border border-gray-100">
                        <Lock size={14} className="mr-2" />
                        <span className="text-xs">비공개 묵상입니다</span>
                    </div>
                ) : (
                    log.content
                )}
            </div>

            {log.bible_verse && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 truncate flex items-center">
                    <div className="w-1 h-1 rounded-full bg-amber-400 mr-2" />
                    {log.bible_verse}
                </div>
            )}
        </div>
    );
}
