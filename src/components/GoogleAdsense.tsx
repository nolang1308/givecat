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

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // 여기에 실제 AdSense 클라이언트 ID를 넣어야 합니다
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
      adSlot="1234567890" // 실제 광고 슬롯 ID로 교체 필요
      adFormat="vertical"
      className={`neuro-adsense ${className}`}
    />
  )
}

// 배너 광고 컴포넌트
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <GoogleAdsense
      adSlot="0987654321" // 실제 광고 슬롯 ID로 교체 필요
      adFormat="horizontal"
      className={`neuro-adsense ${className}`}
    />
  )
}

// 정사각형 광고 컴포넌트
export function SquareAd({ className = '' }: { className?: string }) {
  return (
    <GoogleAdsense
      adSlot="1357924680" // 실제 광고 슬롯 ID로 교체 필요
      adFormat="rectangle"
      className={`neuro-adsense ${className}`}
    />
  )
}