import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 상품 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const productId = resolvedParams.id
    const body = await request.json()
    const { name, description, imageUrl, category, isActive } = body
    
    // 상품 업데이트
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        imageUrl,
        category,
        isActive
      }
    })
    
    // 상품이 비활성화되고 그것이 오늘의 상품이었다면 새로운 상품 선택
    if (!isActive) {
      const today = new Date().toISOString().split('T')[0]
      const dailyProductList = await prisma.dailyProductList.findUnique({
        where: { date: today }
      })
      
      if (dailyProductList && dailyProductList.todayProductId === productId) {
        const activeProducts = await prisma.product.findMany({
          where: { isActive: true }
        })
        
        if (activeProducts.length > 0) {
          const newTodayProduct = activeProducts[Math.floor(Math.random() * activeProducts.length)]
          
          await prisma.dailyProductList.update({
            where: { date: today },
            data: { todayProductId: newTodayProduct.id }
          })
          
          console.log(`Deactivated product was today's product. Selected new product: ${newTodayProduct.name}`)
        }
      }
    }
    
    return NextResponse.json({ 
      message: 'Product updated successfully',
      product 
    })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// 상품 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const productId = resolvedParams.id
    
    // 삭제될 상품이 오늘의 상품인지 확인
    const today = new Date().toISOString().split('T')[0]
    const dailyProductList = await prisma.dailyProductList.findUnique({
      where: { date: today }
    })
    
    // 상품 삭제
    await prisma.product.delete({
      where: { id: productId }
    })
    
    // 삭제된 상품이 오늘의 상품이었다면 새로운 상품 선택
    if (dailyProductList && dailyProductList.todayProductId === productId) {
      const remainingActiveProducts = await prisma.product.findMany({
        where: { isActive: true }
      })
      
      if (remainingActiveProducts.length > 0) {
        const newTodayProduct = remainingActiveProducts[Math.floor(Math.random() * remainingActiveProducts.length)]
        
        await prisma.dailyProductList.update({
          where: { date: today },
          data: { todayProductId: newTodayProduct.id }
        })
        
        console.log(`Deleted product was today's product. Selected new product: ${newTodayProduct.name}`)
      }
    }
    
    return NextResponse.json({ 
      message: 'Product deleted successfully' 
    })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}