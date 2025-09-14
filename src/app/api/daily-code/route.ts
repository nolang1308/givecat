import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTodayCode, getTodayAttempts, checkUserAttempt } from '@/lib/daily-code'
import { hashCode } from '@/lib/crypto'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log('Session:', session)
    
    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    if (!session.user.id) {
      console.error('User ID is missing from session:', session)
      return NextResponse.json({ error: '사용자 ID가 없습니다.' }, { status: 400 })
    }

    const todayCode = await getTodayCode()
    const attempts = await getTodayAttempts()
    const userAttempt = await checkUserAttempt(session.user.id)

    // 성공한 사용자들의 이메일 목록 추출
    const successfulEmails = attempts.map(attempt => attempt.user.email)

    return NextResponse.json({
      productName: todayCode.productName,
      productImage: todayCode.productImage,
      successCount: attempts.length,
      hasSucceeded: userAttempt?.success || false,
      successfulEmails: successfulEmails,
      codeHash: hashCode(todayCode.code), // 해시값만 전송
      salt: process.env.NEXTAUTH_SECRET // 클라이언트 해싱용 salt
    })
  } catch (error) {
    console.error('Daily code fetch error:', error)
    return NextResponse.json(
      { error: '데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}