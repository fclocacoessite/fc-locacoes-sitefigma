'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { MobileHeader } from '@/components/MobileHeader'
import { 
  User, 
  FileText, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut, 
  Truck, 
  Plus 
} from 'lucide-react'
import { ClientConsignmentForm } from '@/components/ClientConsignmentForm'

interface UserData {
  id: string
  email: string
  name: string
  role: string
}

interface Consignment {
  id: string
  owner_name: string
  email: string
  phone: string
  brand: string
  model: string
  year: number
  category: string
  capacity?: string
  condition: string
  mileage?: number
  daily_rate: number
  description?: string
  photos: string[]
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  approved_at?: string
  rejected_at?: string
  rejection_reason?: string
  admin_notes?: string
}

export default function PortalClientePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showConsignmentForm, setShowConsignmentForm] = useState(false)
  const [consignments, setConsignments] = useState<Consignment[]>([])
  const [loadingConsignments, setLoadingConsignments] = useState(false)

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email || '',
        role: user.user_metadata?.role || 'client'
      })
    }
  }, [user])

  useEffect(() => {
    if (userData?.email) {
      fetchConsignments()
    }
  }, [userData?.email])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const fetchConsignments = async () => {
    if (!userData?.email) return

    setLoadingConsignments(true)
    try {
      // Obter token de acesso atual do Supabase para enviar no header Authorization
      const { data: sessionData } = await (await import('@/lib/supabase')).supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      const response = await fetch(`/api/client/consignments?email=${encodeURIComponent(userData.email)}`, {
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      })
      const data = await response.json()
      
      if (data.success) {
        setConsignments(data.consignments || [])
      } else {
        console.error('Erro ao buscar consignações:', data.error)
      }
    } catch (error) {
      console.error('Erro ao buscar consignações:', error)
    } finally {
      setLoadingConsignments(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'Sua consignação está sendo analisada pela nossa equipe'
      case 'approved': return 'Sua consignação foi aprovada! Seu veículo está disponível para locação'
      case 'rejected': return 'Sua consignação foi rejeitada. Verifique os motivos abaixo'
      case 'active': return 'Seu veículo está ativo e disponível para locação'
      case 'completed': return 'Consignação finalizada'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobileHeader />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header do Portal */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal do Cliente</h1>
              <p className="text-gray-600">Bem-vindo, {userData?.name}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-left sm:text-right">
                <p className="text-sm font-medium text-gray-900">{userData?.email}</p>
                <p className="text-xs text-gray-500">{userData?.role}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Navegação por Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-2 sm:space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: User },
              { id: 'quotes', label: 'Orçamentos', icon: FileText },
              { id: 'contracts', label: 'Contratos', icon: Calendar },
              { id: 'consignments', label: 'Consignação', icon: Truck },
              { id: 'payments', label: 'Pagamentos', icon: CreditCard },
              { id: 'profile', label: 'Perfil', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 sm:space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Orçamentos
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">0</dd>
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
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Contratos
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Truck className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Consignações Ativas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {consignments.filter(c => c.status === 'approved' || c.status === 'active').length}
                        </dd>
                        <dd className="text-xs text-gray-500">
                          {consignments.filter(c => c.status === 'pending').length} pendentes
                        </dd>
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
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Pagamentos
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notificações de Consignações */}
            {consignments.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Status das Suas Consignações
                </h3>
                <div className="space-y-3">
                  {consignments.slice(0, 3).map((consignment) => (
                    <div key={consignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Truck className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {consignment.brand} {consignment.model}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getStatusDescription(consignment.status)}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consignment.status)}`}>
                        {getStatusText(consignment.status)}
                      </span>
                    </div>
                  ))}
                  {consignments.length > 3 && (
                    <button
                      onClick={() => setActiveTab('consignments')}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      Ver todas as {consignments.length} consignações
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Mensagem de Boas-vindas */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Bem-vindo ao Portal do Cliente
              </h3>
              <p className="text-gray-600 mb-4">
                Aqui você pode gerenciar seus orçamentos, contratos, consignações e pagamentos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setActiveTab('quotes')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Orçamentos
                </button>
                <button
                  onClick={() => setActiveTab('consignments')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Gerenciar Consignações
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Meus Orçamentos
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Acompanhe o status dos seus orçamentos
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6 text-center">
                  <p className="text-gray-500">Nenhum orçamento encontrado</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Meus Contratos
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Gerencie seus contratos de locação
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6 text-center">
                  <p className="text-gray-500">Nenhum contrato encontrado</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consignments' && (
          <div className="space-y-6">
            {/* Header da seção */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Minhas Consignações</h3>
                <p className="text-sm text-gray-500">Gerencie seus veículos em consignação</p>
              </div>
              <button
                onClick={() => setShowConsignmentForm(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Consignação
              </button>
            </div>

            {/* Lista de consignações */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {loadingConsignments ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando consignações...</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {consignments.map((consignment) => (
                    <li key={consignment.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                          <div className="flex items-start sm:items-center">
                            <div className="flex-shrink-0">
                              <Truck className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {consignment.brand} {consignment.model} ({consignment.year})
                              </div>
                              <div className="text-sm text-gray-500">{consignment.category}</div>
                              <div className="text-sm text-gray-500">
                                Diária: R$ {consignment.daily_rate.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {getStatusDescription(consignment.status)}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${getStatusColor(consignment.status)}`}>
                              {getStatusText(consignment.status)}
                            </span>
                            <div className="text-left sm:text-right">
                              <div className="text-sm text-gray-500">
                                Enviado em {new Date(consignment.submitted_at).toLocaleDateString('pt-BR')}
                              </div>
                              {consignment.approved_at && (
                                <div className="text-sm text-gray-500">
                                  Aprovado em {new Date(consignment.approved_at).toLocaleDateString('pt-BR')}
                                </div>
                              )}
                              {consignment.rejected_at && (
                                <div className="text-sm text-gray-500">
                                  Rejeitado em {new Date(consignment.rejected_at).toLocaleDateString('pt-BR')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {(consignment.admin_notes || consignment.rejection_reason) && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <div className="text-sm text-gray-700">
                              <strong>
                                {consignment.status === 'rejected' ? 'Motivo da rejeição:' : 'Observações do administrador:'}
                              </strong>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {consignment.admin_notes || consignment.rejection_reason}
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {!loadingConsignments && consignments.length === 0 && (
              <div className="text-center py-12">
                <Truck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma consignação</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece consignando seu primeiro veículo.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowConsignmentForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Consignação
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Meus Pagamentos
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Acompanhe seus pagamentos e faturas
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6 text-center">
                  <p className="text-gray-500">Nenhum pagamento encontrado</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Meu Perfil
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Gerencie suas informações pessoais
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Nome</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {userData?.name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {userData?.email}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Tipo de Conta</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {userData?.role}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Nova Consignação */}
      {showConsignmentForm && (
        <ClientConsignmentForm
          onClose={() => setShowConsignmentForm(false)}
          onSuccess={() => {
            // Atualizar lista de consignações
            fetchConsignments()
            console.log('Consignação criada com sucesso!')
          }}
          userEmail={userData?.email || ''}
          userName={userData?.name || ''}
        />
      )}
      
      {/* Footer do Portal - Fixo na parte inferior */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo-fc.jpg" 
                alt="FC Locações" 
                className="w-8 h-8 object-cover rounded"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">FC Locações</p>
                <p className="text-xs text-gray-500">Portal do Cliente</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
              <span>© 2024 FC Locações</span>
              <div className="flex items-center space-x-4">
                <a href="/contato" className="hover:text-gray-700 transition-colors">Suporte</a>
                <a href="/politica-privacidade" className="hover:text-gray-700 transition-colors">Privacidade</a>
                <a href="/termos-uso" className="hover:text-gray-700 transition-colors">Termos</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}