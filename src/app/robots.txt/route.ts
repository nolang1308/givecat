export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${process.env.SITE_URL || 'http://localhost:3000'}/sitemap.xml`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}