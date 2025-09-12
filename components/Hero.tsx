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
      <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-3 lg:px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-center">
          <div className="text-white order-2 lg:order-1">
            {/* Main Headline */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 leading-tight">
              Locação de <span className="text-fc-orange">Caminhões Munck</span> e Cestos Aéreos
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 max-w-lg leading-relaxed">
              Soluções completas em içamento e transporte para sua obra. Frota moderna, operadores qualificados e atendimento em toda região de Nova Iguaçu.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
              <Button size="sm" className="fc-orange hover:bg-orange-600 text-white px-4 sm:px-5 py-2 text-xs sm:text-sm">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                Solicitar Orçamento
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-fc-dark-gray px-4 sm:px-5 py-2 text-xs sm:text-sm"
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                Ver Nossa Frota
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 pt-3 sm:pt-4 border-t border-white/20">
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl font-bold text-fc-orange">15+</div>
                <div className="text-xs text-gray-300">Anos de Experiência</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl font-bold text-fc-orange">200+</div>
                <div className="text-xs text-gray-300">Clientes Atendidos</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl font-bold text-fc-orange">24h</div>
                <div className="text-xs text-gray-300">Atendimento</div>
              </div>
            </div>
          </div>

          {/* Features Cards */}
          <div className="space-y-0.5 order-1 lg:order-2">
            <div className="bg-white/95 backdrop-blur-sm px-1.5 py-1 rounded shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-fc-dark-gray font-semibold text-xs">Caminhões Munck</h3>
              <p className="text-fc-medium-gray text-xs leading-tight">Capacidade de 3 a 70 toneladas para içamento e transporte de cargas pesadas.</p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm px-1.5 py-1 rounded shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-fc-dark-gray font-semibold text-xs">Cestos Aéreos</h3>
              <p className="text-fc-medium-gray text-xs leading-tight">Altura até 45 metros para trabalhos em altura com máxima segurança.</p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm px-1.5 py-1 rounded shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-fc-dark-gray font-semibold text-xs">Caminhões 3/4</h3>
              <p className="text-fc-medium-gray text-xs leading-tight">Transporte de materiais e equipamentos com agilidade e eficiência.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center text-white">
          <span className="text-xs mb-1 text-gray-300">Role para baixo</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-1.5 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}