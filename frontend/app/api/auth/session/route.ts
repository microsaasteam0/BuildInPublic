import { NextRequest, NextResponse } from 'next/server'

type SessionUser = {
  id?: string | number
  email?: string
}

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const raw = req.cookies.get('upvote_user')?.value
    if (!raw) {
      return NextResponse.json(
        { user: null },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      )
    }

    const parsed = JSON.parse(decodeURIComponent(raw)) as SessionUser
    const user = parsed?.email ? { id: parsed.id ?? '', email: parsed.email } : null

    return NextResponse.json(
      { user },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch {
    return NextResponse.json(
      { user: null },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  }
}
