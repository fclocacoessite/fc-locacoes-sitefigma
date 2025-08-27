import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet,
  X,
  Star,
  Users,
  Award,
  Clock
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SitePreviewProps {
  brandSettings?: {
    primaryColor: string;
    darkGray: string;
    mediumGray: string;
    lightGray: string;
    logo: string;
    companyName: string;
    tagline: string;
  };
  heroSettings?: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
    showStats: boolean;
  };
  companySettings?: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
}

export function SitePreview({ 
  brandSettings = {
    primaryColor: '#FF5722',
    darkGray: '#1E1E1E',
    mediumGray: '#B3B3B3',
    lightGray: '#F5F5F5',
    logo: '',
    companyName: 'FC Locações',
    tagline: 'Soluções em Locação de Equipamentos'
  },
  heroSettings = {
    title: 'Locação de Caminhões Munck e Equipamentos',
    subtitle: 'Equipamentos de qualidade para sua obra com segurança e eficiência',
    backgroundImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    ctaText: 'Solicitar Orçamento',
    showStats: true
  },
  companySettings = {
    name: 'FC Locações',
    phone: '(11) 99999-9999',
    email: 'contato@fclocacoes.com.br',
    address: 'São Paulo, SP'
  }
}: SitePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile': return 'w-80 h-[640px]';
      case 'tablet': return 'w-[768px] h-[600px]';
      default: return 'w-full h-[600px]';
    }
  };

  const mockVehicles = [
    {
      name: 'Caminhão Munck 12T',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: 'R$ 800/dia'
    },
    {
      name: 'Cesto Aéreo 20m',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: 'R$ 650/dia'
    },
    {
      name: 'Caminhão 3/4',
      image: 'https://images.unsplash.com/photo-1580407196238-dac33f57c410?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: 'R$ 350/dia'
    }
  ];

  const PreviewContent = () => (
    <div 
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${getViewportClass()}`}
      style={{ 
        fontSize: viewMode === 'mobile' ? '12px' : viewMode === 'tablet' ? '14px' : '16px'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ backgroundColor: brandSettings.lightGray }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {brandSettings.logo ? (
              <ImageWithFallback
                src={brandSettings.logo}
                alt="Logo"
                className="h-8 object-contain"
              />
            ) : (
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: brandSettings.primaryColor }}
              >
                {brandSettings.companyName.charAt(0)}
              </div>
            )}
            <div>
              <h1 
                className="font-bold text-sm"
                style={{ color: brandSettings.darkGray }}
              >
                {brandSettings.companyName}
              </h1>
              {viewMode !== 'mobile' && (
                <p 
                  className="text-xs"
                  style={{ color: brandSettings.mediumGray }}
                >
                  {brandSettings.tagline}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 rounded text-xs font-medium text-white"
              style={{ backgroundColor: brandSettings.primaryColor }}
            >
              {heroSettings.ctaText}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="relative p-8 text-center text-white"
        style={{
          backgroundImage: heroSettings.backgroundImage 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroSettings.backgroundImage})`
            : `linear-gradient(135deg, ${brandSettings.primaryColor}, ${brandSettings.darkGray})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: viewMode === 'mobile' ? '200px' : '250px'
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            {heroSettings.title}
          </h2>
          <p className="text-sm md:text-base mb-6 opacity-90">
            {heroSettings.subtitle}
          </p>
          <button 
            className="px-6 py-2 rounded font-medium text-white text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: brandSettings.primaryColor }}
          >
            {heroSettings.ctaText}
          </button>
        </div>

        {/* Stats (if enabled) */}
        {heroSettings.showStats && viewMode !== 'mobile' && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">50+</div>
                <div className="text-xs opacity-75">Veículos</div>
              </div>
              <div>
                <div className="text-lg font-bold">1000+</div>
                <div className="text-xs opacity-75">Clientes</div>
              </div>
              <div>
                <div className="text-lg font-bold">10+</div>
                <div className="text-xs opacity-75">Anos</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Featured Fleet Section */}
      <div className="p-6">
        <h3 
          className="text-lg font-bold mb-4 text-center"
          style={{ color: brandSettings.darkGray }}
        >
          Nossa Frota em Destaque
        </h3>
        
        <div className={`grid gap-4 ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {mockVehicles.map((vehicle, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-24 object-cover"
              />
              <div className="p-3">
                <h4 
                  className="font-medium text-sm"
                  style={{ color: brandSettings.darkGray }}
                >
                  {vehicle.name}
                </h4>
                <p 
                  className="text-sm font-bold mt-1"
                  style={{ color: brandSettings.primaryColor }}
                >
                  {vehicle.price}
                </p>
                <button 
                  className="w-full mt-2 px-3 py-1 rounded text-xs font-medium border transition-colors"
                  style={{ 
                    borderColor: brandSettings.primaryColor,
                    color: brandSettings.primaryColor
                  }}
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div 
        className="p-6"
        style={{ backgroundColor: brandSettings.lightGray }}
      >
        <h3 
          className="text-lg font-bold mb-4 text-center"
          style={{ color: brandSettings.darkGray }}
        >
          O que nossos clientes dizem
        </h3>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <div className="flex space-x-1">
              {[1,2,3,4,5].map(star => (
                <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <p className="text-sm mb-2" style={{ color: brandSettings.darkGray }}>
            &quot;Excelente serviço! Equipamentos de qualidade e equipe muito profissional.&quot;
          </p>
          <p className="text-xs" style={{ color: brandSettings.mediumGray }}>
            - João Silva, Construtora ABC
          </p>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="p-4 text-center"
        style={{ 
          backgroundColor: brandSettings.darkGray,
          color: 'white'
        }}
      >
        <div className="text-xs space-y-1">
          <p className="font-medium">{companySettings.name}</p>
          <p>{companySettings.phone} | {companySettings.email}</p>
          <p>{companySettings.address}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
          <Eye className="w-4 h-4 mr-2" />
          Preview do Site
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Preview do Site</DialogTitle>
            
            {/* Viewport Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex justify-center overflow-auto">
          <PreviewContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}