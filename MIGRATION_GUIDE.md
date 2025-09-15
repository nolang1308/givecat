# 🚀 무료 플랫폼 이전 가이드 (Render + Supabase)

## 현재 상태
- 기존: Vercel + Neon PostgreSQL  
- 새로운: Render + Supabase (완전 무료)

## 1️⃣ Supabase 데이터베이스 설정

### 1. Supabase 프로젝트 생성
1. [Supabase.com](https://supabase.com) 가입
2. "New Project" 클릭
3. Organization: Personal
4. Project name: `giftcat-database`
5. Database Password: **강력한 비밀번호 설정**
6. Region: `Northeast Asia (Seoul)`
7. "Create new project" 클릭

### 2. 데이터베이스 URL 복사
1. 프로젝트 생성 완료 후 Settings → Database
2. "Connection string" → "URI" 탭
3. `postgresql://postgres:[YOUR-PASSWORD]@db.[REF].supabase.co:5432/postgres` 복사
4. `[YOUR-PASSWORD]` 부분을 실제 설정한 비밀번호로 교체

### 3. Prisma 스키마 적용
```bash
# 환경변수 임시 설정 후 스키마 적용
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres" npx prisma db push
```

## 2️⃣ Render 배포 설정

### 1. Render 계정 설정
1. [Render.com](https://render.com) 가입
2. "GitHub"로 로그인
3. GitHub 저장소 연결 허용

### 2. 웹 서비스 생성
1. Dashboard → "New +"
2. "Web Service" 선택
3. GitHub 저장소 `nolang1308/givecat` 연결
4. 설정값:
   - **Name**: `giftcat`
   - **Environment**: `Node`
   - **Region**: `Singapore` (한국과 가까움)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3. 환경 변수 설정
Environment 탭에서 다음 변수들 추가:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
NEXTAUTH_URL=https://giftcat.onrender.com
NEXTAUTH_SECRET=[RANDOM-SECRET-32-CHARS]
GMAIL_USER=dotory1308@gmail.com
GMAIL_PASSWORD=icewulxftiqpngmp
ADMIN_EMAIL=suminhwang1308@gmail.com
```

## 3️⃣ 도메인 및 배포

### 1. 자동 배포
- Render는 GitHub push 시 자동 재배포
- 첫 배포는 5-10분 소요

### 2. 무료 도메인
- `https://giftcat.onrender.com` 자동 할당
- 커스텀 도메인 연결 가능 (무료)

## 4️⃣ 기존 플랫폼 제거

### 1. 데이터 백업 확인
- Supabase에서 모든 테이블과 데이터 확인
- 사용자, 코드, 시도 기록 모두 이전 완료 확인

### 2. Vercel 프로젝트 삭제
1. Vercel Dashboard 접속
2. 프로젝트 Settings → General
3. "Delete Project" 실행

### 3. Neon 데이터베이스 삭제
1. Neon Console 접속
2. 프로젝트 Settings
3. "Delete Project" 실행

## 5️⃣ 무료 한도 및 제한사항

### Render 무료 플랜
- ✅ 월 750시간 (31일 x 24시간 = 744시간)
- ✅ 자동 HTTPS
- ⚠️ 15분 비활성 시 슬립 (첫 요청 시 웨이크업 30초)
- ✅ 500MB 메모리

### Supabase 무료 플랜
- ✅ 500MB 데이터베이스
- ✅ 월 500만 읽기 작업
- ✅ 월 20만 쓰기 작업
- ✅ 무제한 API 요청
- ⚠️ 1주일 비활성 시 일시정지

## 6️⃣ 성능 최적화 팁

### 슬립 모드 방지
- Uptime Robot 등으로 5분마다 핑
- 또는 간단한 cron job 설정

### 데이터베이스 최적화
- 불필요한 인덱스 제거
- 정기적인 데이터 정리

## 이전 완료 체크리스트

- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 적용
- [ ] Render 웹 서비스 생성
- [ ] 환경 변수 설정
- [ ] 첫 배포 성공
- [ ] 로그인/게임 기능 테스트
- [ ] 기존 Vercel 삭제
- [ ] 기존 Neon DB 삭제

## 예상 소요 시간: 30-60분