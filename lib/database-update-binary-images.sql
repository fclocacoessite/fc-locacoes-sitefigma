-- Atualização do banco para suportar imagens binárias

-- Tabela para armazenar imagens dos veículos como dados binários
CREATE TABLE public.vehicle_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  image_data BYTEA NOT NULL,
  image_type VARCHAR(50) NOT NULL, -- MIME type (image/jpeg, image/png, etc.)
  image_name VARCHAR(255) NOT NULL, -- Nome original do arquivo
  image_size INTEGER NOT NULL, -- Tamanho em bytes
  is_primary BOOLEAN DEFAULT false, -- Imagem principal do veículo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar coluna photos na tabela vehicles para referenciar as imagens
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS photos UUID[] DEFAULT '{}';

-- Índices para melhor performance
CREATE INDEX idx_vehicle_images_vehicle_id ON public.vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_primary ON public.vehicle_images(vehicle_id, is_primary) WHERE is_primary = true;

-- Políticas de segurança RLS para vehicle_images
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;

-- Políticas para vehicle_images (público para visualização)
CREATE POLICY "Imagens de veículos são públicas para visualização" ON public.vehicle_images
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem modificar imagens de veículos" ON public.vehicle_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Função para obter a imagem principal de um veículo
CREATE OR REPLACE FUNCTION get_primary_vehicle_image(vehicle_uuid UUID)
RETURNS TABLE(image_data BYTEA, image_type VARCHAR(50)) AS $$
BEGIN
  RETURN QUERY
  SELECT vi.image_data, vi.image_type
  FROM public.vehicle_images vi
  WHERE vi.vehicle_id = vehicle_uuid AND vi.is_primary = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Função para obter todas as imagens de um veículo
CREATE OR REPLACE FUNCTION get_vehicle_images(vehicle_uuid UUID)
RETURNS TABLE(
  id UUID,
  image_data BYTEA,
  image_type VARCHAR(50),
  image_name VARCHAR(255),
  image_size INTEGER,
  is_primary BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT vi.id, vi.image_data, vi.image_type, vi.image_name, vi.image_size, vi.is_primary, vi.created_at
  FROM public.vehicle_images vi
  WHERE vi.vehicle_id = vehicle_uuid
  ORDER BY vi.is_primary DESC, vi.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar a coluna photos quando imagens são adicionadas/removidas
CREATE OR REPLACE FUNCTION update_vehicle_photos()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Adicionar o ID da nova imagem ao array photos
    UPDATE public.vehicles 
    SET photos = array_append(photos, NEW.id)
    WHERE id = NEW.vehicle_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Remover o ID da imagem do array photos
    UPDATE public.vehicles 
    SET photos = array_remove(photos, OLD.id)
    WHERE id = OLD.vehicle_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers para manter a coluna photos sincronizada
CREATE TRIGGER update_vehicle_photos_on_insert
  AFTER INSERT ON public.vehicle_images
  FOR EACH ROW EXECUTE FUNCTION update_vehicle_photos();

CREATE TRIGGER update_vehicle_photos_on_delete
  AFTER DELETE ON public.vehicle_images
  FOR EACH ROW EXECUTE FUNCTION update_vehicle_photos();
