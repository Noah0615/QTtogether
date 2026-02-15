import { BibleVerse } from '@/lib/getDailyVerse';

interface VerseCardProps {
    verse: BibleVerse;
}

export default function VerseCard({ verse }: VerseCardProps) {
    return (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 shadow-lg text-center mb-8 border border-white/50">
            <h2 className="text-xs font-bold text-amber-800 tracking-[0.2em] uppercase mb-4">Today&apos;s Word</h2>
            <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed break-keep mb-5 word-break-keep">
                &quot;{verse.verse}&quot;
            </p>
            <p className="text-sm text-gray-600 font-medium">
                {verse.reference}
            </p>
        </div>
    );
}
