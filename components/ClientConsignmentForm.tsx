'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
  Truck, 
  User, 
  Car, 
  Camera, 
  Upload, 
  X, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface ClientConsignmentFormProps {
  onClose: () => void
  onSuccess: () => void
  userEmail: string
  userName: string
}

export function ClientConsignmentForm({ onClose, onSuccess, userEmail, userName }: ClientConsignmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Dados do proprietário (pré-preenchidos)
    ownerName: userName,
    email: userEmail,
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      // Simular upload de arquivos (em produção, enviaria para o servidor)
      const newFiles = files.map(file => URL.createObjectURL(file))
      setUploadedFiles(prev => [...prev, ...newFiles])
      toast.success(`${files.length} foto(s) adicionada(s)`)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/client/consignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token') || ''}`
        },
        body: JSON.stringify({
          ...formData,
          photos: uploadedFiles,
          submittedAt: new Date().toISOString()
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar consignação')
      }

      toast.success('Consignação enviada com sucesso!')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erro ao enviar consignação:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar consignação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.ownerName && formData.email && formData.phone
      case 2:
        return formData.brand && formData.model && formData.year && formData.category && formData.condition && formData.dailyRate
      case 3:
        return true // Fotos são opcionais
      case 4:
        return formData.acceptTerms
      default:
        return false
    }
  }

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= step.number
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > step.number ? <CheckCircle className="w-4 h-4" /> : step.number}
            </div>
            <div className="ml-3 hidden sm:block">
              <p className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`hidden sm:block w-16 h-0.5 ml-4 ${
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )

  const Step1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <User className="mx-auto h-12 w-12 text-blue-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Dados do Proprietário</h3>
        <p className="mt-1 text-sm text-gray-500">Confirme suas informações pessoais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="ownerName">Nome Completo *</Label>
          <Input
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) => handleInputChange('ownerName', e.target.value)}
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="phone">Telefone/WhatsApp *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="(21) 99999-9999"
            required
          />
        </div>
      </div>
    </div>
  )

  const Step2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Car className="mx-auto h-12 w-12 text-blue-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Dados do Veículo</h3>
        <p className="mt-1 text-sm text-gray-500">Informações sobre o veículo a ser consignado</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="brand">Marca *</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => handleInputChange('brand', e.target.value)}
            placeholder="Ex: Mercedes-Benz"
            required
          />
        </div>

        <div>
          <Label htmlFor="model">Modelo *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            placeholder="Ex: Atego 1719"
            required
          />
        </div>

        <div>
          <Label htmlFor="year">Ano *</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            placeholder="2020"
            min="1990"
            max="2024"
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Categoria *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {vehicleCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="capacity">Capacidade</Label>
          <Input
            id="capacity"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            placeholder="Ex: 12 toneladas"
          />
        </div>

        <div>
          <Label htmlFor="condition">Estado de Conservação *</Label>
          <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
            <SelectTrigger>
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

        <div>
          <Label htmlFor="mileage">Quilometragem</Label>
          <Input
            id="mileage"
            value={formData.mileage}
            onChange={(e) => handleInputChange('mileage', e.target.value)}
            placeholder="Ex: 150.000 km"
          />
        </div>

        <div>
          <Label htmlFor="dailyRate">Valor da Diária (R$) *</Label>
          <Input
            id="dailyRate"
            type="number"
            value={formData.dailyRate}
            onChange={(e) => handleInputChange('dailyRate', e.target.value)}
            placeholder="450.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Descrição Adicional</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Informações adicionais sobre o veículo..."
            rows={3}
          />
        </div>
      </div>
    </div>
  )

  const Step3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Camera className="mx-auto h-12 w-12 text-blue-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Fotos do Veículo</h3>
        <p className="mt-1 text-sm text-gray-500">Adicione fotos para melhor avaliação (opcional)</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Clique para adicionar fotos
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                PNG, JPG até 10MB cada
              </span>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
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
      )}
    </div>
  )

  const Step4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Confirmação</h3>
        <p className="mt-1 text-sm text-gray-500">Revise os dados antes de enviar</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900">Dados do Proprietário</h4>
          <p className="text-sm text-gray-600">{formData.ownerName}</p>
          <p className="text-sm text-gray-600">{formData.email}</p>
          <p className="text-sm text-gray-600">{formData.phone}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900">Dados do Veículo</h4>
          <p className="text-sm text-gray-600">
            {formData.brand} {formData.model} ({formData.year})
          </p>
          <p className="text-sm text-gray-600">{formData.category}</p>
          <p className="text-sm text-gray-600">Estado: {formData.condition}</p>
          <p className="text-sm text-gray-600">Diária: R$ {formData.dailyRate}</p>
          {formData.description && (
            <p className="text-sm text-gray-600 mt-2">{formData.description}</p>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900">Fotos ({uploadedFiles.length})</h4>
            <div className="flex space-x-2 mt-2">
              {uploadedFiles.slice(0, 3).map((file, index) => (
                <img
                  key={index}
                  src={file}
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
              {uploadedFiles.length > 3 && (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">+{uploadedFiles.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start">
        <input
          id="acceptTerms"
          type="checkbox"
          checked={formData.acceptTerms}
          onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
          Eu aceito os{' '}
          <a href="/termos-uso" className="text-blue-600 hover:text-blue-500">
            termos e condições
          </a>{' '}
          para consignação de veículos
        </label>
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 />
      case 2: return <Step2 />
      case 3: return <Step3 />
      case 4: return <Step4 />
      default: return <Step1 />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Nova Consignação</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <StepIndicator />
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Voltar
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep) || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Consignação'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
