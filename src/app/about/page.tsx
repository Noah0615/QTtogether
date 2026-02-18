'use client';

import ServiceIntro from '@/components/ServiceIntro';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="relative">
            <Link href="/" className="fixed top-6 left-6 z-50 inline-flex items-center text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 transition-colors px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full shadow-sm">
                <ArrowLeft size={20} className="mr-2" />
                돌아가기
            </Link>
            <ServiceIntro showStartButton={false} />
        </div>
    );
}
