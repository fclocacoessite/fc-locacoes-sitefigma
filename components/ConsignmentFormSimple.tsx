'use client'

import { useState, useRef } from 'react'
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

export function ConsignmentFormSimple() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  
  // Refs para todos os inputs
  const formRef = useRef<HTMLFormElement>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const data = Object.fromEntries(formData.entries())

    // Validar campos obrigatórios
    const requiredFields = ['ownerName', 'email', 'phone', 'brand', 'model', 'year', 'category', 'condition', 'dailyRate']
    const missingFields = requiredFields.filter(field => !data[field] || (typeof data[field] === 'string' && data[field].trim() === ''))
    
    if (missingFields.length > 0) {
      toast.error(`Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`)
      return
    }

    if (data.acceptTerms !== 'on') {
      toast.error('Você deve aceitar os termos e condições')
      return
    }

    try {
      const payload = {
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        brand: data.brand,
        model: data.model,
        year: data.year,
        category: data.category,
        capacity: data.capacity,
        condition: data.condition,
        mileage: data.mileage,
        dailyRate: data.dailyRate,
        description: data.description,
        acceptTerms: data.acceptTerms === 'on',
        photos: uploadedFiles,
        submittedAt: new Date().toISOString()
      }

      console.log('📤 Enviando dados:', payload)

      const response = await fetch('/api/consignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success('Solicitação de consignação enviada com sucesso!')
        formRef.current.reset()
        setUploadedFiles([])
        setCurrentStep(1)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao enviar solicitação')
      }
    } catch (error) {
      toast.error('Erro ao enviar solicitação. Tente novamente.')
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
            id="ownerName"
            name="ownerName"
            type="text"
            placeholder="Seu nome completo"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-fc-dark-gray mb-1">
            E-mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            required
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
          id="phone"
          name="phone"
          type="tel"
          placeholder="(21) 99999-9999"
          required
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
            <label key={category} className="cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                className="sr-only"
                required
              />
              <div className="border-2 rounded-lg p-4 text-center transition-colors hover:border-fc-orange peer-checked:border-fc-orange peer-checked:bg-orange-50">
                <span className="text-sm font-medium text-fc-dark-gray">{category}</span>
              </div>
            </label>
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
            id="brand"
            name="brand"
            type="text"
            placeholder="Ex: Mercedes-Benz"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Modelo *
          </label>
          <input
            id="model"
            name="model"
            type="text"
            placeholder="Ex: Atego 1719"
            required
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
            id="year"
            name="year"
            type="number"
            placeholder="2020"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Capacidade
          </label>
          <input
            id="capacity"
            name="capacity"
            type="text"
            placeholder="Ex: 12 toneladas"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fc-orange focus:border-fc-orange"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-fc-dark-gray mb-1">
            Quilometragem
          </label>
          <input
            id="mileage"
            name="mileage"
            type="text"
            placeholder="Ex: 50.000 km"
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
            id="condition"
            name="condition"
            required
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
            id="dailyRate"
            name="dailyRate"
            type="number"
            placeholder="R$ 500"
            required
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
          id="description"
          name="description"
          placeholder="Descreva detalhes importantes sobre o veículo..."
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

      {/* Termos */}
      <div className="flex items-start space-x-3 p-4 rounded-lg bg-orange-50">
        <input
          type="checkbox"
          id="acceptTerms"
          name="acceptTerms"
          required
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
            <form ref={formRef} onSubmit={handleSubmit}>
              <StepIndicator />
              
              <div className="mb-8">
                {renderStep()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
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
                    type="button"
                    onClick={nextStep}
                    className="flex items-center fc-orange hover:bg-orange-600 text-white"
                  >
                    Continuar
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className="flex items-center fc-orange hover:bg-orange-600 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Enviar Solicitação
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
