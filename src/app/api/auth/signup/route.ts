import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API called')
    const { email, nickname, password } = await request.json()
    console.log('Request data:', { email, nickname, password: '***' })

    if (!email || !nickname || !password) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: '이메일, 닉네임, 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    console.log('Checking for existing user...')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    console.log('Existing user check result:', !!existingUser)

    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 400 }
      )
    }

    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Password hashed successfully')

    console.log('Creating user...')
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      }
    })
    console.log('User created successfully:', user.id)

    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error details:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}