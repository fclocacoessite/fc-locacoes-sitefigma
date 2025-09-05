'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Quote, supabase } from '@/lib/supabase'
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
  photos?: string[]
  // Novos campos para compatibilidade com o site público
  capacity_ton?: number | null
  height_m?: number | null
  cabine_suplementar?: boolean | null
  carroceria_aberta?: boolean | null
  banheiro?: boolean | null
  documents?: string[] | null
  status?: string | null
  featured?: boolean | null
  created_at?: string
  updated_at?: string
}

type VehicleImage = {
  id: string
  image_type: string
  image_name: string
  image_size: number
  is_primary: boolean
  created_at: string
  dataUrl?: string // Para armazenamento temporário
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  
  // Estados para edição de veículos
  const [editingVehicle, setEditingVehicle] = useState<AdminVehicle | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    category: '',
    daily_rate: 0,
    weekly_rate: undefined as number | undefined,
    monthly_rate: undefined as number | undefined,
    is_available: true,
    description: '',
    features: '',
    // Novos campos para compatibilidade com o site público
    capacity_ton: undefined as number | undefined,
    height_m: undefined as number | undefined,
    cabine_suplementar: false,
    carroceria_aberta: false,
    banheiro: false,
    documents: '',
    status: 'available',
    featured: false
  })
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [vehiclePhotos, setVehiclePhotos] = useState<VehicleImage[]>([])
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
    features: '', // separado por vírgula
    // Novos campos para compatibilidade com o site público
    capacity_ton: undefined as number | undefined,
    height_m: undefined as number | undefined,
    cabine_suplementar: false,
    carroceria_aberta: false,
    banheiro: false,
    documents: '',
    status: 'available',
    featured: false
  })
  
  // Estado para os textos do top bar
  const [topBarTexts, setTopBarTexts] = useState([
    { id: 1, icon: 'phone', text: '(21) 99215-4030', label: 'Telefone', active: true },
    { id: 2, icon: 'mail', text: 'suporte@fclocacoes.com.br', label: 'Email', active: true },
    { id: 3, icon: 'clock', text: 'Atendimento 24h', label: 'Horário', active: true },
    { id: 4, icon: 'map-pin', text: 'Nova Iguaçu', label: 'Região', active: true },
    { id: 5, icon: 'truck', text: 'Frota Própria', label: 'Serviço', active: true }
  ])
  const [editingText, setEditingText] = useState<number | null>(null)
  const [editingData, setEditingData] = useState({ text: '', label: '' })

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.replace('/admin/login')
          return
        }
        
        const userRole = session.user.user_metadata?.role || 'client'
        if (userRole !== 'admin' && userRole !== 'manager') {
          router.replace('/admin/login')
          return
        }
        
        setAuthLoading(false)
        fetchData()
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.replace('/admin/login')
      }
    }
    
    checkAuth()
  }, [router])

  useEffect(() => {
    if (!authLoading) {
      fetchData()
    }
  }, [authLoading])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [vehiclesRes, quotesRes] = await Promise.all([
        fetch('/api/vehicles?admin=true'),
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

  const closeCreateModal = () => {
    setIsCreatingVehicle(false)
    setVehiclePhotos([])
    setCreateError('')
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
          : [],
        photos: vehiclePhotos.map(photo => photo.dataUrl || ''),
        // Novos campos para compatibilidade com o site público
        capacity_ton: vehicleForm.capacity_ton ? Number(vehicleForm.capacity_ton) : null,
        height_m: vehicleForm.height_m ? Number(vehicleForm.height_m) : null,
        cabine_suplementar: Boolean(vehicleForm.cabine_suplementar),
        carroceria_aberta: Boolean(vehicleForm.carroceria_aberta),
        banheiro: Boolean(vehicleForm.banheiro),
        documents: vehicleForm.documents
          ? vehicleForm.documents.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        status: vehicleForm.status,
        featured: Boolean(vehicleForm.featured)
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
        features: '',
        // Novos campos para compatibilidade com o site público
        capacity_ton: undefined,
        height_m: undefined,
        cabine_suplementar: false,
        carroceria_aberta: false,
        banheiro: false,
        documents: '',
        status: 'available',
        featured: false
      })
      closeCreateModal()
      // Recarregar lista
      fetchData()
    } catch (err: any) {
      setCreateError(err?.message || 'Erro ao criar veículo')
    } finally {
      setCreating(false)
    }
  }

  // Funções para edição de veículos
  const openEditModal = (vehicle: AdminVehicle) => {
    setEditingVehicle(vehicle)
    setEditForm({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      category: vehicle.category,
      daily_rate: vehicle.daily_rate,
      weekly_rate: vehicle.weekly_rate ?? undefined,
      monthly_rate: vehicle.monthly_rate ?? undefined,
      is_available: vehicle.is_available,
      description: vehicle.description || '',
      features: vehicle.features?.join(', ') || '',
      // Novos campos para compatibilidade com o site público
      capacity_ton: vehicle.capacity_ton ?? undefined,
      height_m: vehicle.height_m ?? undefined,
      cabine_suplementar: vehicle.cabine_suplementar ?? false,
      carroceria_aberta: vehicle.carroceria_aberta ?? false,
      banheiro: vehicle.banheiro ?? false,
      documents: vehicle.documents?.join(', ') || '',
      status: vehicle.status || 'available',
      featured: vehicle.featured ?? false
    })
    
    // Carregar imagens existentes do veículo
    if (vehicle.photos && vehicle.photos.length > 0) {
      const existingPhotos = vehicle.photos.map((photoUrl, index) => ({
        id: `existing_${vehicle.id}_${index}`,
        image_type: 'image/jpeg',
        image_name: `Foto ${index + 1}`,
        image_size: 0,
        is_primary: index === 0,
        created_at: new Date().toISOString(),
        dataUrl: photoUrl
      }))
      setVehiclePhotos(existingPhotos)
    } else {
      setVehiclePhotos([])
    }
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingVehicle(null)
    setVehiclePhotos([])
  }

  const handleEditFormChange = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVehicle) return

    setCreating(true)
    try {
      const payload = {
        brand: editForm.brand,
        model: editForm.model,
        year: Number(editForm.year),
        plate: editForm.plate,
        category: editForm.category,
        daily_rate: Number(editForm.daily_rate),
        weekly_rate: editForm.weekly_rate ? Number(editForm.weekly_rate) : null,
        monthly_rate: editForm.monthly_rate ? Number(editForm.monthly_rate) : null,
        is_available: Boolean(editForm.is_available),
        description: editForm.description || null,
        features: editForm.features
          ? editForm.features.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        image_url: vehiclePhotos.length > 0 ? vehiclePhotos[0].dataUrl : null,
        photos: vehiclePhotos.map(photo => photo.dataUrl || ''),
        // Novos campos para compatibilidade com o site público
        capacity_ton: editForm.capacity_ton ? Number(editForm.capacity_ton) : null,
        height_m: editForm.height_m ? Number(editForm.height_m) : null,
        cabine_suplementar: Boolean(editForm.cabine_suplementar),
        carroceria_aberta: Boolean(editForm.carroceria_aberta),
        banheiro: Boolean(editForm.banheiro),
        documents: editForm.documents
          ? editForm.documents.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        status: editForm.status,
        featured: Boolean(editForm.featured)
      }

      const res = await fetch(`/api/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Erro ao atualizar veículo')
      }

      closeEditModal()
      fetchData() // Recarregar lista
    } catch (err: any) {
      console.error('Erro ao atualizar veículo:', err)
      alert(err?.message || 'Erro ao atualizar veículo')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Erro ao excluir veículo')
      }

      fetchData() // Recarregar lista
    } catch (err: any) {
      console.error('Erro ao excluir veículo:', err)
      alert(err?.message || 'Erro ao excluir veículo')
    }
  }


  const handlePhotoUpload = async (files: FileList) => {
    if (files.length === 0) return

    setUploadingPhotos(true)
    try {
      // Validar arquivos
      const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
          alert(`Arquivo "${file.name}" não é uma imagem válida`)
          return false
        }
        if (file.size > 5 * 1024 * 1024) {
          alert(`Arquivo "${file.name}" é muito grande (máximo 5MB)`)
          return false
        }
        return true
      })

      if (validFiles.length === 0) {
        setUploadingPhotos(false)
        return
      }

      const uploadPromises = validFiles.map(async (file) => {
        // Converter arquivo para base64 para armazenamento temporário
        return new Promise<{dataUrl: string, file: File}>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve({ dataUrl: reader.result, file })
            } else {
              reject(new Error('Erro ao converter arquivo'))
            }
          }
          reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
          reader.readAsDataURL(file)
        })
      })

      const uploadedImages = await Promise.all(uploadPromises)
      const newPhotos = uploadedImages.map(({ dataUrl, file }, index) => ({
        id: `temp_${Date.now()}_${index}`,
        image_type: file.type,
        image_name: file.name,
        image_size: file.size,
        is_primary: index === 0 && vehiclePhotos.length === 0,
        created_at: new Date().toISOString(),
        dataUrl
      }))

      setVehiclePhotos(prev => [...prev, ...newPhotos])
      
      // Feedback de sucesso
      if (validFiles.length > 0) {
        console.log(`✅ ${validFiles.length} foto(s) carregada(s) com sucesso!`)
      }
    } catch (err) {
      console.error('Erro no upload de fotos:', err)
      alert('Erro ao processar as fotos. Tente novamente.')
    } finally {
      setUploadingPhotos(false)
    }
  }

  const removePhoto = (index: number) => {
    setVehiclePhotos(prev => prev.filter((_, i) => i !== index))
  }

  const setPrimaryPhoto = (index: number) => {
    setVehiclePhotos(prev => prev.map((photo, i) => ({
      ...photo,
      is_primary: i === index
    })))
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

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

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
                    onClick={() => isCreatingVehicle ? closeCreateModal() : setIsCreatingVehicle(true)}
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
                    
                    {/* Novos campos para compatibilidade com o site público */}
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">📋 Especificações Técnicas</h4>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Capacidade (toneladas)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={vehicleForm.capacity_ton ?? ''}
                        onChange={(e) => handleVehicleFormChange('capacity_ton', e.target.value ? Number(e.target.value) : undefined)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="Ex: 8.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Altura (metros)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={vehicleForm.height_m ?? ''}
                        onChange={(e) => handleVehicleFormChange('height_m', e.target.value ? Number(e.target.value) : undefined)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="Ex: 12.5"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">🚛 Características do Veículo</h4>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={vehicleForm.cabine_suplementar}
                          onChange={(e) => handleVehicleFormChange('cabine_suplementar', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Cabine Suplementar</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={vehicleForm.carroceria_aberta}
                          onChange={(e) => handleVehicleFormChange('carroceria_aberta', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Carroceria Aberta</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={vehicleForm.banheiro}
                          onChange={(e) => handleVehicleFormChange('banheiro', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Banheiro</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={vehicleForm.featured}
                          onChange={(e) => handleVehicleFormChange('featured', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">⭐ Destaque na Frota</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={vehicleForm.status}
                        onChange={(e) => handleVehicleFormChange('status', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      >
                        <option value="available">Disponível</option>
                        <option value="rented">Locado</option>
                        <option value="maintenance">Manutenção</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Documentos (separados por vírgula)</label>
                      <input
                        type="text"
                        value={vehicleForm.documents}
                        onChange={(e) => handleVehicleFormChange('documents', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="CRLV, Seguro, ART, NR-35"
                      />
                    </div>
                    
                    {createError && (
                      <div className="md:col-span-2 text-sm text-red-600">{createError}</div>
                    )}
                    <div className="md:col-span-2 flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={closeCreateModal}
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
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(vehicle)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                              title="Editar veículo"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                              title="Excluir veículo"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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

      {/* Modal de Edição de Veículo */}
      {isEditModalOpen && editingVehicle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Editar Veículo - {editingVehicle.brand} {editingVehicle.model}
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateVehicle} className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Marca</label>
                    <input
                      type="text"
                      required
                      value={editForm.brand}
                      onChange={(e) => handleEditFormChange('brand', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Modelo</label>
                    <input
                      type="text"
                      required
                      value={editForm.model}
                      onChange={(e) => handleEditFormChange('model', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ano</label>
                    <input
                      type="number"
                      required
                      value={editForm.year}
                      onChange={(e) => handleEditFormChange('year', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Placa</label>
                    <input
                      type="text"
                      required
                      value={editForm.plate}
                      onChange={(e) => handleEditFormChange('plate', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <input
                      type="text"
                      required
                      value={editForm.category}
                      onChange={(e) => handleEditFormChange('category', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Disponível</label>
                    <select
                      value={editForm.is_available ? 'true' : 'false'}
                      onChange={(e) => handleEditFormChange('is_available', e.target.value === 'true')}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="true">Disponível</option>
                      <option value="false">Indisponível</option>
                    </select>
                  </div>
                </div>

                {/* Valores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor Diário (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editForm.daily_rate}
                      onChange={(e) => handleEditFormChange('daily_rate', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor Semanal (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.weekly_rate ?? ''}
                      onChange={(e) => handleEditFormChange('weekly_rate', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor Mensal (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.monthly_rate ?? ''}
                      onChange={(e) => handleEditFormChange('monthly_rate', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Descreva as características e especificações do veículo..."
                  />
                </div>

                {/* Características */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Características (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={editForm.features}
                    onChange={(e) => handleEditFormChange('features', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Guindaste, Operador incluso, Seguro"
                  />
                </div>

                {/* Especificações Técnicas */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">📋 Especificações Técnicas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Capacidade (toneladas)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.capacity_ton ?? ''}
                        onChange={(e) => handleEditFormChange('capacity_ton', e.target.value ? Number(e.target.value) : undefined)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Ex: 8.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Altura (metros)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.height_m ?? ''}
                        onChange={(e) => handleEditFormChange('height_m', e.target.value ? Number(e.target.value) : undefined)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Ex: 12.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Características do Veículo */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">🚛 Características do Veículo</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.cabine_suplementar}
                          onChange={(e) => handleEditFormChange('cabine_suplementar', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Cabine Suplementar</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.carroceria_aberta}
                          onChange={(e) => handleEditFormChange('carroceria_aberta', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Carroceria Aberta</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.banheiro}
                          onChange={(e) => handleEditFormChange('banheiro', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Banheiro</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.featured}
                          onChange={(e) => handleEditFormChange('featured', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">⭐ Destaque</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Status e Documentos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => handleEditFormChange('status', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="available">Disponível</option>
                      <option value="rented">Locado</option>
                      <option value="maintenance">Manutenção</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Documentos (separados por vírgula)</label>
                    <input
                      type="text"
                      value={editForm.documents}
                      onChange={(e) => handleEditFormChange('documents', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      placeholder="CRLV, Seguro, ART, NR-35"
                    />
                  </div>
                </div>

                {/* Upload de Fotos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    📸 Adicionar Fotos do Veículo
                  </label>
                  
                  {/* Área de Upload */}
                  <div className="mb-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                        className="hidden"
                        id="vehicle-photo-upload"
                        disabled={uploadingPhotos}
                      />
                      <label 
                        htmlFor="vehicle-photo-upload"
                        className={`cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors ${
                          uploadingPhotos 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                        }`}
                      >
                        {uploadingPhotos ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Carregando...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Selecionar Fotos
                          </>
                        )}
                      </label>
                      <p className="mt-2 text-sm text-gray-500">
                        Clique para escolher uma ou mais fotos (JPG, PNG, GIF)
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Máximo 5MB por foto • Múltiplas fotos permitidas
                      </p>
                    </div>
                  </div>

                  {/* Galeria de fotos */}
                  {vehiclePhotos.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        📷 Fotos Selecionadas ({vehiclePhotos.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {vehiclePhotos.map((photo, index) => (
                          <div key={photo.id} className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <img
                              src={photo.dataUrl || `/api/images/${photo.id}`}
                              alt={photo.image_name || `Foto ${index + 1}`}
                              className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setPrimaryPhoto(index)}
                              title={photo.is_primary ? "Foto principal (clique para alterar)" : "Clique para definir como principal"}
                            />
                            <div className="absolute top-2 left-2">
                              {photo.is_primary ? (
                                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  ⭐ Principal
                                </span>
                              ) : (
                                <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                  Clique para definir como principal
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                removePhoto(index)
                              }}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              title="Remover foto"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {photo.image_name || `Foto ${index + 1}`}
                              {photo.is_primary && <span className="block text-orange-300">⭐ Foto principal</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                        <p className="text-xs text-blue-700">
                          💡 <strong>Dicas:</strong> A primeira foto é definida como principal automaticamente. 
                          Clique em qualquer foto para alterar qual é a principal. 
                          A foto principal será exibida como destaque na listagem de veículos.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Nenhuma foto selecionada</p>
                      <p className="text-xs mt-1">Clique em "Selecionar Fotos" acima para adicionar imagens</p>
                    </div>
                  )}
                </div>

                {/* Botões de ação */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                  >
                    {creating ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}

