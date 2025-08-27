import { Card, CardContent } from './ui/card';
import { Star, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Carlos Silva',
      company: 'Construtora Silva & Cia',
      text: 'Excelente serviço! O caminhão munck chegou no horário combinado e o operador era muito experiente. Recomendo para qualquer obra que precise de içamento.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      name: 'Ana Costa',
      company: 'Empresa de Fachadas Costa',
      text: 'Já utilizamos os cestos aéreos várias vezes. Equipamentos sempre em perfeito estado e com todas as certificações de segurança em dia.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612e228?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Roberto Lima',
      company: 'Metalúrgica Lima',
      text: 'Atendimento 24h realmente funciona. Precisamos de um caminhão de emergência no final de semana e eles atenderam prontamente.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-fc-orange fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 lg:py-24 fc-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white text-fc-orange text-sm font-medium mb-4 border border-fc-orange/20">
            Depoimentos
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-fc-dark-gray mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-lg text-fc-medium-gray max-w-3xl mx-auto">
            A satisfação dos nossos clientes é nossa prioridade. Veja o que eles falam sobre nossos serviços.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-fc-orange" />
                </div>

                {/* Testimonial Text */}
                <p className="text-fc-dark-gray mb-6 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Client Info */}
                <div className="flex items-center">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-fc-dark-gray">{testimonial.name}</h4>
                    <p className="text-sm text-fc-medium-gray">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-fc-orange mb-2">98%</div>
              <p className="text-fc-medium-gray">Satisfação dos Clientes</p>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-fc-orange mb-2">2h</div>
              <p className="text-fc-medium-gray">Tempo Médio de Resposta</p>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-fc-orange mb-2">15+</div>
              <p className="text-fc-medium-gray">Anos de Mercado</p>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-fc-orange mb-2">24h</div>
              <p className="text-fc-medium-gray">Atendimento Disponível</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}