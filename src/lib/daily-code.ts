import moment from 'moment-timezone'
import { prisma } from './prisma'

export function generateRandomCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function getKoreanDate(): string {
  return moment().tz('Asia/Seoul').format('YYYY-MM-DD')
}

export async function getTodayCode() {
  const today = getKoreanDate()
  
  let dailyCode = await prisma.dailyCode.findUnique({
    where: { date: today }
  })
  
  if (!dailyCode) {
    const newCode = generateRandomCode()
    dailyCode = await prisma.dailyCode.create({
      data: {
        date: today,
        code: newCode,
        productName: '오늘의 특별 상품',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
      }
    })
  }
  
  return dailyCode
}

export async function getTodayAttempts() {
  const todayCode = await getTodayCode()
  
  const attempts = await prisma.codeAttempt.findMany({
    where: {
      codeId: todayCode.id,
      success: true
    },
    include: {
      user: {
        select: {
          email: true
        }
      }
    }
  })
  
  return attempts
}

export async function checkUserAttempt(userId: string) {
  if (!userId) {
    console.error('checkUserAttempt: userId is missing')
    return null
  }
  
  const todayCode = await getTodayCode()
  
  const attempt = await prisma.codeAttempt.findUnique({
    where: {
      userId_codeId: {
        userId,
        codeId: todayCode.id
      }
    }
  })
  
  return attempt
}