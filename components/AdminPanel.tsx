import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LayoutDashboard, 
  Truck, 
  FileText, 
  Users, 
  Settings, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Calendar
} from 'lucide-react';
import { SiteSettings } from './SiteSettings';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data for dashboard
  const dashboardStats = [
    {
      title: 'Frota Total',
      value: '24',
      change: '+2 este mês',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Locações Ativas',
      value: '18',
      change: '75% da frota',
      icon: Calendar,
      color: 'text-fc-orange',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 156.000',
      change: '+18% vs mês anterior',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Manutenções Pendentes',
      value: '3',
      change: 'Programadas',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  // Mock fleet data
  const fleetData = [
    {
      id: 'VEI-001',
      name: 'Munck 12T - Mercedes',
      model: 'Atego 1719',
      year: '2022',
      status: 'available',
      location: 'São Paulo - SP',
      nextMaintenance: '2024-02-15',
      dailyRate: 'R$ 800'
    },
    {
      id: 'VEI-002',
      name: 'Cesto Aéreo 20m',
      model: 'Plataforma Telescópica',
      year: '2023',
      status: 'rented',
      location: 'ABC Paulista',
      nextMaintenance: '2024-01-30',
      dailyRate: 'R$ 650'
    },
    {
      id: 'VEI-003',
      name: 'Caminhão 3/4',
      model: 'Cargo 816',
      year: '2021',
      status: 'maintenance',
      location: 'Oficina Central',
      nextMaintenance: '2024-01-25',
      dailyRate: 'R$ 350'
    }
  ];

  // Mock consignment data
  const consignmentData = [
    {
      id: 'CON-001',
      owner: 'João Silva',
      vehicle: 'Mercedes Atego 1719',
      year: '2020',
      submittedAt: '2024-01-15',
      status: 'pending',
      price: 'R$ 180.000',
      category: 'Caminhão Munck'
    },
    {
      id: 'CON-002',
      owner: 'Maria Santos',
      vehicle: 'Ford Cargo 1319',
      year: '2019',
      submittedAt: '2024-01-12',
      status: 'approved',
      price: 'R$ 120.000',
      category: 'Caminhão 3/4'
    },
    {
      id: 'CON-003',
      owner: 'Carlos Lima',
      vehicle: 'VW Constellation',
      year: '2018',
      submittedAt: '2024-01-10',
      status: 'rejected',
      price: 'R$ 95.000',
      category: 'Transporte'
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Frota', icon: Truck },
    { id: 'consignment', label: 'Consignação', icon: FileText },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'rented': return 'Locado';
      case 'maintenance': return 'Manutenção';
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const Dashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="bg-white border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fc-medium-gray">{stat.title}</p>
                  <p className="text-2xl font-bold text-fc-dark-gray">{stat.value}</p>
                  <p className="text-xs text-fc-medium-gray mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-fc-dark-gray">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Nova locação', item: 'Munck 12T - Cliente ABC', time: '1 hora atrás', type: 'success' },
                { action: 'Manutenção concluída', item: 'Cesto Aéreo 20m', time: '3 horas atrás', type: 'info' },
                { action: 'Consignação aprovada', item: 'Mercedes Atego 2020', time: '1 dia atrás', type: 'success' },
                { action: 'Cliente cadastrado', item: 'Construtora Silva', time: '2 dias atrás', type: 'info' }
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-fc-dark-gray">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start fc-orange hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Novo Veículo
            </Button>
            <Button variant="outline" className="w-full justify-start border-fc-orange text-fc-orange hover:bg-orange-50">
              <FileText className="w-4 h-4 mr-2" />
              Gerar Relatório Mensal
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Cadastrar Cliente
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Configurar Sistema
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const Fleet = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-fc-dark-gray">Gestão de Frota</h3>
          <p className="text-fc-medium-gray">Gerencie todos os veículos da sua frota</p>
        </div>
        <Button className="fc-orange hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Veículo
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Buscar por modelo, placa ou ID..."
                className="w-full"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fleet Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="fc-dark-gray text-white">
                <tr>
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Veículo</th>
                  <th className="text-left p-4">Modelo/Ano</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Localização</th>
                  <th className="text-left p-4">Próx. Manutenção</th>
                  <th className="text-left p-4">Diária</th>
                  <th className="text-left p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {fleetData.map((vehicle, index) => (
                  <tr key={vehicle.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 font-medium text-fc-dark-gray">{vehicle.id}</td>
                    <td className="p-4 text-fc-dark-gray">{vehicle.name}</td>
                    <td className="p-4 text-fc-medium-gray">{vehicle.model} ({vehicle.year})</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(vehicle.status)}>
                        {getStatusText(vehicle.status)}
                      </Badge>
                    </td>
                    <td className="p-4 text-fc-medium-gray">{vehicle.location}</td>
                    <td className="p-4 text-fc-medium-gray">{vehicle.nextMaintenance}</td>
                    <td className="p-4 font-medium text-fc-orange">{vehicle.dailyRate}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-fc-orange hover:bg-orange-50">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

  const Consignment = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-fc-dark-gray">Consignação de Veículos</h3>
          <p className="text-fc-medium-gray">Analise e aprove veículos enviados para consignação</p>
        </div>
      </div>

      {/* Consignment Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="fc-dark-gray text-white">
                <tr>
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Proprietário</th>
                  <th className="text-left p-4">Veículo</th>
                  <th className="text-left p-4">Ano</th>
                  <th className="text-left p-4">Categoria</th>
                  <th className="text-left p-4">Valor</th>
                  <th className="text-left p-4">Data Envio</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {consignmentData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 font-medium text-fc-dark-gray">{item.id}</td>
                    <td className="p-4 text-fc-dark-gray">{item.owner}</td>
                    <td className="p-4 text-fc-dark-gray">{item.vehicle}</td>
                    <td className="p-4 text-fc-medium-gray">{item.year}</td>
                    <td className="p-4 text-fc-medium-gray">{item.category}</td>
                    <td className="p-4 font-medium text-fc-orange">{item.price}</td>
                    <td className="p-4 text-fc-medium-gray">{item.submittedAt}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {item.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
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

  return (
    <div className="min-h-screen bg-fc-light-gray flex">
      {/* Sidebar */}
      <div className={`bg-fc-dark-gray text-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 fc-orange rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-gray-400">FC Locações</p>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-fc-orange transition-colors ${
                activeTab === item.id ? 'bg-fc-orange' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-fc-dark-gray"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="border-fc-orange text-fc-orange hover:bg-orange-50">
              Sair
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'fleet' && <Fleet />}
          {activeTab === 'consignment' && <Consignment />}
          {activeTab === 'clients' && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-fc-orange mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-fc-dark-gray">Gestão de Clientes</h3>
              <p className="text-fc-medium-gray">Em desenvolvimento...</p>
            </div>
          )}
          {activeTab === 'settings' && <SiteSettings />}
        </div>
      </div>
    </div>
  );
}