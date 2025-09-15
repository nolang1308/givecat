import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTodayCode, checkUserAttempt } from '@/lib/daily-code'
import { prisma } from '@/lib/prisma'
import { sendWinnerNotification } from '@/lib/email'

// 간단한 Rate Limiting (메모리 기반)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    // Rate Limiting: 사용자당 분당 10회 제한
    const userId = session.user.id
    const now = Date.now()
    const windowMs = 60 * 1000 // 1분
    const maxRequests = 10

    const userLimit = rateLimitMap.get(userId)
    if (userLimit && userLimit.resetTime > now) {
      if (userLimit.count >= maxRequests) {
        return NextResponse.json({ error: '너무 많은 시도입니다. 잠시 후 다시 시도해주세요.' }, { status: 429 })
      }
      userLimit.count++
    } else {
      rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs })
    }

    const { attemptedCode } = await request.json()

    if (!attemptedCode || typeof attemptedCode !== 'string') {
      return NextResponse.json({ error: '유효하지 않은 코드입니다.' }, { status: 400 })
    }

    const existingAttempt = await checkUserAttempt(session.user.id)
    if (existingAttempt?.success) {
      return NextResponse.json({ 
        success: true, 
        message: '이미 코드를 맞추셨습니다!' 
      })
    }

    const todayCode = await getTodayCode()
    const isCorrect = attemptedCode === todayCode.code

    console.log('🔍 Debug info:')
    console.log('- User ID:', session.user.id)
    console.log('- Code ID:', todayCode.id)
    console.log('- Attempted code:', attemptedCode)
    console.log('- Today code:', todayCode.code)
    console.log('- Is correct:', isCorrect)

    const upsertResult = await prisma.codeAttempt.upsert({
      where: {
        userId_codeId: {
          userId: session.user.id,
          codeId: todayCode.id
        }
      },
      update: {
        success: isCorrect,
        attemptedAt: new Date()
      },
      create: {
        userId: session.user.id,
        codeId: todayCode.id,
        success: isCorrect
      }
    })

    console.log('✅ Upsert result:', upsertResult)

    if (isCorrect) {
      // 당첨자 이메일 전송 (비동기로 처리해서 응답 지연 방지)
      const sendEmailAsync = async () => {
        try {
          console.log('🎉 Winner detected! Preparing to send email...')
          
          const user = await prisma.user.findUnique({
            where: { id: session.user.id }
          })
          
          if (user) {
            console.log('👤 Found winner user:', { email: user.email, nickname: user.nickname })
            
            const currentTime = new Date().toLocaleString('ko-KR', {
              timeZone: 'Asia/Seoul',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
            
            const emailResult = await sendWinnerNotification({
              userEmail: user.email,
              nickname: user.nickname,
              correctTime: currentTime,
              correctCode: attemptedCode,
              todayProduct: todayCode.productName
            })
            
            console.log('📧 Email send result:', emailResult)
          } else {
            console.log('❌ User not found for ID:', session.user.id)
          }
        } catch (emailError) {
          console.error('❌ Failed to send winner notification email:', emailError)
        }
      }
      
      // 비동기로 이메일 전송
      sendEmailAsync()
      
      return NextResponse.json({ 
        success: true, 
        message: '축하합니다! 코드를 맞추셨습니다!' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: '틀렸습니다. 다시 시도해보세요.' 
      })
    }
  } catch (error) {
    console.error('Code attempt error:', error)
    return NextResponse.json(
      { error: '코드 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}