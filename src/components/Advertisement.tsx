'use client'

import { SidebarAd, SquareAd } from './GoogleAdsense'

interface AdProps {
  position: 'left' | 'right'
}

export default function Advertisement({ position }: AdProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold neuro-text-light">광고</h3>
      </div>
      
      {/* Google AdSense 사이드바 광고 */}
      <SidebarAd className="sidebar-ad" />
      
      {/* Google AdSense 정사각형 광고 */}
      <SquareAd className="square-ad" />
      
      {/* 추가 사이드바 광고 */}
      <SidebarAd className="sidebar-ad" />
    </div>
  )
}