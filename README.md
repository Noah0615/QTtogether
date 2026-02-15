# 함께 쓰는 익명 큐티 노트 (Anonymous QT Note)

매일의 말씀을 묵상하고, 받은 은혜를 익명으로 자유롭게 나누는 웹 애플리케이션입니다.

## 주요 기능
- **오늘의 말씀 (Today's Word)**: 매일 변경되는 성경 구절 카드
- **익명 묵상 작성**: 닉네임 + 4자리 비밀번호로 간편하게 기록
- **공개/비공개 설정**: 나만 보고 싶은 묵상은 비공개로 안전하게 저장 (서버에서 내용 원천 차단)
- **비밀번호 보안**: `bcrypt` 단방향 암호화를 통한 안전한 비밀번호 저장
- **반응형 디자인**: 모바일, 태블릿, 데스크탑 모두 최적화된 UI

## 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Lucide Icons
- **Database**: Supabase (PostgreSQL)
- **Backend Logic**: Next.js API Routes (Server Actions like)

## 실행 방법

1. 의존성 설치
   ```bash
   npm install
   ```

2. 환경 변수 설정 (`.env.local` 파일 생성)
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. 개발 서버 실행
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
