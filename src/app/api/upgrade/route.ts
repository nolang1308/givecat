import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 실제 결제 처리는 여기서 진행
    // 현재는 간단히 사용자의 업그레이드 상태만 업데이트
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { isUpgraded: true }
    })

    return NextResponse.json({ 
      success: true, 
      message: '업그레이드가 완료되었습니다!',
      user: {
        id: user.id,
        isUpgraded: user.isUpgraded
      }
    })

  } catch (error) {
    console.error('Upgrade error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isUpgraded: true }
    })

    return NextResponse.json({ 
      isUpgraded: user?.isUpgraded || false 
    })

  } catch (error) {
    console.error('Get upgrade status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}