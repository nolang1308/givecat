import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 모든 상품 조회
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// 새 상품 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, imageUrl, category } = body
    
    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: 'Name and imageUrl are required' },
        { status: 400 }
      )
    }
    
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        imageUrl,
        category: category || '',
        isActive: true
      }
    })
    
    return NextResponse.json({ 
      message: 'Product created successfully',
      product 
    })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}