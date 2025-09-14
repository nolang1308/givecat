'use client'

import { useState } from 'react'

interface CatButtonProps {
  onClick: () => void
  disabled?: boolean
  isGenerating?: boolean
}

export default function CatButton({ onClick, disabled = false, isGenerating = false }: CatButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    if (disabled || isGenerating) return
    
    setIsPressed(true)
    onClick()
    
    // 애니메이션 후 원래 상태로 복원
    setTimeout(() => {
      setIsPressed(false)
    }, 800)
  }

  return (
    <div className="cat-button-container">
      <button 
        onClick={handleClick}
        disabled={disabled || isGenerating}
        className="cat-button"
      >
        {/* 고양이 이미지 */}
        <div className={`cat-sprite ${isPressed || isGenerating ? 'pressing' : 'idle'}`}>
          🐱
        </div>
        
        {/* 버튼 */}
        <div className={`red-button ${isPressed || isGenerating ? 'pressed' : ''}`}>
          🔴
        </div>
        
        {/* 텍스트 */}
        <div className="cat-button-text">
          {isGenerating ? '코드 생성 중...' : '고양이가 선물을 줄게요!'}
        </div>
        
        {/* 선물 이펙트 */}
        {isPressed && (
          <div className="gift-effect">
            🎁✨
          </div>
        )}
      </button>
    </div>
  )
}