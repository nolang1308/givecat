'use client'

import { useState, useEffect } from 'react'

interface ElectronicBoardProps {
  successfulEmails: string[]
}

export default function ElectronicBoard({ successfulEmails }: ElectronicBoardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (successfulEmails.length === 0) return

    const interval = setInterval(() => {
      setFade(false) // 먼저 서서히 사라지게
      setTimeout(() => {
        // 인덱스 변경
        setCurrentIndex((prev) => (prev + 1) % successfulEmails.length)
        setFade(true) // 다시 서서히 나타나게
      }, 1000) // fade-out 시간 (1초)
    }, 4000) // 총 주기 (나타남+유지+사라짐)

    return () => clearInterval(interval)
  }, [successfulEmails])

  if (successfulEmails.length === 0) {
    return (
        <div className="wall-board">
          <div className="board-text">코드를 맞춘 사람이 없습니다.</div>
        </div>
    )
  }

  return (
      <div className="wall-board">
        <div
            className={`board-text transition-opacity duration-1000 ${
                fade ? 'opacity-100' : 'opacity-0'
            }`}
        >
          🎉 {successfulEmails[currentIndex]}님이 코드를 맞추셨습니다!
        </div>
      </div>
  )
}