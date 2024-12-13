'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventService } from '@/services/event.service';
import { toast } from '@/components/ui/use-toast';
import { Event } from '@/types/api';

export function EventForm({ event, onSuccess }: { event?: Event; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: event || {
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      price: 0,
      capacity: 0,
      type: '',
      status: 'draft'
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Ajout des champs au FormData
      Object.keys(data).forEach(key => {
        if (key === 'image' && data[key][0]) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = event 
        ? await eventService.updateEvent(event._id, formData)
        : await eventService.createEvent(formData);

      if (response.success) {
        toast({
          title: "Succès",
          description: event 
            ? "L'événement a été mis à jour"
            : "L'événement a été créé",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
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
          <label className="block text-sm font-medium mb-1">Lieu</label>
          <Input {...form.register('location')} />
          {form.formState.errors.location && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
          )}
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