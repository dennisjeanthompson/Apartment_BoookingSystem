import { NextResponse } from 'next/server'

// 1x1 transparent PNG (smallest possible) as favicon substitute
const base64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='

export async function GET() {
  const buffer = Buffer.from(base64, 'base64')
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}
