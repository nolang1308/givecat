'use client'

import { useState } from 'react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function PaymentModal({ isOpen, onClose, onConfirm }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="payment-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="payment-modal">
        {/* 모달 헤더 */}
        <div className="payment-modal-header">
          <h2 className="payment-modal-title">🚀 속도 업그레이드</h2>
          <button 
            className="payment-modal-close"
            onClick={onClose}
            disabled={isProcessing}
          >
            ✕
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="payment-modal-body">
          <div className="upgrade-info">
            <div className="upgrade-icon">⚡</div>
            <h3>고양이 속도 3배 향상!</h3>
            <p>고양이가 버튼을 누르는 속도가 빨라집니다</p>
          </div>

          <div className="speed-comparison">
            <div className="speed-item">
              <div className="speed-label">현재 속도</div>
              <div className="speed-value">1초</div>
              <div className="speed-desc">코드 생성</div>
            </div>
            <div className="speed-arrow">→</div>
            <div className="speed-item upgrade">
              <div className="speed-label">업그레이드 후</div>
              <div className="speed-value">0.3초</div>
              <div className="speed-desc">코드 생성</div>
            </div>
          </div>

          <div className="price-info">
            <div className="price">$1.00</div>
            <div className="price-desc">일회성 결제</div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="payment-modal-footer">
          <button 
            className="payment-btn cancel"
            onClick={onClose}
            disabled={isProcessing}
          >
            취소
          </button>
          <button 
            className="payment-btn confirm"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? '처리 중...' : '결제하기'}
          </button>
        </div>
      </div>
    </div>
  )
}