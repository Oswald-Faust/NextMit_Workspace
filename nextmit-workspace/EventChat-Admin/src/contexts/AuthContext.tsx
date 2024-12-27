import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

type UserRole = 'user' | 'admin' | 'manager' | 'super_admin';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

type AuthContextType = {
  isLoading: boolean;
  userToken: string | null;
  user: User | null;
  signIn: (token: string, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (token: string, userData: User) => Promise<void>;
  isAuthorized: (user: User | null) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const isAuthorized = (user: User | null): boolean => {
    if (!user) return false;
    return ['user', 'admin', 'manager', 'super_admin'].includes(user.role);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userDataStr = await AsyncStorage.getItem('userData');
        
        if (token && userDataStr) {
          const userData = JSON.parse(userDataStr) as User;
          if (isAuthorized(userData)) {
            setUserToken(token);
            setUser(userData);
          } else {
            // Si l'utilisateur n'est pas autorisé, on le déconnecte
            await AsyncStorage.multiRemove(['userToken', 'userData']);
          }
        }
      } catch (e) {
        console.error('Erreur lors de la restauration de la session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    isLoading,
    userToken,
    user,
    isAuthorized,
    signIn: async (token: string, userData: User) => {
      if (!isAuthorized(userData)) {
        throw new Error('Accès non autorisé');
      }
      setUserToken(token);
      setUser(userData);
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    },
    signOut: async () => {
      setUserToken(null);
      setUser(null);
      await AsyncStorage.multiRemove(['userToken', 'userData']);
    },
    signUp: async (token: string, userData: User) => {
      if (!isAuthorized(userData)) {
        throw new Error('Accès non autorisé');
      }
      setUserToken(token);
      setUser(userData);
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}; 