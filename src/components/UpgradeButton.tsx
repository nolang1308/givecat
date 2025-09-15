'use client'

import { useState } from 'react'
import PaymentModal from './PaymentModal'

interface UpgradeButtonProps {
  isUpgraded: boolean
  onUpgrade: () => void
}

export default function UpgradeButton({ isUpgraded, onUpgrade }: UpgradeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleButtonClick = () => {
    if (isUpgraded) return
    setIsModalOpen(true)
  }

  const handleModalConfirm = async () => {
    try {
      const response = await fetch('/api/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.success) {
        onUpgrade()
        // 성공 알림을 여기서 표시할 수도 있습니다
      } else {
        throw new Error(data.error || '업그레이드 처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('업그레이드 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
      throw error // PaymentModal에서 에러 처리를 위해 다시 throw
    }
  }

  return (
    <>
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

      {/* 결제 모달 */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </>
  )
}