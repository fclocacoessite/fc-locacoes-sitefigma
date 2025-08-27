import { VehicleCard } from './VehicleCard';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';

export function FeaturedFleet() {
  const featuredVehicles = [
    {
      id: '1',
      name: 'Munck 12 Toneladas',
      category: 'Caminhão Munck',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: {
        capacity: '12 toneladas',
        reach: '15 metros',
        year: '2022'
      },
      available: true,
      price: 'R$ 800/dia'
    },
    {
      id: '2',
      name: 'Cesto Aéreo 20m',
      category: 'Cesto Aéreo',
      image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: {
        capacity: '200 kg',
        height: '20 metros',
        year: '2023'
      },
      available: true,
      price: 'R$ 650/dia'
    },
    {
      id: '3',
      name: 'Caminhão 3/4',
      category: 'Transporte',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: {
        capacity: '3,5 toneladas',
        year: '2021'
      },
      available: false,
      price: 'R$ 350/dia'
    },
    {
      id: '4',
      name: 'Munck 25 Toneladas',
      category: 'Caminhão Munck',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: {
        capacity: '25 toneladas',
        reach: '22 metros',
        year: '2023'
      },
      available: true,
      price: 'R$ 1.200/dia'
    },
    {
      id: '5',
      name: 'Cesto Aéreo 35m',
      category: 'Cesto Aéreo',
      image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: {
        capacity: '230 kg',
        height: '35 metros',
        year: '2022'
      },
      available: true,
      price: 'R$ 950/dia'
    },
    {
      id: '6',
      name: 'Munck Articulado 15T',
      category: 'Caminhão Munck',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      specs: {
        capacity: '15 toneladas',
        reach: '18 metros',
        year: '2022'
      },
      available: true,
      price: 'R$ 950/dia'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 text-fc-orange text-sm font-medium mb-4">
            Nossa Frota
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-fc-dark-gray mb-4">
            Veículos Disponíveis para Locação
          </h2>
          <p className="text-lg text-fc-medium-gray max-w-3xl mx-auto">
            Frota moderna e bem conservada, com manutenção preventiva rigorosa e operadores qualificados para garantir a segurança e eficiência do seu projeto.
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Service Areas */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-fc-dark-gray mb-6 text-center">
            Áreas Atendidas
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'São Paulo', 'ABC Paulista', 'Guarulhos', 'Osasco', 'Barueri',
              'Alphaville', 'Cotia', 'Itapecerica', 'Taboão da Serra', 'Embu'
            ].map((area) => (
              <span
                key={area}
                className="px-4 py-2 fc-orange text-white rounded-full text-sm font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="fc-orange hover:bg-orange-600 text-white px-8">
            <ChevronRight className="w-5 h-5 mr-2" />
            Ver Frota Completa
          </Button>
        </div>
      </div>
    </section>
  );
}