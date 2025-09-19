'use client'

import Link from 'next/link'
import { Truck, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ConsignFloatingButton() {
  const [isDismissed, setIsDismissed] = useState(false)

  // Debug log
  console.log('ConsignFloatingButton renderizado, isDismissed:', isDismissed)

  // Não mostrar se foi dispensado
  if (isDismissed) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    // Salvar no localStorage para não mostrar novamente na sessão
    if (typeof window !== 'undefined') {
      localStorage.setItem('consign-floating-dismissed', 'true')
    }
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(4px)',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '16px',
        maxWidth: '320px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck style={{ width: '20px', height: '20px', color: '#f97316' }} />
          <span style={{ fontWeight: '600', fontSize: '14px' }}>Consignar Veículo</span>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
      
      <p style={{ fontSize: '12px', color: '#d1d5db', marginBottom: '12px' }}>
        Ganhe dinheiro consignando seu veículo conosco
      </p>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link
          href="/consignacao"
          style={{
            flex: 1,
            backgroundColor: '#f97316',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'block'
          }}
        >
          Consignar Agora
        </Link>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            padding: '8px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Depois
        </button>
      </div>
    </div>
  )
}
