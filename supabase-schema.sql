-- Gift Cat 데이터베이스 스키마 생성 (Supabase용)

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isUpgraded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- 일일 코드 테이블
CREATE TABLE IF NOT EXISTS "daily_codes" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_codes_pkey" PRIMARY KEY ("id")
);

-- 코드 시도 테이블
CREATE TABLE IF NOT EXISTS "code_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_attempts_pkey" PRIMARY KEY ("id")
);

-- 인덱스 및 제약조건 추가
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "daily_codes_date_key" ON "daily_codes"("date");
CREATE UNIQUE INDEX IF NOT EXISTS "code_attempts_userId_codeId_key" ON "code_attempts"("userId", "codeId");

-- 외래키 제약조건
ALTER TABLE "code_attempts" ADD CONSTRAINT "code_attempts_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "code_attempts" ADD CONSTRAINT "code_attempts_codeId_fkey" 
FOREIGN KEY ("codeId") REFERENCES "daily_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;