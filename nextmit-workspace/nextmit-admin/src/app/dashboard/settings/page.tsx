'use client';

import { Card } from '@/components/ui/card';
import { Bell, Lock, Globe, Palette, Mail } from 'lucide-react';

const sections = [
  {
    title: 'Profil',
    description: 'Gérez vos informations personnelles et vos préférences.',
    icon: Lock,
    fields: [
      { label: 'Nom', type: 'text', value: 'Admin' },
      { label: 'Email', type: 'email', value: 'admin@nextmit.com' },
      { label: 'Téléphone', type: 'tel', value: '+33 6 12 34 56 78' },
    ],
  },
  {
    title: 'Notifications',
    description: 'Configurez vos préférences de notifications.',
    icon: Bell,
    settings: [
      { label: 'Notifications par email', type: 'toggle', value: true },
      { label: 'Notifications push', type: 'toggle', value: true },
      { label: 'Résumé hebdomadaire', type: 'toggle', value: false },
    ],
  },
  {
    title: 'Apparence',
    description: 'Personnalisez l\'apparence de votre tableau de bord.',
    icon: Palette,
    settings: [
      { label: 'Thème sombre', type: 'toggle', value: false },
      { label: 'Contraste élevé', type: 'toggle', value: false },
    ],
  },
  {
    title: 'Langue et région',
    description: 'Définissez vos préférences régionales.',
    icon: Globe,
    settings: [
      {
        label: 'Langue',
        type: 'select',
        value: 'fr',
        options: [
          { value: 'fr', label: 'Français' },
          { value: 'en', label: 'English' },
        ],
      },
      {
        label: 'Fuseau horaire',
        type: 'select',
        value: 'Europe/Paris',
        options: [
          { value: 'Europe/Paris', label: 'Paris (UTC+1)' },
          { value: 'Europe/London', label: 'London (UTC)' },
        ],
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Paramètres
      </h1>

      <div className="grid gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {section.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {section.fields?.map((field) => (
                <div key={field.label} className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ))}

              {section.settings?.map((setting) => (
                <div key={setting.label} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {setting.label}
                  </label>
                  {setting.type === 'toggle' ? (
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        setting.value ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          setting.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : setting.type === 'select' ? (
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent">
                      {setting.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Card className="p-6 bg-red-50 dark:bg-red-900/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Mail className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-red-600 dark:text-red-400">
                Zone de danger
              </h2>
              <p className="text-sm text-red-600/90 dark:text-red-400/90">
                Ces actions sont irréversibles.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
              Supprimer mon compte
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
} 