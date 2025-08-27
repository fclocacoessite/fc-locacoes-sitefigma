import { useState } from 'react';
import { VehicleCard } from './VehicleCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Filter, X, Grid, List, SlidersHorizontal } from 'lucide-react';

export function FleetCatalog() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const vehicles = [
    {
      id: '1',
      name: 'Munck 8 Toneladas',
      category: 'Caminhão Munck',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: { capacity: '8 toneladas', reach: '12 metros', year: '2021' },
      available: true,
      price: 'R$ 650/dia'
    },
    {
      id: '2',
      name: 'Munck 12 Toneladas',
      category: 'Caminhão Munck',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: { capacity: '12 toneladas', reach: '15 metros', year: '2022' },
      available: true,
      price: 'R$ 800/dia'
    },
    {
      id: '3',
      name: 'Cesto Aéreo 15m',
      category: 'Cesto Aéreo',
      image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: { capacity: '200 kg', height: '15 metros', year: '2020' },
      available: false,
      price: 'R$ 500/dia'
    },
    {
      id: '4',
      name: 'Cesto Aéreo 20m',
      category: 'Cesto Aéreo',
      image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: { capacity: '200 kg', height: '20 metros', year: '2023' },
      available: true,
      price: 'R$ 650/dia'
    },
    {
      id: '5',
      name: 'Caminhão 3/4 Baú',
      category: 'Transporte',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: { capacity: '3,5 toneladas', year: '2021' },
      available: true,
      price: 'R$ 350/dia'
    },
    {
      id: '6',
      name: 'Munck 25 Toneladas',
      category: 'Caminhão Munck',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: { capacity: '25 toneladas', reach: '22 metros', year: '2023' },
      available: true,
      price: 'R$ 1.200/dia'
    }
  ];

  const categories = ['Caminhão Munck', 'Cesto Aéreo', 'Transporte'];
  const years = ['2023', '2022', '2021', '2020'];
  const availability = ['Disponível', 'Todos'];

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const FiltersPanel = () => (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-fc-dark-gray">Filtros</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilters([])}
            className="text-fc-medium-gray hover:text-fc-orange"
          >
            Limpar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="font-medium text-fc-dark-gray mb-3">Categoria</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={category}
                  className="border-fc-medium-gray data-[state=checked]:bg-fc-orange data-[state=checked]:border-fc-orange"
                />
                <label 
                  htmlFor={category}
                  className="text-sm text-fc-dark-gray cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <h4 className="font-medium text-fc-dark-gray mb-3">Disponibilidade</h4>
          <div className="space-y-2">
            {availability.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox 
                  id={status}
                  className="border-fc-medium-gray data-[state=checked]:bg-fc-orange data-[state=checked]:border-fc-orange"
                />
                <label 
                  htmlFor={status}
                  className="text-sm text-fc-dark-gray cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div>
          <h4 className="font-medium text-fc-dark-gray mb-3">Ano</h4>
          <div className="space-y-2">
            {years.map((year) => (
              <div key={year} className="flex items-center space-x-2">
                <Checkbox 
                  id={year}
                  className="border-fc-medium-gray data-[state=checked]:bg-fc-orange data-[state=checked]:border-fc-orange"
                />
                <label 
                  htmlFor={year}
                  className="text-sm text-fc-dark-gray cursor-pointer"
                >
                  {year}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-medium text-fc-dark-gray mb-3">Faixa de Preço</h4>
          <div className="px-2">
            <Slider
              defaultValue={[300, 1500]}
              max={2000}
              min={200}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-fc-medium-gray mt-2">
              <span>R$ 200/dia</span>
              <span>R$ 2.000/dia</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-fc-dark-gray">
                Nossa Frota
              </h1>
              <p className="text-fc-medium-gray mt-1">
                {vehicles.length} veículos disponíveis
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  className="fc-orange text-white pr-1"
                >
                  {filter}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filter)}
                    className="ml-1 h-auto p-0 text-white hover:text-white/80"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FiltersPanel />
          </div>

          {/* Vehicle Grid/List */}
          <div className="flex-1">
            <div className={`${
              viewMode === 'grid' 
                ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-6'
            }`}>
              {vehicles.map((vehicle) => (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle}
                  variant={viewMode}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                className="border-fc-orange text-fc-orange hover:bg-fc-orange hover:text-white"
              >
                Carregar Mais Veículos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}