import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { GoogleLogin } from '@react-oauth/google';
import { ShieldCheck, AlertTriangle, UserCheck, ChevronDown } from 'lucide-react';
import fotoSoldando from '../assets/hombre_soldando.PNG';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const DEMO_ACCOUNTS = [
  { id: 'alumno', label: 'Alumno' },
  { id: 'docente', label: 'Docente' },
  { id: 'admin', label: 'Administrador' },
  { id: 'directivo', label: 'Directivo' },
];

export default function LoginPage() {
  const { isAuthenticated, isLoading, loginWithGoogle, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDevAccess, setShowDevAccess] = useState(false);

  // Destino original cuando el usuario llegó acá por una ruta protegida.
  const redirectTo = location.state?.from?.pathname || '/perfil';

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
    setIsSubmitting(true);

    try {
      await loginWithGoogle(credentialResponse.credential, { remember: rememberMe });
      navigate(redirectTo, { replace: true });
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
      await loginAsDemo(accountType, { remember: rememberMe });
      navigate(redirectTo, { replace: true });
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

        {/* Right Side: Google Sign-In */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">

            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-custom-gris-oscuro font-roboto mb-2">
                ¡Bienvenido/a de nuevo!
              </h2>
              <p className="text-custom-gris-claro text-sm">
                Ingresá con tu cuenta de Google para acceder a la plataforma.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3.5 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-rose-700 text-sm font-medium flex gap-2.5 items-start">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!GOOGLE_CLIENT_ID && (
              <div className="mb-6 p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-800 text-sm font-medium">
                Falta configurar <code className="font-mono text-xs">VITE_GOOGLE_CLIENT_ID</code> en el archivo{' '}
                <code className="font-mono text-xs">client/.env</code>.
              </div>
            )}

            <div className="space-y-5">
              {/* Botón oficial de Google Identity Services */}
              <div className="flex justify-center min-h-[44px]">
                {isSubmitting ? (
                  <div className="flex items-center gap-3 text-sm font-semibold text-custom-gris-claro">
                    <div className="w-5 h-5 border-2 border-custom-celeste border-t-transparent rounded-full animate-spin" />
                    Validando tu cuenta…
                  </div>
                ) : (
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
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none justify-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-custom-celeste focus:ring-custom-celeste border-slate-300 cursor-pointer"
                />
                <span className="text-xs text-custom-gris-claro font-medium">Mantener la sesión iniciada en este dispositivo</span>
              </label>

              <div className="flex gap-2.5 items-start p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-custom-celeste mt-0.5 shrink-0" />
                <p className="text-xs text-custom-gris-claro leading-relaxed">
                  Usamos tu cuenta de Google solo para verificar tu identidad. Nunca accedemos a tu contraseña
                  ni al contenido de tu correo.
                </p>
              </div>

              {/* Acceso de desarrollo con las cuentas del seed */}
              {import.meta.env.DEV && (
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowDevAccess(!showDevAccess)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-custom-azul-oscuro transition-colors cursor-pointer"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDevAccess ? 'rotate-180' : ''}`} />
                    Acceso de desarrollo
                  </button>

                  {showDevAccess && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {DEMO_ACCOUNTS.map((account) => (
                        <button
                          key={account.id}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleDemoLogin(account.id)}
                          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-custom-azul-oscuro font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200 disabled:opacity-60"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-custom-celeste" />
                          {account.label}
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
