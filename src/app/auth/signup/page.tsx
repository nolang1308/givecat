'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [catPressed, setCatPressed] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자리 이상이어야 합니다.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          nickname,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '회원가입에 실패했습니다.')
      }

      alert('회원가입이 완료되었습니다! 로그인해주세요.')
      router.push('/auth/signin')
    } catch (error) {
      setError(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.')
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

        {/* 오른쪽: 회원가입 폼 */}
        <div className="auth-form-section">
          <div className="auth-form">
            <div className="mb-8">
              <h2 className="auth-title">
                GIFT CAT
              </h2>
              <p className="auth-subtitle">
                따뜻한 방에 함께 들어와서 고양이와 놀아요!
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
                  <p className="text-sm text-orange-600 mb-2 font-medium">
                    ⚠️ 이메일은 선물받기에 사용되니 정확하게 입력해주시기 바랍니다.
                  </p>
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
                  <label htmlFor="nickname" className="auth-label">
                    닉네임
                  </label>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    required
                    className="auth-input"
                    placeholder="닉네임을 입력해주세요"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
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
                    placeholder="비밀번호를 입력해주세요 (6자리 이상)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="auth-label">
                    비밀번호 확인
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="auth-input"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-btn"
                >
                  {loading ? '🐾 가입 중...' : '🐾 방 만들고 들어가기 🐾'}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="auth-link-text">
                  이미 방에 들어온 적이 있나요? {' '}
                  <Link href="/auth/signin" className="auth-link">
                    기존 방으로 들어가기
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