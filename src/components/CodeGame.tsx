'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { generateRandomCode } from '@/lib/daily-code'

interface CodeGameProps {
  onSuccess: () => void
  disabled: boolean
  codeHash: string
  salt: string
}

export default function CodeGame({ onSuccess, disabled, codeHash, salt }: CodeGameProps) {
  const [currentCode, setCurrentCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [catPressed, setCatPressed] = useState(false) // 고양이가 버튼을 눌렀는지
  const [manualInput, setManualInput] = useState('') // 사용자 직접 입력
  const [isSubmitting, setIsSubmitting] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const generateAndDisplayCode = () => {
    const newCode = generateRandomCode()
    setCurrentCode(newCode)
    return newCode
  }

  const hashCodeClient = async (code: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(code + salt)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  const playSuccessSound = () => {
    // Web Audio API를 사용한 성공 사운드 생성
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // 성공 사운드 (상승하는 멜로디)
      const frequencies = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        oscillator.type = 'triangle'
        
        const startTime = audioContext.currentTime + (index * 0.15)
        const endTime = startTime + 0.3
        
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime)
        
        oscillator.start(startTime)
        oscillator.stop(endTime)
      })
    } catch (error) {
      console.log('Audio not supported:', error)
    }
  }

  const showSuccessNotification = () => {
    // 브라우저 알림 권한 요청 및 표시
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🎉 GIFT CAT', {
          body: '축하합니다! 코드를 맞추셨습니다! 🐱🎁',
          icon: '/cat_2.png',
          tag: 'gift-cat-success'
        })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('🎉 GIFT CAT', {
              body: '축하합니다! 코드를 맞추셨습니다! 🐱🎁',
              icon: '/cat_2.png',
              tag: 'gift-cat-success'
            })
          }
        })
      }
    }
  }

  const checkCode = async (code: string) => {
    // 클라이언트 사이드에서 해시 비교
    const clientHash = await hashCodeClient(code)
    
    if (clientHash === codeHash) {
      // 성공! 사운드와 알림 재생
      playSuccessSound()
      showSuccessNotification()
      
      // 서버에 알림
      try {
        const response = await fetch('/api/attempt-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            attemptedCode: code
          })
        })

        await response.json()
        
        stopGame()
        onSuccess()
        return true
      } catch (error) {
        console.error('Server notification error:', error)
        // 서버 오류가 있어도 사용자에게는 성공 표시
        stopGame()
        onSuccess()
        return true
      }
    }
    return false
  }

  const startGame = () => {
    if (disabled) return

    setIsRunning(true)
    
    intervalRef.current = setInterval(async () => {
      // 고양이가 버튼을 누름
      setCatPressed(true)
      
      // 코드 생성
      const code = generateAndDisplayCode()
      
      // 0.5초 후 고양이 팔 올림
      setTimeout(() => {
        setCatPressed(false)
      }, 500)
      
      // 코드 체크
      await checkCode(code)
    }, 1500) // 1.5초마다 반복
  }

  const stopGame = () => {
    setIsRunning(false)
    setCatPressed(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleManualSubmit = async () => {
    if (!manualInput.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const isSuccess = await checkCode(manualInput.trim())
      if (!isSuccess) {
        // 틀렸을 때 입력 필드 초기화
        setManualInput('')
        alert('틀렸습니다! 다시 시도해보세요 😿')
      }
    } catch (error) {
      console.error('Manual code submission error:', error)
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualSubmit()
    }
  }

  useEffect(() => {
    // 컴포넌트 마운트시 알림 권한 요청
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  if (disabled) {
    return (
        <div className="cat-zone">
          <div className="success-card">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-2xl font-bold mb-2">축하합니다!</p>
            <p>고양이가 선물을 주었어요!</p>
            <div className="text-4xl mt-4">🐱🎁</div>
          </div>
        </div>
    )
  }

  return (
      <div className="cat-zone">
        {/* 말풍선 (고양이 위) */}
        <div className="speech-bubble">
          {currentCode || 'START를 눌러주세요 😸'}
        </div>

        {/* 고양이 이미지 */}
        <div className="flex justify-center mb-6">
          <Image
            src={catPressed ? "/cat_1.png" : "/cat_2.png"}
            alt={catPressed ? "버튼을 누르는 고양이" : "팔을 올린 고양이"}
            width={250}
            height={250}
            className="transition-all duration-300"
          />
        </div>

        {/* 시작/중지 버튼 및 수동 입력 */}
        <div className="flex flex-col items-center gap-4">
          {!isRunning ? (
            <>
              <button
                onClick={startGame}
                className="cozy-btn text-xl px-10 py-4"
              >
                🐾시작🐾
              </button>
              
              {/* 수동 입력 영역 */}
              <div className="manual-input-section">
                <p className="text-sm text-gray-600 mb-2 text-center">
                  또는 직접 코드를 입력해보세요
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value.toLowerCase())}
                    onKeyPress={handleInputKeyPress}
                    placeholder="10자리 코드 입력"
                    maxLength={10}
                    className="px-3 py-2 border border-amber-300 rounded-lg bg-amber-50 focus:outline-none focus:border-amber-500 text-center font-mono text-lg"
                    disabled={isSubmitting}
                  />
                  <button
                    onClick={handleManualSubmit}
                    disabled={!manualInput.trim() || isSubmitting}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '확인중...' : '확인'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={stopGame}
              className="cozy-btn danger text-lg px-8 py-3"
            >
              🐾그만🐾
            </button>
          )}
        </div>
      </div>
  )
}