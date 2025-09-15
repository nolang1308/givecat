-- Gift Cat 데이터 백업 스크립트
-- 기존 Neon DB에서 추출한 데이터를 여기에 저장

-- 사용자 데이터 백업
-- INSERT INTO "users" (id, email, nickname, password, "isUpgraded", "createdAt", "updatedAt") VALUES (...);

-- 일일 코드 데이터 백업  
-- INSERT INTO "daily_codes" (id, date, code, "productName", "productImage", "createdAt") VALUES (...);

-- 코드 시도 기록 백업
-- INSERT INTO "code_attempts" (id, "userId", "codeId", success, "attemptedAt") VALUES (...);

-- 이 파일은 Supabase 설정 후 데이터 복원에 사용됩니다.