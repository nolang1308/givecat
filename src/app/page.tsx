'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import CodeGame from '@/components/CodeGame'
import ElectronicBoard from '@/components/ElectronicBoard'
import Advertisement from '@/components/Advertisement'

interface DailyData {
  productName: string
  productImage: string
  successCount: number
  hasSucceeded: boolean
  successfulNicknames: string[]
  codeHash: string
  salt: string
}

interface UpgradeStatus {
  isUpgraded: boolean
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dailyData, setDailyData] = useState<DailyData | null>(null)
  const [upgradeStatus, setUpgradeStatus] = useState<UpgradeStatus>({ isUpgraded: false })
  const [loading, setLoading] = useState(true)
  const [gameCompleted, setGameCompleted] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchDailyData()
    fetchUpgradeStatus()
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

  const fetchUpgradeStatus = async () => {
    try {
      const response = await fetch('/api/upgrade')
      if (response.ok) {
        const data = await response.json()
        setUpgradeStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch upgrade status:', error)
    }
  }

  const handleGameSuccess = () => {
    setGameCompleted(true)
    fetchDailyData()
  }

  const handleUpgradeComplete = () => {
    setUpgradeStatus({ isUpgraded: true })
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
          <div className="header-center">
            <ElectronicBoard successfulNicknames={dailyData.successfulNicknames} />
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

        {/* 액자-고양이-액자 박스 */}
        <div className="game-frames-box">
          <div className="frames-layout">
            {/* 왼쪽 액자 */}
            <div className="frame-item">
              <div className="product-frame">
                <div className="product-image-container">
                  <Image
                    src={dailyData.productImage}
                    alt={dailyData.productName}
                    width={240}
                    height={240}
                    className="object-cover rounded-lg w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-product.jpg'
                    }}
                  />
                </div>
                <div className="product-label">
                  {dailyData.productName}
                </div>
              </div>
            </div>

            {/* 가운데 - 고양이존 */}
            <div className="cat-item">
              <CodeGame 
                onSuccess={handleGameSuccess}
                disabled={gameCompleted}
                codeHash={dailyData.codeHash}
                salt={dailyData.salt}
                isUpgraded={upgradeStatus.isUpgraded}
                onUpgradeComplete={handleUpgradeComplete}
              />
            </div>

            {/* 오른쪽 액자 */}
            <div className="frame-item">
              <div className="product-frame">
                <div className="product-image-container">
                  <Image
                    src={dailyData.productImage}
                    alt={dailyData.productName}
                    width={240}
                    height={240}
                    className="object-cover rounded-lg w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-product.jpg'
                    }}
                  />
                </div>
                <div className="product-label">
                  {dailyData.productName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 박스 밑 - 광고, 편지, 광고 */}
        <div className="bottom-content">
          <div className="bottom-layout">
            {/* 왼쪽 광고 */}
            <div className="ad-item">
              <Advertisement />
            </div>

            {/* 가운데 편지 */}
            <div className="letter-item">
              <div className="letter">
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

            {/* 오른쪽 광고 */}
            <div className="ad-item">
              <Advertisement />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
