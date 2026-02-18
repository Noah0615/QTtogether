'use client';

import { ArrowRight, BookOpen, PenTool, Users, Lock, Archive, Flame, HeartHandshake } from 'lucide-react';

interface ServiceIntroProps {
    onStart?: () => void;
    showStartButton?: boolean;
}

export default function ServiceIntro({ onStart, showStartButton = true }: ServiceIntroProps) {
    return (
        <div className="min-h-screen bg-[#faf9f6] dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative selection:bg-amber-200 dark:selection:bg-amber-900 font-sans transition-colors duration-300">
            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full bg-gradient-to-b from-amber-100/40 to-transparent blur-3xl opacity-60 dark:from-indigo-900/20 dark:opacity-40" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-gradient-to-t from-orange-100/30 to-transparent blur-3xl opacity-50 dark:from-purple-900/20 dark:opacity-30" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">

                <header className="mb-12 text-center animate-in slide-in-from-bottom-4 duration-700 fade-in">
                    <h1 className="text-4xl md:text-6xl font-black text-amber-950 dark:text-amber-100 mb-6 tracking-tight leading-tight">
                        Daily<span className="text-amber-600 dark:text-amber-400">QT</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                        내 안의 은혜를 기록하고 나누는<br />
                        <span className="font-bold text-gray-800 dark:text-gray-100">100% 익명 묵상 공간</span>
                    </p>
                </header>

                {showStartButton && onStart && (
                    <button
                        onClick={onStart}
                        className="mb-16 group relative inline-flex items-center justify-center px-10 py-5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xl rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 animate-in slide-in-from-bottom-4 duration-700 delay-100 fade-in fill-mode-backwards"
                    >
                        DailyQT 시작하기
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-30 blur group-hover:opacity-50 transition-opacity duration-500"></div>
                    </button>
                )}

                <div className="w-full space-y-12 animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in fill-mode-backwards text-left">
                    <Section
                        icon={<BookOpen className="w-6 h-6 text-amber-600" />}
                        title="1. 영감을 주는 오늘의 말씀"
                        content="1년 365일, 매일 새로운 성경 구절이 묵상 큐티 카드로 제공됩니다."
                    />

                    <Section
                        icon={<PenTool className="w-6 h-6 text-amber-600" />}
                        title="2. 자유로운 묵상 기록 & 미디어 첨부"
                        content="글, 이미지, 유튜브 영상으로 은혜를 자유롭게 기록하세요. 안전한 공간을 위해 부적절한 내용은 AI가 자동으로 걸러냅니다."
                    />

                    <Section
                        icon={<Users className="w-6 h-6 text-amber-600" />}
                        title="3. 나만을 위한 페르소나 매칭 & 깊은 상담"
                        content="내가 쓴 묵상 글을 바탕으로 영적 성향이 비슷한 성경 인물(다윗, 바울, 에스더 등)과 깊은 대화를 나눌 수 있습니다."
                    />

                    <Section
                        icon={<Lock className="w-6 h-6 text-amber-600" />}
                        title="4. 나만을 위한 비밀 공간"
                        content="남들에게 보이기 어려운 깊은 고백은 '비공개'로 남기세요. 비밀번호로 안전하게 보호됩니다."
                    />

                    <Section
                        icon={<Archive className="w-6 h-6 text-amber-600" />}
                        title="5. 소중한 기록 보관 & 은혜 나눔"
                        content="작성한 묵상은 사라지지 않고 날짜별로 쌓입니다. 언제든 다시 꺼내보며 그날의 감동을 되새겨보세요."
                    />

                    <Section
                        icon={<Flame className="w-6 h-6 text-amber-600" />}
                        title="6. 실시간 은혜의 등불"
                        content="화면 하단의 촛불과 불빛들이 현재 접속한 성도님들을 나타냅니다. 함께 깨어 기도하는 동역자들을 느껴보세요."
                    />

                    <Section
                        icon={<HeartHandshake className="w-6 h-6 text-amber-600" />}
                        title="7. 서로를 위한 중보 기도"
                        content="기도제목을 익명으로 나누고 'Amen'으로 서로에게 기도의 힘을 실어주세요."
                    />
                </div>

                <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 text-center w-full animate-in slide-in-from-bottom-8 duration-700 delay-300 fade-in fill-mode-backwards">
                    <p className="text-xl font-serif font-medium text-gray-800 dark:text-gray-200 mb-4">
                        "오늘 당신에게 임한 하나님의 은혜를<br />이곳에 흘려보내주세요."
                    </p>
                </div>
            </div>
        </div>
    );
}

function Section({ icon, title, content }: { icon: React.ReactNode, title: string, content: React.ReactNode }) {
    return (
        <div className="flex gap-4 md:gap-6 group bg-white/50 dark:bg-gray-900/50 p-6 rounded-2xl border border-transparent hover:border-amber-100 dark:hover:border-gray-800 transition-all">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-amber-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-gray-700 transition-colors duration-300">
                {icon}
            </div>
            <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                    {content}
                </p>
            </div>
        </div>
    );
}
