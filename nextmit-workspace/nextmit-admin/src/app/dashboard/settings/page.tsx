'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { authService } from '@/services/auth.service';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Bell, Lock, Globe, Palette, Mail, Loader2 } from 'lucide-react';

type NotificationSettings = {
  email: boolean;
  push: boolean;
  weekly: boolean;
};

type AppearanceSettings = {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
};

type LanguageSettings = {
  language: 'fr' | 'en' | 'es';
};

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    weekly: false,
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'system',
    fontSize: 'medium',
  });

  const [language, setLanguage] = useState<LanguageSettings>({
    language: 'fr',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      if (userData) {
        setProfile({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          avatar: userData.avatar || '',
        });
        
        // Charger les préférences sauvegardées si elles existent
        if (userData.preferences) {
          setNotifications(userData.preferences.notifications || notifications);
          setAppearance(userData.preferences.appearance || appearance);
          setLanguage(userData.preferences.language || language);
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations du profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile({
        ...profile,
        preferences: {
          notifications,
          appearance,
          language,
        },
      });

      if (updateUser) {
        updateUser(updatedUser);
      }

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleThemeChange = (theme: AppearanceSettings['theme']) => {
    setAppearance(prev => ({ ...prev, theme }));
    // Appliquer le thème
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
    localStorage.setItem('theme', theme);
  };

  const handleLanguageChange = (language: LanguageSettings['language']) => {
    setLanguage({ language });
    // Implémenter le changement de langue ici
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Profil */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Profil</h2>
            <p className="text-sm text-gray-500">
              Gérez vos informations personnelles
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {profile.avatar && (
            <div className="flex items-center space-x-4">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover"
              />
              <Button variant="outline">Changer l'avatar</Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Prénom</label>
              <Input
                value={profile.firstName}
                onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Votre prénom"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={profile.lastName}
                onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Téléphone</label>
            <Input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <Button 
            onClick={handleProfileUpdate}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder les modifications
          </Button>
        </div>
      </Card>

      {/* Section Notifications */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Notifications</h2>
            <p className="text-sm text-gray-500">
              Gérez vos préférences de notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {key === 'email' ? 'Notifications par email' :
                 key === 'push' ? 'Notifications push' :
                 'Résumé hebdomadaire'}
              </label>
              <Switch
                checked={value}
                onCheckedChange={() => handleNotificationChange(key as keyof NotificationSettings)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Section Apparence */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Apparence</h2>
            <p className="text-sm text-gray-500">
              Personnalisez l'apparence de l'application
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Thème</label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {['light', 'dark', 'system'].map((theme) => (
                <Button
                  key={theme}
                  variant={appearance.theme === theme ? 'default' : 'outline'}
                  onClick={() => handleThemeChange(theme as AppearanceSettings['theme'])}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Section Langue */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Langue</h2>
            <p className="text-sm text-gray-500">
              Choisissez la langue de l'interface
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { code: 'fr', label: 'Français' },
              { code: 'en', label: 'English' },
              { code: 'es', label: 'Español' }
            ].map((lang) => (
              <Button
                key={lang.code}
                variant={language.language === lang.code ? 'default' : 'outline'}
                onClick={() => handleLanguageChange(lang.code as LanguageSettings['language'])}
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
} 