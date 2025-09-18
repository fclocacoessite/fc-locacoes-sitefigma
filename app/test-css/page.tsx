export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-fc-orange mb-8">
          Teste de CSS - FC Locações
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-fc-dark-gray mb-4">
              Cores da Marca
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-fc-orange rounded"></div>
                <span className="text-fc-dark-gray">FC Orange</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-fc-dark-gray rounded"></div>
                <span className="text-fc-dark-gray">FC Dark Gray</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-fc-light-gray rounded border"></div>
                <span className="text-fc-dark-gray">FC Light Gray</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-fc-dark-gray mb-4">
              Componentes Tailwind
            </h2>
            <div className="space-y-4">
              <button className="bg-fc-orange text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                Botão Primário
              </button>
              <button className="border border-fc-orange text-fc-orange px-4 py-2 rounded hover:bg-fc-orange hover:text-white transition-colors">
                Botão Secundário
              </button>
              <div className="p-4 bg-fc-light-gray rounded">
                <p className="text-fc-dark-gray">Card com fundo claro</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-fc-dark-gray mb-4">
            Teste de Responsividade
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-fc-orange text-white p-4 rounded text-center">
                Item {item}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 bg-fc-dark-gray text-white p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Teste de Tipografia
          </h2>
          <p className="text-lg mb-2">Este é um parágrafo com texto grande.</p>
          <p className="text-base mb-2">Este é um parágrafo com texto normal.</p>
          <p className="text-sm text-gray-300">Este é um parágrafo com texto pequeno.</p>
        </div>
      </div>
    </div>
  )
}