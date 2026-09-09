import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation, useNavigate, Link } from 'react-router';
import { GoogleLogin } from '@react-oauth/google';
import { ShieldCheck, AlertTriangle, UserCheck, ChevronDown, Sparkles } from 'lucide-react';
import fotoSoldando from '../assets/hombre_soldando.PNG';
import { canonicalRole } from '../utils/roles';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const STAFF_ROLES = ['GOD', 'ADMIN', 'DIRECTOR', 'REGENTE', 'SECRETARIA', 'PRECEPTORIA'];

const DEMO_ACCOUNTS = [
  { id: 'admin', label: 'Administrador (Admin)', roleBadge: 'ADMIN' },
  { id: 'directivo', label: 'Directivo / Dirección', roleBadge: 'DIRECTOR' },
  { id: 'docente', label: 'Docente / Instructor', roleBadge: 'DOCENTE' },
  { id: 'alumno', label: 'Alumno Regular', roleBadge: 'ALUMNO' },
  { id: 'postulante', label: 'Postulante', roleBadge: 'POSTULANTE' },
];

function safeRedirectPath(pathname, role) {
  if (typeof pathname === 'string' && /^\/(perfil|admin)(\/|$)/.test(pathname) && !pathname.includes('//') && !pathname.includes('\\') && !/https?:/i.test(pathname)) {
    return pathname;
  }
  if (role && STAFF_ROLES.includes(canonicalRole(role))) {
    return '/admin/dashboard';
  }
  return '/perfil';
}

export default function LoginPage() {
  const { user, isAuthenticated, isLoading, loginWithGoogle, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDevAccess, setShowDevAccess] = useState(true);

  // Destino cuando el usuario ya está autenticado
  const redirectTo = safeRedirectPath(location.state?.from?.pathname, user?.rol);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-100 font-nunito">
        <div className="w-10 h-10 border-4 border-custom-celeste border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-custom-gris-claro">Verificando tu sesión…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMsg('');

    if (!acceptedTerms) {
      setErrorMsg('Debés aceptar los términos y condiciones antes de iniciar sesión.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginWithGoogle(credentialResponse.credential, {
        remember: rememberMe,
        acceptedTerms: Boolean(acceptedTerms),
      });
      const target = location.state?.from?.pathname
        ? safeRedirectPath(location.state.from.pathname, result?.user?.rol)
        : safeRedirectPath(undefined, result?.user?.rol);
      navigate(target, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'No pudimos validar tu cuenta de Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg('Google canceló el inicio de sesión o no pudo completarlo. Intentá nuevamente.');
  };

  const handleDemoLogin = async (accountType) => {
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const loggedUser = await loginAsDemo(accountType, { remember: rememberMe });
      const target = location.state?.from?.pathname
        ? safeRedirectPath(location.state.from.pathname, loggedUser?.rol)
        : safeRedirectPath(undefined, loggedUser?.rol);
      navigate(target, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo iniciar sesión con la cuenta de prueba.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-nunito p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] border border-gray-100">

        {/* Left Side: Institutional Hero Branding */}
        <div className="lg:col-span-6 relative bg-custom-azul-oscuro text-white p-8 lg:p-12 flex flex-col justify-between overflow-hidden group">
          <div className="absolute inset-0 z-0">
            <img
              src={fotoSoldando}
              alt="Formación Laboral CFL 404"
              className="w-full h-full object-cover object-center opacity-25 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-custom-azul-oscuro via-custom-azul-oscuro/90 to-custom-azul-oscuro/70" />
          </div>

          <div className="relative z-10 w-full pt-48">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight font-roboto mb-4 text-center">
              Potenciá tu futuro profesional con capacitación laboral oficial.
            </h1>
            <p className="text-blue-100 text-sm lg:text-base font-light leading-relaxed text-center">
              Accedé a tu perfil de estudiante, consultá tus calificaciones, estado de regularidad y contenidos de tus cursos.
            </p>
            <img src="/logo_texto_hero.svg" alt="CFL N°404" className="absolute top-0 left-1/2 -translate-x-1/2 h-[180px] w-auto object-contain" />
          </div>

          <div className="relative z-10 text-xs text-blue-200/80 pt-4 border-t border-white/10 mt-8">
            © 2026 CFL N°404 Berisso. Todos los derechos reservados.
          </div>
        </div>

        {/* Right Side: Sign-In */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">

            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-custom-gris-oscuro font-roboto mb-2">
                ¡Bienvenido/a de nuevo!
              </h2>
              <p className="text-custom-gris-claro text-sm">
                Ingresá con tu cuenta para acceder a la plataforma.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3.5 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-rose-700 text-sm font-medium flex gap-2.5 items-start">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Botón oficial de Google Identity Services */}
              <div className="flex justify-center min-h-[44px]">
                {isSubmitting ? (
                  <div className="flex items-center gap-3 text-sm font-semibold text-custom-gris-claro py-2">
                    <div className="w-5 h-5 border-2 border-custom-celeste border-t-transparent rounded-full animate-spin" />
                    Validando tu cuenta…
                  </div>
                ) : GOOGLE_CLIENT_ID ? (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signin_with"
                    shape="pill"
                    size="large"
                    width="360"
                    locale="es"
                    useOneTap={false}
                  />
                ) : (
                  <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs text-center font-medium">
                    Google OAuth no configurado en este entorno. Usá el acceso de desarrollo abajo.
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-custom-celeste focus:ring-custom-celeste border-slate-300 cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-custom-gris-claro font-medium leading-tight">
                    Acepto los{' '}
                    <Link to="/terminos-condiciones" target="_blank" className="text-custom-celeste hover:underline font-bold">
                      Términos y Condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link to="/privacidad" target="_blank" className="text-custom-celeste hover:underline font-bold">
                      Política de Privacidad
                    </Link>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-custom-celeste focus:ring-custom-celeste border-slate-300 cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-custom-gris-claro font-medium">Mantener la sesión iniciada en este dispositivo</span>
                </label>
              </div>

              <div className="flex gap-2.5 items-start p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-custom-celeste mt-0.5 shrink-0" />
                <p className="text-xs text-custom-gris-claro leading-relaxed">
                  Usamos tu cuenta para verificar tu identidad y permisos de acceso en la institución.
                </p>
              </div>

              {/* Acceso de desarrollo con las cuentas del seed */}
              {import.meta.env.DEV && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Acceso Rápido (Desarrollo)
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDevAccess(!showDevAccess)}
                      className="text-xs font-semibold text-slate-500 hover:text-custom-azul-oscuro transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDevAccess ? 'rotate-180' : ''}`} />
                      {showDevAccess ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>

                  {showDevAccess && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {DEMO_ACCOUNTS.map((account) => (
                        <button
                          key={account.id}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleDemoLogin(account.id)}
                          className={`py-2 px-3 text-left rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer border ${
                            account.id === 'admin'
                              ? 'bg-custom-azul-oscuro text-white hover:bg-slate-800 border-custom-azul-oscuro shadow-sm'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          } disabled:opacity-60`}
                        >
                          <span className="flex items-center gap-1.5">
                            <UserCheck className={`w-3.5 h-3.5 ${account.id === 'admin' ? 'text-amber-400' : 'text-custom-celeste'}`} />
                            {account.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

