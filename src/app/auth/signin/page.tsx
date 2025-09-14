'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [catPressed, setCatPressed] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-room">
      <div className="auth-split-layout">
        {/* 왼쪽: 거대한 고양이와 PUSH 버튼 */}
        <div className="auth-cat-section">
          <div className="giant-cat-container">
            <Image
              src={catPressed ? "/cat_1.png" : "/cat_2.png"}
              alt={catPressed ? "버튼을 누르는 고양이" : "팔을 올린 고양이"}
              width={500}
              height={500}
              className="giant-cat-image"
            />
            <button
              className="push-button"
              onMouseDown={() => setCatPressed(true)}
              onMouseUp={() => setCatPressed(false)}
              onMouseLeave={() => setCatPressed(false)}
              onTouchStart={() => setCatPressed(true)}
              onTouchEnd={() => setCatPressed(false)}
            >
              PUSH
            </button>
          </div>
        </div>

        {/* 오른쪽: 로그인 폼 */}
        <div className="auth-form-section">
          <div className="auth-form">
            <div className="mb-8">
              <h2 className="auth-title">
                GIFT CAT
              </h2>
              <p className="auth-subtitle">
                따뜻한 방에서 고양이에게 선물을 받아보아요!
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="auth-label">
                    이메일
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="auth-input"
                    placeholder="이메일을 입력해주세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="auth-label">
                    비밀번호
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="auth-input"
                    placeholder="비밀번호를 입력해주세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-btn"
                >
                  {loading ? '🐾 입장 중...' : '🐾 방에 들어가기 🐾'}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="auth-link-text">
                  아직 계정이 없나요? {' '}
                  <Link href="/auth/signup" className="auth-link">
                    회원가입하고 들어가기
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}