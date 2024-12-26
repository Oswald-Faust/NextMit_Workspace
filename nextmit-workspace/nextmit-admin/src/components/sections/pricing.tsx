'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    description: "Parfait pour débuter",
    features: [
      "Jusqu'à 2 événements",
      "Gestion basique des participants",
      "Support par email",
      "Interface intuitive"
    ]
  },
  {
    name: "Pro",
    price: "29€",
    description: "Pour les organisateurs réguliers",
    features: [
      "Événements illimités",
      "Analyses avancées",
      "Support prioritaire",
      "Personnalisation complète",
      "Export des données"
    ],
    popular: true
  },
  {
    name: "Entreprise",
    price: "Sur mesure",
    description: "Pour les grandes organisations",
    features: [
      "Tout du plan Pro",
      "API dédiée",
      "Support 24/7",
      "Formation personnalisée",
      "SLA garanti"
    ]
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative rounded-2xl bg-white/10 backdrop-blur-lg p-8 ${
                plan.popular ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm">
                  Populaire
                </span>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              <div className="text-3xl font-bold text-white mb-6">{plan.price}</div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-purple-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-purple-500 hover:bg-purple-600">
                Commencer
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 