'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { MobileHeader } from '@/components/MobileHeader'
import { Footer } from '@/components/Footer'
import { 
  User, 
  FileText, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function PortalClientePage() {
  const { user, session, loading, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Redirecionar se não estiver autenticado
  if (!user) {
    return null
  }

  // Dados reais do usuário
  const userData = {
    name: user.user_metadata?.name || 'Usuário',
    email: user.email || '',
    phone: user.user_metadata?.phone || '',
    company: user.user_metadata?.company || '',
    role: user.user_metadata?.role || 'client'
  }

  // Mock data para orçamentos e contratos (em produção viria do banco)
  const mockQuotes = [
    {
      id: '1',
      vehicle: 'Munck 12 Toneladas - Mercedes Atego',
      period: '15/01/2024 - 20/01/2024',
      status: 'approved',
      total: 2500.00,
      created_at: '2024-01-10'
    },
    {
      id: '2',
      vehicle: 'Cesto Aéreo 20m - Volvo FH',
      period: '25/01/2024 - 30/01/2024',
      status: 'pending',
      total: 3200.00,
      created_at: '2024-01-22'
    }
  ]

  const mockContracts = [
    {
      id: '1',
      vehicle: 'Munck 12 Toneladas',
      period: '15/01/2024 - 20/01/2024',
      status: 'active',
      total: 2500.00
    }
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'active': return 'text-blue-600 bg-blue-100'
      case 'completed': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado'
      case 'pending': return 'Pendente'
      case 'rejected': return 'Rejeitado'
      case 'active': return 'Ativo'
      case 'completed': return 'Concluído'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header do Portal */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal do Cliente</h1>
              <p className="text-gray-600">Bem-vindo, {userData.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userData.email}</p>
                <p className="text-xs text-gray-500">{userData.role}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Navegação por Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: User },
              { id: 'quotes', label: 'Orçamentos', icon: FileText },
              { id: 'contracts', label: 'Contratos', icon: Calendar },
              { id: 'payments', label: 'Pagamentos', icon: CreditCard },
              { id: 'profile', label: 'Perfil', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Orçamentos Pendentes</dt>
                      <dd className="text-lg font-medium text-gray-900">{mockQuotes.filter(q => q.status === 'pending').length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Contratos Ativos</dt>
                      <dd className="text-lg font-medium text-gray-900">{mockContracts.filter(c => c.status === 'active').length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total em Contratos</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        R$ {mockContracts.reduce((sum, c) => sum + c.total, 0).toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {mockQuotes.map((quote) => (
                <li key={quote.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{quote.vehicle}</div>
                          <div className="text-sm text-gray-500">{quote.period}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                          {getStatusText(quote.status)}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">R$ {quote.total.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">Criado em {quote.created_at}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {mockContracts.map((contract) => (
                <li key={contract.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contract.vehicle}</div>
                          <div className="text-sm text-gray-500">{contract.period}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                          {getStatusText(contract.status)}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">R$ {contract.total.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Pagamentos</h3>
            <p className="text-gray-500">Nenhum pagamento encontrado.</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Perfil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <p className="mt-1 text-sm text-gray-900">{userData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <p className="mt-1 text-sm text-gray-900">{userData.phone || 'Não informado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Empresa</label>
                <p className="mt-1 text-sm text-gray-900">{userData.company || 'Não informado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Conta</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{userData.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Rodapé */}
      <Footer />
    </div>
  )
}

