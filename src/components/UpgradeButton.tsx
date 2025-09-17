'use client'

import { useRouter } from 'next/navigation'

interface UpgradeButtonProps {
  isUpgraded: boolean
}

export default function UpgradeButton({ isUpgraded }: UpgradeButtonProps) {
  const router = useRouter()

  const handleButtonClick = () => {
    if (isUpgraded) return
    router.push('/upgrade')
  }

  return (
    <div className="relative group">
      <button 
        className={`upgrade-btn ${isUpgraded ? 'upgraded' : ''}`}
        disabled={isUpgraded}
        onClick={handleButtonClick}
      >
        {isUpgraded ? '⚡' : '🚀'}
      </button>
      
      {/* 호버 툴팁 */}
      <div className="tooltip group-hover:opacity-100 group-hover:visible">
        {isUpgraded 
          ? '업그레이드 완료! 3배 빠른 속도'
          : '고양이가 버튼을 누르는 속도를 향상시킵니다.'
        }
      </div>
    </div>
  )
}