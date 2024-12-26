'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from "@/contexts/auth.context";
import { useToast } from "@/components/ui/use-toast";
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/20 animate-gradient" />
      
      <div className="absolute inset-0 -z-10 h-full w-full bg-white/[0.02] [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:100px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:100px] [mask-image:linear-gradient(to_right,white,transparent)]" />
      </div>

      <motion.div
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/" className="absolute top-8 left-8 text-white hover:text-purple-400 transition-colors">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </Link>
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div>
            <motion.img
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto h-12 w-auto"
              src="/logo.svg"
              alt="Nextmit Admin"
            />
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center text-3xl font-extrabold text-white"
            >
              Connexion à l'administration
            </motion.h2>
          </div>

          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-6 backdrop-blur-sm bg-white/10 p-8 rounded-2xl"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="bg-white/20 border-gray-500 text-white placeholder:text-gray-400"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-400">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="bg-white/20 border-gray-500 text-white placeholder:text-gray-400"
                  {...form.register('password')}
                />
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-500/20 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-200">
                      Erreur de connexion
                    </h3>
                    <div className="mt-2 text-sm text-red-200">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              size="lg"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
} 