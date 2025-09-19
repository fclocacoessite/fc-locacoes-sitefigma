import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ConsignFloatingButton } from '@/components/ConsignFloatingButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FC Locações - Locação de Veículos',
  description: 'Soluções completas em locação de veículos para sua empresa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
          <ConsignFloatingButton />
        </Providers>
      </body>
    </html>
  )
} 