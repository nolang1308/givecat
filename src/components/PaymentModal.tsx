'use client'

import { useState, useEffect } from 'react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function PaymentModal({ isOpen, onClose, onConfirm }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isProcessing, onClose])

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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose()
    }
  }

  return (
    <>
      {/* 모달 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={handleOverlayClick}
      >
        {/* 모달 컨테이너 */}
        <div className="bg-orange-50 rounded-2xl shadow-2xl border-3 border-orange-500 w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* 모달 헤더 */}
          <div className="flex justify-between items-center p-6 bg-orange-100 border-b-2 border-orange-200 rounded-t-2xl">
            <h2 className="text-xl font-bold text-orange-900 flex items-center gap-2">
              🚀 속도 업그레이드
            </h2>
            <button 
              className="w-8 h-8 rounded-full bg-orange-200 hover:bg-orange-300 flex items-center justify-center text-orange-800 font-bold transition-all duration-200 disabled:opacity-50"
              onClick={onClose}
              disabled={isProcessing}
            >
              ✕
            </button>
          </div>

          {/* 모달 본문 */}
          <div className="p-6 text-center">
            {/* 업그레이드 정보 */}
            <div className="mb-6">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-orange-700 mb-2">
                고양이 속도 3배 향상!
              </h3>
              <p className="text-orange-600">
                고양이가 버튼을 누르는 속도가 빨라집니다
              </p>
            </div>

            {/* 속도 비교 */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border-2 border-orange-200 flex-1 max-w-[120px]">
                <div className="text-xs text-orange-600 font-semibold mb-1">현재 속도</div>
                <div className="text-xl font-bold text-orange-700 mb-1">1초</div>
                <div className="text-xs text-orange-500">코드 생성</div>
              </div>
              <div className="text-xl font-bold text-orange-600">→</div>
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-400 flex-1 max-w-[120px]">
                <div className="text-xs text-green-600 font-semibold mb-1">업그레이드 후</div>
                <div className="text-xl font-bold text-green-600 mb-1">0.3초</div>
                <div className="text-xs text-green-500">코드 생성</div>
              </div>
            </div>

            {/* 가격 정보 */}
            <div className="bg-orange-500 rounded-xl p-6 text-white mb-6">
              <div className="text-3xl font-bold mb-1">$1.00</div>
              <div className="text-orange-100">일회성 결제</div>
            </div>
          </div>

          {/* 모달 푸터 */}
          <div className="flex gap-3 p-6 bg-orange-100 border-t-2 border-orange-200 rounded-b-2xl">
            <button 
              className="flex-1 py-3 px-4 bg-white text-orange-700 font-semibold rounded-xl border-2 border-orange-300 hover:bg-orange-50 transition-all duration-200 disabled:opacity-50"
              onClick={onClose}
              disabled={isProcessing}
            >
              취소
            </button>
            <button 
              className="flex-1 py-3 px-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 shadow-lg"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? '처리 중...' : '결제하기'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}