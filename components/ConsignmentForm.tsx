'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Truck, 
  User, 
  Car 
} from 'lucide-react'
import { toast } from 'sonner'

export function ConsignmentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Dados do proprietário
    ownerName: '',
    email: '',
    phone: '',
    
    // Dados do veículo
    brand: '',
    model: '',
    year: '',
    category: '',
    capacity: '',
    condition: '',
    mileage: '',
    dailyRate: '',
    description: '',
    
    // Termos
    acceptTerms: false
  })

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  // Refs para manter foco
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null }>({})

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const steps = [
    { number: 1, title: 'Proprietário', description: 'Seus dados pessoais' },
    { number: 2, title: 'Veículo', description: 'Informações do veículo' },
    { number: 3, title: 'Fotos', description: 'Imagens do veículo' },
    { number: 4, title: 'Confirmação', description: 'Revise e envie' }
  ]

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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handler que só atualiza no blur para evitar re-renders
  const handleInputBlur = useCallback((e: any) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }, [])

  // Handler para mudanças imediatas (sem re-render)
  const handleInputChange = useCallback((e: any) => {
    // Não faz nada, apenas mantém o foco
  }, [])

  // Função para registrar refs
  const registerRef = useCallback((name: string, ref: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null) => {
    console.log('📝 Registrando ref:', name, !!ref)
    inputRefs.current[name] = ref
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target?.result) {
              setUploadedFiles(prev => [...prev, event.target!.result as string])
            }
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target?.result) {
              setUploadedFiles(prev => [...prev, event.target!.result as string])
            }
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    // Solução simplificada: coletar dados diretamente do DOM
    const form = document.querySelector('form') || document
    
    // Coletar dados usando querySelector
    const ownerName = (form.querySelector('input[name="ownerName"]') as HTMLInputElement)?.value || ''
    const email = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value || ''
    const phone = (form.querySelector('input[name="phone"]') as HTMLInputElement)?.value || ''
    const brand = (form.querySelector('input[name="brand"]') as HTMLInputElement)?.value || ''
    const model = (form.querySelector('input[name="model"]') as HTMLInputElement)?.value || ''
    const year = (form.querySelector('input[name="year"]') as HTMLInputElement)?.value || ''
    const capacity = (form.querySelector('input[name="capacity"]') as HTMLInputElement)?.value || ''
    const condition = (form.querySelector('select[name="condition"]') as HTMLSelectElement)?.value || ''
    const mileage = (form.querySelector('input[name="mileage"]') as HTMLInputElement)?.value || ''
    const dailyRate = (form.querySelector('input[name="dailyRate"]') as HTMLInputElement)?.value || ''
    const description = (form.querySelector('textarea[name="description"]') as HTMLTextAreaElement)?.value || ''
    const acceptTerms = (form.querySelector('input[name="acceptTerms"]') as HTMLInputElement)?.checked || false
    
    // Usar categoria do estado
    const category = formData.category || ''
    
    console.log('📋 Dados coletados do DOM:', {
      ownerName, email, phone, brand, model, year, category,
      capacity, condition, mileage, dailyRate, description, acceptTerms
    })
    
    // Validações básicas
    if (!acceptTerms) {
      alert('Você deve aceitar os termos de consignação')
      return
    }
    
    if (!ownerName || !email || !phone || !brand || !model || !year || !category || !condition || !dailyRate) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const payload = {
        ownerName, email, phone, brand, model, year, category,
        capacity, condition, mileage, dailyRate, description, acceptTerms,
        photos: uploadedFiles,
        submittedAt: new Date().toISOString()
      }
      
      console.log('🚀 Enviando:', payload)
      
      const response = await fetch('/api/consignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        alert('Solicitação enviada com sucesso!')
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (error) {
      alert('Erro ao enviar. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200
              ${currentStep >= step.number 
                ? 'bg-fc-orange border-fc-orange text-white' 
                : 'border-fc-medium-gray text-fc-medium-gray'
              }
            `}>
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`
                w-full h-0.5 mx-4 transition-colors duration-200
                ${currentStep > step.number ? 'bg-fc-orange' : 'bg-fc-medium-gray'}
              `} />
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-fc-dark-gray">
          {steps[currentStep - 1].title}
        </h3>
        <p className="text-sm text-fc-medium-gray">
          {steps[currentStep - 1].description}
        </p>
      </div>

      <div className="mt-4">
        <Progress value={progress} className="w-full h-2" />
        <p className="text-xs text-fc-medium-gray text-center mt-2">
          Passo {currentStep} de {totalSteps}
        </p>
      </div>
    </div>
  )

  const Step1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-12 h-12 text-fc-orange mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-fc-dark-gray mb-2">
          Dados do Proprietário
        </h3>
        <p className="text-fc-medium-gray">
          Preencha suas informações de contato
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Nome Completo *
          </label>
          <input
            ref={(el) => registerRef('ownerName', el)}
            id="ownerName"
            name="ownerName"
            type="text"
            placeholder="Seu nome completo"
            defaultValue={formData.ownerName}
            onBlur={handleInputBlur}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-fc-dark-gray mb-1">
            E-mail *
          </label>
          <input
            ref={(el) => registerRef('email', el)}
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            defaultValue={formData.email}
            onBlur={handleInputBlur}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-fc-dark-gray mb-1">
          Telefone/WhatsApp *
        </label>
        <input
          ref={(el) => registerRef('phone', el)}
          id="phone"
          name="phone"
          type="tel"
          placeholder="(21) 99999-9999"
          defaultValue={formData.phone}
          onBlur={handleInputBlur}
          onInput={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
          autoComplete="tel"
        />
      </div>
    </div>
  )

  const Step2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Car className="w-12 h-12 text-fc-orange mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-fc-dark-gray mb-2">
          Informações do Veículo
        </h3>
        <p className="text-fc-medium-gray">
          Detalhes sobre o veículo que deseja consignar
        </p>
      </div>

      {/* Categoria */}
      <div className="space-y-4">
        <label className="block text-base font-medium text-fc-dark-gray mb-1">Categoria do Veículo *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vehicleCategories.map((category) => (
            <div 
              key={category}
              className={`border-2 rounded-lg p-4 cursor-pointer text-center transition-colors ${
                formData.category === category 
                  ? 'border-fc-orange bg-orange-50' 
                  : 'border-gray-200 hover:border-fc-orange'
              }`}
              onClick={() => {
                setFormData(prev => ({ ...prev, category }))
              }}
            >
              <span className="text-sm font-medium text-fc-dark-gray">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Marca *
          </label>
          <input
            ref={(el) => registerRef('brand', el)}
            id="brand"
            name="brand"
            type="text"
            placeholder="Ex: Mercedes-Benz"
            defaultValue={formData.brand}
            onBlur={handleInputBlur}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Modelo *
          </label>
          <input
            ref={(el) => registerRef('model', el)}
            id="model"
            name="model"
            type="text"
            placeholder="Ex: Atego 1719"
            defaultValue={formData.model}
            onBlur={handleInputBlur}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="organization"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Ano *
          </label>
          <input
            ref={(el) => registerRef('year', el)}
            id="year"
            name="year"
            type="number"
            placeholder="2020"
            defaultValue={formData.year}
            onBlur={handleInputBlur}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Capacidade
          </label>
          <input
            ref={(el) => registerRef('capacity', el)}
            id="capacity"
            name="capacity"
            type="text"
            placeholder="Ex: 12 toneladas"
            defaultValue={formData.capacity}
            onBlur={handleInputBlur}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Quilometragem
          </label>
          <input
            ref={(el) => registerRef('mileage', el)}
            id="mileage"
            name="mileage"
            type="text"
            placeholder="Ex: 50.000 km"
            defaultValue={formData.mileage}
            onBlur={handleInputBlur}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Estado de Conservação *
          </label>
          <select
            ref={(el) => registerRef('condition', el)}
            id="condition"
            name="condition"
            defaultValue={formData.condition}
            onBlur={handleInputBlur}
            onChange={handleInputBlur}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
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
          <label htmlFor="dailyRate" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Valor da Diária Pretendida *
          </label>
          <input
            ref={(el) => registerRef('dailyRate', el)}
            id="dailyRate"
            name="dailyRate"
            type="number"
            placeholder="R$ 500"
            defaultValue={formData.dailyRate}
            onBlur={handleInputBlur}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-fc-dark-gray mb-1">
          Descrição Adicional
        </label>
        <textarea
          ref={(el) => registerRef('description', el)}
          id="description"
          name="description"
          placeholder="Descreva detalhes importantes sobre o veículo..."
          defaultValue={formData.description}
          onBlur={handleInputBlur}
          onInput={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange min-h-20"
          rows={4}
        />
      </div>
    </div>
  )

  const Step3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Camera className="w-12 h-12 text-fc-orange mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-fc-dark-gray mb-2">
          Fotos do Veículo
        </h3>
        <p className="text-fc-medium-gray">
          Adicione fotos do veículo (mínimo 3 fotos)
        </p>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-fc-orange transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-fc-medium-gray mb-4">
          Arraste e solte as fotos aqui ou clique para selecionar
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-fc-orange hover:bg-orange-600 cursor-pointer"
        >
          Selecionar Fotos
        </label>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-fc-dark-gray mb-4">
            Fotos Selecionadas ({uploadedFiles.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={file}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const Step4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle className="w-12 h-12 text-fc-orange mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-fc-dark-gray mb-2">
          Confirmação Final
        </h3>
        <p className="text-fc-medium-gray">
          Revise os dados e confirme o envio da solicitação
        </p>
      </div>

      {/* Resumo dos Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <User className="w-5 h-5 mr-2" />
            Dados do Proprietário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Nome:</span>
            <span className="font-medium">{formData.ownerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">E-mail:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Telefone:</span>
            <span className="font-medium">{formData.phone}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Car className="w-5 h-5 mr-2" />
            Dados do Veículo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Categoria:</span>
            <span className="font-medium">{formData.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Marca:</span>
            <span className="font-medium">{formData.brand}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Modelo:</span>
            <span className="font-medium">{formData.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Ano:</span>
            <span className="font-medium">{formData.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Capacidade:</span>
            <span className="font-medium">{formData.capacity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Quilometragem:</span>
            <span className="font-medium">{formData.mileage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Estado:</span>
            <span className="font-medium">{formData.condition}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Diária:</span>
            <span className="font-medium">R$ {formData.dailyRate}</span>
          </div>
          {formData.description && (
            <div>
              <span className="text-fc-medium-gray">Descrição:</span>
              <p className="mt-1 text-sm text-fc-dark-gray">{formData.description}</p>
            </div>
          )}
          {uploadedFiles.length > 0 && (
            <div className="flex justify-between">
              <span className="text-fc-medium-gray">Fotos:</span>
              <span className="font-medium">{uploadedFiles.length} foto(s) enviada(s)</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Termos */}
      <div className="flex items-start space-x-3 p-4 rounded-lg bg-orange-50">
        <input
          ref={(el) => registerRef('acceptTerms', el)}
          type="checkbox"
          id="acceptTerms"
          name="acceptTerms"
          defaultChecked={formData.acceptTerms}
          onBlur={handleInputBlur}
          onChange={handleInputBlur}
          className="mt-1 h-4 w-4 text-fc-orange focus:ring-fc-orange border-gray-300 rounded"
        />
        <div className="text-sm">
          <label 
            htmlFor="acceptTerms"
            className="font-medium text-fc-dark-gray cursor-pointer"
          >
            Aceito os termos de consignação e autorizo o uso dos dados fornecidos para análise da solicitação.
          </label>
        </div>
      </div>

      <div className="bg-fc-light-gray rounded-lg p-6">
        <h4 className="font-semibold text-fc-dark-gray mb-2">Próximos passos:</h4>
        <div className="space-y-3 text-sm text-fc-medium-gray">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-fc-orange" />
            Sua solicitação será analisada em até 24 horas
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-2 text-fc-orange" />
            Entraremos em contato para agendar uma vistoria
          </div>
          <div className="flex items-center">
            <Truck className="w-4 h-4 mr-2 text-fc-orange" />
            Após aprovação, seu veículo estará disponível para locação
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      default: return <Step1 />;
    }
  }

  return (
    <div className="min-h-screen bg-fc-light-gray py-8">
      {/* BOTÃO DE TESTE ABSOLUTO */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        zIndex: 9999,
        backgroundColor: 'red',
        padding: '10px',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        <button 
          onClick={() => {
            alert('TESTE: JavaScript funcionando!');
            console.log('TESTE: Botão clicado!');
          }}
          style={{
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          TESTE JS
        </button>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fc-dark-gray mb-2">
            Consignação de Veículos
          </h1>
          <p className="text-lg text-fc-medium-gray">
            Cadastre seu veículo para locação através da FC Locações
          </p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <StepIndicator />
            
            <div className="mb-8">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center fc-orange hover:bg-orange-600 text-white"
                >
                  Continuar
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#f97316',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Check className="w-4 h-4" />
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}