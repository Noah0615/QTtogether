import { getDailyVerse } from '@/lib/getDailyVerse';
import HomeClient from '@/components/HomeClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'DailyQT - 함께 나누는 묵상 노트',
  description: '매일의 말씀 은혜를 묵상하고 익명으로 나누는 공간입니다.',
};

export default function Home() {
  const verse = getDailyVerse();
  return <HomeClient verse={verse} />;
}
