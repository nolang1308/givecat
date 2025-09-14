import nodemailer from 'nodemailer'

interface WinnerNotificationData {
  userEmail: string
  nickname: string
  correctTime: string
  correctCode: string
  todayProduct: string
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
})

export async function sendWinnerNotification(data: WinnerNotificationData) {
  try {
    console.log('🔔 Sending winner notification email...')
    console.log('📧 From:', process.env.GMAIL_USER)
    console.log('📧 To:', process.env.ADMIN_EMAIL)
    console.log('👤 Winner data:', data)

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '🎉 GIFT CAT 당첨자 알림',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: #78350f; font-size: 28px; margin: 0;">🎉 GIFT CAT 당첨자 발생!</h1>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color: #ea580c; margin-bottom: 20px;">당첨자 정보</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">이메일:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${data.userEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">닉네임:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${data.nickname}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">맞춘 시간:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${data.correctTime}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">맞춘 코드:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-family: monospace; background: #f9fafb; padding: 8px; border-radius: 4px;">${data.correctCode}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151;">오늘의 선물:</td>
                <td style="padding: 10px 0; color: #111827; font-weight: bold; color: #ea580c;">${data.todayProduct}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #fef9f3; border-radius: 8px; border-left: 4px solid #ea580c;">
            <p style="margin: 0; color: #78350f; font-size: 14px;">
              🐱 고양이가 성공적으로 코드를 맞춘 새로운 당첨자가 나타났습니다! 
              선물 발송을 위해 당첨자에게 연락해주세요.
            </p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Winner notification email sent successfully!')
    console.log('📨 Message ID:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Failed to send winner notification email:', error)
    console.error('🔍 Error details:', error instanceof Error ? error.message : String(error))
    return { success: false, error: error }
  }
}