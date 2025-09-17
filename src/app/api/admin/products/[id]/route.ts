import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 상품 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, imageUrl, category, isActive } = body
    
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        imageUrl,
        category,
        isActive
      }
    })
    
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id }
    })
    
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