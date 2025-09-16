import { ResponsiveHeader } from '@/components/ResponsiveHeader'
import { Footer } from '@/components/Footer'

export default function TermosUsoPage() {
  return (
    <main className="min-h-screen bg-white">
      <ResponsiveHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
          
          <div className="text-sm text-gray-600 mb-8">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                Ao acessar e utilizar o site da FC Locações, você concorda em cumprir e estar 
                vinculado aos seguintes termos e condições de uso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Descrição dos Serviços</h2>
              <p className="text-gray-700 leading-relaxed">
                A FC Locações oferece serviços de locação de:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li>Caminhões Munck</li>
                <li>Cestos Aéreos</li>
                <li>Caminhões 3/4</li>
                <li>Equipamentos para construção civil</li>
                <li>Transporte especializado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Uso do Site</h2>
              <p className="text-gray-700 leading-relaxed">
                Você concorda em usar o site apenas para fins legais e de acordo com estes termos. 
                É proibido:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li>Usar o site para qualquer propósito ilegal ou não autorizado</li>
                <li>Interferir no funcionamento do site</li>
                <li>Tentar obter acesso não autorizado a qualquer parte do site</li>
                <li>Transmitir vírus ou outros códigos maliciosos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Solicitações de Orçamento</h2>
              <p className="text-gray-700 leading-relaxed">
                As solicitações de orçamento através do site são consideradas consultas iniciais. 
                Todos os orçamentos estão sujeitos a:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li>Disponibilidade dos equipamentos</li>
                <li>Confirmação de datas e especificações</li>
                <li>Aprovação final pela FC Locações</li>
                <li>Assinatura de contrato de locação</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 leading-relaxed">
                A FC Locações não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li>Danos diretos ou indiretos resultantes do uso do site</li>
                <li>Interrupções temporárias do serviço</li>
                <li>Perda de dados ou informações</li>
                <li>Decisões tomadas com base nas informações do site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Propriedade Intelectual</h2>
              <p className="text-gray-700 leading-relaxed">
                Todo o conteúdo do site, incluindo textos, imagens, logotipos e design, 
                é propriedade da FC Locações e está protegido por leis de direitos autorais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Modificações</h2>
              <p className="text-gray-700 leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                As alterações entrarão em vigor imediatamente após a publicação no site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Lei Aplicável</h2>
              <p className="text-gray-700 leading-relaxed">
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será 
                resolvida nos tribunais competentes de Nova Iguaçu, RJ.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contato</h2>
              <p className="text-gray-700 leading-relaxed">
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="mt-4 text-gray-700">
                <p><strong>E-mail:</strong> contato@fclocacoes.com.br</p>
                <p><strong>Telefone:</strong> (21) 99215-4030</p>
                <p><strong>Endereço:</strong> Nova Iguaçu, RJ</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
