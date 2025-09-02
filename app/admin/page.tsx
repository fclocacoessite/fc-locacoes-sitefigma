'use client'

import { useState, useEffect } from 'react'
import { Quote } from '@/lib/supabase'
import { MobileHeader } from '@/components/MobileHeader'
 
import { 
  Users, 
  Truck, 
  FileText, 
  DollarSign, 
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Save,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

type AdminVehicle = {
  id: string
  brand: string
  model: string
  year: number
  plate: string
  category: string
  daily_rate: number
  weekly_rate?: number | null
  monthly_rate?: number | null
  is_available: boolean
  image_url?: string | null
  description?: string | null
  features?: string[] | null
  created_at?: string
  updated_at?: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [vehicleForm, setVehicleForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    category: '',
    daily_rate: 0,
    weekly_rate: undefined as number | undefined,
    monthly_rate: undefined as number | undefined,
    is_available: true,
    image_url: '',
    description: '',
    features: '' // separado por vírgula
  })
  
  // Estado para os textos do top bar
  const [topBarTexts, setTopBarTexts] = useState([
    { id: 1, icon: 'phone', text: '(11) 9999-9999', label: 'Telefone', active: true },
    { id: 2, icon: 'mail', text: 'contato@fclocacoes.com.br', label: 'Email', active: true },
    { id: 3, icon: 'clock', text: 'Atendimento 24h', label: 'Horário', active: true },
    { id: 4, icon: 'map-pin', text: 'Grande São Paulo', label: 'Região', active: true },
    { id: 5, icon: 'truck', text: 'Frota Própria', label: 'Serviço', active: true }
  ])
  const [editingText, setEditingText] = useState<number | null>(null)
  const [editingData, setEditingData] = useState({ text: '', label: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [vehiclesRes, quotesRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/quotes')
      ])
      
      const vehiclesJson = await vehiclesRes.json()
      setVehicles(vehiclesJson?.vehicles || [])
      
      // Mock quotes data - em produção viria da API
      setQuotes([
        {
          id: '1',
          client_name: 'João Silva',
          client_email: 'joao@empresa.com',
          client_phone: '(11) 99999-9999',
          vehicle_id: '1',
          start_date: '2024-01-15',
          end_date: '2024-01-20',
          total_days: 5,
          total_cost: 2500,
          status: 'pending',
          message: 'Preciso para obra em São Paulo',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z'
        },
        {
          id: '2',
          client_name: 'Maria Santos',
          client_email: 'maria@construtora.com',
          client_phone: '(11) 88888-8888',
          vehicle_id: '2',
          start_date: '2024-01-25',
          end_date: '2024-01-30',
          total_days: 5,
          total_cost: 3200,
          status: 'approved',
          message: 'Trabalho em altura',
          created_at: '2024-01-22T14:30:00Z',
          updated_at: '2024-01-22T14:30:00Z'
        }
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Login é tratado no middleware e em /admin/login

  const handleVehicleFormChange = (field: string, value: any) => {
    setVehicleForm(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    try {
      const payload = {
        brand: vehicleForm.brand,
        model: vehicleForm.model,
        year: Number(vehicleForm.year),
        plate: vehicleForm.plate,
        category: vehicleForm.category,
        daily_rate: Number(vehicleForm.daily_rate),
        weekly_rate: vehicleForm.weekly_rate ? Number(vehicleForm.weekly_rate) : null,
        monthly_rate: vehicleForm.monthly_rate ? Number(vehicleForm.monthly_rate) : null,
        is_available: Boolean(vehicleForm.is_available),
        image_url: vehicleForm.image_url || null,
        description: vehicleForm.description || null,
        features: vehicleForm.features
          ? vehicleForm.features.split(',').map(s => s.trim()).filter(Boolean)
          : []
      }

      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Erro ao criar veículo')
      }

      // Resetar formulário e fechar
      setVehicleForm({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        plate: '',
        category: '',
        daily_rate: 0,
        weekly_rate: undefined,
        monthly_rate: undefined,
        is_available: true,
        image_url: '',
        description: '',
        features: ''
      })
      setIsCreatingVehicle(false)
      // Recarregar lista
      fetchData()
    } catch (err: any) {
      setCreateError(err?.message || 'Erro ao criar veículo')
    } finally {
      setCreating(false)
    }
  }

  const handleQuoteStatusUpdate = async (quoteId: string, newStatus: string) => {
    // Em produção, faria uma chamada para a API
    setQuotes(prev => prev.map(quote => 
      quote.id === quoteId ? { ...quote, status: newStatus as any } : quote
    ))
  }

  // Funções para gerenciar os textos do top bar
  const startEditing = (id: number) => {
    const text = topBarTexts.find(t => t.id === id)
    if (text) {
      setEditingText(id)
      setEditingData({ text: text.text, label: text.label })
    }
  }

  const saveEdit = (id: number) => {
    setTopBarTexts(prev => prev.map(text => 
      text.id === id 
        ? { ...text, text: editingData.text, label: editingData.label }
        : text
    ))
    setEditingText(null)
    setEditingData({ text: '', label: '' })
  }

  const cancelEdit = () => {
    setEditingText(null)
    setEditingData({ text: '', label: '' })
  }

  const toggleTextActive = (id: number) => {
    setTopBarTexts(prev => prev.map(text => 
      text.id === id ? { ...text, active: !text.active } : text
    ))
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'phone':
        return <Phone className="w-4 h-4" />
      case 'mail':
        return <Mail className="w-4 h-4" />
      case 'clock':
        return <Clock className="w-4 h-4" />
      case 'map-pin':
        return <MapPin className="w-4 h-4" />
      case 'truck':
        return <Truck className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado'
      case 'pending': return 'Pendente'
      case 'rejected': return 'Rejeitado'
      case 'expired': return 'Expirado'
      default: return status
    }
  }

  // Render direto: acesso já protegido pelo middleware

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie veículos, orçamentos e configurações do sistema</p>
        </div>

        {/* Tabs de Navegação */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'vehicles', label: 'Veículos', icon: Truck },
              { id: 'quotes', label: 'Orçamentos', icon: FileText },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
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
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Truck className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total de Veículos</dt>
                        <dd className="text-lg font-medium text-gray-900">{vehicles.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Orçamentos Pendentes</dt>
                        <dd className="text-lg font-medium text-gray-900">{quotes.filter(q => q.status === 'pending').length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Orçamentos Aprovados</dt>
                        <dd className="text-lg font-medium text-gray-900">{quotes.filter(q => q.status === 'approved').length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Receita Total</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          R$ {quotes.filter(q => q.status === 'approved').reduce((sum, q) => sum + q.total_cost, 0).toFixed(2)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Frota de Veículos</h3>
                  <button
                    onClick={() => setIsCreatingVehicle(v => !v)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isCreatingVehicle ? 'Fechar' : 'Adicionar Veículo'}</span>
                  </button>
                </div>
              </div>
              {isCreatingVehicle && (
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                  <form onSubmit={handleCreateVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Marca</label>
                      <input
                        type="text"
                        required
                        value={vehicleForm.brand}
                        onChange={(e) => handleVehicleFormChange('brand', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Modelo</label>
                      <input
                        type="text"
                        required
                        value={vehicleForm.model}
                        onChange={(e) => handleVehicleFormChange('model', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ano</label>
                      <input
                        type="number"
                        required
                        value={vehicleForm.year}
                        onChange={(e) => handleVehicleFormChange('year', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Placa</label>
                      <input
                        type="text"
                        required
                        value={vehicleForm.plate}
                        onChange={(e) => handleVehicleFormChange('plate', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoria</label>
                      <input
                        type="text"
                        required
                        value={vehicleForm.category}
                        onChange={(e) => handleVehicleFormChange('category', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Valor Diário (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={vehicleForm.daily_rate}
                        onChange={(e) => handleVehicleFormChange('daily_rate', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Valor Semanal (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={vehicleForm.weekly_rate ?? ''}
                        onChange={(e) => handleVehicleFormChange('weekly_rate', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Valor Mensal (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={vehicleForm.monthly_rate ?? ''}
                        onChange={(e) => handleVehicleFormChange('monthly_rate', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Disponível</label>
                      <select
                        value={vehicleForm.is_available ? 'true' : 'false'}
                        onChange={(e) => handleVehicleFormChange('is_available', e.target.value === 'true')}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      >
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Imagem (URL)</label>
                      <input
                        type="url"
                        value={vehicleForm.image_url}
                        onChange={(e) => handleVehicleFormChange('image_url', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Descrição</label>
                      <textarea
                        rows={3}
                        value={vehicleForm.description}
                        onChange={(e) => handleVehicleFormChange('description', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Características (separadas por vírgula)</label>
                      <input
                        type="text"
                        value={vehicleForm.features}
                        onChange={(e) => handleVehicleFormChange('features', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="Guindaste, Operador incluso, Seguro"
                      />
                    </div>
                    {createError && (
                      <div className="md:col-span-2 text-sm text-red-600">{createError}</div>
                    )}
                    <div className="md:col-span-2 flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingVehicle(false)}
                        className="px-4 py-2 border rounded-md text-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={creating}
                        className="px-4 py-2 rounded-md text-sm text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-60"
                      >
                        {creating ? 'Salvando...' : 'Salvar Veículo'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {vehicles.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Nenhum veículo encontrado.</div>
              ) : (
              <ul className="divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <li key={vehicle.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Truck className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{vehicle.brand} {vehicle.model}</div>
                            <div className="text-sm text-gray-500">{vehicle.year} • {vehicle.plate}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vehicle.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {vehicle.is_available ? 'Disponível' : 'Indisponível'}
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">R$ {Number(vehicle.daily_rate).toFixed(2)}/dia</div>
                            <div className="text-sm text-gray-500">{vehicle.category}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              )}
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Orçamentos</h3>
              </div>
              {quotes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Nenhum orçamento encontrado.</div>
              ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Período
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quotes.map((quote) => (
                      <tr key={quote.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {quote.client_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {quote.client_email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(quote.start_date).toLocaleDateString('pt-BR')} - {new Date(quote.end_date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {quote.total_cost.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                            {getStatusText(quote.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button 
                            onClick={() => handleQuoteStatusUpdate(quote.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Aprovar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleQuoteStatusUpdate(quote.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Rejeitar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900" title="Visualizar">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Gestão de Usuários</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-center py-8">
                  Funcionalidade de gestão de usuários em desenvolvimento.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Configurações do Sistema</h3>
                <p className="text-sm text-gray-600 mt-1">Gerencie os textos e informações exibidas no site</p>
              </div>
              <div className="p-6">
                {/* Configuração dos textos do top bar */}
                <div className="mb-8">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Textos do Top Bar (Informações Rotativas)</h4>
                  <div className="space-y-4">
                    {topBarTexts.map((text) => (
                      <div key={text.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-gray-500">
                              {getIconComponent(text.icon)}
                            </div>
                            <div className="flex-1">
                              {editingText === text.id ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={editingData.text}
                                    onChange={(e) => setEditingData({ ...editingData, text: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    placeholder="Texto"
                                  />
                                  <input
                                    type="text"
                                    value={editingData.label}
                                    onChange={(e) => setEditingData({ ...editingData, label: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    placeholder="Label"
                                  />
                                </div>
                              ) : (
                                <div>
                                  <div className="font-medium text-gray-900">{text.text}</div>
                                  <div className="text-sm text-gray-500">{text.label}</div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {editingText === text.id ? (
                              <>
                                <button
                                  onClick={() => saveEdit(text.id)}
                                  className="text-green-600 hover:text-green-900 p-1"
                                  title="Salvar"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="text-gray-600 hover:text-gray-900 p-1"
                                  title="Cancelar"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(text.id)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toggleTextActive(text.id)}
                                  className={`p-1 ${text.active ? 'text-green-600 hover:text-green-900' : 'text-gray-400 hover:text-gray-600'}`}
                                  title={text.active ? 'Desativar' : 'Ativar'}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {!text.active && (
                          <div className="mt-2 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            ⚠️ Este texto está desativado e não será exibido no site
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">Como funciona:</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Os textos rotam automaticamente a cada 3 segundos no top bar do site</li>
                      <li>• Apenas textos ativados são exibidos</li>
                      <li>• As alterações são salvas automaticamente</li>
                      <li>• Os ícones são fixos e não podem ser alterados</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      
    </div>
  )
}

