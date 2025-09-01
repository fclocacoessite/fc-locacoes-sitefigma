'use client'

import { useState, useEffect } from 'react'
import { Vehicle } from '@/lib/supabase'
import { MobileHeader } from '@/components/MobileHeader'
import { Footer } from '@/components/Footer'

export default function FrotaPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      setVehicles(data.vehicles || [])
    } catch (error) {
      console.error('Erro ao carregar veículos:', error)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filter === 'all') return true
    return vehicle.category.toLowerCase().includes(filter.toLowerCase())
  })

  const categories = [
    { key: 'all', label: 'Todos' },
    { key: 'munck', label: 'Caminhões Munck' },
    { key: 'cesto', label: 'Cestos Aéreos' },
    { key: 'caminhão', label: 'Caminhões 3/4' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
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
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img
                    src={vehicle.photos?.[0] || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={`${vehicle.category} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status === 'available' ? 'Disponível' : 'Locado'}
                    </span>
                  </div>
                  {vehicle.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Destaque
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {vehicle.model}
                    </h3>
                  </div>
                  
                  <p className="text-orange-600 font-medium text-sm mb-3">
                    {vehicle.category}
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
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {vehicle.cabine_suplementar && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          Cabine Suplementar
                        </span>
                      )}
                      {vehicle.carroceria_aberta && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          Carroceria Aberta
                        </span>
                      )}
                      {vehicle.banheiro && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          Banheiro
                        </span>
                      )}
                      {vehicle.documents && vehicle.documents.length > 0 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {vehicle.documents.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Botão */}
                  <a
                    href={`/orcamento?vehicle_id=${vehicle.id}`}
                    className={`block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors ${
                      vehicle.status === 'available'
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {vehicle.status === 'available' ? 'Solicitar Orçamento' : 'Indisponível'}
                  </a>
                </div>
              </div>
            ))}
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
              href="tel:+5511999999999"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              (11) 9999-9999
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

      {/* Footer */}
      <Footer />
    </div>
  )
}
