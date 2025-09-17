import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { amount, orderName } = await request.json()
    
    // 주문 ID 생성 (고유값이어야 함)
    const orderId = `upgrade_${session.user.id}_${Date.now()}`
    
    // 토스페이먼츠 결제 요청 데이터 (최소 필수 파라미터)
    const paymentData = {
      amount: amount,
      orderId: orderId,
      orderName: orderName,
      successUrl: "https://givecat.onrender.com/payment/success",
      failUrl: "https://givecat.onrender.com/payment/fail",
    }

    return NextResponse.json({
      success: true,
      paymentData,
      clientKey: process.env.TOSS_CLIENT_KEY
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: '결제 요청 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}