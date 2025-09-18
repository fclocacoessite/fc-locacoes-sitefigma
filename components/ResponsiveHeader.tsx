'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Shield, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ResponsiveHeader() {
  const [currentInfoIndex, setCurrentInfoIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { user, session, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Detectar tipos de usuário
  const isAdmin = !!user && (user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'manager')
  const isClient = !!user && user.user_metadata?.role === 'client'

  // Detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Redirecionamentos baseados no tipo de usuário
  useEffect(() => {
    if (!session || !user) return

    console.log('🔄 ResponsiveHeader: Verificando redirecionamento...', {
      isAdmin,
      isClient,
      pathname,
      userRole: user.user_metadata?.role
    })

    // Se for cliente e tentar acessar /admin, redireciona para /
    if (isClient && pathname.startsWith('/admin')) {
      console.log('🔄 ResponsiveHeader: Cliente tentando acessar /admin, redirecionando para /')
      router.replace('/')
      return
    }
  }, [session, user, isClient, pathname, router])

  // Informações rotativas para o top bar
  const topBarInfo = [
    { icon: 'phone', text: '(21) 99215-4030', label: 'Telefone' },
    { icon: 'mail', text: 'suporte@fclocacoes.com.br', label: 'Email' },
    { icon: 'clock', text: 'Atendimento 24h', label: 'Horário' },
    { icon: 'map-pin', text: 'Nova Iguaçu', label: 'Região' },
    { icon: 'truck', text: 'Frota Própria', label: 'Serviço' }
  ]

  // Rotação automática das informações
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInfoIndex((prev) => (prev + 1) % topBarInfo.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [topBarInfo.length])

  // Navegação só aparece para não-admins
  const navigation = isAdmin ? [] : [
    { name: 'Início', href: '/' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Frota', href: '/frota' },
    { name: 'Consignação', href: '/consignacao' },
    { name: 'Orçamento', href: '/orcamento' },
    { name: 'Contato', href: '/contato' },
  ]

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'phone':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        )
      case 'mail':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'clock':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'map-pin':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'truck':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
          </svg>
        )
      default:
        return null
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      {/* Top Bar - Responsivo */}
      <div className="bg-gray-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            {/* Informações rotativas - adaptadas para mobile */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center space-x-2 text-center">
                <div className="flex items-center space-x-1">
                  {getIcon(topBarInfo[currentInfoIndex].icon)}
                  <span className="font-medium text-xs sm:text-sm">
                    {topBarInfo[currentInfoIndex].text}
                  </span>
                </div>
                <span className="text-gray-400 text-xs hidden sm:inline">•</span>
                <span className="text-gray-400 text-xs hidden sm:inline">
                  {topBarInfo[currentInfoIndex].label}
                </span>
              </div>
            </div>
            
            {/* Área de autenticação - responsiva */}
            <div className="flex items-center space-x-1">
              {!session ? (
                <div className="text-white text-xs">Acesse sua conta</div>
              ) : user ? (
                <div className="flex items-center space-x-1">
                  {/* Nome do usuário - oculto em mobile muito pequeno */}
                  <span className="text-white text-xs hidden xs:inline">
                    Olá, {user.user_metadata?.name || user.email}
                  </span>
                  
                  
                  {/* Botão Área do Cliente - só para não-admins */}
                  {!isAdmin && (
                    <Link href="/portal-cliente">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-1.5 py-0.5 rounded text-xs font-medium transition-colors flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span className="hidden sm:inline">Portal</span>
                      </button>
                    </Link>
                  )}
                  
                  
                  <button
                    onClick={handleSignOut}
                    className="border border-white/20 hover:bg-white/10 text-white px-1.5 py-0.5 rounded text-xs transition-colors flex items-center space-x-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden sm:inline">Sair</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Link href="/auth/signin">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-1.5 py-0.5 rounded text-xs font-medium transition-colors flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span className="hidden sm:inline">Cliente</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Responsivo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Responsivo */}
          <div className="flex items-center">
            <a href={isAdmin ? "/admin" : "/"} className="flex-shrink-0 flex items-center space-x-2 sm:space-x-3">
              <img 
                src="/logo-fc.jpg" 
                alt="FC Locações" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
              />
              <div className="text-gray-800">
                <div className="font-bold text-lg sm:text-xl">FC Locações</div>
                <div className="text-xs text-gray-600 hidden sm:block">Caminhões Munck & Cestos Aéreos</div>
              </div>
            </a>
          </div>

          {/* Desktop Navigation - só para não-admins */}
          {!isAdmin && (
            <nav className="hidden lg:flex space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors whitespace-nowrap"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          )}

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAdmin && (
              <Link href="/orcamento">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 lg:px-6 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                  Solicitar Orçamento
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-500 transition-colors p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Botão Área do Cliente no menu mobile para usuários logados */}
              {user && !isAdmin && (
                <Link href="/portal-cliente">
                  <button 
                    className="w-full text-left px-3 py-2 text-sm font-medium bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Área do Cliente</span>
                  </button>
                </Link>
              )}
              
              
              
              <a
                href="/orcamento"
                className="px-3 py-2 text-sm font-medium bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Solicitar Orçamento
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
