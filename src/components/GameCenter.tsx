'use client'

import Image from 'next/image'
import CodeGame from '@/components/CodeGame'
import Advertisement from '@/components/Advertisement'

interface GameCenterProps {
  productName: string
  productImage: string
  onSuccess: () => void
  disabled: boolean
  codeHash: string
  salt: string
}

export default function GameCenter({ 
  productName, 
  productImage, 
  onSuccess, 
  disabled, 
  codeHash, 
  salt 
}: GameCenterProps) {
  return (
    <div className="game-center">
      {/* 상품 정보 섹션 */}
      <div className="product-display">
        <h2 className="product-title">🎁 오늘의 상품 🎁</h2>
        <div className="product-showcase">
          <div className="product-frame-center">
            <div className="product-image-container-center">
              <Image
                src={productImage}
                alt={productName}
                width={300}
                height={300}
                className="object-cover rounded-lg w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-product.jpg'
                }}
              />
            </div>
            <div className="product-label-center">
              {productName}
            </div>
          </div>
        </div>
      </div>

      {/* 게임 섹션 */}
      <div className="game-section">
        <CodeGame 
          onSuccess={onSuccess}
          disabled={disabled}
          codeHash={codeHash}
          salt={salt}
        />
        
        <div className="game-instructions">
          {"고양이가 버튼을 눌러 코드를 생성합니다."}
          <br />
          {"코드는 알파벳 a~z, 숫자 0~9로 구성된 10자리 코드이며"}
          <br/>
          {"매일 밤 한국시 기준 00시 00분에 상품과 코드가 랜덤으로 바뀌게 됩니다."}
          <br />
          {"고양이가 코드를 맞추면, 오늘의 상품을 선물합니다."}
          <br />
          {"고양이를 멈추거나, 사이트를 나가면 고양이가 버튼을 누르지 않습니다."}
        </div>
      </div>

      {/* 광고 섹션 */}
      <div className="ads-section">
        <Advertisement />
      </div>
    </div>
  )
}