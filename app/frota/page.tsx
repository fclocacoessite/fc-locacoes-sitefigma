'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Vehicle } from '@/lib/supabase'
import { MobileHeader } from '@/components/MobileHeader'
import { Footer } from '@/components/Footer'

// Array de veículos com imagens locais e descrições detalhadas
const localVehicles = [
  {
    id: '1',
    model: 'Munck 8 Toneladas',
    category: 'Caminhão Munck',
    description: 'Caminhão munck com capacidade de 8 toneladas, ideal para transportes de carga pesada e equipamentos.',
    photos: [
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.17.jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.17 (1).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.17 (2).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.17 (3).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.17 (4).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.35.17.jpeg'
    ],
    capacity_ton: 8,
    height_m: 12,
    status: 'available',
    featured: true,
    cabine_suplementar: true,
    carroceria_aberta: true,
    banheiro: false,
    documents: ['CRLV', 'Documentação em dia'],
    features: ['Cabine suplementar para 8 passageiros', 'Carroceria aberta metálica', 'Ideal para equipes de trabalho'],
    created_at: '2025-09-03T00:00:00Z',
    updated_at: '2025-09-03T00:00:00Z'
  },
  {
    id: '2',
    model: 'Munck 12 Toneladas',
    category: 'Caminhão Munck',
    description: 'Caminhão munck de 12 toneladas com cabine suplementar, perfeito para transportes de maior capacidade.',
    photos: [
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.17 (1).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.17.jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.17 (2).jpeg'
    ],
    capacity_ton: 12,
    height_m: 15,
    status: 'available',
    featured: false,
    cabine_suplementar: true,
    carroceria_aberta: true,
    banheiro: false,
    documents: ['CRLV', 'Documentação em dia'],
    features: ['Cabine suplementar', 'Carroceria aberta', 'Alta capacidade de carga'],
    created_at: '2025-09-03T00:00:00Z',
    updated_at: '2025-09-03T00:00:00Z'
  },
  {
    id: '3',
    model: 'Cesto Aéreo 10 Metros',
    category: 'Cesto Aéreo',
    description: 'Cesto aéreo simples de 10 metros com malões, ideal para trabalhos em altura e manutenção.',
    photos: [
      '/img/VEÍCULO 34 CESTO AÉREO SIMPLES 10 METROS (LINHA MORTA )COM MALÕES E SEM CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.45.43.jpeg',
      '/img/VEÍCULO 34 CESTO AÉREO SIMPLES 10 METROS (LINHA MORTA )COM MALÕES E SEM CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.45.43 (1).jpeg',
      '/img/VEÍCULO 34 CESTO AÉREO SIMPLES 10 METROS (LINHA MORTA )COM MALÕES E SEM CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.45.43 (2).jpeg',
      '/img/VEÍCULO 34 CESTO AÉREO SIMPLES 10 METROS (LINHA MORTA )COM MALÕES E SEM CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.45.42.jpeg',
      '/img/VEÍCULO 34 CESTO AÉREO SIMPLES 10 METROS (LINHA MORTA )COM MALÕES E SEM CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.45.42 (2).jpeg'
    ],
    capacity_ton: 0.2,
    height_m: 10,
    status: 'rented',
    featured: false,
    cabine_suplementar: false,
    carroceria_aberta: false,
    banheiro: false,
    documents: ['CRLV', 'Documentação em dia'],
    features: ['Alcance de 10 metros', 'Malões para ferramentas', 'Ideal para manutenção'],
    created_at: '2025-09-03T00:00:00Z',
    updated_at: '2025-09-03T00:00:00Z'
  },
  {
    id: '4',
    model: 'Cesto Aéreo 13 Metros Duplo',
    category: 'Cesto Aéreo',
    description: 'Cesto aéreo duplo de 13 metros com linha viva, malões e cabine suplementar para equipes.',
    photos: [
      '/img/VEÍCULO 34 CESTO AÉREO DUPLO 13 METROS (LINHA VIVA) COM MALÕES E CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.47.35.jpeg',
      '/img/VEÍCULO 34 CESTO AÉREO DUPLO 13 METROS (LINHA VIVA) COM MALÕES E CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.47.35 (1).jpeg',
      '/img/VEÍCULO 34 CESTO AÉREO DUPLO 13 METROS (LINHA VIVA) COM MALÕES E CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.47.35 (2).jpeg',
      '/img/VEÍCULO 34 CESTO AÉREO DUPLO 13 METROS (LINHA VIVA) COM MALÕES E CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.47.35 (3).jpeg',
      '/img/VEÍCULO 34 CESTO AÉREO DUPLO 13 METROS (LINHA VIVA) COM MALÕES E CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.47.35 (4).jpeg',
      '/img/VEÍCULO 34 CESTO AÉREO DUPLO 13 METROS (LINHA VIVA) COM MALÕES E CABINE SUPLEMENTAR/WhatsApp Image 2025-09-03 at 11.47.35 (5).jpeg'
    ],
    capacity_ton: 0.2,
    height_m: 13,
    status: 'available',
    featured: true,
    cabine_suplementar: true,
    carroceria_aberta: false,
    banheiro: false,
    documents: ['CRLV', 'Documentação em dia'],
    features: ['Alcance de 13 metros', 'Linha viva', 'Cabine suplementar', 'Malões para ferramentas'],
    created_at: '2025-09-03T00:00:00Z',
    updated_at: '2025-09-03T00:00:00Z'
  },
  {
    id: '5',
    model: 'Caminhão 3/4 Baú',
    category: 'Caminhão 3/4',
    description: 'Caminhão 3/4 com baú fechado, ideal para transportes de mercadorias e cargas sensíveis.',
    photos: [
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.40.01.jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.40.01 (1).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.40.01 (2).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.40.01 (3).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.40.01 (4).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.40.01 (5).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.40.01 (6).jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.40.01 (7).jpeg'
    ],
    capacity_ton: 3.5,
    height_m: undefined,
    status: 'rented',
    featured: false,
    cabine_suplementar: false,
    carroceria_aberta: false,
    banheiro: false,
    documents: ['CRLV', 'Documentação em dia'],
    features: ['Baú fechado', 'Ideal para cargas sensíveis', 'Versátil para diversos tipos de transporte'],
    created_at: '2025-09-03T00:00:00Z',
    updated_at: '2025-09-03T00:00:00Z'
  },
  {
    id: '6',
    model: 'Munck 25 Toneladas',
    category: 'Caminhão Munck',
    description: 'Caminhão munck de alta capacidade com 25 toneladas, cabine suplementar e carroceria aberta.',
    photos: [
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.18.jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.17.jpeg',
      '/img/VEÍCULO 34 COM CABINE SUPLEMENTAR DE 8 PASSAGEIROS E CARROCERIA ABERTA METALICA/WhatsApp Image 2025-09-03 at 11.37.17 (1).jpeg'
    ],
    capacity_ton: 25,
    height_m: 22,
    status: 'maintenance',
    featured: true,
    cabine_suplementar: true,
    carroceria_aberta: true,
    banheiro: false,
    documents: ['CRLV', 'Documentação em dia'],
    features: ['Alta capacidade de 25 toneladas', 'Cabine suplementar', 'Carroceria aberta metálica', 'Ideal para grandes cargas'],
    created_at: '2025-09-03T00:00:00Z',
    updated_at: '2025-09-03T00:00:00Z'
  }
]

