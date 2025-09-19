const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gdwpvvdncdqesakkfmle.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4OTI3OSwiZXhwIjoyMDcwOTY1Mjc5fQ.vx6l5XpyAY_s0K036QLWUcO39YcVWkfC0YKlFgfHS1s'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkVehicleExists() {
  const vehicleId = '484ad4ce-2594-4c68-aa7c-a163bc24f6ea'
  
  try {
    console.log(`🔍 Verificando se o veículo existe: ${vehicleId}`)
    
    // 1. Buscar veículo com select simples
    const { data: vehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select('id, status, plate')
      .eq('id', vehicleId)
      .single()
    
    if (fetchError) {
      console.error('❌ Erro ao buscar veículo:', fetchError)
      return
    }
    
    console.log('✅ Veículo encontrado:', vehicle)
    
    // 2. Testar update com select simples
    console.log('\n📋 Testando update com select simples...')
    const { data: updateResult, error: updateError } = await supabase
      .from('vehicles')
      .update({ status: 'disponivel' })
      .eq('id', vehicleId)
      .select('id, status')
      .single()
    
    if (updateError) {
      console.error('❌ Erro no update:', updateError)
    } else {
      console.log('✅ Update bem-sucedido:', updateResult)
    }
    
    // 3. Testar update sem single()
    console.log('\n📋 Testando update sem single()...')
    const { data: updateResult2, error: updateError2 } = await supabase
      .from('vehicles')
      .update({ status: 'disponivel' })
      .eq('id', vehicleId)
      .select('id, status')
    
    if (updateError2) {
      console.error('❌ Erro no update sem single():', updateError2)
    } else {
      console.log('✅ Update sem single() bem-sucedido:', updateResult2)
      console.log('Quantidade de registros:', updateResult2?.length || 0)
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

checkVehicleExists()
