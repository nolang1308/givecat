import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // 한국시간 기준으로 현재 날짜 계산
    const kstOffset = 9 * 60 * 60 * 1000 // KST는 UTC+9
    const kstDate = new Date(Date.now() + kstOffset)
    const today = kstDate.toISOString().split('T')[0] // YYYY-MM-DD format
    
    // 기존 오늘 날짜 상품 목록 삭제 (있다면)
    await prisma.dailyProductList.deleteMany({
      where: { date: today }
    })
    
    // 활성화된 상품들 조회
    const activeProducts = await prisma.product.findMany({
      where: { isActive: true }
    })
    
    if (activeProducts.length === 0) {
      return NextResponse.json(
        { error: 'No active products available' },
        { status: 400 }
      )
    }
    
    // 오늘의 상품 1개 랜덤 선택
    const todayProductId = activeProducts[Math.floor(Math.random() * activeProducts.length)].id
    const todayProduct = activeProducts.find(p => p.id === todayProductId)
    
    // 새로운 일일 상품 목록 생성
    await prisma.dailyProductList.create({
      data: {
        date: today,
        todayProductId: todayProductId // 오늘의 상품 1개
      }
    })
    
    console.log(`Daily product list manually refreshed for ${today}. Today's product:`, todayProduct?.name)
    
    return NextResponse.json({
      message: 'Daily product list refreshed successfully',
      date: today,
      todayProductId: todayProductId,
      totalActiveProducts: activeProducts.length,
      todayProduct: {
        id: todayProduct?.id,
        name: todayProduct?.name,
        category: todayProduct?.category
      }
    })
    
  } catch (error) {
    console.error('Manual product refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh daily product list' },
      { status: 500 }
    )
  }
}