'use client'

import { ResponsiveHeader } from '@/components/ResponsiveHeader'
import { Footer } from '@/components/Footer'
import { ConsignFloatingButton } from '@/components/ConsignFloatingButton'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Instagram,
  MessageSquare
} from 'lucide-react'

export default function ContatoPage() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      subject: String(formData.get('subject') || ''),
      message: String(formData.get('message') || ''),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(`Falha ao enviar mensagem: ${err.error || res.statusText}`)
        return
      }

      alert('Mensagem enviada com sucesso!')
      form.reset()
    } catch (error) {
      console.error('Erro ao enviar contato:', error)
      alert('Erro ao enviar mensagem. Tente novamente mais tarde.')
    }
  }
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/fclocacoesltda?igsh=MXc0Njg1ZGZnZmJyeQ%3D%3D&utm_source=qr',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      description: 'Veja nossas fotos no Instagram'
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      url: 'https://wa.me/5521992154030',
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Fale conosco pelo WhatsApp'
    }
  ]

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefone',
      value: '(21) 99215-4030',
      subtitle: 'Atendimento 24h',
      action: 'tel:+5521992154030',
      actionText: 'Ligar Agora'
    },
    {
      icon: Mail,
      title: 'E-mail - Comercial',
      value: 'comercial@fclocacoes.com.br',
      subtitle: 'Para assuntos comerciais. (Propostas, cotações, contratos)',
      action: 'mailto:comercial@fclocacoes.com.br',
      actionText: 'Enviar E-mail'
    },
    {
      icon: Mail,
      title: 'E-mail - Suporte',
      value: 'suporte@fclocacoes.com.br',
      subtitle: 'Para assuntos relacionados a manutenção e frota',
      action: 'mailto:suporte@fclocacoes.com.br',
      actionText: 'Enviar E-mail'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      value: 'Tv. dos Teixeiras, 84',
      subtitle: 'Rodilândia, Nova Iguaçu - RJ, 26083-180, Brasil',
      action: 'https://maps.google.com/?q=Tv.+dos+Teixeiras,+84,+Rodilândia,+Nova+Iguaçu+-+RJ,+26083-180,+Brasil',
      actionText: 'Ver no Mapa'
    },
    {
      icon: Clock,
      title: 'Horário de Funcionamento',
      value: 'Segunda a Sexta: 8h às 18h',
      subtitle: 'Emergência: 24h',
      action: null,
      actionText: null
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Estamos prontos para atender suas necessidades 24h por dia. 
            Entre em contato conosco e descubra como podemos ajudar seu projeto.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cards de Contato */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{info.value}</p>
                <p className="text-gray-600 text-sm mb-4">{info.subtitle}</p>
                {info.action && (
                  <a
                    href={info.action}
                    className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {info.actionText}
                  </a>
                )}
              </div>
            )
          })}
        </div>

        {/* Redes Sociais */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Siga-nos nas Redes Sociais
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fique por dentro das novidades, veja fotos dos nossos equipamentos em ação 
              e acompanhe os projetos que realizamos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className={`${social.color} rounded-xl p-6 text-white text-center hover:shadow-lg transition-all transform group-hover:scale-105`}>
                    <Icon className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{social.name}</h3>
                    <p className="text-sm opacity-90">{social.description}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* Mapa e Formulário */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Mapa */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nossa Localização
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-96 bg-gray-200 relative">
                {/* Mapa do Google Maps - Substitua o src pela URL real da sua empresa */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1234567890123!2d-46.12345678901234!3d-23.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA3JzM0LjQiUyA0NsKwMDcnMzQuNCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização FC Locações"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">FC Locações</h3>
                <p className="text-gray-600 text-sm">
                  Tv. dos Teixeiras, 84<br />
                  Rodilândia, Nova Iguaçu - RJ<br />
                  CEP: 26083-180
                </p>
                <div className="mt-4">
                  <a
                    href="https://maps.google.com/?q=Tv.+dos+Teixeiras,+84,+Rodilândia,+Nova+Iguaçu+-+RJ,+26083-180,+Brasil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver rota no Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envie uma Mensagem
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:z-10 relative"
                      placeholder="Seu nome completo"
                      style={{ zIndex: 10 }}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:z-10 relative"
                      placeholder="seu@email.com"
                      style={{ zIndex: 10 }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:z-10 relative"
                    placeholder="(11) 99999-9999"
                    style={{ zIndex: 10 }}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="orcamento">Solicitar Orçamento</option>
                    <option value="duvida">Dúvida sobre Serviços</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="reclamacao">Reclamação</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Descreva sua mensagem aqui..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-16 bg-orange-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Atendimento Personalizado
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            Nossa equipe está preparada para entender suas necessidades específicas e 
            oferecer a melhor solução para seu projeto. Entre em contato e descubra 
            como podemos ajudar você a alcançar seus objetivos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+5521992154030"
              className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Ligar Agora
            </a>
            <a
              href="/orcamento"
              className="inline-flex items-center px-6 py-3 border border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-medium rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Solicitar Orçamento
            </a>
          </div>
        </div>
      </div>

      {/* Consign Floating Button */}
      <ConsignFloatingButton />

      {/* Footer */}
      <Footer />
    </div>
  )
}
