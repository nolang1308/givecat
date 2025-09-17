import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    
    // 오늘의 상품 목록 조회
    let dailyProductList = await prisma.dailyProductList.findUnique({
      where: { date: today }
    })
    
    // 오늘의 상품 목록이 없으면 생성
    if (!dailyProductList) {
      // 활성화된 상품들 조회
      const activeProducts = await prisma.product.findMany({
        where: { isActive: true }
      })
      
      if (activeProducts.length === 0) {
        // 기본 상품이 없으면 샘플 상품들 생성
        await createSampleProducts()
        const newActiveProducts = await prisma.product.findMany({
          where: { isActive: true }
        })
        const todayProductId = newActiveProducts[Math.floor(Math.random() * newActiveProducts.length)].id
        
        dailyProductList = await prisma.dailyProductList.create({
          data: {
            date: today,
            todayProductId: todayProductId // 오늘의 상품 1개
          }
        })
      } else {
        const todayProductId = activeProducts[Math.floor(Math.random() * activeProducts.length)].id
        
        dailyProductList = await prisma.dailyProductList.create({
          data: {
            date: today,
            todayProductId: todayProductId // 오늘의 상품 1개
          }
        })
      }
    }
    
    // DB의 모든 활성 상품 조회 (항상 최신 상품 목록 표시)
    const allActiveProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    
    // 오늘의 상품 정보 조회
    let todayProduct = await prisma.product.findUnique({
      where: { id: dailyProductList.todayProductId }
    })
    
    // 오늘의 상품이 삭제되었거나 비활성화된 경우 새로운 상품 선택
    if (!todayProduct || !todayProduct.isActive) {
      if (allActiveProducts.length > 0) {
        // 새로운 오늘의 상품 랜덤 선택
        const newTodayProduct = allActiveProducts[Math.floor(Math.random() * allActiveProducts.length)]
        
        // DailyProductList 업데이트
        await prisma.dailyProductList.update({
          where: { date: today },
          data: { todayProductId: newTodayProduct.id }
        })
        
        todayProduct = newTodayProduct
        console.log(`Today's product was missing/inactive. Selected new product: ${newTodayProduct.name}`)
      } else {
        todayProduct = null
        console.log('No active products available for today\'s product')
      }
    }
    
    return NextResponse.json({
      date: today,
      products: allActiveProducts, // DB의 모든 활성 상품
      todayProduct: todayProduct // 오늘의 상품 1개 (교체 가능)
    })
    
  } catch (error) {
    console.error('Daily products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily products' },
      { status: 500 }
    )
  }
}

// 샘플 상품 생성 함수
async function createSampleProducts() {
  const sampleProducts = [
    {
      name: "스타벅스 아메리카노",
      description: "부드럽고 진한 스타벅스 아메리카노",
      imageUrl: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&h=300&fit=crop",
      category: "음료"
    },
    {
      name: "에어팟 프로",
      description: "Apple AirPods Pro 무선 이어폰",
      imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop",
      category: "전자제품"
    },
    {
      name: "나이키 운동화",
      description: "편안하고 스타일리시한 나이키 운동화",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      category: "패션"
    },
    {
      name: "맥북 에어",
      description: "Apple MacBook Air M2 노트북",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
      category: "전자제품"
    },
    {
      name: "아이폰 15",
      description: "최신 iPhone 15 스마트폰",
      imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
      category: "전자제품"
    },
    {
      name: "치킨 세트",
      description: "바삭한 프라이드 치킨 세트",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop",
      category: "음식"
    },
    {
      name: "플레이스테이션 5",
      description: "Sony PlayStation 5 게임 콘솔",
      imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&h=300&fit=crop",
      category: "게임"
    },
    {
      name: "아마존 기프트카드",
      description: "아마존 50달러 기프트카드",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      category: "기프트카드"
    }
  ]
  
  await prisma.product.createMany({
    data: sampleProducts
  })
}