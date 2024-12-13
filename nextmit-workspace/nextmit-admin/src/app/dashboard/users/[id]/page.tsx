'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
  Edit,
  Lock,
  Ticket,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

// Données temporaires
const user = {
  id: '1',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@example.com',
  phone: '+33 6 12 34 56 78',
  address: '123 Rue de Paris, 75001 Paris',
  createdAt: '2023-01-15T10:30:00',
  status: 'active' as const,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  stats: {
    totalSpent: 350,
    eventsAttended: 5,
    upcomingEvents: 2,
  },
  recentActivity: [
    {
      id: '1',
      type: 'ticket_purchase',
      eventName: 'Festival Gastronomique 2024',
      date: '2024-01-10T14:30:00',
      amount: 75,
    },
    {
      id: '2',
      type: 'event_attendance',
      eventName: 'Soirée Dégustation de Vins',
      date: '2023-12-15T19:00:00',
    },
    {
      id: '3',
      type: 'profile_update',
      date: '2023-12-01T10:15:00',
    },
  ],
  upcomingEvents: [
    {
      id: '1',
      name: 'Festival Gastronomique 2024',
      date: '2024-06-15T10:00:00',
      location: 'Paris Expo',
    },
    {
      id: '2',
      name: 'Festival de la Bière Artisanale',
      date: '2024-07-01T11:00:00',
      location: 'Place de la République',
    },
  ],
};

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ticket_purchase':
        return <Ticket className="h-5 w-5" />;
      case 'event_attendance':
        return <Calendar className="h-5 w-5" />;
      case 'profile_update':
        return <User className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const formatActivityText = (activity: typeof user.recentActivity[0]) => {
    switch (activity.type) {
      case 'ticket_purchase':
        return `A acheté un billet pour ${activity.eventName} pour ${activity.amount}€`;
      case 'event_attendance':
        return `A participé à ${activity.eventName}`;
      case 'profile_update':
        return 'A mis à jour son profil';
      default:
        return 'Activité inconnue';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/users"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Profil utilisateur
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Modifier
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Réinitialiser le mot de passe
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-20 w-20 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Client depuis le{' '}
                {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              </p>
              <span
                className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}
              >
                {user.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Mail className="h-5 w-5" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Phone className="h-5 w-5" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-5 w-5" />
              <span>{user.address}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total dépensé
              </div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.stats.totalSpent.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Événements participés
              </div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.stats.eventsAttended}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Événements à venir
              </div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.stats.upcomingEvents}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Activité récente
            </h3>
            <div className="space-y-4">
              {user.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatActivityText(activity)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Événements à venir
            </h3>
            <div className="space-y-4">
              {user.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-full">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 