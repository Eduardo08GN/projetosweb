import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY
const DATABASE_URL = process.env.DATABASE_URL

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, email, whatsapp, fonte, bloco, utmSource, utmMedium, utmCampaign } = body

    if (!nome || !email) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    // Salvar no banco apenas se DATABASE_URL estiver configurada
    if (DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma')
      await prisma.lead.create({
        data: {
          nome,
          email,
          whatsapp: whatsapp || '',
          fonte: fonte || 'formulario',
          bloco: bloco || 'hero',
          utmSource,
          utmMedium,
          utmCampaign,
          pagina: req.headers.get('referer') || '/landing',
        },
      })
    }

    if (BREVO_API_KEY) {
      fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          attributes: { NOME: nome, WHATSAPP: whatsapp },
          listIds: [2],
          updateEnabled: true,
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
