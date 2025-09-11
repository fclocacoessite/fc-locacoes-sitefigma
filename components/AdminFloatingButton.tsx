'use client'

import { useAuth } from '@/app/providers'
import Link from 'next/link'
import { Shield, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function AdminFloatingButton() {
  const { session, user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Mostrar o botão apenas se não estiver logado e não foi dispensado
  useEffect(() => {
    if (!session && !isDismissed) {
      // Mostrar após 3 segundos para não ser muito intrusivo
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [session, isDismissed])

  // Não mostrar se estiver logado ou foi dispensado
  if (session || isDismissed || !isVisible) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
    // Salvar no localStorage para não mostrar novamente na sessão
    localStorage.setItem('admin-floating-dismissed', 'true')
  }

  // Verificar se foi dispensado anteriormente
  useEffect(() => {
    const dismissed = localStorage.getItem('admin-floating-dismissed')
    if (dismissed === 'true') {
      setIsDismissed(true)
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-sm">Área Administrativa</span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-xs text-gray-300 mb-3">
          Acesso rápido ao painel administrativo
        </p>
        
        <div className="flex space-x-2">
          <Link
            href="/admin/login"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-xs font-medium transition-colors text-center"
          >
            Fazer Login
          </Link>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            Depois
          </button>
        </div>
      </div>
    </div>
  )
}
