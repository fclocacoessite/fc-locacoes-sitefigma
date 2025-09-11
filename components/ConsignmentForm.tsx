'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Progress } from './ui/progress'
import { Upload, Camera, FileText, CheckCircle, AlertCircle, X, ChevronLeft, ChevronRight, Check, Truck, User, Car } from 'lucide-react'
import { toast } from 'sonner'

export function ConsignmentForm() {
  const [currentStep, setCurrentStep] = useState(1)
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
    price: '',
    dailyRate: '',
    description: '',
    
    // Termos
    acceptTerms: false
  })

  // Refs para inputs não controlados
  const formRef = React.useRef<HTMLFormElement>(null)

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

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

  const syncFormData = () => {
    if (formRef.current) {
      const formDataObj = new FormData(formRef.current)
      const data = Object.fromEntries(formDataObj.entries())
      
      setFormData(prev => ({
        ...prev,
        ...data
      }))
    }
  }

  const nextStep = () => {
    // Sincronizar dados antes de avançar
    syncFormData()
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    // Sincronizar dados antes de voltar
    syncFormData()
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target?.result) {
              setUploadedFiles(prev => [...prev, event.target.result as string])
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
              setUploadedFiles(prev => [...prev, event.target.result as string])
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
    if (!formData.acceptTerms) {
      toast.error('Você deve aceitar os termos de consignação')
      return
    }

    if (uploadedFiles.length < 3) {
      toast.error('Envie pelo menos 3 fotos do veículo')
      return
    }

    try {
      // Coletar dados do formulário não controlado
      const formDataObj = new FormData(formRef.current!)
      const formValues = Object.fromEntries(formDataObj.entries())
      
      const payload = {
        ownerName: formValues.ownerName || '',
        email: formValues.email || '',
        phone: formValues.phone || '',
        brand: formValues.brand || '',
        model: formValues.model || '',
        year: formValues.year || '',
        category: formData.category,
        capacity: formValues.capacity || '',
        condition: formValues.condition || '',
        mileage: formValues.mileage || '',
        dailyRate: formValues.dailyRate || '',
        description: formValues.description || '',
        photos: uploadedFiles,
        submittedAt: new Date().toISOString()
      }

      const response = await fetch('/api/consignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar solicitação')
      }

      toast.success('Solicitação de consignação enviada com sucesso!')
      
      // Reset form
      if (formRef.current) {
        formRef.current.reset()
      }
      setFormData({
        ownerName: '',
        email: '',
        phone: '',
        brand: '',
        model: '',
        year: '',
        category: '',
        capacity: '',
        condition: '',
        mileage: '',
        price: '',
        dailyRate: '',
        description: '',
        acceptTerms: false
      })
      setUploadedFiles([])
      setCurrentStep(1)

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
                flex-1 h-0.5 mx-4 transition-colors duration-200
                ${currentStep > step.number ? 'bg-fc-orange' : 'bg-fc-medium-gray'}
              `} />
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <h2 className="text-xl font-semibold text-fc-dark-gray mb-1">
          {steps[currentStep - 1].title}
        </h2>
        <p className="text-fc-medium-gray">
          {steps[currentStep - 1].description}
        </p>
      </div>
      
      <div className="mt-4">
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )

  const Step1 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <User className="w-12 h-12 text-fc-orange mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-fc-dark-gray mb-2">
          Dados do Proprietário
        </h3>
        <p className="text-fc-medium-gray">
          Preencha suas informações de contato
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="ownerName" className="text-fc-dark-gray font-medium">Nome Completo *</Label>
          <Input
            id="ownerName"
            name="ownerName"
            placeholder="Seu nome completo"
            defaultValue={formData.ownerName}
            className="h-12"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-fc-dark-gray font-medium">E-mail *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            defaultValue={formData.email}
            className="h-12"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-fc-dark-gray font-medium">Telefone/WhatsApp *</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="(21) 99999-9999"
          defaultValue={formData.phone}
          className="h-12"
          required
        />
      </div>
    </div>
  )

  const Step2 = () => (
    <div className="space-y-8">
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
        <Label className="text-fc-dark-gray font-medium">Categoria do Veículo *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vehicleCategories.map((category) => (
            <div 
              key={category}
              className={`border-2 rounded-lg p-4 cursor-pointer text-center transition-colors ${
                formData.category === category 
                  ? 'border-fc-orange bg-orange-50' 
                  : 'border-gray-200 hover:border-fc-orange'
              }`}
              onClick={() => handleInputChange('category', category)}
            >
              <span className="text-sm font-medium text-fc-dark-gray">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-fc-dark-gray font-medium">Marca *</Label>
          <Input
            id="brand"
            name="brand"
            placeholder="Ex: Mercedes-Benz"
            defaultValue={formData.brand}
            className="h-12"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model" className="text-fc-dark-gray font-medium">Modelo *</Label>
          <Input
            id="model"
            name="model"
            placeholder="Ex: Atego 1719"
            defaultValue={formData.model}
            className="h-12"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <Label htmlFor="year" className="text-fc-dark-gray font-medium">Ano *</Label>
          <Input
            id="year"
            name="year"
            placeholder="2020"
            defaultValue={formData.year}
            className="h-12"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity" className="text-fc-dark-gray font-medium">Capacidade</Label>
          <Input
            id="capacity"
            name="capacity"
            placeholder="Ex: 12 toneladas"
            defaultValue={formData.capacity}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage" className="text-fc-dark-gray font-medium">Quilometragem</Label>
          <Input
            id="mileage"
            name="mileage"
            placeholder="Ex: 50.000 km"
            defaultValue={formData.mileage}
            className="h-12"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="condition" className="text-fc-dark-gray font-medium">Estado de Conservação *</Label>
          <Select name="condition" defaultValue={formData.condition}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {vehicleConditions.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dailyRate" className="text-fc-dark-gray font-medium">Valor da Diária Pretendida *</Label>
          <Input
            id="dailyRate"
            name="dailyRate"
            placeholder="R$ 500"
            defaultValue={formData.dailyRate}
            className="h-12"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-fc-dark-gray font-medium">Descrição Adicional</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Descreva detalhes importantes sobre o veículo..."
          defaultValue={formData.description}
          className="min-h-24"
        />
      </div>
    </div>
  )

  const Step3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Camera className="w-12 h-12 text-fc-orange mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-fc-dark-gray mb-2">
          Fotos do Veículo
        </h3>
        <p className="text-fc-medium-gray">
          Adicione pelo menos 3 fotos do seu veículo
        </p>
      </div>

      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-fc-orange transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="text-center">
          <Camera className="w-16 h-16 text-fc-medium-gray mx-auto mb-6" />
          <p className="text-fc-dark-gray font-medium mb-3 text-lg">
            Adicione fotos do seu veículo
          </p>
          <p className="text-fc-medium-gray mb-2">
            Mínimo 3 fotos para melhor avaliação
          </p>
          <p className="text-sm text-fc-medium-gray mb-8">
            Arraste e solte as imagens aqui ou clique no botão abaixo
          </p>
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button 
              type="button"
              variant="outline" 
              className="border-fc-orange text-fc-orange hover:bg-orange-50 px-8 py-3 h-12"
            >
              <Upload className="w-5 h-5 mr-2" />
              Selecionar Fotos
            </Button>
          </div>
        </div>
      </div>

      {/* Preview das fotos */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-fc-dark-gray">
              Fotos Selecionadas ({uploadedFiles.length})
            </h4>
            {uploadedFiles.length < 3 && (
              <span className="text-sm text-orange-600 font-medium">
                Adicione mais {3 - uploadedFiles.length} foto(s)
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={file}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const Step4 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <CheckCircle className="w-12 h-12 text-fc-orange mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-fc-dark-gray mb-2">
          Confirmação Final
        </h3>
        <p className="text-fc-medium-gray">
          Revise as informações e envie sua solicitação
        </p>
      </div>

      {/* Resumo dos dados */}
      <div className="bg-gray-50 rounded-lg p-8 space-y-6">
        <h4 className="font-semibold text-fc-dark-gray text-lg">Resumo da Solicitação</h4>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h5 className="font-medium text-fc-dark-gray text-base">Dados do Proprietário</h5>
            <div className="space-y-2">
              <p className="text-sm text-fc-medium-gray">Nome: {formData.ownerName}</p>
              <p className="text-sm text-fc-medium-gray">E-mail: {formData.email}</p>
              <p className="text-sm text-fc-medium-gray">Telefone: {formData.phone}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-medium text-fc-dark-gray text-base">Dados do Veículo</h5>
            <div className="space-y-2">
              <p className="text-sm text-fc-medium-gray">Categoria: {formData.category}</p>
              <p className="text-sm text-fc-medium-gray">Marca/Modelo: {formData.brand} {formData.model}</p>
              <p className="text-sm text-fc-medium-gray">Ano: {formData.year}</p>
              <p className="text-sm text-fc-medium-gray">Diária Pretendida: {formData.dailyRate}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-fc-medium-gray">
            Fotos: {uploadedFiles.length} imagens selecionadas
          </p>
        </div>
      </div>

      {/* Termos */}
      <div className="flex items-start space-x-4 p-6 rounded-lg bg-orange-50">
        <Checkbox 
          id="terms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
          className="mt-1 border-fc-orange data-[state=checked]:bg-fc-orange data-[state=checked]:border-fc-orange"
        />
        <div className="text-sm">
          <label 
            htmlFor="terms"
            className="font-medium text-fc-dark-gray cursor-pointer text-base"
          >
            Aceito os termos de consignação *
          </label>
          <p className="text-fc-medium-gray mt-2">
            Li e concordo com os termos de consignação da FC Locações.
          </p>
        </div>
      </div>

      {/* Informações sobre o processo */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-medium text-fc-dark-gray mb-4 flex items-center text-base">
          <Truck className="w-5 h-5 mr-2 text-blue-600" />
          Próximos Passos
        </h4>
        <div className="space-y-3 text-sm text-fc-medium-gray">
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-3 text-fc-orange" />
            Nossa equipe analisará sua solicitação em até 24h
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-3 text-fc-orange" />
            Entraremos em contato para agendar uma vistoria
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-3 text-fc-orange" />
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
            <form ref={formRef}>
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
                    type="button"
                    onClick={handleSubmit}
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