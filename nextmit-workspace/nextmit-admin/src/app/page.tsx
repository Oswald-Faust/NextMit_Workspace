'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Navbar  } from '@/components/layout/navbar';
import { Features } from '@/components/sections/features';
import { Pricing } from '@/components/sections/pricing';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = ev;
      containerRef.current.style.setProperty('--x', `${clientX}px`);
      containerRef.current.style.setProperty('--y', `${clientY}px`);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-hidden">
      <Navbar />
      {/* Gradient de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/20 animate-gradient" />
      
      {/* Effet de suivi de souris */}
      <div className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 bg-[radial-gradient(circle_at_var(--x,_100px)_var(--y,_100px),_rgba(255,255,255,0.06),transparent_20%)]" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative inline-block"
          >
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-4 -right-4 animate-pulse" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text text-lg font-medium">
              Nextmit Admin Dashboard
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-white"
          >
            Gérez vos événements avec
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              {' '}élégance
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Une plateforme moderne et intuitive pour créer, gérer et suivre vos événements en temps réel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                Commencer maintenant
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Grille animée */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white/[0.02] [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:100px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:100px] [mask-image:linear-gradient(to_right,white,transparent)]" />
        </div>
      </div>

      <Features />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
