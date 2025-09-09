'use client'

import { useAuth } from '@/app/providers'
import Link from 'next/link'

export function Footer() {
  const { user } = useAuth()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e Descrição */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/logo-fc.jpg" 
                alt="FC Locações" 
                className="w-14 h-14 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-bold text-white">FC Locações</h3>
                <p className="text-sm text-gray-400">Caminhões Munck & Cestos Aéreos</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Soluções completas em locação de veículos para sua empresa. 
              Qualidade, confiança e pontualidade em todos os nossos serviços.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243s.122-.928.49-1.243c.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243s-.122.928-.49 1.243c-.369.315-.807.49-1.297.49z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Serviços</h3>
            <ul className="space-y-3">
              <li><a href="/sobre" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Sobre Nós</a></li>
              <li><a href="/frota" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Frota de Veículos</a></li>
              <li><a href="/orcamento" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Solicitar Orçamento</a></li>
              <li><a href="/contato" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Entre em Contato</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Caminhões Munck</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Cestos Aéreos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">Transporte Especializado</a></li>
            </ul>
          </div>

          {/* Acesso */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Acesso</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/signin" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">
                  Portal do Cliente
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">
                  Login Administrativo
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-gray-300 hover:text-orange-500 transition-colors duration-300">
                  Criar Conta
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">(21) 99215-4030</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">contato@fclocacoes.com.br</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300">Nova Iguaçu, RJ</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FC Locações. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
              {user ? (
                <Link href={user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'manager' ? '/admin' : '/portal-cliente'} className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-sm">
                  {user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'manager' ? 'Painel Admin' : 'Meu Portal'}
                </Link>
              ) : (
                <>
                  <Link href="/auth/signin" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-sm">
                    Portal do Cliente
                  </Link>
                  <Link href="/admin/login" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-sm">
                    Login Admin
                  </Link>
                </>
              )}
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-sm">Política de Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-sm">Termos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}