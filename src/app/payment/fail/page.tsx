'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function PaymentFailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const message = searchParams.get('message') || '결제가 취소되었습니다.'
  const code = searchParams.get('code')

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">❌ 결제 실패</h2>
          <p className="mb-4">{message}</p>
          {code && (
            <p className="text-sm text-gray-600">오류 코드: {code}</p>
          )}
        </div>
        <div className="mt-6 space-x-4">
          <button
            onClick={() => router.push('/upgrade')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <PaymentFailContent />
    </Suspense>
  )
}