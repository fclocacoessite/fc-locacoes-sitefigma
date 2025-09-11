import { ConsignmentForm } from '@/components/ConsignmentForm'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function ConsignacaoPage() {
  return (
    <div className="min-h-screen bg-fc-light-gray">
      <Header />
      <ConsignmentForm />
      <Footer />
    </div>
  )
}

