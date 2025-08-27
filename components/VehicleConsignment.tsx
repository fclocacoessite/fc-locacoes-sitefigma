import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Upload, X, Camera, FileText, Check, AlertCircle, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function VehicleConsignment() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    capacity: '',
    condition: '',
    mileage: '',
    price: '',
    description: ''
  });

  const vehicleCategories = [
    'Caminhão Munck',
    'Cesto Aéreo',
    'Caminhão 3/4',
    'Guindaste',
    'Outro'
  ];

  const vehicleConditions = [
    'Excelente',
    'Muito Bom',
    'Bom',
    'Regular',
    'Precisa de Reparos'
  ];

  // Mock submitted vehicles
  const submittedVehicles = [
    {
      id: 'VEI-001',
      brand: 'Mercedes-Benz',
      model: 'Atego 1719',
      year: '2020',
      category: 'Caminhão Munck',
      status: 'analyzing',
      submittedAt: '2024-01-15',
      price: 'R$ 180.000'
    },
    {
      id: 'VEI-002',
      brand: 'Volkswagen',
      model: 'Constellation 17-250',
      year: '2019',
      category: 'Caminhão 3/4',
      status: 'approved',
      submittedAt: '2024-01-10',
      price: 'R$ 120.000'
    },
    {
      id: 'VEI-003',
      brand: 'Ford',
      model: 'Cargo 1319',
      year: '2018',
      category: 'Caminhão Munck',
      status: 'rejected',
      submittedAt: '2024-01-08',
      price: 'R$ 95.000'
    }
  ];

  const addFile = () => {
    // Simulate file upload
    const mockImageUrl = `https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`;
    setUploadedFiles([...uploadedFiles, mockImageUrl]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'analyzing': return 'Em Análise';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzing': return <Clock className="w-4 h-4" />;
      case 'approved': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-fc-light-gray py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fc-dark-gray mb-2">
            Consignação de Veículos
          </h1>
          <p className="text-lg text-fc-medium-gray">
            Envie seu veículo para análise e possível inclusão em nossa frota
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-fc-dark-gray">
                  <FileText className="w-5 h-5 mr-2" />
                  Dados do Veículo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vehicle Category */}
                <div>
                  <Label className="mb-3 block">Categoria do Veículo *</Label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {vehicleCategories.map((category) => (
                      <div 
                        key={category}
                        className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-fc-orange transition-colors text-center"
                      >
                        <span className="text-sm font-medium text-fc-dark-gray">{category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="brand">Marca *</Label>
                    <Input 
                      id="brand"
                      placeholder="Ex: Mercedes-Benz"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo *</Label>
                    <Input 
                      id="model"
                      placeholder="Ex: Atego 1719"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="year">Ano *</Label>
                    <Input 
                      id="year"
                      placeholder="2020"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacidade</Label>
                    <Input 
                      id="capacity"
                      placeholder="Ex: 12 toneladas"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Quilometragem</Label>
                    <Input 
                      id="mileage"
                      placeholder="Ex: 50.000 km"
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                    />
                  </div>
                </div>

                {/* Condition and Price */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="condition">Estado de Conservação *</Label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
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
                    <Label htmlFor="price">Valor Pretendido</Label>
                    <Input 
                      id="price"
                      placeholder="R$ 150.000"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Descrição Adicional</Label>
                  <Textarea 
                    id="description"
                    placeholder="Descreva detalhes importantes sobre o veículo, histórico de manutenção, acessórios, etc."
                    className="min-h-24"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <Label className="mb-3 block">Fotos do Veículo *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-fc-orange transition-colors">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-fc-medium-gray mx-auto mb-4" />
                      <p className="text-fc-dark-gray font-medium mb-2">
                        Adicione fotos do seu veículo
                      </p>
                      <p className="text-sm text-fc-medium-gray mb-4">
                        Mínimo 5 fotos (frente, traseira, laterais, interior e motor)
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={addFile}
                        className="border-fc-orange text-fc-orange hover:bg-orange-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Selecionar Fotos
                      </Button>
                    </div>
                  </div>

                  {/* Preview uploaded files */}
                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <ImageWithFallback
                            src={file}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-orange-50">
                  <Checkbox 
                    id="terms"
                    className="mt-1 border-fc-orange data-[state=checked]:bg-fc-orange data-[state=checked]:border-fc-orange"
                  />
                  <div className="text-sm">
                    <label 
                      htmlFor="terms"
                      className="font-medium text-fc-dark-gray cursor-pointer"
                    >
                      Aceito os termos de consignação
                    </label>
                    <p className="text-fc-medium-gray mt-1">
                      Li e concordo com os termos de consignação da FC Locações. Entendo que a análise pode levar até 5 dias úteis.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button className="w-full fc-orange hover:bg-orange-600 text-white py-3">
                  <FileText className="w-5 h-5 mr-2" />
                  Enviar para Análise
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-fc-dark-gray">Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 fc-orange rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-fc-dark-gray">Envio</h4>
                    <p className="text-sm text-fc-medium-gray">Preencha o formulário com os dados do seu veículo</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 fc-orange rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-fc-dark-gray">Análise</h4>
                    <p className="text-sm text-fc-medium-gray">Nossa equipe técnica avalia o veículo em até 5 dias</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 fc-orange rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-fc-dark-gray">Proposta</h4>
                    <p className="text-sm text-fc-medium-gray">Receba nossa proposta de consignação por email</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 fc-orange rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium text-fc-dark-gray">Contrato</h4>
                    <p className="text-sm text-fc-medium-gray">Se aprovado, assinamos o contrato de consignação</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submitted Vehicles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-fc-dark-gray">Veículos Enviados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {submittedVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-fc-dark-gray text-sm">
                          {vehicle.brand} {vehicle.model}
                        </h4>
                        <p className="text-xs text-fc-medium-gray">{vehicle.year} - {vehicle.category}</p>
                      </div>
                      <Badge className={getStatusColor(vehicle.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(vehicle.status)}
                          <span>{getStatusText(vehicle.status)}</span>
                        </div>
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-fc-medium-gray">
                      <span>ID: {vehicle.id}</span>
                      <span>{vehicle.submittedAt}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}