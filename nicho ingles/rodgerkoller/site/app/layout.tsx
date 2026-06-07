import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Curso de Inglês Online — Método Koller | Rodger Koller',
  description:
    'Aprenda inglês com o Método Koller. Professor certificado Cambridge (CPE+CELTA), +34.000 alunos. Acesso vitalício + acompanhamento pessoal por 1 ano.',
  openGraph: {
    type: 'website',
    title: 'Método Koller — Fale Inglês com Quem Tem CPE de Cambridge',
    description:
      '+34.000 alunos. Acesso vitalício. Acompanhamento pessoal por 1 ano. Garantia de 7 dias.',
    images: ['/images/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
