'use client';
import { useState } from 'react';
import VerseCard from '@/components/VerseCard';
import WriteModal from '@/components/WriteModal';
import QTList from '@/components/QTList';
import { PenTool } from 'lucide-react';
import { BibleVerse } from '@/lib/getDailyVerse';
import { QTLog } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import PrayerList from '@/components/PrayerList';
import PrayerWriteModal from '@/components/PrayerWriteModal';
import { HeartHandshake, Info } from 'lucide-react';
import Link from 'next/link';

interface HomeClientProps {
    verse: BibleVerse;
}

export default function HomeClient({ verse }: HomeClientProps) {
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeTab, setActiveTab] = useState<'qt' | 'prayer'>('qt');
    const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);

    // Edit State
    const [editingLog, setEditingLog] = useState<QTLog | undefined>(undefined);
    const [editingContent, setEditingContent] = useState<string | undefined>(undefined);

    const handleEditLog = (log: QTLog, content: string) => {
        setEditingLog(log);
        setEditingContent(content);
        setIsWriteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsWriteModalOpen(false);
        setEditingLog(undefined);
        setEditingContent(undefined);
    };

    return (
        <main className="min-h-screen bg-[#faf9f6] dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative selection:bg-amber-200 dark:selection:bg-amber-900 font-sans transition-colors duration-300">
            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full bg-gradient-to-b from-amber-100/40 to-transparent blur-3xl opacity-60 dark:from-indigo-900/20 dark:opacity-40" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-gradient-to-t from-orange-100/30 to-transparent blur-3xl opacity-50 dark:from-purple-900/20 dark:opacity-30" />
            </div>

            <div className="fixed top-5 right-5 z-50">
                <ThemeToggle />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-5 py-12 md:py-20 flex flex-col items-center">
                <header className="text-center mb-12 animate-in slide-in-from-top-4 duration-700 fade-in relative">
                    <h1 className="text-4xl md:text-6xl font-black text-amber-950 dark:text-amber-100 mb-4 tracking-tighter leading-tight drop-shadow-sm">
                        Daily<span className="text-amber-600 dark:text-amber-400">QT</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-gray-600 dark:text-gray-400 font-medium text-lg md:text-xl">매일의 은혜를 기록하고 나누는 공간</p>
                        <Link href="/about" className="text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" title="서비스 소개">
                            <Info size={18} />
                        </Link>
                    </div>
                </header>

                <div className="w-full mb-12 transform hover:scale-[1.01] transition-transform duration-500 animate-in slide-in-from-bottom-4 duration-700 delay-100 fade-in fill-mode-backwards">
                    <VerseCard verse={verse} />
                </div>

                {/* Tab Navigation */}
                <div className="flex p-1 bg-gray-200/50 dark:bg-gray-800/50 rounded-full mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-150 fade-in fill-mode-backwards w-full max-w-sm mx-auto backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('qt')}
                        className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'qt'
                            ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-md'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        오늘의 묵상
                    </button>
                    <button
                        onClick={() => setActiveTab('prayer')}
                        className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'prayer'
                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        중보 기도
                    </button>
                </div>

                <div className="mb-12 animate-in slide-in-from-bottom-4 duration-700 delay-200 fade-in fill-mode-backwards">
                    {activeTab === 'qt' ? (
                        <button
                            onClick={() => {
                                setEditingLog(undefined);
                                setEditingContent(undefined);
                                setIsWriteModalOpen(true);
                            }}
                            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold text-lg rounded-full hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                        >
                            <PenTool className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300 text-amber-400" />
                            나만의 묵상 기록하기
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur group-hover:opacity-40 transition-opacity duration-500"></div>
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsPrayerModalOpen(true)}
                            className="group relative inline-flex items-center justify-center px-8 py-4 bg-indigo-900 text-white font-bold text-lg rounded-full hover:bg-indigo-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                        >
                            <HeartHandshake className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300 text-indigo-300" />
                            기도제목 나누기
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur group-hover:opacity-40 transition-opacity duration-500"></div>
                        </button>
                    )}
                </div>

                <div className="w-full animate-in slide-in-from-bottom-4 duration-700 delay-300 fade-in fill-mode-backwards">
                    {activeTab === 'qt' ? (
                        <QTList key={`qt-${refreshKey}`} onEditLog={handleEditLog} />
                    ) : (
                        <PrayerList key={`prayer-${refreshKey}`} refreshTrigger={refreshKey} />
                    )}
                </div>
            </div>

            <WriteModal
                isOpen={isWriteModalOpen}
                onClose={handleCloseModal}
                verse={`${verse.reference}`}
                onSuccess={() => setRefreshKey((prev) => prev + 1)}
                initialData={editingLog}
                initialContent={editingContent}
            />

            <PrayerWriteModal
                isOpen={isPrayerModalOpen}
                onClose={() => setIsPrayerModalOpen(false)}
                onSuccess={() => setRefreshKey((prev) => prev + 1)}
            />
        </main>
    );
}
