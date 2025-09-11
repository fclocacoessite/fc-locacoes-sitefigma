export default function TestConsignacaoPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Teste da Página de Consignação
      </h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <p className="text-lg mb-4">
          Se você está vendo esta página, a rota está funcionando!
        </p>
        <p className="text-gray-600">
          A página de consignação está em: <code>/consignacao</code>
        </p>
        <div className="mt-6">
          <a 
            href="/consignacao" 
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Ir para Consignação
          </a>
        </div>
      </div>
    </div>
  )
}

