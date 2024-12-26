'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EventForm } from '@/components/events/event-form';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function CreateEventPage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast({
      title: "Succès",
      description: "L'événement a été créé avec succès",
    });
    router.push('/dashboard/events');
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.push('/dashboard/events')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Créer un événement</h1>
      </div>

      <Card className="max-w-3xl mx-auto p-6">
        <EventForm onSuccess={handleSuccess} />
      </Card>
    </div>
  );
} 