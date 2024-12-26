'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Event } from '@/types/api';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { eventService } from '@/services/event.service';
import { toast } from '@/components/ui/use-toast';

const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
  address: z.string().min(1, 'L\'adresse est requise'),
  city: z.string().min(1, 'La ville est requise'),
  capacity: z.number().min(1, 'La capacité doit être supérieure à 0'),
  price: z.number().min(0, 'Le prix ne peut pas être négatif'),
  type: z.string().min(1, 'Le type est requis'),
  status: z.enum(['draft', 'published', 'cancelled']).default('draft'),
  image: z.any().optional()
});

export function EventForm({ event, onSuccess }: { event?: Event; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
      endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      address: event?.location?.address || '',
      city: event?.location?.city || '',
      capacity: event?.capacity || 0,
      price: event?.price || 0,
      type: event?.type || '',
      status: event?.status || 'draft'
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      
      // Vérifier le token avant la soumission
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer un événement",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      
      // Ajout des données au FormData
      const eventData = {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: {
          address: data.address,
          city: data.city
        },
        capacity: Number(data.capacity),
        price: Number(data.price),
        type: data.type,
        status: data.status
      };

      Object.entries(eventData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      });

      if (data.image?.[0]) {
        formData.append('image', data.image[0]);
      }

      console.log('Token utilisé:', token); // Pour déboguer
      const response = await eventService.createEvent(formData);

      if (response.success) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <div className="flex items-center gap-4">
            {event?.image && (
              <img
                src={event.image}
                alt="Aperçu"
                className="w-24 h-24 object-cover rounded-md"
              />
            )}
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                <span>Choisir une image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                {...form.register('image')}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <Input {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea {...form.register('description')} />
          {form.formState.errors.description && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date de début</label>
            <Input type="datetime-local" {...form.register('startDate')} />
            {form.formState.errors.startDate && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date de fin</label>
            <Input type="datetime-local" {...form.register('endDate')} />
            {form.formState.errors.endDate && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Adresse</label>
            <Input {...form.register('address')} />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ville</label>
            <Input {...form.register('city')} />
            {form.formState.errors.city && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prix (€)</label>
            <Input
              type="number"
              step="0.01"
              {...form.register('price', { valueAsNumber: true })}
            />
            {form.formState.errors.price && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Capacité</label>
            <Input
              type="number"
              {...form.register('capacity', { valueAsNumber: true })}
            />
            {form.formState.errors.capacity && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.capacity.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type d'événement</label>
          <select
            {...form.register('type')}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Sélectionner un type</option>
            <option value="food">Gastronomie</option>
            <option value="drink">Boissons</option>
            <option value="music">Musique</option>
            <option value="art">Art</option>
            <option value="other">Autre</option>
          </select>
          {form.formState.errors.type && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select
            {...form.register('status')}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="cancelled">Annulé</option>
          </select>
          {form.formState.errors.status && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {event ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
} 