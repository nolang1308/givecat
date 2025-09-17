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
    
    // 3. 임시로 성공 응답 (실제 토스 API 호출 없이)
    console.log('Returning success response')
    
    return NextResponse.json({
      success: true,
      message: '테스트 업그레이드가 완료되었습니다!',
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