'use client'

import { useState, useMemo } from 'react'
import { Vehicle } from '@/lib/supabase'
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface FleetSearchFilterProps {
  vehicles: Vehicle[]
  onFilteredVehicles: (vehicles: Vehicle[]) => void
  onSearchTerm: (term: string) => void
}

export function FleetSearchFilter({ vehicles, onFilteredVehicles, onSearchTerm }: FleetSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [capacityRange, setCapacityRange] = useState<[number, number]>([0, 50])
  const [heightRange, setHeightRange] = useState<[number, number]>([0, 50])
  const [hasCabineSuplementar, setHasCabineSuplementar] = useState<boolean | null>(null)
  const [hasCarroceriaAberta, setHasCarroceriaAberta] = useState<boolean | null>(null)
  const [hasBanheiro, setHasBanheiro] = useState<boolean | null>(null)

  // Extrair categorias únicas dos veículos
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(vehicles.map(v => v.category))]
    return uniqueCategories.sort()
  }, [vehicles])

  // Extrair status únicos dos veículos
  const statusOptions = useMemo(() => {
    const uniqueStatus = [...new Set(vehicles.map(v => v.status))]
    return uniqueStatus.sort()
  }, [vehicles])

  // Extrair features únicas dos veículos
  const allFeatures = useMemo(() => {
    const features = vehicles.flatMap(v => v.features || [])
    const uniqueFeatures = [...new Set(features)]
    return uniqueFeatures.sort()
  }, [vehicles])

  // Calcular ranges de capacidade e altura
  const capacityStats = useMemo(() => {
    const capacities = vehicles.map(v => v.capacity_ton).filter(Boolean) as number[]
    return {
      min: Math.min(...capacities, 0),
      max: Math.max(...capacities, 50)
    }
  }, [vehicles])

  const heightStats = useMemo(() => {
    const heights = vehicles.map(v => v.height_m).filter(Boolean) as number[]
    return {
      min: Math.min(...heights, 0),
      max: Math.max(...heights, 50)
    }
  }, [vehicles])

  // Função de filtro principal
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      // Filtro de busca por texto
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm || 
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower) ||
        vehicle.category.toLowerCase().includes(searchLower) ||
        vehicle.description?.toLowerCase().includes(searchLower) ||
        vehicle.features?.some(feature => feature.toLowerCase().includes(searchLower))

      // Filtro por categoria
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(vehicle.category)

      // Filtro por status
      const matchesStatus = selectedStatus.length === 0 || 
        selectedStatus.includes(vehicle.status)

      // Filtro por features
      const matchesFeatures = selectedFeatures.length === 0 || 
        selectedFeatures.every(feature => vehicle.features?.includes(feature))

      // Filtro por capacidade
      const matchesCapacity = !vehicle.capacity_ton || 
        (vehicle.capacity_ton >= capacityRange[0] && vehicle.capacity_ton <= capacityRange[1])

      // Filtro por altura
      const matchesHeight = !vehicle.height_m || 
        (vehicle.height_m >= heightRange[0] && vehicle.height_m <= heightRange[1])

      // Filtro por características específicas
      const matchesCabineSuplementar = hasCabineSuplementar === null || 
        vehicle.cabine_suplementar === hasCabineSuplementar

      const matchesCarroceriaAberta = hasCarroceriaAberta === null || 
        vehicle.carroceria_aberta === hasCarroceriaAberta

      const matchesBanheiro = hasBanheiro === null || 
        vehicle.banheiro === hasBanheiro

      return matchesSearch && matchesCategory && matchesStatus && matchesFeatures && 
             matchesCapacity && matchesHeight && matchesCabineSuplementar && 
             matchesCarroceriaAberta && matchesBanheiro
    })
  }, [
    vehicles, searchTerm, selectedCategories, selectedStatus, selectedFeatures,
    capacityRange, heightRange, hasCabineSuplementar, hasCarroceriaAberta, hasBanheiro
  ])

  // Atualizar veículos filtrados quando o filtro muda
  useMemo(() => {
    onFilteredVehicles(filteredVehicles)
    onSearchTerm(searchTerm)
  }, [filteredVehicles, searchTerm, onFilteredVehicles, onSearchTerm])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category])
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category))
    }
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatus(prev => [...prev, status])
    } else {
      setSelectedStatus(prev => prev.filter(s => s !== status))
    }
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures(prev => [...prev, feature])
    } else {
      setSelectedFeatures(prev => prev.filter(f => f !== feature))
    }
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
    setSelectedStatus([])
    setSelectedFeatures([])
    setCapacityRange([capacityStats.min, capacityStats.max])
    setHeightRange([heightStats.min, heightStats.max])
    setHasCabineSuplementar(null)
    setHasCarroceriaAberta(null)
    setHasBanheiro(null)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível'
      case 'rented': return 'Locado'
      case 'maintenance': return 'Manutenção'
      default: return status
    }
  }

  const activeFiltersCount = selectedCategories.length + selectedStatus.length + 
    selectedFeatures.length + (hasCabineSuplementar !== null ? 1 : 0) + 
    (hasCarroceriaAberta !== null ? 1 : 0) + (hasBanheiro !== null ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Barra de busca principal - estilo integrado */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campo de busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo, categoria, descrição ou características..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
            />
          </div>
          
          {/* Botão de filtros avançados */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            <Filter className="w-4 h-4" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <span className="bg-white text-orange-500 text-xs font-bold px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            {showAdvancedFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Filtros ativos */}
        {(selectedCategories.length > 0 || selectedStatus.length > 0 || selectedFeatures.length > 0 || 
          hasCabineSuplementar !== null || hasCarroceriaAberta !== null || hasBanheiro !== null) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600 font-medium">Filtros ativos:</span>
            {selectedCategories.map(category => (
              <span key={category} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                {category}
                <button
                  onClick={() => handleCategoryChange(category, false)}
                  className="ml-1 hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedStatus.map(status => (
              <span key={status} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {getStatusLabel(status)}
                <button
                  onClick={() => handleStatusChange(status, false)}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedFeatures.map(feature => (
              <span key={feature} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {feature}
                <button
                  onClick={() => handleFeatureChange(feature, false)}
                  className="ml-1 hover:text-green-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {hasCabineSuplementar !== null && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                {hasCabineSuplementar ? 'Com Cabine' : 'Sem Cabine'}
                <button
                  onClick={() => setHasCabineSuplementar(null)}
                  className="ml-1 hover:text-purple-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {hasCarroceriaAberta !== null && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                {hasCarroceriaAberta ? 'Carroceria Aberta' : 'Carroceria Fechada'}
                <button
                  onClick={() => setHasCarroceriaAberta(null)}
                  className="ml-1 hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {hasBanheiro !== null && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">
                {hasBanheiro ? 'Com Banheiro' : 'Sem Banheiro'}
                <button
                  onClick={() => setHasBanheiro(null)}
                  className="ml-1 hover:text-pink-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700 text-sm font-medium ml-2"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* Filtros avançados - painel deslizante */}
      {showAdvancedFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Categorias */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Categorias</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={(e) => handleCategoryChange(category, e.target.checked)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Status</h4>
              <div className="space-y-2">
                {statusOptions.map(status => (
                  <label key={status} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatus.includes(status)}
                      onChange={(e) => handleStatusChange(status, e.target.checked)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{getStatusLabel(status)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Características Específicas */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Características</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCabineSuplementar === true}
                    onChange={(e) => setHasCabineSuplementar(e.target.checked ? true : null)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Cabine Suplementar</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCarroceriaAberta === true}
                    onChange={(e) => setHasCarroceriaAberta(e.target.checked ? true : null)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Carroceria Aberta</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBanheiro === true}
                    onChange={(e) => setHasBanheiro(e.target.checked ? true : null)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Banheiro</span>
                </label>
              </div>
            </div>
          </div>

          {/* Features */}
          {allFeatures.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Características Técnicas</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allFeatures.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature)}
                      onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Ranges de Capacidade e Altura */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Capacidade */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Capacidade (toneladas)</h4>
              <div className="px-2">
                <input
                  type="range"
                  min={capacityStats.min}
                  max={capacityStats.max}
                  value={capacityRange[1]}
                  onChange={(e) => setCapacityRange([capacityRange[0], Number(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{capacityRange[0]}t</span>
                  <span>{capacityRange[1]}t</span>
                </div>
              </div>
            </div>

            {/* Altura */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Altura (metros)</h4>
              <div className="px-2">
                <input
                  type="range"
                  min={heightStats.min}
                  max={heightStats.max}
                  value={heightRange[1]}
                  onChange={(e) => setHeightRange([heightRange[0], Number(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{heightRange[0]}m</span>
                  <span>{heightRange[1]}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="text-center text-gray-600 text-sm">
        {filteredVehicles.length} de {vehicles.length} veículos encontrados
        {searchTerm && ` para "${searchTerm}"`}
      </div>
    </div>
  )
}