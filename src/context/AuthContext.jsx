import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearAuthToken,
  getAuthToken,
  isRememberedSession,
  persistUser,
  readStoredUser,
  setAuthToken,
  setOnUnauthorized,
} from '../services/api';

const AuthContext = createContext(null);

function normalizeUser(payload) {
  if (!payload || typeof payload !== 'object') return null;

  return {
    id: payload.id ?? null,
    nombres: payload.nombres || payload.firstName || '',
    apellidos: payload.apellidos || payload.lastName || '',
    correo: payload.correo || payload.email || '',
    dni: payload.dni || '',
    rol: payload.rol || payload.role?.name || payload.role || '',
    estado: payload.estado || payload.status || '',
    institucion: payload.institucion || "CFL N°404 'Berisso'",
    fotoUrl: payload.fotoUrl || payload.profilePhotoUrl || '',
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => normalizeUser(readStoredUser()));
  const [remember, setRemember] = useState(() => isRememberedSession());

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    setOnUnauthorized(() => {
      setToken(null);
      setUser(null);
    });

    return () => setOnUnauthorized(null);
  }, []);

  const login = useCallback((jwt, userPayload, { remember: rememberSession = true } = {}) => {
    if (!jwt) {
      throw new Error('No se recibió un token JWT del servidor');
    }

    const nextUser = normalizeUser(userPayload);
    setAuthToken(jwt, { remember: rememberSession });
    persistUser(nextUser, { remember: rememberSession });
    setRemember(rememberSession);
    setToken(jwt);
    setUser(nextUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      const next = normalizeUser({ ...prev, ...updatedFields });
      persistUser(next, { remember });
      return next;
    });
  }, [remember]);

  const value = useMemo(
    () => ({ token, user, isAuthenticated, login, logout, updateUser }),
    [token, user, isAuthenticated, login, logout, updateUser],
  );

  return (
    <AuthContext.Provider value={value}>
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
