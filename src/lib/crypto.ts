import crypto from 'crypto'

// 서버에서만 사용 (실제 코드 해싱)
export function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code + process.env.NEXTAUTH_SECRET).digest('hex')
}

// 클라이언트에서 사용 (브라우저 호환)
export async function hashCodeClient(code: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(code + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}