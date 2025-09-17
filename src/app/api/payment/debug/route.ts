import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { paymentData } = await request.json()
    
    console.log('Payment Data being sent to Toss:', JSON.stringify(paymentData, null, 2))
    
    // 토스페이먼츠 API 직접 호출해서 오류 확인
    const response = await fetch('https://api.tosspayments.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    const result = await response.json()
    
    console.log('Toss API Response:', JSON.stringify(result, null, 2))
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: result
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}