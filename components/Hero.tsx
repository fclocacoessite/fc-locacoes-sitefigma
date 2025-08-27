import { Button } from './ui/button';
import { Play, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1558618666-fbd51c2cd47a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Caminhões Munck em operação"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-fc-dark-gray/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full fc-orange text-white text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Disponível 24h
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Locação de <span className="text-fc-orange">Caminhões Munck</span> e Cestos Aéreos
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 mb-8 max-w-xl">
              Soluções completas em içamento e transporte para sua obra. Frota moderna, operadores qualificados e atendimento em toda Grande São Paulo.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="fc-orange hover:bg-orange-600 text-white px-8 py-4">
                <ChevronRight className="w-5 h-5 mr-2" />
                Solicitar Orçamento
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-fc-dark-gray px-8 py-4"
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Nossa Frota
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-fc-orange">15+</div>
                <div className="text-sm text-gray-300">Anos de Experiência</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-fc-orange">200+</div>
                <div className="text-sm text-gray-300">Clientes Atendidos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-fc-orange">24h</div>
                <div className="text-sm text-gray-300">Atendimento</div>
              </div>
            </div>
          </div>

          {/* Features Cards */}
          <div className="space-y-4">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h3 className="text-fc-dark-gray font-semibold mb-2">Caminhões Munck</h3>
              <p className="text-fc-medium-gray text-sm">Capacidade de 3 a 70 toneladas para içamento e transporte de cargas pesadas.</p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h3 className="text-fc-dark-gray font-semibold mb-2">Cestos Aéreos</h3>
              <p className="text-fc-medium-gray text-sm">Altura até 45 metros para trabalhos em altura com máxima segurança.</p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h3 className="text-fc-dark-gray font-semibold mb-2">Caminhões 3/4</h3>
              <p className="text-fc-medium-gray text-sm">Transporte de materiais e equipamentos com agilidade e eficiência.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center text-white">
          <span className="text-xs mb-2 text-gray-300">Role para baixo</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}