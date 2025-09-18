import { NextRequest, NextResponse } from 'next/server'

interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ContactPayload>

    const requiredFields: Array<keyof ContactPayload> = ['name', 'email', 'subject', 'message']
    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === 'string' && body[field]!.trim().length === 0)) {
        return NextResponse.json({ error: `Campo obrigatório: ${field}` }, { status: 400 })
      }
    }

    if (!isValidEmail(String(body.email))) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
    }

    const toEmail = process.env.CONTACT_TO || 'comercial@fclocacoes.com.br'
    const fromEmail = process.env.CONTACT_FROM || 'no-reply@fclocacoes.com.br'
    const resendApiKey = process.env.RESEND_API_KEY

    const subject = `[Contato] ${body.subject} - ${body.name}`
    const text = `Nova mensagem de contato\n\nNome: ${body.name}\nE-mail: ${body.email}\nTelefone: ${body.phone || '-'}\nAssunto: ${body.subject}\n\nMensagem:\n${body.message}`
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${body.name}</p>
        <p><strong>E-mail:</strong> ${body.email}</p>
        <p><strong>Telefone:</strong> ${body.phone || '-'}</p>
        <p><strong>Assunto:</strong> ${body.subject}</p>
        <hr />
        <p style="white-space: pre-wrap;">${body.message}</p>
      </div>
    `

    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          subject,
          text,
          html
        })
      })

      if (!response.ok) {
        const details = await response.text().catch(() => 'Erro desconhecido')
        return NextResponse.json({ error: 'Falha ao enviar e-mail', details }, { status: 502 })
      }
    } else {
      console.warn('RESEND_API_KEY não configurada. Mensagem de contato não foi enviada por e-mail.')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao processar contato:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


