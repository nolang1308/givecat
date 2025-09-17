import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Payment API is working',
    timestamp: new Date().toISOString(),
    env: {
      hasSecretKey: !!process.env.TOSS_SECRET_KEY,
      secretKeyLength: process.env.TOSS_SECRET_KEY?.length || 0
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: 'POST request received',
      receivedData: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to parse request',
      message: String(error),
      timestamp: new Date().toISOString()
    }, { status: 400 })
  }
}