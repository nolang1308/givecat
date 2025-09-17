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
    
    // 랜덤하게 5개 상품 선택
    const selectedProducts = activeProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(5, activeProducts.length))
    
    const selectedProductIds = selectedProducts.map(p => p.id)
    
    // 새로운 일일 상품 목록 생성
    await prisma.dailyProductList.create({
      data: {
        date: today,
        productIds: selectedProductIds
      }
    })
    
    console.log(`Daily product list manually refreshed for ${today}:`, selectedProductIds)
    
    return NextResponse.json({
      message: 'Daily product list refreshed successfully',
      date: today,
      productIds: selectedProductIds,
      productCount: selectedProductIds.length,
      selectedProducts: selectedProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category
      }))
    })
    
  } catch (error) {
    console.error('Manual product refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh daily product list' },
      { status: 500 }
    )
  }
}