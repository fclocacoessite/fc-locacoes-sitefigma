import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Upload, 
  CreditCard, 
  Calendar,
  TrendingUp,
  Truck,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';

export function ClientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data
  const dashboardStats = [
    {
      title: 'Cotações Ativas',
      value: '3',
      change: '+2 esta semana',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Locações em Andamento',
      value: '1',
      change: 'Munck 12T até 25/01',
      icon: Truck,
      color: 'text-fc-orange'
    },
    {
      title: 'Pagamentos Pendentes',
      value: 'R$ 2.400',
      change: 'Vence em 5 dias',
      icon: CreditCard,
      color: 'text-red-600'
    },
    {
      title: 'Total Economizado',
      value: 'R$ 15.600',
      change: '+12% este mês',
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  const quotes = [
    {
      id: 'COT-001',
      vehicle: 'Caminhão Munck 12T',
      date: '2024-01-15',
      status: 'pending',
      value: 'R$ 800/dia',
      period: '5 dias'
    },
    {
      id: 'COT-002',
      vehicle: 'Cesto Aéreo 20m',
      date: '2024-01-12',
      status: 'approved',
      value: 'R$ 650/dia',
      period: '3 dias'
    },
    {
      id: 'COT-003',
      vehicle: 'Caminhão 3/4',
      date: '2024-01-10',
      status: 'rejected',
      value: 'R$ 350/dia',
      period: '2 dias'
    }
  ];

  const payments = [
    {
      id: 'PAG-001',
      description: 'Locação Munck 12T - Janeiro',
      value: 'R$ 2.400,00',
      dueDate: '2024-01-30',
      status: 'pending',
      installment: '1/1'
    },
    {
      id: 'PAG-002',
      description: 'Locação Cesto Aéreo - Dezembro',
      value: 'R$ 1.950,00',
      dueDate: '2024-01-05',
      status: 'paid',
      installment: '1/1'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      case 'paid': return 'Pago';
      default: return status;
    }
  };

  const Dashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-fc-dark-gray">Bem-vindo, Carlos Silva</h2>
          <p className="text-fc-medium-gray">Aqui está o resumo da sua conta</p>
        </div>
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-fc-dark-gray">Carlos Silva</p>
            <p className="text-sm text-fc-medium-gray">Construtora Silva & Cia</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fc-medium-gray">{stat.title}</p>
                  <p className="text-2xl font-bold text-fc-dark-gray">{stat.value}</p>
                  <p className="text-xs text-fc-medium-gray mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-fc-dark-gray">
              <Clock className="w-5 h-5 mr-2" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Cotação aprovada', item: 'Munck 12T', time: '2 horas atrás', type: 'success' },
                { action: 'Pagamento realizado', item: 'R$ 1.950,00', time: '1 dia atrás', type: 'success' },
                { action: 'Nova cotação', item: 'Cesto Aéreo 25m', time: '3 dias atrás', type: 'info' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-fc-dark-gray">{activity.action}</p>
                    <p className="text-sm text-fc-medium-gray">{activity.item}</p>
                  </div>
                  <span className="text-xs text-fc-medium-gray">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-fc-dark-gray">
              <AlertCircle className="w-5 h-5 mr-2" />
              Ações Necessárias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-fc-orange bg-orange-50 rounded-r-lg">
                <h4 className="font-medium text-fc-dark-gray">Pagamento Pendente</h4>
                <p className="text-sm text-fc-medium-gray">Fatura de R$ 2.400,00 vence em 5 dias</p>
                <Button size="sm" className="mt-2 fc-orange hover:bg-orange-600 text-white">
                  Pagar Agora
                </Button>
              </div>
              
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                <h4 className="font-medium text-fc-dark-gray">Documentação</h4>
                <p className="text-sm text-fc-medium-gray">Contrato de locação disponível para download</p>
                <Button size="sm" variant="outline" className="mt-2 border-blue-500 text-blue-500">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const Quotes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-fc-dark-gray">Minhas Cotações</h3>
          <p className="text-fc-medium-gray">Acompanhe suas solicitações de orçamento</p>
        </div>
        <Button className="fc-orange hover:bg-orange-600 text-white">
          Nova Cotação
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="fc-dark-gray text-white">
                <tr>
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Veículo</th>
                  <th className="text-left p-4">Data</th>
                  <th className="text-left p-4">Período</th>
                  <th className="text-left p-4">Valor</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote, index) => (
                  <tr key={quote.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 font-medium text-fc-dark-gray">{quote.id}</td>
                    <td className="p-4 text-fc-dark-gray">{quote.vehicle}</td>
                    <td className="p-4 text-fc-medium-gray">{quote.date}</td>
                    <td className="p-4 text-fc-medium-gray">{quote.period}</td>
                    <td className="p-4 font-medium text-fc-orange">{quote.value}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(quote.status)}>
                        {getStatusText(quote.status)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="text-fc-orange hover:bg-orange-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {quote.status === 'approved' && (
                          <Button size="sm" className="fc-orange hover:bg-orange-600 text-white">
                            Contratar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const Payments = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-fc-dark-gray">Pagamentos</h3>
        <p className="text-fc-medium-gray">Gerencie suas faturas e pagamentos</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-fc-dark-gray">Faturas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className={`p-4 rounded-lg border-2 ${
                  payment.status === 'pending' ? 'border-fc-orange bg-orange-50' : 'border-green-200 bg-green-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-fc-dark-gray">{payment.description}</h4>
                      <p className="text-sm text-fc-medium-gray">Parcela {payment.installment}</p>
                      <p className="text-sm text-fc-medium-gray">Vencimento: {payment.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-fc-dark-gray">{payment.value}</p>
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusText(payment.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  {payment.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="fc-orange hover:bg-orange-600 text-white">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pagar Agora
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Boleto
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-fc-dark-gray">Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-600">Pendente</p>
                <p className="text-xl font-bold text-red-700">R$ 2.400,00</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-600">Pago este mês</p>
                <p className="text-xl font-bold text-green-700">R$ 1.950,00</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">Total ano</p>
                <p className="text-xl font-bold text-blue-700">R$ 28.600,00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-fc-light-gray">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 fc-orange rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-fc-dark-gray">Portal do Cliente</h1>
                <p className="text-xs text-fc-medium-gray">FC Locações</p>
              </div>
            </div>
            <Button variant="outline" className="border-fc-orange text-fc-orange hover:bg-orange-50">
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="quotes" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
              Cotações
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
              Pagamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="quotes">
            <Quotes />
          </TabsContent>


          <TabsContent value="payments">
            <Payments />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}