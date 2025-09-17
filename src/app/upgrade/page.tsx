'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function UpgradePage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [upgradeStatus, setUpgradeStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const router = useRouter()
  const { data: session, update } = useSession()

  const handleUpgrade = async () => {
    if (!session?.user) {
      alert('로그인이 필요합니다.')
      router.push('/auth/signin')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setUpgradeStatus('success')
        // 세션 업데이트
        await update()
        // 3초 후 메인 페이지로 이동
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        setUpgradeStatus('error')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      setUpgradeStatus('error')
    } finally {
      setIsProcessing(false)
    }
  }

  if (upgradeStatus === 'success') {
    return (
      <div className="cozy-room">
        <div className="room-content">
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-green-50 border-4 border-green-400 rounded-3xl p-8 max-w-md text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold text-green-700 mb-4">
                업그레이드 완료!
              </h1>
              <p className="text-green-600 mb-4">
                고양이 속도가 3배 빨라졌습니다!<br/>
                3초 후 메인 페이지로 이동합니다.
              </p>
              <div className="text-sm text-green-500">
                0.3초마다 코드가 생성됩니다 ⚡
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cozy-room">
      <div className="room-content">
        <div className="min-h-screen py-8">
          {/* 뒤로가기 버튼 */}
          <div className="max-w-4xl mx-auto px-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-300 rounded-xl text-orange-700 font-semibold hover:bg-orange-50 transition-all duration-200"
            >
              ← 뒤로가기
            </button>
          </div>

          {/* 업그레이드 페이지 메인 */}
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-orange-50 border-4 border-orange-400 rounded-3xl p-8 text-center">
              {/* 헤더 */}
              <div className="mb-8">
                <div className="text-6xl mb-4">🚀</div>
                <h1 className="text-3xl font-bold text-orange-700 mb-2">
                  속도 업그레이드
                </h1>
                <p className="text-orange-600 text-lg">
                  고양이의 코드 생성 속도를 3배 빠르게 만들어보세요!
                </p>
              </div>

              {/* 기능 설명 */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border-2 border-orange-200">
                  <div className="text-3xl mb-3">🐱</div>
                  <h3 className="text-lg font-bold text-orange-700 mb-2">현재 속도</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-1">1초</div>
                  <p className="text-orange-500 text-sm">코드 생성 간격</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-400">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="text-lg font-bold text-green-700 mb-2">업그레이드 후</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">0.3초</div>
                  <p className="text-green-500 text-sm">코드 생성 간격</p>
                </div>
              </div>

              {/* 혜택 목록 */}
              <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 mb-8">
                <h3 className="text-lg font-bold text-orange-700 mb-4">🎁 업그레이드 혜택</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-orange-700">코드 생성 속도 <strong>3배 향상</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-orange-700">더 빠른 게임 진행</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-orange-700">영구적인 업그레이드</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    <span className="text-orange-700">일회성 결제</span>
                  </div>
                </div>
              </div>

              {/* 가격 및 결제 */}
              <div className="bg-orange-500 rounded-2xl p-6 text-white mb-6">
                <div className="text-4xl font-bold mb-2">$1.00</div>
                <div className="text-orange-100 mb-4">일회성 결제</div>
                <div className="text-sm text-orange-200">
                  * 실제 결제는 되지 않으며, 데모용입니다
                </div>
              </div>

              {/* 결제 버튼 */}
              {upgradeStatus === 'error' && (
                <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 mb-4">
                  <p className="text-red-700">업그레이드 중 오류가 발생했습니다. 다시 시도해주세요.</p>
                </div>
              )}

              <button
                onClick={handleUpgrade}
                disabled={isProcessing}
                className="w-full py-4 bg-orange-600 text-white font-bold text-xl rounded-2xl hover:bg-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    처리 중...
                  </div>
                ) : (
                  '지금 업그레이드하기 🚀'
                )}
              </button>

              <p className="text-sm text-orange-600 mt-4">
                업그레이드는 즉시 적용되며, 계정에 영구히 저장됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}