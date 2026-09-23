import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  GET,
  PATCH,
  POST,
  clearAuthToken,
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
    tipo: payload.tipo || payload.type || '',
    emailVerificado: payload.emailVerificado ?? payload.emailVerified ?? false,
    aceptaTerminos: Boolean(payload.aceptaTerminos ?? payload.acceptedTerms),
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(() => normalizeUser(readStoredUser()));
  const [remember, setRemember] = useState(() => isRememberedSession());
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  const applySession = useCallback((jwt, userPayload, rememberSession) => {
    const nextUser = normalizeUser(userPayload);

    setAuthToken(jwt, { remember: rememberSession });
    persistUser(nextUser, { remember: rememberSession });
    setRemember(rememberSession);
    setToken(Boolean(nextUser) ? 'session' : null);
    setUser(nextUser);

    return nextUser;
  }, []);

  const logout = useCallback(() => {
    POST('/api/auth/logout').catch(() => {})
    clearAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      setToken(null);
      setUser(null);
    });
    return () => setOnUnauthorized(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await GET('/api/auth/me');
        if (cancelled) return;
        const nextUser = normalizeUser(data.user ?? data);
        const rememberSession = isRememberedSession();
        persistUser(nextUser, { remember: rememberSession });
        setRemember(rememberSession);
        setAuthToken(null, { remember: rememberSession });
        setToken('session');
        setUser(nextUser);
      } catch {
        if (cancelled) return;
        clearAuthToken();
        setToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((jwt, userPayload, { remember: rememberSession = true } = {}) => {
    applySession(jwt, userPayload, rememberSession);
    return true;
  }, [applySession]);

  const loginWithGoogle = useCallback(async (credential, { remember: rememberSession = true, acceptedTerms = true } = {}) => {
    if (!credential) {
      throw new Error('Google no devolvió una credencial válida');
    }

    const data = await POST('/api/auth/google', { credential, acceptedTerms: Boolean(acceptedTerms) });
    const nextUser = applySession(data.token, data.user ?? data, rememberSession);
    return { user: nextUser, isNewAccount: Boolean(data.isNewAccount), message: data.message };
  }, [applySession]);

  const loginAsDemo = useCallback(async (accountType = 'alumno', { remember: rememberSession = true } = {}) => {
    const data = await POST('/api/auth/dev-login', { accountType });
    return applySession(data.token, data.user ?? data, rememberSession);
  }, [applySession]);

  const updateUser = useCallback(async (updatedFields) => {
    const payload = {
      firstName: updatedFields.nombres ?? updatedFields.firstName,
      lastName: updatedFields.apellidos ?? updatedFields.lastName,
      dni: updatedFields.dni,
      profilePhotoUrl: updatedFields.fotoUrl ?? updatedFields.profilePhotoUrl,
      acceptedTerms: updatedFields.aceptaTerminos ?? updatedFields.acceptedTerms,
    }

    const data = await PATCH('/api/auth/me', payload)
    const nextUser = normalizeUser(data.user ?? data)
    persistUser(nextUser, { remember })
    setUser(nextUser)
    return nextUser
  }, [remember]);

  const value = useMemo(
    () => ({ token, user, isAuthenticated, isLoading, login, loginWithGoogle, loginAsDemo, logout, updateUser }),
    [token, user, isAuthenticated, isLoading, login, loginWithGoogle, loginAsDemo, logout, updateUser],
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
