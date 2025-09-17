'use client'

import { useEffect } from 'react'

interface GoogleAdsenseProps {
  adSlot: string
  adFormat?: string
  responsive?: boolean
  className?: string
}

export default function GoogleAdsense({ 
  adSlot, 
  adFormat = 'auto',
  responsive = true,
  className = ''
}: GoogleAdsenseProps) {
  useEffect(() => {
    try {
      // @ts-expect-error - Google AdSense global object
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-expect-error - Google AdSense push method
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  // 개발 모드에서 플레이스홀더 표시
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment) {
    return (
      <div className={`adsense-container ${className}`}>
        <div 
          className="bg-orange-100 border-2 border-orange-300 border-dashed rounded-lg p-4 text-center text-orange-600 font-semibold"
          style={{ minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
        >
          <div className="text-2xl mb-2">📢</div>
          <div>Google AdSense</div>
          <div className="text-sm mt-1">({adFormat} 광고)</div>
          <div className="text-xs mt-2 opacity-70">슬롯: {adSlot}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9734166484318003" // layout.tsx에 있는 실제 클라이언트 ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}

// 사이드바 광고 컴포넌트
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <GoogleAdsense
      adSlot="1234567890" // AdSense 승인 후 실제 슬롯 ID로 교체
      adFormat="auto"
      className={`sidebar-ad ${className}`}
    />
  )
}

// 배너 광고 컴포넌트
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <GoogleAdsense
      adSlot="0987654321" // AdSense 승인 후 실제 슬롯 ID로 교체
      adFormat="auto"
      className={`banner-ad ${className}`}
    />
  )
}

// 정사각형 광고 컴포넌트
export function SquareAd({ className = '' }: { className?: string }) {
  return (
    <GoogleAdsense
      adSlot="1357924680" // AdSense 승인 후 실제 슬롯 ID로 교체
      adFormat="auto"
      className={`square-ad ${className}`}
    />
  )
}