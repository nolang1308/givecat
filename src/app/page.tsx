'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import GameCenter from '@/components/GameCenter'
import ElectronicBoard from '@/components/ElectronicBoard'

interface DailyData {
  productName: string
  productImage: string
  successCount: number
  hasSucceeded: boolean
  successfulNicknames: string[]
  codeHash: string
  salt: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dailyData, setDailyData] = useState<DailyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [gameCompleted, setGameCompleted] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchDailyData()
  }, [session, status, router])

  const fetchDailyData = async () => {
    try {
      const response = await fetch('/api/daily-code')
      if (response.ok) {
        const data = await response.json()
        setDailyData(data)
        setGameCompleted(data.hasSucceeded)
      }
    } catch (error) {
      console.error('Failed to fetch daily data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGameSuccess = () => {
    setGameCompleted(true)
    fetchDailyData()
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!session || !dailyData) {
    return null
  }

  return (
    <div className="cozy-room">
      <div className="room-content">
        {/* 상단 헤더 */}
        <div className="room-header">
          <div className="welcome-text">
            GIFT CAT
          </div>
          <div className="flex items-center gap-4">
            <span className="welcome-text text-base">
              {session.user?.nickname}님 어서오세요! 🏠
            </span>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              나가기
            </button>
          </div>
        </div>

        {/* 벽에 걸린 전광판 */}
        <ElectronicBoard successfulNicknames={dailyData.successfulNicknames} />

        {/* 통합된 게임 센터 */}
        <GameCenter 
          productName={dailyData.productName}
          productImage={dailyData.productImage}
          onSuccess={handleGameSuccess}
          disabled={gameCompleted}
          codeHash={dailyData.codeHash}
          salt={dailyData.salt}
        />
      </div>
    </div>
  )
}
