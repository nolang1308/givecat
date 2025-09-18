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
    
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: '결제 데이터가 누락되었습니다.' }, { status: 400 })
    }

    // 3. 토스페이먼츠 결제 검증
    try {
      console.log('Verifying payment with TossPayments...')
      
      const tossResponse = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
      })

      if (!tossResponse.ok) {
        console.error('TossPayments verification failed:', await tossResponse.text())
        return NextResponse.json(
          { error: '결제 검증에 실패했습니다.' },
          { status: 400 }
        )
      }

      const paymentData = await tossResponse.json()
      console.log('Payment verified:', { status: paymentData.status, amount: paymentData.totalAmount })

      // 결제 상태 및 금액 확인
      if (paymentData.status !== 'DONE' || paymentData.totalAmount !== parseInt(amount.toString())) {
        return NextResponse.json(
          { error: '결제 정보가 일치하지 않습니다.' },
          { status: 400 }
        )
      }

    } catch (verifyError) {
      console.error('Payment verification error:', verifyError)
      return NextResponse.json(
        { error: '결제 검증 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
    
    // 4. 사용자 업그레이드 처리
    try {
      console.log('Updating user upgrade status...')
      
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
          method: 'CARD',
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