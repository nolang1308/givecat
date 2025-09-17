import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 한국시간 기준으로 현재 날짜 계산
    const kstOffset = 9 * 60 * 60 * 1000 // KST는 UTC+9
    const kstDate = new Date(Date.now() + kstOffset)
    const today = kstDate.toISOString().split('T')[0] // YYYY-MM-DD format
    
    // 오늘 날짜의 상품 목록이 이미 존재하는지 확인
    const existingList = await prisma.dailyProductList.findUnique({
      where: { date: today }
    })
    
    if (existingList) {
      return NextResponse.json({ 
        message: 'Daily product list already exists for today',
        date: today 
      })
    }
    
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
    
    // 모든 활성 상품 ID와 오늘의 상품 1개 랜덤 선택
    const allProductIds = activeProducts.map(p => p.id)
    const todayProductId = activeProducts[Math.floor(Math.random() * activeProducts.length)].id
    
    // 새로운 일일 상품 목록 생성
    await prisma.dailyProductList.create({
      data: {
        date: today,
        productIds: allProductIds, // 모든 상품 ID
        todayProductId: todayProductId // 오늘의 상품 1개
      }
    })
    
    console.log(`Daily product list created for ${today}. Today's product:`, todayProductId)
    
    return NextResponse.json({
      message: 'Daily product list updated successfully',
      date: today,
      productIds: allProductIds,
      todayProductId: todayProductId,
      productCount: allProductIds.length
    })
    
  } catch (error) {
    console.error('Daily product list update error:', error)
    return NextResponse.json(
      { error: 'Failed to update daily product list' },
      { status: 500 }
    )
  }
}

export async function POST() {
  // POST 메서드도 같은 로직으로 처리 (Vercel cron job compatibility)
  return GET()
}