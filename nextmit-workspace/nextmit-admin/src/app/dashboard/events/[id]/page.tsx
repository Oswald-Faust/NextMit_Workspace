'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EventForm } from '@/components/events/event-form';
import { eventService } from '@/services/event.service';
import { Event, EventStats } from '@/types/api';
import { formatDateTime, formatPrice, formatNumber } from '@/lib/utils';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true);
        const [eventResponse, statsResponse] = await Promise.all([
          eventService.getEvent(params.id),
          eventService.getEventStats(params.id),
        ]);

        if (eventResponse.success) {
          setEvent(eventResponse.data);
        }
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [params.id]);

  const handleUpdateSuccess = async () => {
    const response = await eventService.getEvent(params.id);
    if (response.success) {
      setEvent(response.data);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const blob = await eventService.exportEventData(params.id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `event-${params.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Événement non trouvé</h1>
        <Button onClick={() => router.push('/dashboard/events')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/dashboard/events')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Détails de l'événement</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informations</h2>
            <EventForm initialData={event} onSuccess={handleUpdateSuccess} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
            {stats && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Billets vendus</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(stats.soldTickets)} / {formatNumber(stats.totalTickets)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenus</p>
                  <p className="text-2xl font-bold">{formatPrice(stats.revenue)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prix moyen</p>
                  <p className="text-2xl font-bold">{formatPrice(stats.averagePrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Jours populaires</p>
                  <div className="space-y-2">
                    {stats.popularDays.map((day) => (
                      <div
                        key={day.date}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>{formatDateTime(day.date)}</span>
                        <span className="font-medium">{formatNumber(day.count)} billets</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
            <div className="space-y-2">
              <Button
                variant={event.status === 'published' ? 'outline' : 'default'}
                className="w-full"
                onClick={async () => {
                  if (event.status !== 'published') {
                    const response = await eventService.publishEvent(event._id);
                    if (response.success) {
                      setEvent(response.data);
                    }
                  }
                }}
                disabled={event.status === 'published'}
              >
                {event.status === 'published' ? 'Déjà publié' : 'Publier'}
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={async () => {
                  if (
                    window.confirm('Êtes-vous sûr de vouloir annuler cet événement ?')
                  ) {
                    const response = await eventService.cancelEvent(event._id, 'Annulé par l\'administrateur');
                    if (response.success) {
                      setEvent(response.data);
                    }
                  }
                }}
                disabled={event.status === 'cancelled'}
              >
                {event.status === 'cancelled' ? 'Déjà annulé' : 'Annuler'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 