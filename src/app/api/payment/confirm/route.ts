import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { paymentKey, orderId, amount } = await request.json()
    
    // 토스페이먼츠 결제 승인 요청
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    })

    const payment = await response.json()

    if (!response.ok) {
      console.error('Payment confirmation failed:', payment)
      return NextResponse.json(
        { error: payment.message || '결제 승인에 실패했습니다.' },
        { status: 400 }
      )
    }

    // 결제 성공 시 사용자 업그레이드 처리
    if (payment.status === 'DONE') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { isUpgraded: true }
      })

      // 결제 내역 저장 (선택사항)
      await prisma.payment.create({
        data: {
          userId: session.user.id,
          paymentKey: payment.paymentKey,
          orderId: payment.orderId,
          amount: payment.totalAmount,
          status: payment.status,
          method: payment.method || 'UNKNOWN',
          approvedAt: payment.approvedAt ? new Date(payment.approvedAt) : new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: '업그레이드가 완료되었습니다!',
        payment: {
          orderId: payment.orderId,
          amount: payment.totalAmount,
          method: payment.method
        }
      })
    } else {
      return NextResponse.json(
        { error: '결제가 완료되지 않았습니다.' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: '결제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}