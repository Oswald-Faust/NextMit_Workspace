'use client';

import { Bell, Menu, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <button
        type="button"
        className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 lg:hidden"
      >
        <span className="sr-only">Ouvrir la barre latérale</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Tableau de bord
          </h1>
        </div>
        <div className="ml-4 flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            onClick={toggleTheme}
          >
            <span className="sr-only">
              {isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
            </span>
            {isDark ? (
              <Sun className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Moon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative"
          >
            <span className="sr-only">Voir les notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800" />
          </button>
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 