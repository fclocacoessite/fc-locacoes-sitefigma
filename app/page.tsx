import { MobileHeader } from '@/components/MobileHeader'

export default function Home() {
  return (
    <main className="min-h-screen">
      <MobileHeader />
      
      {/* Hero Section - Versão Completa */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fbd51c2cd47a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Caminhões Munck em operação"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              {/* Badge removido */}

              {/* Main Headline */}
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Locação de <span className="text-orange-500">Caminhões Munck</span> e Cestos Aéreos
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-300 mb-8 max-w-xl">
                Soluções completas em içamento e transporte para sua obra. Frota moderna, operadores qualificados e atendimento em toda Grande São Paulo.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a href="/orcamento" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  Solicitar Orçamento
                </a>
                <a href="/frota" className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Ver Nossa Frota
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold text-orange-500">15+</div>
                  <div className="text-sm text-gray-300">Anos de Experiência</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500">200+</div>
                  <div className="text-sm text-gray-300">Clientes Atendidos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500">24h</div>
                  <div className="text-sm text-gray-300">Atendimento</div>
                </div>
              </div>
            </div>

            {/* Features Cards */}
            <div className="space-y-4">
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <h3 className="text-gray-800 font-semibold mb-2">Caminhões Munck</h3>
                <p className="text-gray-600 text-sm">Capacidade de 3 a 70 toneladas para içamento e transporte de cargas pesadas.</p>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <h3 className="text-gray-800 font-semibold mb-2">Cestos Aéreos</h3>
                <p className="text-gray-600 text-sm">Altura até 45 metros para trabalhos em altura com máxima segurança.</p>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <h3 className="text-gray-800 font-semibold mb-2">Caminhões 3/4</h3>
                <p className="text-gray-600 text-sm">Transporte de materiais e equipamentos com agilidade e eficiência.</p>
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

      {/* Frota Featured Section */}
      <section id="frota" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 text-orange-500 text-sm font-medium mb-4">
              Nossa Frota
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Veículos Disponíveis para Locação
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Frota moderna e bem conservada, com manutenção preventiva rigorosa e operadores qualificados para garantir a segurança e eficiência do seu projeto.
            </p>
          </div>

          {/* Vehicle Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Vehicle 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
              <img 
                src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Munck 12 Toneladas"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">Munck 12 Toneladas</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Disponível</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Caminhão Munck</p>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div>Capacidade: 12 toneladas</div>
                  <div>Alcance: 15 metros</div>
                  <div>Ano: 2022</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-orange-500">R$ 800/dia</span>
                  <a href="/orcamento" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm">
                    Solicitar
                  </a>
                </div>
              </div>
            </div>

            {/* Vehicle 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
              <img 
                src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Cesto Aéreo 20m"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">Cesto Aéreo 20m</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Disponível</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Cesto Aéreo</p>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div>Capacidade: 200 kg</div>
                  <div>Altura: 20 metros</div>
                  <div>Ano: 2023</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-orange-500">R$ 650/dia</span>
                  <a href="/orcamento" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm">
                    Solicitar
                  </a>
                </div>
              </div>
            </div>

            {/* Vehicle 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
              <img 
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Caminhão 3/4"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">Caminhão 3/4</h3>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Locado</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Transporte</p>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div>Capacidade: 3,5 toneladas</div>
                  <div>Ano: 2021</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-500">R$ 350/dia</span>
                  <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded text-sm" disabled>
                    Indisponível
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Áreas Atendidas
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'São Paulo', 'ABC Paulista', 'Guarulhos', 'Osasco', 'Barueri',
                'Alphaville', 'Cotia', 'Itapecerica', 'Taboão da Serra', 'Embu'
              ].map((area) => (
                <span
                  key={area}
                  className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a href="/frota" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg flex items-center mx-auto w-fit">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              Ver Frota Completa
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mais de 200 empresas confiam na FC Locações para seus projetos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Cliente"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">João Silva</h4>
                  <p className="text-sm text-gray-600">Construção Civil</p>
                </div>
              </div>
              <p className="text-gray-700">&quot;Excelente serviço! Equipamentos sempre em perfeito estado e entrega pontual. Recomendo!&quot;</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Cliente"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Maria Santos</h4>
                  <p className="text-sm text-gray-600">Indústria</p>
                </div>
              </div>
              <p className="text-gray-700">&quot;Parceiros confiáveis há mais de 3 anos. Sempre resolvem nossos problemas de logística rapidamente.&quot;</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  alt="Cliente"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Carlos Oliveira</h4>
                  <p className="text-sm text-gray-600">Engenharia</p>
                </div>
              </div>
              <p className="text-gray-700">&quot;Profissionais competentes e equipamentos de primeira linha. Melhor custo-benefício da região.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 text-orange-500 text-sm font-medium mb-6">
                Sobre a FC Locações
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Mais de 15 anos de experiência em locação de equipamentos
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A FC Locações é uma empresa especializada em locação de caminhões munck, cestos aéreos e equipamentos para construção civil. 
                Oferecemos soluções completas para empresas que buscam qualidade, segurança e eficiência em seus projetos.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">Frota Moderna</h3>
                    <p className="text-gray-600">Equipamentos novos e bem conservados com manutenção preventiva rigorosa</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">Operadores Qualificados</h3>
                    <p className="text-gray-600">Profissionais certificados e experientes para garantir a segurança da operação</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">Atendimento 24h</h3>
                    <p className="text-gray-600">Suporte técnico e atendimento disponível 24 horas por dia, 7 dias por semana</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">15+</div>
                  <div className="text-sm text-gray-600">Anos de experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">500+</div>
                  <div className="text-sm text-gray-600">Projetos realizados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">50+</div>
                  <div className="text-sm text-gray-600">Veículos na frota</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Equipe FC Locações"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Entre em Contato
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estamos prontos para atender suas necessidades 24h por dia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Telefone</h3>
              <p className="text-gray-600">(21) 99215-4030</p>
              <p className="text-sm text-gray-500">24h por dia</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">E-mail</h3>
              <p className="text-gray-600">contato@fclocacoes.com.br</p>
              <p className="text-sm text-gray-500">Respondemos em 2h</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Localização</h3>
              <p className="text-gray-600">São Paulo, SP</p>
              <p className="text-sm text-gray-500">Grande São Paulo</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Horário</h3>
              <p className="text-gray-600">Seg-Sex: 7h-18h</p>
              <p className="text-sm text-gray-500">Emergência: 24h</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a
              href="/orcamento"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Solicitar Orçamento Agora
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/logo-fc.jpg" 
                  alt="FC Locações" 
                  className="w-8 h-8 object-cover rounded-lg"
                />
                <span className="font-bold text-lg">FC Locações</span>
              </div>
              <p className="text-gray-400 text-sm">
                Soluções completas em locação de equipamentos para construção civil e indústria.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Caminhões Munck</li>
                <li>Cestos Aéreos</li>
                <li>Caminhões 3/4</li>
                <li>Transporte</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>(21) 99215-4030</li>
                <li>contato@fclocacoes.com.br</li>
                <li>Nova Iguaçu, RJ</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Horário</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Segunda a Sexta: 7h às 18h</li>
                <li>Sábado: 8h às 12h</li>
                <li>Emergência: 24h</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 mt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 FC Locações. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
} 