'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description?: string
  imageUrl: string
  category?: string
}

interface DailyProductsResponse {
  date: string
  products: Product[]
  todayProduct: Product
}

export default function DailyProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [todayProduct, setTodayProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDailyProducts()
  }, [])

  const fetchDailyProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/daily-products')
      if (!response.ok) {
        throw new Error('상품 목록을 불러오는데 실패했습니다.')
      }
      const data: DailyProductsResponse = await response.json()
      setProducts(data.products)
      setTodayProduct(data.todayProduct)
    } catch (error) {
      console.error('Error fetching daily products:', error)
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="daily-products-container">
        <h3 className="daily-products-title">🎁 오늘의 상품 목록</h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="daily-products-container">
        <h3 className="daily-products-title">🎁 오늘의 상품 목록</h3>
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="daily-products-container">
      <h3 className="daily-products-title">🎁 오늘의 상품 목록</h3>
      <p className="daily-products-subtitle">
        고양이가 코드를 맞추면 <strong>오늘의 상품</strong>을 선물해드립니다!
      </p>
      
      <div className="products-grid">
        {products.map((product, index) => {
          const isTodayProduct = todayProduct?.id === product.id
          return (
          <div key={product.id} className={`product-card ${isTodayProduct ? 'today-product' : ''}`}>
            <div className="product-image-wrapper">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={120}
                height={120}
                className="product-image"
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 이미지로 대체
                  e.currentTarget.src = '/cat_2.png'
                }}
              />
              <div className="product-number">{index + 1}</div>
              {isTodayProduct && <div className="today-badge">오늘의 상품</div>}
            </div>
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              {product.description && (
                <p className="product-description">{product.description}</p>
              )}
              {product.category && (
                <span className="product-category">{product.category}</span>
              )}
            </div>
          </div>
          )
        })}
      </div>
      
      <div className="products-note">
        <p className="text-sm text-orange-600">
          ⏰ 매일 밤 12시에 새로운 상품 목록으로 업데이트됩니다
        </p>
      </div>
    </div>
  )
}