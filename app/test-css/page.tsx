export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-fc-light-gray p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-fc-dark-gray mb-8 text-center">
          Teste de Estilização
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-fc-dark-gray mb-4">
              Card 1
            </h2>
            <p className="text-fc-medium-gray mb-4">
              Este é um teste de estilização com Tailwind CSS.
            </p>
            <button className="bg-fc-orange text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
              Botão Teste
            </button>
          </div>
          
          <div className="bg-fc-orange text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Card 2
            </h2>
            <p className="mb-4 opacity-90">
              Cores personalizadas da FC Locações.
            </p>
            <button className="bg-white text-fc-orange px-4 py-2 rounded hover:bg-gray-100 transition-colors">
              Botão Invertido
            </button>
          </div>
          
          <div className="bg-fc-dark-gray text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Card 3
            </h2>
            <p className="text-fc-medium-gray mb-4">
              Teste de cores escuras.
            </p>
            <button className="bg-fc-orange text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
              Botão Laranja
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-fc-medium-gray">
            Se você está vendo as cores e estilos corretos, o Tailwind está funcionando!
          </p>
        </div>
      </div>
    </div>
  )
}

