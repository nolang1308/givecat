import { NextResponse } from 'next/server'
import { getTodayCode } from '@/lib/daily-code'

export async function GET() {
  try {
    const todayCode = await getTodayCode()
    
    return NextResponse.json({
      date: todayCode.date,
      code: todayCode.code,
      productName: todayCode.productName,
      productImage: todayCode.productImage
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { error: 'Failed to get today code' },
      { status: 500 }
    )
  }
}