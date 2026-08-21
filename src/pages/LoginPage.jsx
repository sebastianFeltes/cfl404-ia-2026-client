import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, LogIn, UserCheck } from 'lucide-react';
import { POST } from '../services/api';
import fotoSoldando from '../assets/hombre_soldando.PNG';

export default function LoginPage() {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (token) {
    return <Navigate to="/perfil" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos para ingresar.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const data = await POST('/auth/login', { email, password });
      const jwt = data.token ?? data.accessToken;
      if (!jwt) {
        throw new Error('El servidor no devolvió un token de sesión.');
      }

      login(jwt, data.user ?? data, { remember: rememberMe });
      navigate('/perfil');
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo iniciar sesión. Verificá tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('m.garcia.404@email.com');
    setPassword('12345678');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-nunito p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-gray-100 my-auto">

        {/* Left Side: Institutional Hero Branding */}
        <div className="lg:col-span-6 relative bg-custom-azul-oscuro text-white p-8 lg:p-10 flex flex-col items-center justify-center overflow-hidden group min-h-[280px] lg:min-h-full">
          {/* Background Image with Dark Blue Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={fotoSoldando}
              alt="Formación Laboral CFL 404"
              className="w-full h-full object-cover object-center opacity-25 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-custom-azul-oscuro via-custom-azul-oscuro/90 to-custom-azul-oscuro/70" />
          </div>

          {/* Institutional Logo & Title */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center py-4 lg:py-6">
            <img src="/logo_texto_hero.svg" alt="CFL N°404" className="h-28 sm:h-32 lg:h-36 w-auto object-contain mb-5 drop-shadow-md" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-roboto max-w-sm">
              Educación para el presente, trabajo para el futuro
            </h1>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">

            <div className="mb-5">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-custom-gris-oscuro font-roboto mb-1">
                ¡Bienvenido/a de nuevo!
              </h2>
              <p className="text-custom-gris-claro text-sm">
                Ingresá tus credenciales para acceder a la plataforma.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-rose-700 text-sm font-medium animate-pulse">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / DNI Field */}
              <div>
                <label className="block text-xs font-bold text-custom-gris-oscuro uppercase tracking-wider mb-1.5">
                  Correo Electrónico o DNI
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-custom-gris-claro">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input title="Ingrese su correo electrónico o DNI"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m.garcia.404@email.com o DNI"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-custom-gris-oscuro placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-custom-celeste focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-custom-gris-oscuro uppercase tracking-wider">
                    Contraseña
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Instrucciones para recuperar tu contraseña fueron enviadas a tu correo.');
                    }}
                    className="text-xs font-semibold text-custom-celeste hover:text-custom-azul-oscuro transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-custom-gris-claro">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input title="Ingrese su contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-custom-gris-oscuro placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-custom-celeste focus:bg-white transition-all text-sm font-medium"
                  />
                  <button title="Mostrar u ocultar contraseña"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-custom-gris-claro hover:text-custom-gris-oscuro transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-custom-celeste focus:ring-custom-celeste border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs text-custom-gris-claro font-medium">Recordarme en este dispositivo</span>
                </label>
              </div>

              {/* Submit Button */}
              <button title="Iniciar sesión"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-custom-celeste hover:bg-custom-azul-oscuro text-white font-bold rounded-xl shadow-lg shadow-custom-celeste/20 hover:shadow-custom-azul-oscuro/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>

              {/* Quick Fill Demo Pill */}
              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 mb-1.5 font-normal">
                  ¿Querés probar rápidamente la demo?
                </p>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-custom-azul-oscuro font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                >
                  <UserCheck className="w-4 h-4 text-custom-celeste" />
                  <span>Usar credenciales de demostración (Martina García)</span>
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
