import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Search, 
  BarChart3, 
  Shield, 
  Mail, 
  Database,
  Key,
  Globe,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

export function AdvancedSettings() {
  const [seoSettings, setSeoSettings] = useState({
    siteName: 'FC Locações - Locação de Equipamentos',
    siteDescription: 'Especializada em locação de caminhões Munck, cestos aéreos e caminhões 3/4. Equipamentos de qualidade para sua obra.',
    keywords: 'locação, caminhão munck, cesto aéreo, equipamentos, construção, são paulo',
    googleAnalytics: '',
    googleTagManager: '',
    facebookPixel: '',
    robotsTxt: 'User-agent: *\nAllow: /',
    sitemap: true
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: 'contato@fclocacoes.com.br',
    fromName: 'FC Locações'
  });

  const [securitySettings, setSecuritySettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    lastBackup: '2024-01-20 02:00:00'
  });

  const SEOTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Search className="w-5 h-5 mr-2" />
            Otimização para Mecanismos de Busca (SEO)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteName">Título do Site</Label>
            <Input
              id="siteName"
              value={seoSettings.siteName}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, siteName: e.target.value }))}
            />
            <p className="text-xs text-fc-medium-gray mt-1">Aparece na aba do navegador e resultados de busca</p>
          </div>

          <div>
            <Label htmlFor="siteDescription">Descrição do Site</Label>
            <Textarea
              id="siteDescription"
              value={seoSettings.siteDescription}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              className="min-h-20"
            />
            <p className="text-xs text-fc-medium-gray mt-1">Máximo 160 caracteres. Aparece nos resultados de busca.</p>
          </div>

          <div>
            <Label htmlFor="keywords">Palavras-chave</Label>
            <Input
              id="keywords"
              value={seoSettings.keywords}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="palavra1, palavra2, palavra3"
            />
            <p className="text-xs text-fc-medium-gray mt-1">Separadas por vírgula. Relacionadas ao seu negócio.</p>
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="sitemap"
              checked={seoSettings.sitemap}
              onCheckedChange={(checked) => setSeoSettings(prev => ({ ...prev, sitemap: checked }))}
            />
            <div>
              <Label htmlFor="sitemap" className="cursor-pointer">Gerar Sitemap Automaticamente</Label>
              <p className="text-xs text-fc-medium-gray">Ajuda os mecanismos de busca a indexar seu site</p>
            </div>
          </div>

          <div>
            <Label htmlFor="robotsTxt">Robots.txt</Label>
            <Textarea
              id="robotsTxt"
              value={seoSettings.robotsTxt}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, robotsTxt: e.target.value }))}
              className="min-h-20 font-mono text-sm"
            />
            <p className="text-xs text-fc-medium-gray mt-1">Instruções para robôs de busca</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <BarChart3 className="w-5 h-5 mr-2" />
            Ferramentas de Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="googleAnalytics">Google Analytics (GA4)</Label>
            <Input
              id="googleAnalytics"
              value={seoSettings.googleAnalytics}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, googleAnalytics: e.target.value }))}
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-xs text-fc-medium-gray mt-1">ID de medição do Google Analytics</p>
          </div>

          <div>
            <Label htmlFor="googleTagManager">Google Tag Manager</Label>
            <Input
              id="googleTagManager"
              value={seoSettings.googleTagManager}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, googleTagManager: e.target.value }))}
              placeholder="GTM-XXXXXXX"
            />
            <p className="text-xs text-fc-medium-gray mt-1">ID do contêiner do Google Tag Manager</p>
          </div>

          <div>
            <Label htmlFor="facebookPixel">Facebook Pixel</Label>
            <Input
              id="facebookPixel"
              value={seoSettings.facebookPixel}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, facebookPixel: e.target.value }))}
              placeholder="123456789012345"
            />
            <p className="text-xs text-fc-medium-gray mt-1">ID do Facebook Pixel para acompanhamento de conversões</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Política de Privacidade</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Lembre-se de atualizar sua política de privacidade ao usar ferramentas de analytics para estar em conformidade com a LGPD.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const EmailTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Mail className="w-5 h-5 mr-2" />
            Configurações de E-mail
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpHost">Servidor SMTP</Label>
              <Input
                id="smtpHost"
                value={emailSettings.smtpHost}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">Porta</Label>
              <Input
                id="smtpPort"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                placeholder="587"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpUser">Usuário SMTP</Label>
              <Input
                id="smtpUser"
                value={emailSettings.smtpUser}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                placeholder="seu-email@gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="smtpPassword">Senha/Token</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                placeholder="********"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromEmail">E-mail Remetente</Label>
              <Input
                id="fromEmail"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                placeholder="contato@fclocacoes.com.br"
              />
            </div>
            <div>
              <Label htmlFor="fromName">Nome Remetente</Label>
              <Input
                id="fromName"
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                placeholder="FC Locações"
              />
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">Status da Conexão</h4>
                <p className="text-sm text-green-700">Configuração de e-mail funcionando corretamente</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-green-600 text-green-600">
              Testar E-mail
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Shield className="w-5 h-5 mr-2" />
            Configurações de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-fc-dark-gray">Modo de Manutenção</h4>
              <p className="text-sm text-fc-medium-gray">Ativa página de manutenção para visitantes</p>
            </div>
            <Switch
              checked={securitySettings.maintenanceMode}
              onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, maintenanceMode: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-fc-dark-gray">Permitir Registro de Usuários</h4>
              <p className="text-sm text-fc-medium-gray">Novos usuários podem se cadastrar</p>
            </div>
            <Switch
              checked={securitySettings.allowRegistration}
              onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, allowRegistration: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-fc-dark-gray">Verificação de E-mail</h4>
              <p className="text-sm text-fc-medium-gray">Obrigatório verificar e-mail no cadastro</p>
            </div>
            <Switch
              checked={securitySettings.requireEmailVerification}
              onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireEmailVerification: checked }))}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="passwordMinLength">Tamanho Mínimo da Senha</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                min="6"
                max="20"
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Timeout da Sessão (min)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts">Máx. Tentativas de Login</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                min="3"
                max="10"
              />
            </div>
          </div>

          {securitySettings.maintenanceMode && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Modo de Manutenção Ativo</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    O site está indisponível para visitantes. Apenas administradores podem acessar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const BackupTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Database className="w-5 h-5 mr-2" />
            Backup e Restauração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-fc-dark-gray">Backup Automático</h4>
              <p className="text-sm text-fc-medium-gray">Criar backups automaticamente</p>
            </div>
            <Switch
              checked={backupSettings.autoBackup}
              onCheckedChange={(checked) => setBackupSettings(prev => ({ ...prev, autoBackup: checked }))}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="backupFrequency">Frequência do Backup</Label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={backupSettings.backupFrequency}
                onChange={(e) => setBackupSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            <div>
              <Label htmlFor="retentionDays">Retenção (dias)</Label>
              <Input
                id="retentionDays"
                type="number"
                value={backupSettings.retentionDays}
                onChange={(e) => setBackupSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                min="7"
                max="365"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-fc-dark-gray mb-3">Status do Backup</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-fc-medium-gray">Último backup:</span>
                <Badge variant="secondary">{backupSettings.lastBackup}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-fc-medium-gray">Próximo backup:</span>
                <Badge className="bg-green-100 text-green-800">Hoje às 02:00</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-fc-medium-gray">Tamanho total:</span>
                <span className="text-sm font-medium text-fc-dark-gray">2.4 GB</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="fc-orange hover:bg-orange-600 text-white">
              <Database className="w-4 h-4 mr-2" />
              Criar Backup Agora
            </Button>
            <Button variant="outline" className="border-blue-500 text-blue-600">
              <Key className="w-4 h-4 mr-2" />
              Restaurar Backup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-fc-dark-gray">Configurações Avançadas</h3>
        <p className="text-fc-medium-gray">Configurações técnicas e de segurança do sistema</p>
      </div>

      <Tabs defaultValue="seo">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="seo" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
            <Search className="w-4 h-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
            <Mail className="w-4 h-4 mr-2" />
            E-mail
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seo">
          <SEOTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="email">
          <EmailTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}