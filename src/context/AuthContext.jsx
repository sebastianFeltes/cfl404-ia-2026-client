import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  GET,
  PATCH,
  POST,
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
    tipo: payload.tipo || payload.type || '',
    emailVerificado: payload.emailVerificado ?? payload.emailVerified ?? false,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => normalizeUser(readStoredUser()));
  const [remember, setRemember] = useState(() => isRememberedSession());

  // Mientras se revalida el token guardado no se puede decidir si el usuario
  // está autenticado; las rutas privadas esperan a que termine.
  const [isLoading, setIsLoading] = useState(() => Boolean(getAuthToken()));

  const isAuthenticated = Boolean(token && user);

  const applySession = useCallback((jwt, userPayload, rememberSession) => {
    const nextUser = normalizeUser(userPayload);

    setAuthToken(jwt, { remember: rememberSession });
    persistUser(nextUser, { remember: rememberSession });
    setRemember(rememberSession);
    setToken(jwt);
    setUser(nextUser);

    return nextUser;
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  // Cierre de sesión automático cuando la API responde 401 (token vencido o revocado).
  useEffect(() => {
    setOnUnauthorized(() => {
      setToken(null);
      setUser(null);
    });
    return () => setOnUnauthorized(null);
  }, []);

  // Al montar, revalida contra el servidor el token que quedó en storage.
  // Si el servidor lo rechaza, la sesión se descarta.
  useEffect(() => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await GET('/api/auth/me');
        if (cancelled) return;
        const nextUser = normalizeUser(data.user ?? data);
        persistUser(nextUser, { remember: isRememberedSession() });
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
    if (!jwt) {
      throw new Error('No se recibió un token JWT del servidor');
    }
    applySession(jwt, userPayload, rememberSession);
    return true;
  }, [applySession]);

  /**
   * Canjea el ID token de Google Identity Services por el JWT de la plataforma.
   * El servidor verifica la firma de Google antes de emitir la sesión.
   */
  const loginWithGoogle = useCallback(async (credential, { remember: rememberSession = true } = {}) => {
    if (!credential) {
      throw new Error('Google no devolvió una credencial válida');
    }

    const data = await POST('/api/auth/google', { credential });
    const jwt = data.token ?? data.accessToken;

    if (!jwt) {
      throw new Error('El servidor no devolvió un token de sesión');
    }

    const nextUser = applySession(jwt, data.user ?? data, rememberSession);
    return { user: nextUser, isNewAccount: Boolean(data.isNewAccount), message: data.message };
  }, [applySession]);

  /** Acceso rápido con las cuentas de prueba del seed (solo entorno de desarrollo). */
  const loginAsDemo = useCallback(async (accountType = 'alumno', { remember: rememberSession = true } = {}) => {
    const data = await POST('/api/auth/dev-login', { accountType });
    const jwt = data.token ?? data.accessToken;

    if (!jwt) {
      throw new Error('El servidor no devolvió un token de sesión');
    }

    return applySession(jwt, data.user ?? data, rememberSession);
  }, [applySession]);

  const updateUser = useCallback(async (updatedFields) => {
    const payload = {
      firstName: updatedFields.nombres ?? updatedFields.firstName,
      lastName: updatedFields.apellidos ?? updatedFields.lastName,
      dni: updatedFields.dni,
      profilePhotoUrl: updatedFields.fotoUrl ?? updatedFields.profilePhotoUrl,
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
