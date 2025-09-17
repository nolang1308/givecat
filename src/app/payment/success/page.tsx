'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const paymentKey = searchParams.get('paymentKey')
        const orderId = searchParams.get('orderId')
        const amount = searchParams.get('amount')

        if (!paymentKey || !orderId || !amount) {
          setError('결제 정보가 없습니다.')
          return
        }

        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount)
          })
        })

        const result = await response.json()

        if (response.ok) {
          setSuccess(true)
        } else {
          setError(result.error || '결제 처리에 실패했습니다.')
        }
      } catch (error) {
        console.error('Payment confirmation error:', error)
        setError('결제 처리 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    confirmPayment()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">결제를 처리하고 있습니다...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">결제 실패</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={() => router.push('/upgrade')}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🎉 결제 성공!</h2>
            <p className="mb-4">업그레이드가 완료되었습니다!</p>
            <p className="text-sm">이제 고양이가 더 빠르게 버튼을 누를 수 있어요.</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-6 bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 text-lg"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return null
}