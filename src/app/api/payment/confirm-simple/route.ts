import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Payment Confirm Simple API Started ===')
    
    // 1. 세션 확인
    const session = await getServerSession(authOptions)
    console.log('Session check:', !!session?.user)
    
    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    // 2. 요청 데이터 파싱
    const { paymentKey, orderId, amount } = await request.json()
    console.log('Request data:', { paymentKey: !!paymentKey, orderId: !!orderId, amount })
    
    // 3. 사용자 업그레이드 처리
    try {
      console.log('Updating user upgrade status...')
      
      // Prisma import 추가 필요 - 아래에서 수정
      const { prisma } = await import('@/lib/prisma')
      
      // 사용자 업그레이드
      await prisma.user.update({
        where: { id: session.user.id },
        data: { isUpgraded: true }
      })
      
      console.log('User upgraded successfully')
      
      // 결제 내역 저장
      await prisma.payment.create({
        data: {
          userId: session.user.id,
          paymentKey: paymentKey,
          orderId: orderId,
          amount: parseInt(amount.toString()),
          status: 'DONE',
          method: 'TEST',
          approvedAt: new Date()
        }
      })
      
      console.log('Payment record saved')
      
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: '업그레이드 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: '업그레이드가 완료되었습니다!',
      payment: {
        orderId,
        amount: parseInt(amount.toString()),
        method: 'TEST'
      }
    })

  } catch (error) {
    console.error('Payment confirm simple error:', error)
    return NextResponse.json(
      { error: '결제 처리 중 오류가 발생했습니다: ' + String(error) },
      { status: 500 }
    )
  }
}