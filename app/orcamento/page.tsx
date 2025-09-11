'use client'

import { useState, useEffect } from 'react'
import { Vehicle } from '@/lib/supabase'
import { ResponsiveHeader } from '@/components/ResponsiveHeader'
import { Footer } from '@/components/Footer'
import { AdminFloatingButton } from '@/components/AdminFloatingButton'

export default function OrcamentoPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    vehicle_id: '',
    start_date: '',
    end_date: '',
    message: ''
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      setVehicles(data.vehicles || [])
    } catch (error) {
      console.error('Erro ao carregar veículos:', error)
      setVehicles([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          client_name: '',
          client_email: '',
          client_phone: '',
          vehicle_id: '',
          start_date: '',
          end_date: '',
          message: ''
        })
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error)
      alert('Erro ao enviar orçamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Orçamento Enviado!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Recebemos sua solicitação. Entraremos em contato em até 2 horas.
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                Voltar ao Início
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveHeader />

      {/* Formulário */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Solicitar Orçamento</h1>
              <p className="mt-2 text-gray-600">
                Preencha os dados abaixo e receba sua cotação em até 2 horas
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados pessoais */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    id="client_name"
                    required
                    value={formData.client_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="client_email" className="block text-sm font-medium text-gray-700">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="client_email"
                    id="client_email"
                    required
                    value={formData.client_email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="client_phone" className="block text-sm font-medium text-gray-700">
                  Telefone/WhatsApp *
                </label>
                <input
                  type="tel"
                  name="client_phone"
                  id="client_phone"
                  required
                  value={formData.client_phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Seleção de veículo */}
              <div>
                <label htmlFor="vehicle_id" className="block text-sm font-medium text-gray-700">
                  Veículo *
                </label>
                <select
                  name="vehicle_id"
                  id="vehicle_id"
                  required
                  value={formData.vehicle_id}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Selecione um veículo</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.category} - {vehicle.model} 
                      {vehicle.capacity_ton && ` (${vehicle.capacity_ton}t)`}
                      {vehicle.height_m && ` (${vehicle.height_m}m)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Período */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    id="start_date"
                    required
                    value={formData.start_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                    Data de Término *
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    id="end_date"
                    required
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Mensagem */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Descreva detalhes sobre o local de trabalho, tipo de carga, horários especiais, etc."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Botão de envio */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Solicitar Orçamento'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Admin Floating Button */}
      <AdminFloatingButton />

      {/* Footer */}
      <Footer />
    </div>
  )
}
