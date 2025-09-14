import { NextResponse } from 'next/server'
import { sendWinnerNotification } from '@/lib/email'

export async function POST() {
  try {
    console.log('🧪 Testing email functionality...')
    
    const testResult = await sendWinnerNotification({
      userEmail: 'test@example.com',
      nickname: '테스트유저',
      correctTime: new Date().toLocaleString('ko-KR'),
      correctCode: 'test123456',
      todayProduct: '테스트 상품'
    })
    
    return NextResponse.json({
      message: 'Email test completed',
      result: testResult
    })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json(
      { error: 'Email test failed', details: error.message },
      { status: 500 }
    )
  }
}