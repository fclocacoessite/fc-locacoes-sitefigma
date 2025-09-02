'use client'

import { Footer } from '@/components/Footer'
import { MobileHeader } from '@/components/MobileHeader'
import { 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  Shield, 
  Target, 
  Heart,
  Star,
  CheckCircle,
  TrendingUp,
  Globe,
  Building2,
  Handshake
} from 'lucide-react'

export default function SobrePage() {
  const stats = [
    {
      icon: Truck,
      number: '50+',
      label: 'Veículos na Frota',
      description: 'Ampla variedade de equipamentos'
    },
    {
      icon: Users,
      number: '500+',
      label: 'Clientes Atendidos',
      description: 'Satisfação garantida'
    },
    {
      icon: Clock,
      number: '10+',
      label: 'Anos de Experiência',
      description: 'Mercado consolidado'
    },
    {
      icon: Award,
      number: '98%',
      label: 'Taxa de Aprovação',
      description: 'Qualidade reconhecida'
    }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Priorizamos a segurança em todas as operações, garantindo equipamentos em perfeito estado e procedimentos rigorosos.'
    },
    {
      icon: Target,
      title: 'Qualidade',
      description: 'Comprometimento com a excelência em todos os serviços, desde a manutenção dos veículos até o atendimento ao cliente.'
    },
    {
      icon: Heart,
      title: 'Confiança',
      description: 'Construímos relacionamentos duradouros baseados na transparência, honestidade e cumprimento dos compromissos.'
    },
    {
      icon: Handshake,
      title: 'Parceria',
      description: 'Trabalhamos em conjunto com nossos clientes para encontrar as melhores soluções para cada projeto.'
    }
  ]

  const team = [
    {
      name: 'João Silva',
      role: 'Diretor Executivo',
      experience: '15 anos no setor',
      description: 'Especialista em gestão de frotas e operações logísticas.'
    },
    {
      name: 'Maria Santos',
      role: 'Gerente de Operações',
      experience: '12 anos de experiência',
      description: 'Responsável pela coordenação de todas as operações de locação.'
    },
    {
      name: 'Carlos Oliveira',
      role: 'Supervisor Técnico',
      experience: '10 anos na área',
      description: 'Garante a manutenção e qualidade de todos os equipamentos.'
    },
    {
      name: 'Ana Costa',
      role: 'Coordenadora Comercial',
      experience: '8 anos de atuação',
      description: 'Desenvolve e mantém relacionamentos com clientes estratégicos.'
    }
  ]

  const milestones = [
    {
      year: '2014',
      title: 'Fundação da Empresa',
      description: 'Início das operações com 5 veículos na frota.'
    },
    {
      year: '2016',
      title: 'Expansão da Frota',
      description: 'Ampliação para 20 veículos e primeiro contrato corporativo.'
    },
    {
      year: '2018',
      title: 'Certificação ISO',
      description: 'Conquista da certificação ISO 9001 de qualidade.'
    },
    {
      year: '2020',
      title: 'Presença Digital',
      description: 'Lançamento do site e sistema online de orçamentos.'
    },
    {
      year: '2022',
      title: 'Expansão Regional',
      description: 'Abertura de filial em São Paulo e ampliação para 50+ veículos.'
    },
    {
      year: '2024',
      title: 'Inovação Tecnológica',
      description: 'Implementação de sistema de rastreamento e gestão inteligente.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sobre a FC Locações
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Uma década de excelência em locação de veículos e equipamentos para construção e logística
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa História
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Desde 2014, a FC Locações tem sido sinônimo de confiança e qualidade no setor de locação de veículos e equipamentos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {milestone.title}
                </h3>
                <p className="text-gray-600">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Missão */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
              <p className="text-gray-600">
                Fornecer soluções completas em locação de veículos e equipamentos, 
                contribuindo para o sucesso dos projetos de nossos clientes através 
                de serviços de qualidade, pontualidade e segurança.
              </p>
            </div>

            {/* Visão */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Visão</h3>
              <p className="text-gray-600">
                Ser referência nacional em locação de equipamentos, reconhecida pela 
                excelência operacional, inovação tecnológica e compromisso com a 
                sustentabilidade e o desenvolvimento do setor.
              </p>
            </div>

            {/* Valores */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossos Valores</h3>
              <p className="text-gray-600">
                Ética, transparência, responsabilidade social, inovação e foco no 
                cliente são os pilares que guiam todas as nossas ações e decisões.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores Detalhados */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores em Ação
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cada valor representa um compromisso que assumimos com nossos clientes, 
              colaboradores e sociedade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Números que Falam por Si
            </h2>
            <p className="text-xl opacity-90">
              Resultados que demonstram nossa dedicação e crescimento constante
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg font-semibold mb-2">{stat.label}</div>
                <div className="text-sm opacity-80">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Profissionais experientes e dedicados que fazem a diferença todos os dias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <div className="text-orange-600 font-medium mb-2">
                  {member.role}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  {member.experience}
                </div>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que Escolher a FC Locações?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Diferenciais que nos tornam a escolha certa para seu projeto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Frota Moderna
                </h3>
              </div>
              <p className="text-gray-600">
                Veículos e equipamentos sempre atualizados e em perfeito estado de conservação.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Suporte 24/7
                </h3>
              </div>
              <p className="text-gray-600">
                Atendimento disponível 24 horas por dia, 7 dias por semana para emergências.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Preços Competitivos
                </h3>
              </div>
              <p className="text-gray-600">
                Melhor custo-benefício do mercado com opções flexíveis de pagamento.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Entrega Rápida
                </h3>
              </div>
              <p className="text-gray-600">
                Agilidade na entrega e retirada dos equipamentos em qualquer local.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Documentação Completa
                </h3>
              </div>
              <p className="text-gray-600">
                Todos os documentos necessários para sua operação em conformidade com a lei.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Experiência Comprovada
                </h3>
              </div>
              <p className="text-gray-600">
                Mais de uma década de experiência no mercado com centenas de clientes satisfeitos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar no sucesso do seu projeto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/orcamento"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              Solicitar Orçamento
            </a>
            <a
              href="/contato"
              className="inline-flex items-center px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Falar Conosco
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
