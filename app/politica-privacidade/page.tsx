import { ResponsiveHeader } from '@/components/ResponsiveHeader'
import { Footer } from '@/components/Footer'

export default function PoliticaPrivacidadePage() {
  return (
    <main className="min-h-screen bg-white">
      <ResponsiveHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
          
          <div className="text-sm text-gray-600 mb-8">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Informações que Coletamos</h2>
              <p className="text-gray-700 leading-relaxed">
                Coletamos informações que você nos fornece diretamente, como quando você:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li>Solicita um orçamento através do nosso site</li>
                <li>Preenche formulários de contato</li>
                <li>Se cadastra em nosso portal do cliente</li>
                <li>Entra em contato conosco por telefone ou e-mail</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Como Utilizamos suas Informações</h2>
              <p className="text-gray-700 leading-relaxed">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li>Fornecer nossos serviços de locação de equipamentos</li>
                <li>Processar solicitações de orçamento</li>
                <li>Comunicar-nos com você sobre nossos serviços</li>
                <li>Melhorar nosso site e serviços</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Compartilhamento de Informações</h2>
              <p className="text-gray-700 leading-relaxed">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                exceto quando necessário para fornecer nossos serviços ou quando exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Segurança dos Dados</h2>
              <p className="text-gray-700 leading-relaxed">
                Implementamos medidas de segurança apropriadas para proteger suas informações 
                pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Seus Direitos</h2>
              <p className="text-gray-700 leading-relaxed">
                Você tem o direito de:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar a exclusão de suas informações</li>
                <li>Retirar seu consentimento a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contato</h2>
              <p className="text-gray-700 leading-relaxed">
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
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
