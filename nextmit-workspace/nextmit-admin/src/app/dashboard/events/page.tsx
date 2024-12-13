'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { eventService } from '@/services/event.service';
import { Event, EventFilters } from '@/types/api';
import { toast } from '@/components/ui/use-toast';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EventForm } from '@/components/events/event-form';
import { useToast } from '@/components/ui/toaster';

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents(filters);
      if (response.success) {
        setEvents(response.data.items);
      } else {
        showToast("Impossible de charger les événements", "error");
      }
    } catch (error) {
      showToast("Une erreur est survenue", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  const handleCreateSuccess = async () => {
    setShowCreateDialog(false);
    await loadEvents();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        const response = await eventService.deleteEvent(id);
        if (response.success) {
          toast({
            title: "Succès",
            description: "L'événement a été supprimé",
          });
          loadEvents();
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'événement",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Événements</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Événement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouvel événement</DialogTitle>
            </DialogHeader>
            <EventForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            placeholder="Rechercher un événement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event._id} className="p-4">
              <div className="relative">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    event.status === 'published' ? 'bg-green-100 text-green-800' :
                    event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.status === 'published' ? 'Publié' :
                     event.status === 'draft' ? 'Brouillon' : 'Annulé'}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{event.description}</p>
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => window.location.href = `/dashboard/events/${event._id}`}>
                  Modifier
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(event._id)}>
                  Supprimer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 