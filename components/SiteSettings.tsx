import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  Palette, 
  Upload, 
  Building, 
  Type, 
  Share2, 
  Eye,
  Save,
  RotateCcw,
  Image as ImageIcon,
  Camera,
  X,
  Plus,
  Check,
  AlertCircle
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SitePreview } from './SitePreview';

export function SiteSettings() {
  const [activeTab, setActiveTab] = useState('branding');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Current brand settings
  const [brandSettings, setBrandSettings] = useState({
    primaryColor: '#FF5722',
    darkGray: '#1E1E1E',
    mediumGray: '#B3B3B3',
    lightGray: '#F5F5F5',
    logo: '',
    companyName: 'FC Locações',
    tagline: 'Soluções em Locação de Equipamentos'
  });

  // Hero section settings
  const [heroSettings, setHeroSettings] = useState({
    title: 'Locação de Caminhões Munck e Equipamentos',
    subtitle: 'Equipamentos de qualidade para sua obra com segurança e eficiência',
    backgroundImage: '',
    ctaText: 'Solicitar Orçamento',
    showStats: true
  });

  // Company info settings
  const [companySettings, setCompanySettings] = useState({
    name: 'FC Locações',
    description: 'Especializada em locação de caminhões Munck, cestos aéreos e caminhões 3/4 para atender suas necessidades de construção e logística.',
    phone: '(11) 99999-9999',
    email: 'contato@fclocacoes.com.br',
    address: 'Rua das Empresas, 123 - Rio de Janeiro, RJ',
    cnpj: '12.345.678/0001-90',
    workingHours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h'
  });

  // Social media settings
  const [socialSettings, setSocialSettings] = useState({
    instagram: '',
    whatsapp: '21992154030',
    youtube: '',
    website: 'www.fclocacoes.com.br'
  });

  const [fleetImages, setFleetImages] = useState([
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580407196238-dac33f57c410?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ]);

  const predefinedColors = [
    { name: 'Laranja FC', color: '#FF5722' },
    { name: 'Azul Corporativo', color: '#2563EB' },
    { name: 'Verde Empresarial', color: '#059669' },
    { name: 'Vermelho Forte', color: '#DC2626' },
    { name: 'Roxo Moderno', color: '#7C3AED' },
    { name: 'Amarelo Destaque', color: '#D97706' }
  ];

  const handleColorChange = (colorType: string, color: string) => {
    setBrandSettings(prev => ({ ...prev, [colorType]: color }));
    setHasChanges(true);
  };

  const handleImageUpload = (type: string) => {
    // Simulate image upload
    const mockImageUrl = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    if (type === 'logo') {
      setBrandSettings(prev => ({ ...prev, logo: mockImageUrl }));
    } else if (type === 'hero') {
      setHeroSettings(prev => ({ ...prev, backgroundImage: mockImageUrl }));
    } else if (type === 'fleet') {
      setFleetImages(prev => [...prev, mockImageUrl]);
    }
    setHasChanges(true);
  };

  const removeFleetImage = (index: number) => {
    setFleetImages(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Simulate save
    setHasChanges(false);
    // Here would be the API call to save settings
    console.log('Settings saved:', {
      brandSettings,
      heroSettings,
      companySettings,
      socialSettings,
      fleetImages
    });
  };

  const resetSettings = () => {
    // Reset to defaults
    setBrandSettings({
      primaryColor: '#FF5722',
      darkGray: '#1E1E1E',
      mediumGray: '#B3B3B3',
      lightGray: '#F5F5F5',
      logo: '',
      companyName: 'FC Locações',
      tagline: 'Soluções em Locação de Equipamentos'
    });
    setHasChanges(false);
  };

  const BrandingTab = () => (
    <div className="space-y-6">
      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <ImageIcon className="w-5 h-5 mr-2" />
            Logo da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {brandSettings.logo ? (
              <div className="relative">
                <ImageWithFallback
                  src={brandSettings.logo}
                  alt="Logo atual"
                  className="w-32 h-20 object-contain border border-gray-200 rounded-lg bg-white p-2"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                  onClick={() => setBrandSettings(prev => ({ ...prev, logo: '' }))}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <Button 
                onClick={() => handleImageUpload('logo')}
                className="fc-orange hover:bg-orange-600 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
              <p className="text-sm text-fc-medium-gray mt-2">
                Recomendado: PNG ou SVG, fundo transparente, até 2MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Building className="w-5 h-5 mr-2" />
            Informações da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              value={brandSettings.companyName}
              onChange={(e) => setBrandSettings(prev => ({ ...prev, companyName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="tagline">Slogan/Tagline</Label>
            <Input
              id="tagline"
              value={brandSettings.tagline}
              onChange={(e) => setBrandSettings(prev => ({ ...prev, tagline: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Palette className="w-5 h-5 mr-2" />
            Paleta de Cores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Predefined Colors */}
          <div>
            <Label className="mb-3 block">Cores Pré-definidas</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {predefinedColors.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => handleColorChange('primaryColor', colorOption.color)}
                  className={`group relative w-full h-16 rounded-lg border-2 transition-all ${
                    brandSettings.primaryColor === colorOption.color 
                      ? 'border-fc-dark-gray ring-2 ring-fc-orange' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption.color }}
                >
                  {brandSettings.primaryColor === colorOption.color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                  )}
                  <div className="absolute -bottom-8 left-0 right-0 text-xs text-center text-fc-medium-gray opacity-0 group-hover:opacity-100 transition-opacity">
                    {colorOption.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Custom Colors */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="primaryColor">Cor Primária</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={brandSettings.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={brandSettings.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  placeholder="#FF5722"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="darkGray">Cinza Escuro</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  id="darkGray"
                  type="color"
                  value={brandSettings.darkGray}
                  onChange={(e) => handleColorChange('darkGray', e.target.value)}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={brandSettings.darkGray}
                  onChange={(e) => handleColorChange('darkGray', e.target.value)}
                  placeholder="#1E1E1E"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mediumGray">Cinza Médio</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  id="mediumGray"
                  type="color"
                  value={brandSettings.mediumGray}
                  onChange={(e) => handleColorChange('mediumGray', e.target.value)}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={brandSettings.mediumGray}
                  onChange={(e) => handleColorChange('mediumGray', e.target.value)}
                  placeholder="#B3B3B3"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lightGray">Cinza Claro</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  id="lightGray"
                  type="color"
                  value={brandSettings.lightGray}
                  onChange={(e) => handleColorChange('lightGray', e.target.value)}
                  className="w-16 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={brandSettings.lightGray}
                  onChange={(e) => handleColorChange('lightGray', e.target.value)}
                  placeholder="#F5F5F5"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
            <h4 className="font-medium text-fc-dark-gray mb-4">Preview das Cores</h4>
            <div className="flex gap-4 items-center">
              <div 
                className="w-16 h-16 rounded-lg border border-gray-300"
                style={{ backgroundColor: brandSettings.primaryColor }}
                title="Cor Primária"
              />
              <div 
                className="w-16 h-16 rounded-lg border border-gray-300"
                style={{ backgroundColor: brandSettings.darkGray }}
                title="Cinza Escuro"
              />
              <div 
                className="w-16 h-16 rounded-lg border border-gray-300"
                style={{ backgroundColor: brandSettings.mediumGray }}
                title="Cinza Médio"
              />
              <div 
                className="w-16 h-16 rounded-lg border border-gray-300"
                style={{ backgroundColor: brandSettings.lightGray }}
                title="Cinza Claro"
              />
              <div className="flex-1">
                <Button 
                  style={{ backgroundColor: brandSettings.primaryColor }}
                  className="text-white hover:opacity-90"
                >
                  Botão Exemplo
                </Button>
                <p className="text-sm text-fc-medium-gray mt-2">
                  Assim ficará a aparência dos botões
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ContentTab = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Type className="w-5 h-5 mr-2" />
            Seção Principal (Hero)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Título Principal</Label>
            <Input
              id="heroTitle"
              value={heroSettings.title}
              onChange={(e) => setHeroSettings(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="heroSubtitle">Subtítulo</Label>
            <Textarea
              id="heroSubtitle"
              value={heroSettings.subtitle}
              onChange={(e) => setHeroSettings(prev => ({ ...prev, subtitle: e.target.value }))}
              className="min-h-20"
            />
          </div>

          <div>
            <Label htmlFor="ctaText">Texto do Botão Principal</Label>
            <Input
              id="ctaText"
              value={heroSettings.ctaText}
              onChange={(e) => setHeroSettings(prev => ({ ...prev, ctaText: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="showStats"
              checked={heroSettings.showStats}
              onCheckedChange={(checked) => setHeroSettings(prev => ({ ...prev, showStats: checked }))}
            />
            <Label htmlFor="showStats">Mostrar estatísticas na seção hero</Label>
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Building className="w-5 h-5 mr-2" />
            Informações da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyPhone">Telefone</Label>
              <Input
                id="companyPhone"
                value={companySettings.phone}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="companyEmail">E-mail</Label>
              <Input
                id="companyEmail"
                type="email"
                value={companySettings.email}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="companyAddress">Endereço</Label>
            <Input
              id="companyAddress"
              value={companySettings.address}
              onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyCnpj">CNPJ</Label>
              <Input
                id="companyCnpj"
                value={companySettings.cnpj}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, cnpj: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="workingHours">Horário de Funcionamento</Label>
              <Input
                id="workingHours"
                value={companySettings.workingHours}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, workingHours: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="companyDescription">Descrição da Empresa</Label>
            <Textarea
              id="companyDescription"
              value={companySettings.description}
              onChange={(e) => setCompanySettings(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-24"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ImagesTab = () => (
    <div className="space-y-6">
      {/* Hero Background */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Camera className="w-5 h-5 mr-2" />
            Banner Principal (Hero)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {heroSettings.backgroundImage ? (
            <div className="relative">
              <ImageWithFallback
                src={heroSettings.backgroundImage}
                alt="Banner hero"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => setHeroSettings(prev => ({ ...prev, backgroundImage: '' }))}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-fc-medium-gray">Nenhuma imagem selecionada</p>
              </div>
            </div>
          )}
          
          <Button 
            onClick={() => handleImageUpload('hero')}
            className="fc-orange hover:bg-orange-600 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Banner
          </Button>
          <p className="text-sm text-fc-medium-gray">
            Recomendado: 1920x1080px, formato JPG ou PNG, até 5MB
          </p>
        </CardContent>
      </Card>

      {/* Fleet Images */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-fc-dark-gray">
              <ImageIcon className="w-5 h-5 mr-2" />
              Galeria da Frota
            </CardTitle>
            <Button
              onClick={() => handleImageUpload('fleet')}
              size="sm"
              className="fc-orange hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Imagem
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fleetImages.map((image, index) => (
              <div key={index} className="relative group">
                <ImageWithFallback
                  src={image}
                  alt={`Veículo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFleetImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
              </div>
            ))}
            
            {/* Add new image placeholder */}
            <button
              onClick={() => handleImageUpload('fleet')}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          <p className="text-sm text-fc-medium-gray mt-4">
            Recomendado: 800x600px, formato JPG ou PNG, até 3MB por imagem
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const SocialTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-fc-dark-gray">
            <Share2 className="w-5 h-5 mr-2" />
            Redes Sociais e Contatos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/fclocacoes"
                value={socialSettings.instagram}
                onChange={(e) => setSocialSettings(prev => ({ ...prev, instagram: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                placeholder="https://youtube.com/@fclocacoes"
                value={socialSettings.youtube}
                onChange={(e) => setSocialSettings(prev => ({ ...prev, youtube: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="21992154030"
                value={socialSettings.whatsapp}
                onChange={(e) => setSocialSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="www.fclocacoes.com.br"
                value={socialSettings.website}
                onChange={(e) => setSocialSettings(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with save controls */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-fc-dark-gray">Configurações do Site</h3>
          <p className="text-fc-medium-gray">Personalize a aparência e conteúdo do seu site</p>
        </div>
        
        <div className="flex gap-3">
          {hasChanges && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Alterações não salvas</span>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={resetSettings}
            className="flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          
          <Button
            onClick={saveSettings}
            className="fc-orange hover:bg-orange-600 text-white flex items-center"
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-2" />
            Marca
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
            <Type className="w-4 h-4 mr-2" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
            <ImageIcon className="w-4 h-4 mr-2" />
            Imagens
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-fc-orange data-[state=active]:text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Social
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <BrandingTab />
        </TabsContent>

        <TabsContent value="content">
          <ContentTab />
        </TabsContent>

        <TabsContent value="images">
          <ImagesTab />
        </TabsContent>

        <TabsContent value="social">
          <SocialTab />
        </TabsContent>
      </Tabs>

      {/* Preview Button */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Visualizar Alterações</h4>
              <p className="text-sm text-blue-700">Veja como ficará o site com as novas configurações</p>
            </div>
            <SitePreview 
              brandSettings={brandSettings}
              heroSettings={heroSettings}
              companySettings={companySettings}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}