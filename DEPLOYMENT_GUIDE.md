# Vercel 배포 가이드

## 현재 문제: SQLite는 Vercel에서 사용 불가

Vercel은 서버리스 환경이므로 파일 기반 SQLite 데이터베이스를 사용할 수 없습니다.

## 해결 방법 옵션들:

### 옵션 1: Vercel Postgres (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# Vercel에 로그인 후 Postgres 데이터베이스 생성
vercel login
vercel link
vercel storage create postgres
```

### 옵션 2: Supabase (무료)
1. [Supabase](https://supabase.com)에 가입
2. 새 프로젝트 생성
3. DATABASE_URL 복사

### 옵션 3: PlanetScale (무료)
1. [PlanetScale](https://planetscale.com)에 가입
2. 새 데이터베이스 생성
3. 연결 URL 복사

## 빠른 해결 (Supabase 추천):

### 1. Supabase 설정
```bash
# Supabase에서 받은 DATABASE_URL 예시:
# postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### 2. 환경 변수 업데이트
```env
# .env 파일 수정
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
NEXTAUTH_URL="https://your-vercel-app.vercel.app"
NEXTAUTH_SECRET="super-secret-key-here"
```

### 3. Prisma 스키마 수정
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4. 데이터베이스 마이그레이션
```bash
npx prisma db push
```

### 5. Vercel 환경 변수 설정
Vercel 대시보드에서 환경 변수 추가:
- `DATABASE_URL`: PostgreSQL 연결 URL
- `NEXTAUTH_URL`: https://your-app.vercel.app
- `NEXTAUTH_SECRET`: 랜덤 시크릿 키
- `GMAIL_USER`: Gmail 주소
- `GMAIL_PASSWORD`: Gmail 앱 비밀번호
- `ADMIN_EMAIL`: 관리자 이메일

### 6. 재배포
```bash
git add .
git commit -m "Update database to PostgreSQL for Vercel deployment"
git push
```

## 임시 해결책 (로컬 테스트용):

현재 로컬에서는 정상 작동하므로, 우선 Vercel에 PostgreSQL 데이터베이스를 연결하면 해결됩니다.

## 참고:
- SQLite는 로컬 개발용으로만 사용
- 프로덕션에서는 반드시 PostgreSQL/MySQL 등 사용
- Vercel은 파일 시스템에 쓰기 불가능한 서버리스 환경