# 실제 결제 시스템 연동 가이드

현재 구현된 업그레이드 기능은 시뮬레이션이며, 실제 결제를 위해서는 다음과 같은 결제 서비스를 연동할 수 있습니다.

## 1. Stripe 연동 (추천)

### 설치
```bash
npm install stripe @stripe/stripe-js
```

### 환경 변수 설정 (.env)
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 백엔드 API 수정 (`/api/upgrade/route.ts`)
```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Stripe Checkout Session 생성
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: '고양이 속도 업그레이드',
              description: '고양이가 버튼을 누르는 속도를 3배 향상시킵니다',
            },
            unit_amount: 100, // $1.00 = 100 cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`,
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url 
    })

  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Payment setup failed' }, { status: 500 })
  }
}
```

### Webhook 처리 (`/api/webhooks/stripe/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.log('Webhook signature verification failed.', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  // 결제 완료 처리
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId

    if (userId) {
      // 사용자 업그레이드 상태 업데이트
      await prisma.user.update({
        where: { id: userId },
        data: { isUpgraded: true }
      })
    }
  }

  return NextResponse.json({ received: true })
}
```

### 프론트엔드 수정 (`PaymentModal.tsx`)
```typescript
const handleConfirm = async () => {
  setIsProcessing(true)
  try {
    const response = await fetch('/api/upgrade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()

    if (data.checkoutUrl) {
      // Stripe Checkout으로 리다이렉트
      window.location.href = data.checkoutUrl
    } else {
      throw new Error('결제 설정에 실패했습니다.')
    }
  } catch (error) {
    console.error('Payment error:', error)
    alert('결제 처리 중 오류가 발생했습니다.')
  } finally {
    setIsProcessing(false)
  }
}
```

## 2. PayPal 연동

### 설치
```bash
npm install @paypal/react-paypal-js
```

### PayPal 버튼 컴포넌트
```typescript
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"

const PayPalPayment = ({ onSuccess }: { onSuccess: () => void }) => {
  return (
    <PayPalScriptProvider options={{ 
      "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
      currency: "USD"
    }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: "1.00",
                currency_code: "USD"
              },
              description: "고양이 속도 업그레이드"
            }]
          })
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order?.capture()
          if (order?.status === 'COMPLETED') {
            // 백엔드에 결제 완료 알림
            await fetch('/api/upgrade', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                paypalOrderId: order.id,
                paymentMethod: 'paypal'
              })
            })
            onSuccess()
          }
        }}
      />
    </PayPalScriptProvider>
  )
}
```

## 3. 국내 결제 (토스페이먼츠)

### 설치
```bash
npm install @tosspayments/payment-sdk
```

### 토스페이먼츠 연동
```typescript
import { loadTossPayments } from '@tosspayments/payment-sdk'

const handleTossPayment = async () => {
  const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!)
  
  tossPayments.requestPayment('카드', {
    amount: 1000, // 1000원
    orderId: `upgrade_${Date.now()}`,
    orderName: '고양이 속도 업그레이드',
    customerName: session.user.nickname,
    successUrl: `${window.location.origin}/payment/success`,
    failUrl: `${window.location.origin}/payment/fail`,
  })
}
```

## 구현 순서

1. **결제 서비스 선택**: Stripe (해외), 토스페이먼츠 (국내) 등
2. **계정 생성 및 API 키 발급**
3. **환경 변수 설정**
4. **백엔드 API 수정**: 결제 세션 생성 로직
5. **Webhook 설정**: 결제 완료 시 자동 업그레이드 처리
6. **프론트엔드 수정**: 결제 버튼 및 리다이렉트 로직
7. **테스트**: 테스트 결제로 전체 플로우 검증
8. **운영 배포**: 실제 결제 키로 변경

## 보안 고려사항

- API 키는 반드시 환경 변수로 관리
- Webhook 서명 검증 필수
- 결제 금액은 서버에서 검증
- 결제 완료 후 중복 처리 방지
- HTTPS 필수

## 현재 시뮬레이션에서 실제 결제로 전환

현재 `/api/upgrade` 엔드포인트의 간단한 업그레이드 로직을 위의 결제 서비스 로직으로 교체하면 됩니다.