'use client'

import { useState, useRef } from 'react'
import { ResponsiveHeader } from '@/components/ResponsiveHeader'
import { Footer } from '@/components/Footer'

export default function ConsignacaoPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    vehicle_brand: '',
    vehicle_model: '',
    vehicle_year: '',
    vehicle_category: '',
    vehicle_condition: '',
    vehicle_mileage: '',
    daily_rate: '',
    message: ''
  })

  const vehicleCategories = [
    'Caminhão Munck',
    'Cesto Aéreo', 
    'Caminhão 3/4',
    'Guindaste',
    'Caminhão Baú',
    'Van',
    'Outro'
  ]

  const vehicleConditions = [
    'Excelente',
    'Muito Bom', 
    'Bom',
    'Regular',
    'Precisa de Reparos'
  ]

  // Função para converter arquivo para base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Função para gerenciar upload de fotos
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const validFiles: File[] = []
    const previewUrls: string[] = []
    
    // Validar cada arquivo
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} não é uma imagem válida.`)
        continue
      }
      
      // Validar tamanho (máximo 5MB por foto)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} é muito grande. Tamanho máximo: 5MB.`)
        continue
      }
      
      validFiles.push(file)
      previewUrls.push(URL.createObjectURL(file))
    }

    // Limitar a 6 fotos no total
    const totalPhotos = photos.length + validFiles.length
    if (totalPhotos > 6) {
      alert('Você pode adicionar no máximo 6 fotos.')
      const allowedFiles = validFiles.slice(0, 6 - photos.length)
      const allowedPreviews = previewUrls.slice(0, 6 - photos.length)
      
      setPhotos(prev => [...prev, ...allowedFiles])
      setPhotoPreviewUrls(prev => [...prev, ...allowedPreviews])
    } else {
      setPhotos(prev => [...prev, ...validFiles])
      setPhotoPreviewUrls(prev => [...prev, ...previewUrls])
    }

    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Função para remover foto
  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviewUrls[index]) // Liberar memória
    setPhotos(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Converter fotos para base64
      const photosBase64: string[] = []
      for (const photo of photos) {
        try {
          const base64 = await convertToBase64(photo)
          photosBase64.push(base64)
        } catch (error) {
          console.error('Erro ao converter foto:', error)
        }
      }

      const response = await fetch('/api/consignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerName: formData.owner_name,
          email: formData.owner_email,
          phone: formData.owner_phone,
          brand: formData.vehicle_brand,
          model: formData.vehicle_model,
          year: formData.vehicle_year,
          category: formData.vehicle_category,
          condition: formData.vehicle_condition,
          mileage: formData.vehicle_mileage,
          dailyRate: formData.daily_rate,
          description: formData.message,
          photos: photosBase64,
          submittedAt: new Date().toISOString()
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        
        // Limpar formulário
        setFormData({
          owner_name: '',
          owner_email: '',
          owner_phone: '',
          vehicle_brand: '',
          vehicle_model: '',
          vehicle_year: '',
          vehicle_category: '',
          vehicle_condition: '',
          vehicle_mileage: '',
          daily_rate: '',
          message: ''
        })
        
        // Limpar fotos
        photoPreviewUrls.forEach(url => URL.revokeObjectURL(url))
        setPhotos([])
        setPhotoPreviewUrls([])
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (error) {
      console.error('Erro ao enviar consignação:', error)
      alert('Erro ao enviar consignação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 text-center">
          <div>
            <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Solicitação Enviada!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Recebemos sua solicitação de consignação. Entraremos em contato em até 24 horas para agendar uma vistoria.
            </p>
            
            {/* Informações sobre o Portal do Cliente */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-center mb-2">
                <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-medium text-orange-900">Acompanhe sua Consignação</h3>
              </div>
              <p className="text-xs text-orange-700 mb-4">
                Para acompanhar o status da sua consignação em tempo real, crie uma conta ou faça login no portal do cliente.
              </p>
              <div className="space-y-2">
                <a
                  href="/auth/signup"
                  className="inline-flex items-center justify-center w-full px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                >
                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Criar Conta
                </a>
                <a
                  href="/portal-cliente/login"
                  className="inline-flex items-center justify-center w-full px-3 py-2 border border-orange-300 text-xs font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 transition-colors"
                >
                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Já tenho conta - Fazer Login
                </a>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                Voltar ao Início
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveHeader />

      {/* Formulário */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Consignar Veículo</h1>
              <p className="mt-2 text-gray-600">
                Preencha os dados do seu veículo e receba uma proposta de consignação
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados do proprietário */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dados do Proprietário</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="owner_name" className="block text-sm font-medium text-gray-700">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="owner_name"
                      id="owner_name"
                      required
                      value={formData.owner_name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="owner_email" className="block text-sm font-medium text-gray-700">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="owner_email"
                      id="owner_email"
                      required
                      value={formData.owner_email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="owner_phone" className="block text-sm font-medium text-gray-700">
                    Telefone/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="owner_phone"
                    id="owner_phone"
                    required
                    value={formData.owner_phone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Dados do veículo */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dados do Veículo</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="vehicle_brand" className="block text-sm font-medium text-gray-700">
                      Marca *
                    </label>
                    <input
                      type="text"
                      name="vehicle_brand"
                      id="vehicle_brand"
                      required
                      value={formData.vehicle_brand}
                      onChange={handleChange}
                      placeholder="Ex: Mercedes-Benz"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="vehicle_model" className="block text-sm font-medium text-gray-700">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      name="vehicle_model"
                      id="vehicle_model"
                      required
                      value={formData.vehicle_model}
                      onChange={handleChange}
                      placeholder="Ex: Atego 1719"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="vehicle_year" className="block text-sm font-medium text-gray-700">
                      Ano *
                    </label>
                    <input
                      type="number"
                      name="vehicle_year"
                      id="vehicle_year"
                      required
                      value={formData.vehicle_year}
                      onChange={handleChange}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      placeholder="2020"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="vehicle_category" className="block text-sm font-medium text-gray-700">
                      Categoria *
                    </label>
                    <select
                      name="vehicle_category"
                      id="vehicle_category"
                      required
                      value={formData.vehicle_category}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Selecione a categoria</option>
                      {vehicleCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="vehicle_condition" className="block text-sm font-medium text-gray-700">
                      Estado de Conservação *
                    </label>
                    <select
                      name="vehicle_condition"
                      id="vehicle_condition"
                      required
                      value={formData.vehicle_condition}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Selecione o estado</option>
                      {vehicleConditions.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="vehicle_mileage" className="block text-sm font-medium text-gray-700">
                      Quilometragem
                    </label>
                    <input
                      type="text"
                      name="vehicle_mileage"
                      id="vehicle_mileage"
                      value={formData.vehicle_mileage}
                      onChange={handleChange}
                      placeholder="Ex: 50.000 km"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="daily_rate" className="block text-sm font-medium text-gray-700">
                    Valor da Diária Pretendida *
                  </label>
                  <input
                    type="number"
                    name="daily_rate"
                    id="daily_rate"
                    required
                    value={formData.daily_rate}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    placeholder="500.00"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Upload de Fotos */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fotos do Veículo</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Adicione fotos do veículo para ajudar na avaliação (máximo 6 fotos, 5MB cada)
                </p>
                
                {/* Botão de upload */}
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Adicionar Fotos
                  </label>
                  <span className="ml-2 text-sm text-gray-500">
                    {photos.length}/6 fotos
                  </span>
                </div>

                {/* Preview das fotos */}
                {photoPreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photoPreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Observações */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Observações Adicionais
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Descreva detalhes importantes sobre o veículo, documentação, disponibilidade, etc."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Botão de envio */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Solicitação'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

