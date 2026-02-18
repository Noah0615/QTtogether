'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, PenTool, Users, Lock, Archive, Flame, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#faf9f6] dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative selection:bg-amber-200 dark:selection:bg-amber-900 font-sans transition-colors duration-300">
            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full bg-gradient-to-b from-amber-100/40 to-transparent blur-3xl opacity-60 dark:from-indigo-900/20 dark:opacity-40" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-gradient-to-t from-orange-100/30 to-transparent blur-3xl opacity-50 dark:from-purple-900/20 dark:opacity-30" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-20">
                <Link href="/" className="inline-flex items-center text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 transition-colors mb-8 group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    돌아가기
                </Link>

                <header className="mb-16 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                    <h1 className="text-4xl md:text-5xl font-black text-amber-950 dark:text-amber-100 mb-6 tracking-tight leading-tight">
                        Daily<span className="text-amber-600 dark:text-amber-400">QT</span> 소개
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        이곳은 내 안의 은혜를 기록하고 나누는<br className="hidden md:block" />
                        <span className="font-bold text-gray-800 dark:text-gray-100">100% 익명 묵상 공간</span>입니다.
                    </p>
                </header>

                <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700 delay-100 fade-in fill-mode-backwards">

                    <Section
                        icon={<BookOpen className="w-6 h-6 text-amber-600" />}
                        title="1. 영감을 주는 오늘의 말씀"
                        content="1년 365일, 매일 새로운 성경 구절이 묵상 큐티 카드로 제공됩니다. 하나님의 말씀으로 하루를 시작해보세요."
                    />

                    <Section
                        icon={<PenTool className="w-6 h-6 text-amber-600" />}
                        title="2. 자유로운 묵상 기록 & 미디어 첨부"
                        content={
                            <>
                                오늘 묵상한 말씀을 자유롭게 기록하세요. 글뿐만 아니라 📸 이미지나 🎥 유튜브 영상 링크도 첨부할 수 있습니다.
                                '공개'로 설정하면 서로의 은혜를 함께 누릴 수 있습니다.
                                <br /><span className="text-sm text-gray-400 mt-2 block">* 안전한 공간을 위해, 부적절한 내용은 AI가 자동으로 걸러냅니다.</span>
                            </>
                        }
                    />

                    <Section
                        icon={<Users className="w-6 h-6 text-amber-600" />}
                        title="3. 나만을 위한 페르소나 매칭 & 깊은 상담"
                        content="내가 쓴 묵상 글을 바탕으로 영적 성향이 비슷한 성경 인물(다윗, 바울, 에스더 등)을 찾아줍니다. 성경 인물과의 깊은 대화를 통해 영적 조언을 얻어보세요."
                    />

                    <Section
                        icon={<Lock className="w-6 h-6 text-amber-600" />}
                        title="4. 나만을 위한 비밀 공간"
                        content="남들에게 보이기 어려운 깊은 고백은 '비공개'로 남기세요. 🔒 자물쇠가 채워지며, 비밀번호를 아는 본인만 열어볼 수 있습니다. (서버 관리자도 내용을 알 수 없습니다)"
                    />

                    <Section
                        icon={<Archive className="w-6 h-6 text-amber-600" />}
                        title="5. 소중한 기록 보관 & 은혜 나눔"
                        content="작성한 묵상은 사라지지 않고 날짜별로 차곡차곡 쌓입니다. 언제든 다시 꺼내보며 그날의 감동을 되새겨보세요."
                    />

                    <Section
                        icon={<Flame className="w-6 h-6 text-amber-600" />}
                        title="6. 실시간 은혜의 등불 (Live Grace Lights)"
                        content={
                            <>
                                화면 하단을 밝히는 <span className="font-bold text-amber-600">촛불</span>과 공중을 유영하는 <span className="font-bold text-amber-600">불빛</span>들이 현재 접속한 성도님들을 나타냅니다.
                                <br />누군가 은혜를 나누는 순간, 화면 가득 '축복의 빛'이 퍼져나가는 감동을 경험해보세요.
                                <br /><span className="text-sm font-serif italic text-gray-500 mt-2 block">"두세 사람이 내 이름으로 모인 곳에는 나도 그들 중에 있느니라 (마 18:20)"</span>
                            </>
                        }
                    />

                    <Section
                        icon={<HeartHandshake className="w-6 h-6 text-amber-600" />}
                        title="7. 서로를 위한 중보 기도"
                        content="나 혼자 감당하기 힘든 기도의 제목들을 익명으로 나누어보세요. '함께 기도하기(Amen)' 버튼을 통해 서로에게 기도의 힘을 실어줄 수 있습니다."
                    />

                </div>

                <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 text-center animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in fill-mode-backwards">
                    <p className="text-xl font-serif font-medium text-gray-800 dark:text-gray-200 mb-4">
                        "오늘 당신에게 임한 하나님의 은혜를<br />이곳에 흘려보내주세요."
                    </p>
                    <p className="text-gray-500 text-sm">나눔은 은혜를 배가시킵니다.</p>
                </div>
            </div>
        </main>
    );
}

function Section({ icon, title, content }: { icon: React.ReactNode, title: string, content: React.ReactNode }) {
    return (
        <div className="flex gap-4 md:gap-6 group">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-amber-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-gray-700 transition-colors duration-300">
                {icon}
            </div>
            <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {content}
                </p>
            </div>
        </div>
    );
}
