'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, BarChart, Shield } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: "Gestion d'événements simplifiée",
    description: "Créez et gérez vos événements en quelques clics avec notre interface intuitive."
  },
  {
    icon: Users,
    title: "Gestion des participants",
    description: "Suivez facilement les inscriptions et communiquez avec vos participants."
  },
  {
    icon: BarChart,
    title: "Analyses détaillées",
    description: "Obtenez des insights précieux sur vos événements et votre audience."
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Vos données sont protégées avec les dernières technologies de sécurité."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-black to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Fonctionnalités principales
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez tous les outils dont vous avez besoin pour gérer vos événements efficacement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-colors"
            >
              <feature.icon className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 