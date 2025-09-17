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
    
    // 현재 도메인 기반으로 URL 생성 (프로덕션에서는 HTTPS 사용)
    const host = request.headers.get('host')
    const isProduction = host?.includes('vercel.app') || host?.includes('onrender.com')
    const protocol = isProduction ? 'https' : 'http'
    const baseUrl = `${protocol}://${host}`
    
    // 토스페이먼츠 결제 요청 데이터
    const paymentData = {
      amount: amount,
      orderId: orderId,
      orderName: orderName,
      customerName: session.user.nickname || session.user.email,
      successUrl: `${baseUrl}/payment/success`,
      failUrl: `${baseUrl}/payment/fail`,
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