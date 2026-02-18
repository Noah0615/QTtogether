'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PrayerRequest {
    id: string;
    nickname: string;
    content: string;
    amen_count: number;
    created_at: string;
}

export default function PrayerList({ refreshTrigger }: { refreshTrigger: number }) {
    const [scrolled, setScrolled] = useState(false);
    const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchPrayers();
    }, [refreshTrigger]);

    async function fetchPrayers() {
        setLoading(true);
        const res = await fetch('/api/prayer');
        if (res.ok) {
            const data = await res.json();
            setPrayers(data);
        }
        setLoading(false);
    }

    const handleAmen = async (id: string) => {
        if (prayedIds.has(id)) return; // Prevent multiple clicks locally

        // Optimistic update
        setPrayers(prev => prev.map(p =>
            p.id === id ? { ...p, amen_count: p.amen_count + 1 } : p
        ));
        setPrayedIds(prev => new Set(prev).add(id));

        try {
            await fetch(`/api/prayer/${id}/amen`, { method: 'POST' });
        } catch (error) {
            console.error('Failed to amen', error);
        }
    };

    if (loading && prayers.length === 0) {
        return <div className="text-center py-20 text-gray-500">기도제목을 불러오는 중...</div>;
    }

    return (
        <div className="grid gap-6 w-full max-w-2xl mx-auto pb-20">
            {prayers.length === 0 ? (
                <div className="text-center py-20 bg-white/50 rounded-3xl border border-indigo-100">
                    <p className="text-gray-500 mb-2">아직 등록된 기도제목이 없습니다.</p>
                    <p className="text-sm text-indigo-400">가장 먼저 기도를 부탁해보세요!</p>
                </div>
            ) : (
                prayers.map((prayer) => (
                    <div
                        key={prayer.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-indigo-50/50 dark:border-gray-700 hover:shadow-md transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm">
                                    {prayer.nickname[0]}
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-200">{prayer.nickname}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">
                                {formatDistanceToNow(new Date(prayer.created_at), { addSuffix: true, locale: ko })}
                            </span>
                        </div>

                        <p className="text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-6 text-[15px]">
                            {prayer.content}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
                            <button
                                onClick={() => handleAmen(prayer.id)}
                                disabled={prayedIds.has(prayer.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${prayedIds.has(prayer.id)
                                        ? 'bg-indigo-100 text-indigo-600 cursor-default'
                                        : 'bg-gray-50 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                                    }`}
                            >
                                <Heart
                                    size={18}
                                    className={`transition-transform ${prayedIds.has(prayer.id) ? 'fill-current scale-110' : 'scale-100'}`}
                                />
                                <span className="font-bold text-sm">
                                    {prayedIds.has(prayer.id) ? '기도했어요' : '함께 기도하기'}
                                </span>
                                {prayer.amen_count > 0 && (
                                    <span className="ml-1 text-xs font-medium opacity-60">
                                        {prayer.amen_count}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
