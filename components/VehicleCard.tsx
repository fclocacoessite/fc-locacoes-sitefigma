import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Eye, Calendar, Gauge, Weight, Users } from 'lucide-react';

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    category: string;
    image: string;
    specs: {
      capacity: string;
      height?: string;
      reach?: string;
      year: string;
    };
    available: boolean;
    price: string;
  };
  variant?: 'grid' | 'list';
}

export function VehicleCard({ vehicle, variant = 'grid' }: VehicleCardProps) {
  const isGrid = variant === 'grid';

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 hover:border-fc-orange border-2 border-transparent ${
      isGrid ? '' : 'flex flex-row'
    }`}>
      <div className={`relative ${isGrid ? '' : 'w-1/3'}`}>
        <ImageWithFallback
          src={vehicle.image}
          alt={vehicle.name}
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isGrid ? 'h-48 rounded-t-lg' : 'h-full rounded-l-lg'
          }`}
        />
        
        {/* Availability Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            className={`${
              vehicle.available 
                ? 'fc-orange text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {vehicle.available ? 'Disponível' : 'Locado'}
          </Badge>
        </div>

        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-fc-dark-gray/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
          <Button variant="ghost" className="text-white hover:bg-white/20">
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </div>

      <CardContent className={`p-6 ${isGrid ? '' : 'flex-1'}`}>
        {/* Category */}
        <div className="text-xs font-medium text-fc-orange uppercase tracking-wider mb-2">
          {vehicle.category}
        </div>

        {/* Vehicle Name */}
        <h3 className="text-fc-dark-gray font-semibold mb-3 group-hover:text-fc-orange transition-colors">
          {vehicle.name}
        </h3>

        {/* Specifications */}
        <div className={`space-y-2 mb-4 ${isGrid ? '' : 'grid grid-cols-2 gap-4'}`}>
          <div className="flex items-center text-sm text-fc-medium-gray">
            <Weight className="w-4 h-4 mr-2" />
            <span>{vehicle.specs.capacity}</span>
          </div>
          
          {vehicle.specs.height && (
            <div className="flex items-center text-sm text-fc-medium-gray">
              <Gauge className="w-4 h-4 mr-2" />
              <span>Altura: {vehicle.specs.height}</span>
            </div>
          )}
          
          {vehicle.specs.reach && (
            <div className="flex items-center text-sm text-fc-medium-gray">
              <Users className="w-4 h-4 mr-2" />
              <span>Alcance: {vehicle.specs.reach}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-fc-medium-gray">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{vehicle.specs.year}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className={`${isGrid ? '' : 'flex justify-between items-center'}`}>
          <div className="mb-4">
            <div className="text-xs text-fc-medium-gray">A partir de</div>
            <div className="text-xl font-bold text-fc-orange">{vehicle.price}</div>
          </div>

          <Button 
            className={`w-full fc-orange hover:bg-orange-600 text-white ${
              isGrid ? '' : 'w-auto ml-4'
            }`}
            disabled={!vehicle.available}
          >
            {vehicle.available ? 'Solicitar Orçamento' : 'Indisponível'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}