import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Database connection test started')
    
    // Test database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Database connection successful:', result)
    
    // Test user table structure
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      result
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 })
  }
}