export default function FrotaPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(0)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        
        // Usar cache inteligente para melhor performance
        const response = await fetch('/api/vehicles', {
          cache: 'no-store', // Não usar cache para garantir dados atualizados
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('📡 Dados recebidos da API:', data.vehicles?.length || 0, 'veículos')
          console.log('🖼️ Primeiro veículo com fotos:', data.vehicles?.[0]?.photos?.length || 0, 'fotos')
          setVehicles(data.vehicles || [])
        } else {
          console.error('❌ Erro ao buscar veículos:', response.statusText)
          console.log('🔄 Usando dados locais como fallback...')
          // Fallback para dados locais em caso de erro
          setVehicles(localVehicles)
        }
      } catch (error) {
        console.error('Erro ao buscar veículos:', error)
        // Fallback para dados locais em caso de erro
        setVehicles(localVehicles)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  // Memoizar filtros para melhor performance
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      if (filter === 'all') return true
      if (filter === 'munck') return vehicle.category.toLowerCase().includes('munck')
      if (filter === 'cesto') return vehicle.category.toLowerCase().includes('cesto')
      if (filter === 'caminhão') return vehicle.category.toLowerCase().includes('3/4')
      return true
    })
  }, [vehicles, filter])

  // Paginação para melhor performance
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredVehicles.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredVehicles, currentPage, itemsPerPage])

  const categories = [
    { key: 'all', label: 'Todos' },
    { key: 'munck', label: 'Caminhões Munck' },
    { key: 'cesto', label: 'Cestos Aéreos' },
    { key: 'caminhão', label: 'Caminhões 3/4' },
  ]

  // Memoizar funções de navegação para melhor performance
  const nextImage = useCallback(() => {
    if (selectedVehicle) {
      setCurrentImageIndex((prev) => 
        prev === selectedVehicle.photos.length - 1 ? 0 : prev + 1
      )
    }
  }, [selectedVehicle])

  const prevImage = useCallback(() => {
    if (selectedVehicle) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedVehicle.photos.length - 1 : prev - 1
      )
    }
  }, [selectedVehicle])

  // Callback para rastrear carregamento de imagens
  const handleImageLoad = useCallback(() => {
    setImagesLoaded(prev => prev + 1)
  }, [])


  // Navegação por teclado para o modal de visualização de fotos
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedVehicle || selectedVehicle.photos.length <= 1) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setCurrentImageIndex(prev => 
          prev === 0 ? selectedVehicle.photos.length - 1 : prev - 1
        )
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        setCurrentImageIndex(prev => 
          prev === selectedVehicle.photos.length - 1 ? 0 : prev + 1
        )
      } else if (event.key === 'Escape') {
        event.preventDefault()
        setSelectedVehicle(null)
        setCurrentImageIndex(0)
      }
    }

    if (selectedVehicle) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedVehicle])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobileHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nossa Frota Completa
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Equipamentos modernos e bem conservados para atender todas as suas necessidades
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setFilter(category.key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Grid de Veículos */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="relative h-48">
                  <img
                    src={vehicle.photos?.[0] || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={`${vehicle.brand} ${vehicle.model} - ${vehicle.category}`}
                    className="w-full h-full object-cover cursor-pointer"
                    loading="lazy"
                    onLoad={(e) => {
                      console.log('✅ Imagem carregada com sucesso:', vehicle.photos?.[0])
                      handleImageLoad()
                    }}
                    onError={(e) => {
                      console.error('❌ Erro ao carregar imagem:', vehicle.photos?.[0])
                      console.log('🔄 Tentando imagem de fallback...')
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    }}
                    onClick={() => {
                      console.log('🖼️ Abrindo modal para veículo:', vehicle.id)
                      setSelectedVehicle(vehicle)
                      setCurrentImageIndex(0)
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : vehicle.status === 'rented'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vehicle.status === 'available' ? 'Disponível' : 
                       vehicle.status === 'rented' ? 'Locado' : 
                       vehicle.status === 'maintenance' ? 'Manutenção' : 'Indisponível'}
                    </span>
                  </div>
                  {vehicle.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Destaque
                      </span>
                    </div>
                  )}
                  {vehicle.photos && vehicle.photos.length > 1 && (
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {vehicle.photos.length} fotos
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                  </div>
                  
                  <p className="text-orange-600 font-medium text-sm mb-3">
                    {vehicle.category}
                  </p>

                  {/* Descrição */}
                  <p className="text-gray-600 text-sm mb-4">
                    {vehicle.description}
                  </p>
                  
                  {/* Especificações */}
                  <div className="mb-4 space-y-1">
                    {vehicle.capacity_ton && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Capacidade:</span>
                        <span className="font-medium">{vehicle.capacity_ton}t</span>
                      </div>
                    )}
                    {vehicle.height_m && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Altura:</span>
                        <span className="font-medium">{vehicle.height_m}m</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Features */}
                  <div className="mb-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features?.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Botão - sempre na parte inferior */}
                  <div className="mt-auto">
                    {vehicle.status === 'available' ? (
                      <a
                        href={`/orcamento?vehicle_id=${vehicle.id}`}
                        className="block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors min-h-[48px] flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Solicitar Orçamento
                      </a>
                    ) : (
                      <div className="block w-full text-center py-3 px-4 rounded-lg font-medium min-h-[48px] flex items-center justify-center bg-gray-300 text-gray-500 cursor-not-allowed">
                        {vehicle.status === 'maintenance' ? 'Em Manutenção' : 'Indisponível'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Controles de Paginação */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        )}

        {/* Nenhum veículo encontrado */}
        {!loading && filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum veículo encontrado para o filtro selecionado.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Visualização de Imagens */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedVehicle.brand} {selectedVehicle.model} - {selectedVehicle.category}
                </h3>
                {selectedVehicle.photos.length > 1 && (
                  <p className="text-sm text-gray-500 mt-1">
                    ⌨️ Use ← → para navegar • ESC para fechar
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="relative p-4">
              <img
                src={selectedVehicle.photos[currentImageIndex]}
                alt={`${selectedVehicle.brand} ${selectedVehicle.model} - Imagem ${currentImageIndex + 1}`}
                className="w-full h-96 object-contain rounded"
                onError={(e) => {
                  console.error('Erro ao carregar imagem no modal:', selectedVehicle.photos[currentImageIndex])
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                }}
              />
              
              {selectedVehicle.photos.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg"
                  >
                    →
                  </button>
                  
                  <div className="flex justify-center mt-4 space-x-2">
                    {selectedVehicle.photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="p-4 border-t">
              <p className="text-gray-600 text-sm mb-3">
                {selectedVehicle.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedVehicle.features?.map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Não encontrou o que precisa?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Entre em contato conosco para soluções personalizadas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+5521992154030"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              (21) 99215-4030
            </a>
            <a
              href="mailto:contato@fclocacoes.com.br"
              className="border border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              contato@fclocacoes.com.br
            </a>
          </div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
