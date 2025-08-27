import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, ChevronLeft, ChevronRight, Check, MapPin, Clock, Truck } from 'lucide-react';

export function QuoteWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: 'Serviço', description: 'Tipo de veículo e período' },
    { number: 2, title: 'Local', description: 'Endereço e detalhes' },
    { number: 3, title: 'Contato', description: 'Seus dados pessoais' },
    { number: 4, title: 'Resumo', description: 'Confirme as informações' }
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
  );

  const Step1 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium text-fc-dark-gray mb-4 block">
          Qual tipo de veículo você precisa?
        </Label>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { id: 'munck', title: 'Caminhão Munck', icon: Truck, desc: 'Para içamento e transporte' },
            { id: 'cesto', title: 'Cesto Aéreo', icon: MapPin, desc: 'Para trabalhos em altura' },
            { id: 'caminhao', title: 'Caminhão 3/4', icon: Truck, desc: 'Para transporte de carga' }
          ].map((option) => (
            <div 
              key={option.id}
              className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-fc-orange transition-colors duration-200"
            >
              <option.icon className="w-8 h-8 text-fc-orange mb-2" />
              <h4 className="font-medium text-fc-dark-gray">{option.title}</h4>
              <p className="text-sm text-fc-medium-gray">{option.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="capacity">Capacidade Necessária</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a capacidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8t">8 toneladas</SelectItem>
              <SelectItem value="12t">12 toneladas</SelectItem>
              <SelectItem value="25t">25 toneladas</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration">Duração Prevista</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Por quanto tempo?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meio-dia">Meio período</SelectItem>
              <SelectItem value="dia">1 dia</SelectItem>
              <SelectItem value="semana">1 semana</SelectItem>
              <SelectItem value="mes">1 mês ou mais</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label className="mb-2 block">Data de Início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? startDate.toLocaleDateString('pt-BR') : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="mb-2 block">Data de Término</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? endDate.toLocaleDateString('pt-BR') : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="address">Endereço Completo</Label>
        <Input 
          id="address"
          placeholder="Rua, número, bairro, cidade"
          className="mt-1"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input 
            id="cep"
            placeholder="00000-000"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="reference">Ponto de Referência</Label>
          <Input 
            id="reference"
            placeholder="Próximo ao mercado..."
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="access">Condições de Acesso</Label>
        <Textarea 
          id="access"
          placeholder="Descreva as condições de acesso ao local (rua estreita, portão baixo, etc.)"
          className="mt-1 min-h-20"
        />
      </div>

      <div>
        <Label className="mb-4 block">Serviços Adicionais</Label>
        <div className="space-y-3">
          {[
            { id: 'operator', label: 'Operador incluso', desc: 'Profissional qualificado para operação' },
            { id: 'insurance', label: 'Seguro adicional', desc: 'Cobertura extra para o equipamento' },
            { id: 'transport', label: 'Transporte do equipamento', desc: 'Entrega e retirada no local' }
          ].map((service) => (
            <div key={service.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200">
              <Checkbox 
                id={service.id}
                className="mt-1 border-fc-medium-gray data-[state=checked]:bg-fc-orange data-[state=checked]:border-fc-orange"
              />
              <div className="flex-1">
                <label 
                  htmlFor={service.id}
                  className="font-medium text-fc-dark-gray cursor-pointer"
                >
                  {service.label}
                </label>
                <p className="text-sm text-fc-medium-gray">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Nome Completo *</Label>
          <Input 
            id="name"
            placeholder="Seu nome completo"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input 
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <Input 
            id="phone"
            placeholder="(11) 99999-9999"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="company">Empresa</Label>
          <Input 
            id="company"
            placeholder="Nome da sua empresa"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="cnpj">CNPJ</Label>
        <Input 
          id="cnpj"
          placeholder="00.000.000/0000-00"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="observations">Observações Adicionais</Label>
        <Textarea 
          id="observations"
          placeholder="Informações extras sobre o projeto ou necessidades específicas..."
          className="mt-1 min-h-24"
        />
      </div>

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
            Aceito os termos de uso e política de privacidade
          </label>
          <p className="text-fc-medium-gray mt-1">
            Ao enviar este formulário, você autoriza o contato da FC Locações para elaboração do orçamento.
          </p>
        </div>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-fc-dark-gray">Quase pronto!</h3>
        <p className="text-fc-medium-gray">Revise suas informações antes de enviar</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Truck className="w-5 h-5 mr-2" />
            Resumo do Serviço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Tipo de Veículo:</span>
            <span className="font-medium">Caminhão Munck</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Capacidade:</span>
            <span className="font-medium">12 toneladas</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Período:</span>
            <span className="font-medium">15/01/2024 - 20/01/2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fc-medium-gray">Duração:</span>
            <span className="font-medium">1 semana</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <MapPin className="w-5 h-5 mr-2" />
            Local de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-fc-dark-gray">
            Rua das Flores, 123 - Centro<br />
            São Paulo, SP - CEP: 01234-567
          </p>
        </CardContent>
      </Card>

      <div className="bg-fc-light-gray rounded-lg p-6">
        <h4 className="font-semibold text-fc-dark-gray mb-2">O que acontece agora?</h4>
        <div className="space-y-3 text-sm text-fc-medium-gray">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-fc-orange" />
            Você receberá um orçamento em até 2 horas
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-2 text-fc-orange" />
            Nossa equipe entrará em contato para confirmar detalhes
          </div>
          <div className="flex items-center">
            <Truck className="w-4 h-4 mr-2 text-fc-orange" />
            Após aprovação, agendaremos a entrega do equipamento
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      default: return <Step1 />;
    }
  };

  return (
    <div className="min-h-screen bg-fc-light-gray py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fc-dark-gray mb-2">
            Solicitar Orçamento
          </h1>
          <p className="text-lg text-fc-medium-gray">
            Preencha os dados abaixo e receba seu orçamento personalizado
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
                <Button className="flex items-center fc-orange hover:bg-orange-600 text-white">
                  <Check className="w-4 h-4 mr-2" />
                  Enviar Solicitação
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}