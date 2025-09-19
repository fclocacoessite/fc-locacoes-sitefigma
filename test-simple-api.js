const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gdwpvvdncdqesakkfmle.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4OTI3OSwiZXhwIjoyMDcwOTY1Mjc5fQ.vx6l5XpyAY_s0K036QLWUcO39YcVWkfC0YKlFgfHS1s'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSimpleAPI() {
  const vehicleId = '484ad4ce-2594-4c68-aa7c-a163bc24f6ea'
  
  try {
    console.log(`🔍 Testando API simples: ${vehicleId}`)
    
    // Testar com payload mínimo
    const response = await fetch(`http://localhost:3000/api/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'disponivel'
      })
    })
    
    console.log('Status da resposta:', response.status)
    console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Resposta da API:', result)
    } else {
      const errorText = await response.text()
      console.log('❌ Erro da API:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Erro na chamada da API:', error.message)
  }
}

testSimpleAPI()
