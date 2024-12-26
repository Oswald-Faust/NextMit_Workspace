'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { eventService } from '@/services/event.service';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: {
    address: string;
    city: string;
  };
  image?: string;
  price: number;
  category: string;
  status: 'draft' | 'published' | 'cancelled';
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getEvents();
        if (response.success) {
          setEvents(response.data);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des événements");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement des événements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Événements</h1>
        <Link href="/dashboard/events/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Créer un événement
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Aucun événement trouvé</p>
          <Link href="/dashboard/events/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer votre premier événement
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event._id} className="p-4">
              <div className="relative">
                {event.image && (
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="rounded-lg object-cover w-full h-48"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.status === 'published' ? 'bg-green-100 text-green-800' :
                    event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.status === 'published' ? 'Publié' :
                     event.status === 'draft' ? 'Brouillon' : 'Annulé'}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(event.date), 'PPP', { locale: fr })}
                </p>
                <p className="text-sm text-gray-500">{event.location.city}</p>
                <p className="text-sm font-semibold mt-2">{event.price}€</p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Link href={`/dashboard/events/${event._id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/dashboard/events/${event._id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}