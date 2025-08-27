'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function PortalClienteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Portal Cliente Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro no Portal do Cliente</h2>
        <p className="text-gray-600 mb-6">
          Não foi possível carregar o portal do cliente. Verifique sua conexão e tente novamente.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Tentar Novamente
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/auth/signin'}
            className="w-full"
          >
            Voltar ao Login
          </Button>
        </div>
      </div>
    </div>
  )
}
