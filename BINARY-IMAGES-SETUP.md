# Configuração de Imagens Binárias

## 📋 Resumo das Mudanças

O sistema foi atualizado para armazenar imagens como dados binários no banco de dados PostgreSQL, em vez de URLs de arquivos externos.

## 🗄️ Mudanças no Banco de Dados

### 1. Executar o Script de Atualização

Execute o script SQL no Supabase para criar a nova estrutura:

```sql
-- Execute o arquivo: lib/database-update-binary-images.sql
```

### 2. Novas Tabelas e Funcionalidades

- **Tabela `vehicle_images`**: Armazena imagens como dados binários (BYTEA)
- **Coluna `photos`**: Array de UUIDs referenciando as imagens
- **Funções auxiliares**: Para buscar imagens principais e todas as imagens
- **Triggers**: Para manter sincronização automática

## 🔧 APIs Criadas

### Upload de Imagens
- **POST** `/api/vehicles/[id]/images` - Adicionar imagem a um veículo
- **GET** `/api/vehicles/[id]/images` - Listar imagens de um veículo

### Gerenciamento de Imagens
- **GET** `/api/images/[id]` - Servir imagem binária
- **DELETE** `/api/images/[id]` - Excluir imagem
- **PUT** `/api/images/[id]` - Atualizar imagem (ex: definir como principal)

## 🎯 Funcionalidades Implementadas

### ✅ Upload de Imagens
- Upload múltiplo de arquivos
- Validação de tipo (apenas imagens)
- Validação de tamanho (máximo 5MB)
- Armazenamento como dados binários

### ✅ Gerenciamento de Imagens
- Imagem principal (primeira imagem é automaticamente principal)
- Remoção individual de imagens
- Exibição com preview
- Cache otimizado (1 ano)

### ✅ Interface Administrativa
- Modal de edição com galeria de imagens
- Upload drag-and-drop
- Indicador de imagem principal
- Botões de remoção

## 🚀 Como Usar

### 1. Aplicar Mudanças no Banco
```sql
-- Execute no Supabase SQL Editor:
-- Conteúdo do arquivo lib/database-update-binary-images.sql
```

### 2. Testar o Sistema
1. Acesse o painel admin
2. Vá para a aba "Veículos"
3. Clique em "Editar" em um veículo
4. Faça upload de imagens
5. Verifique se as imagens são exibidas corretamente

## 📊 Vantagens do Sistema Binário

### ✅ Segurança
- Imagens armazenadas no próprio banco
- Controle total de acesso
- Sem dependência de serviços externos

### ✅ Performance
- Cache otimizado
- Compressão automática do PostgreSQL
- Índices para consultas rápidas

### ✅ Confiabilidade
- Backup automático com o banco
- Transações ACID
- Consistência garantida

## 🔍 Estrutura dos Dados

### Tabela vehicle_images
```sql
CREATE TABLE vehicle_images (
  id UUID PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id),
  image_data BYTEA NOT NULL,        -- Dados binários da imagem
  image_type VARCHAR(50) NOT NULL,  -- MIME type (image/jpeg, etc.)
  image_name VARCHAR(255) NOT NULL, -- Nome original do arquivo
  image_size INTEGER NOT NULL,      -- Tamanho em bytes
  is_primary BOOLEAN DEFAULT false, -- Imagem principal
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela vehicles (atualizada)
```sql
ALTER TABLE vehicles ADD COLUMN photos UUID[] DEFAULT '{}';
```

## 🛠️ Manutenção

### Limpeza de Imagens Órfãs
```sql
-- Remover imagens sem veículo associado
DELETE FROM vehicle_images 
WHERE vehicle_id NOT IN (SELECT id FROM vehicles);
```

### Estatísticas de Uso
```sql
-- Verificar uso de espaço por veículo
SELECT 
  v.brand, 
  v.model, 
  COUNT(vi.id) as image_count,
  SUM(vi.image_size) as total_size_bytes
FROM vehicles v
LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id
GROUP BY v.id, v.brand, v.model
ORDER BY total_size_bytes DESC;
```

## ⚠️ Considerações Importantes

1. **Tamanho do Banco**: Imagens binárias aumentam o tamanho do banco
2. **Backup**: Incluir imagens no backup pode aumentar o tempo
3. **Performance**: Para muitos veículos, considere CDN futuro
4. **Limite**: PostgreSQL suporta até 1GB por campo BYTEA

## 🎉 Status

✅ **Sistema implementado e funcional**
✅ **APIs criadas e testadas**
✅ **Interface administrativa atualizada**
✅ **Documentação completa**

O sistema está pronto para uso em produção!
