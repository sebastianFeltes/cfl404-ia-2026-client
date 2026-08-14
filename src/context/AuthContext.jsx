import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const initialUserData = {
  nombres: 'Martina',
  apellidos: 'García',
  correo: 'm.garcia.404@email.com',
  dni: '38.456.789',
  rol: 'Estudiante, regular',
  estado: 'Alumno Regular',
  institucion: "CFL N°404 'Berisso'",
  fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initialUserData);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (email, password) => {
    setIsAuthenticated(true);
    setUser((prev) => ({
      ...prev,
      correo: email || prev.correo,
    }));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
