'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Upload, Camera, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'

interface ConsignmentModalProps {
  children: React.ReactNode
}

export function ConsignmentModal({ children }: ConsignmentModalProps) {
  const [open, setOpen] = useState(false)
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

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = () => {
    // Simular upload de arquivo
    const mockImageUrl = `https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&t=${Date.now()}`
    setUploadedFiles(prev => [...prev, mockImageUrl])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.acceptTerms) {
      toast.error('Você deve aceitar os termos de consignação')
      return
    }

    if (uploadedFiles.length < 3) {
      toast.error('Envie pelo menos 3 fotos do veículo')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
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
      setOpen(false)

    } catch (error) {
      toast.error('Erro ao enviar solicitação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
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
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-fc-dark-gray flex items-center">
            <FileText className="w-6 h-6 mr-2 text-fc-orange" />
            Consignação de Veículos
          </DialogTitle>
          <p className="text-fc-medium-gray">
            Cadastre seu veículo para locação através da FC Locações
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Proprietário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-fc-dark-gray text-lg">
                <FileText className="w-5 h-5 mr-2" />
                Dados do Proprietário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
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
              </div>
              <div>
                <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(21) 99999-9999"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Dados do Veículo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-fc-dark-gray text-lg">
                <FileText className="w-5 h-5 mr-2" />
                Dados do Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Categoria */}
              <div>
                <Label className="mb-3 block">Categoria do Veículo *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vehicleCategories.map((category) => (
                    <div 
                      key={category}
                      className={`border-2 rounded-lg p-3 cursor-pointer text-center transition-colors ${
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
              <div className="grid md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="year">Ano *</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="2020"
                    required
                  />
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
                  <Label htmlFor="mileage">Quilometragem</Label>
                  <Input
                    id="mileage"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    placeholder="Ex: 50.000 km"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                  <Label htmlFor="dailyRate">Valor da Diária Pretendida *</Label>
                  <Input
                    id="dailyRate"
                    value={formData.dailyRate}
                    onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                    placeholder="R$ 500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição Adicional</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva detalhes importantes sobre o veículo..."
                  className="min-h-20"
                />
              </div>

              {/* Upload de Fotos */}
              <div>
                <Label className="mb-3 block">Fotos do Veículo *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-fc-orange transition-colors">
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-fc-medium-gray mx-auto mb-2" />
                    <p className="text-fc-dark-gray font-medium mb-1">
                      Adicione fotos do seu veículo
                    </p>
                    <p className="text-sm text-fc-medium-gray mb-3">
                      Mínimo 3 fotos
                    </p>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={handleFileUpload}
                      className="border-fc-orange text-fc-orange hover:bg-orange-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar Fotos
                    </Button>
                  </div>
                </div>

                {/* Preview das fotos */}
                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={file}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-16 object-cover rounded border border-gray-200"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-1 -right-1 w-5 h-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Termos */}
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-orange-50">
                <Checkbox 
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                  className="mt-1 border-fc-orange data-[state=checked]:bg-fc-orange data-[state=checked]:border-fc-orange"
                />
                <div className="text-sm">
                  <label 
                    htmlFor="terms"
                    className="font-medium text-fc-dark-gray cursor-pointer"
                  >
                    Aceito os termos de consignação *
                  </label>
                  <p className="text-fc-medium-gray mt-1">
                    Li e concordo com os termos de consignação da FC Locações.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              className="border-gray-300"
            >
              Limpar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-gray-300"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-fc-orange hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Enviar para Análise
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
