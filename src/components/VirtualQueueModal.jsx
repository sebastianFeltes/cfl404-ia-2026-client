import React, { useState, useEffect } from 'react';
import { Users, Clock, Radio, CheckCircle, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function VirtualQueueModal({ course, onClose }) {
  const navigate = useNavigate();
  const [position, setPosition] = useState(14);
  const [estimatedWait, setEstimatedWait] = useState(3); // minutos
  const [status, setStatus] = useState('en_espera'); // 'en_espera' | 'turn_granted'
  const [webhookEvent, setWebhookEvent] = useState('Esperando actualización por Webhook...');

  useEffect(() => {
    // Simulación de avance en la cola virtual mediante eventos webhook ficticios
    const timer1 = setTimeout(() => {
      setPosition(8);
      setEstimatedWait(2);
      setWebhookEvent('Webhook: queue.position_updated [Turnos 1-6 procesados]');
    }, 3000);

    const timer2 = setTimeout(() => {
      setPosition(2);
      setEstimatedWait(1);
      setWebhookEvent('Webhook: queue.position_updated [Próximo en la fila]');
    }, 6000);

    const timer3 = setTimeout(() => {
      setPosition(0);
      setStatus('turn_granted');
      setWebhookEvent('Webhook: queue.access_granted [Acceso directo concedido]');
    }, 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleProceedToLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 font-['Nunito'] animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 relative p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#166193]/10 text-[#166193] rounded-2xl">
              <Users className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#166193] bg-[#166193]/10 px-2 py-0.5 rounded font-['Roboto_Flex']">
                Sistema de Alta Demanda
              </span>
              <h3 className="text-xl font-extrabold text-[#1D1E1C] font-['Roboto_Flex'] mt-0.5">
                Cola Virtual de Pre-inscripción
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
          >
            Salir
          </button>
        </div>

        {/* Info del Curso */}
        {course && (
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
            <img
              src={course.image}
              alt={course.name}
              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase text-[#166193]">{course.category}</span>
              <h4 className="text-sm font-bold text-[#1D1E1C] truncate">{course.name}</h4>
              <p className="text-xs text-gray-500">Inicio: {course.start_date}</p>
            </div>
          </div>
        )}

        {/* Body Status */}
        {status === 'en_espera' ? (
          <div className="space-y-6 text-center">
            
            {/* Position Display */}
            <div className="py-6 px-4 bg-gradient-to-b from-[#166193]/5 to-transparent rounded-3xl border border-[#166193]/20 space-y-2">
              <span className="text-xs text-[#585856] font-semibold block uppercase tracking-wider">
                Tu Posición Actual en la Fila
              </span>
              <div className="text-5xl font-black text-[#166193] font-['Roboto_Flex'] tracking-tight">
                #{position}
              </div>
              <p className="text-xs font-semibold text-[#166193] flex items-center justify-center gap-1.5 pt-2">
                <Clock className="w-4 h-4 text-[#37ACDE]" />
                Tiempo estimado de espera: <strong>~{estimatedWait} min</strong>
              </p>
            </div>

            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#166193] to-[#37ACDE] h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(15, (15 - position) * 7.5))}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Por favor, mantén esta pantalla abierta. Te avisaremos automáticamente cuando sea tu turno.
              </p>
            </div>

            {/* Webhook live status indicator */}
            <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl border border-slate-700 text-left text-xs font-mono space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Radio className="w-4 h-4 animate-ping text-emerald-400 shrink-0" />
                <span>Gestión de Tráfico Webhook: CONECTADO</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">{webhookEvent}</p>
            </div>

          </div>
        ) : (
          <div className="space-y-6 text-center animate-fadeIn">
            
            <div className="py-6 px-4 bg-emerald-50 rounded-3xl border border-emerald-200 space-y-3">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-extrabold text-emerald-900 font-['Roboto_Flex']">
                ¡Es tu turno de pre-inscripción!
              </h4>
              <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
                Tu posición en la cola virtual ha sido otorgada. Haz clic a continuación para iniciar sesión y completar tu ficha.
              </p>
            </div>

            <button
              onClick={handleProceedToLogin}
              className="w-full bg-[#166193] hover:bg-[#37ACDE] text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer font-['Roboto_Flex']"
            >
              <span>Continuar a Iniciar Sesión</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>
        )}

        {/* Institutional footnote */}
        <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-2 border-t border-gray-100">
          <ShieldCheck className="w-4 h-4 text-[#166193]" />
          <span>CFP N° 404 Berisso • Control de Demanda Seguro</span>
        </div>

      </div>
    </div>
  );
}
