'use client';
import { useState, useEffect, useCallback } from 'react';
import { QTLog } from '@/lib/supabase';
import QTCard from './QTCard';
import PasswordModal from './PasswordModal';
import QTDetailModal from './QTDetailModal';
import { RotateCw, Loader2 } from 'lucide-react';

interface QTListProps {
    onEditLog?: (log: QTLog, content: string) => void;
}

export default function QTList({ onEditLog }: QTListProps) {
    const [logs, setLogs] = useState<QTLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<QTLog | null>(null);

    // Modal states
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordAction, setPasswordAction] = useState<'view' | 'delete' | null>(null);
    const [verifying, setVerifying] = useState(false);

    // Detail View State
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailContent, setDetailContent] = useState('');

    // Fetch logic
    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/qt?t=' + Date.now());
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Handlers
    const handleCardClick = (log: QTLog) => {
        if (log.is_public) {
            setSelectedLog(log);
            setDetailContent(log.content);
            setIsDetailOpen(true);
        } else {
            setSelectedLog(log);
            setPasswordAction('view');
            setIsPasswordModalOpen(true);
        }
    };

    const handleDeleteRequest = () => {
        setIsDetailOpen(false);
        setPasswordAction('delete');
        setIsPasswordModalOpen(true);
    };

    const handleEditRequest = () => {
        if (selectedLog && onEditLog) {
            onEditLog(selectedLog, detailContent);
            setIsDetailOpen(false);
        }
    };

    const handlePasswordSubmit = async (password: string) => {
        if (!selectedLog || !passwordAction) return;

        setVerifying(true);
        try {
            if (passwordAction === 'view') {
                const res = await fetch(`/api/qt/${selectedLog.id}/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password }),
                });

                if (res.ok) {
                    const { content } = await res.json();
                    setDetailContent(content);
                    setIsPasswordModalOpen(false);
                    setIsDetailOpen(true);
                } else {
                    alert('비밀번호가 일치하지 않습니다.');
                }
            } else if (passwordAction === 'delete') {
                const res = await fetch(`/api/qt/${selectedLog.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password }),
                });

                if (res.ok) {
                    alert('삭제되었습니다.');
                    setIsPasswordModalOpen(false);
                    setSelectedLog(null);
                    // Refetch
                    fetchLogs();
                } else {
                    alert('비밀번호가 일치하지 않습니다.');
                }
            }
        } catch (err) {
            alert('오류가 발생했습니다.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8 px-2">
                <h3 className="text-xl font-bold text-gray-800 flex items-center tracking-tight">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-3 shadow-sm"></span>
                    Community Share
                </h3>
                <button
                    onClick={fetchLogs}
                    disabled={loading}
                    className="p-2.5 text-gray-400 hover:text-amber-600 transition-all rounded-full hover:bg-white hover:shadow-sm"
                    title="새로고침"
                >
                    {loading ? <Loader2 size={20} className="animate-spin text-amber-500" /> : <RotateCw size={20} />}
                </button>
            </div>

            {logs.length === 0 && !loading ? (
                <div className="text-center py-24 bg-white/40 rounded-3xl border-2 border-dashed border-gray-200 backdrop-blur-sm">
                    <p className="text-gray-400 font-medium">아직 작성된 묵상이 없습니다.<br />오늘의 첫 번째 은혜를 나눠주세요!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-fr">
                    {logs.map((log) => (
                        <QTCard key={log.id} log={log} onClick={() => handleCardClick(log)} />
                    ))}
                </div>
            )}

            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={handlePasswordSubmit}
                loading={verifying}
                title={passwordAction === 'delete' ? '삭제 확인' : '비공개 글 열람'}
            />

            <QTDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                log={selectedLog}
                content={detailContent}
                onDeleteRequest={handleDeleteRequest}
                onEditRequest={handleEditRequest}
            />
        </div>
    );
}
