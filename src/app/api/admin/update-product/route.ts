import { NextRequest, NextResponse } from 'next/server'
import { getTodayCode } from '@/lib/daily-code'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { productName, productImage } = await request.json()

    if (!productName || !productImage) {
      return NextResponse.json(
        { error: '상품명과 이미지 URL이 필요합니다.' },
        { status: 400 }
      )
    }

    const todayCode = await getTodayCode()
    
    const updatedCode = await prisma.dailyCode.update({
      where: { id: todayCode.id },
      data: {
        productName,
        productImage
      }
    })

    return NextResponse.json({
      message: '상품 정보가 업데이트되었습니다.',
      product: {
        name: updatedCode.productName,
        image: updatedCode.productImage
      }
    })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: '상품 정보 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}