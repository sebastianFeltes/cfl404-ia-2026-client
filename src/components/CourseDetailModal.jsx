import React from 'react';
import { Calendar, Clock, Award, ShieldCheck, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_ENDORSEMENT } from '../data/coursesData';

export default function CourseDetailModal({ course, onClose, onLogin, onOpenQueue }) {
  if (!course) return null;

  const sponsor = course.sponsor || {
    name: 'TecPlata',
    logo: '/images/tecplata_logo.jpg',
    mention: 'Patrocinado por TecPlata - Terminal Portuaria',
    badge: 'TecPlata'
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const preenrollmentOpen = !course.preenrollment_date || todayStr >= course.preenrollment_date;

  const handleActionClick = () => {
    onClose();
    if (onOpenQueue && preenrollmentOpen) {
      onOpenQueue(course);
    } else if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      {/* Modal Container Card */}
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200 my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header Bar (SIN botón de cruz X) */}
        <div className="relative h-56 sm:h-64 w-full shrink-0 bg-gray-900">
          <img
            src={course.image}
            alt={course.name}
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/Herreria.webp';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1E1C] via-[#1D1E1C]/40 to-transparent"></div>

          {/* Title, Category & Stage Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#37ACDE] text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {course.category}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                {course.stage}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${course.status?.color || 'bg-emerald-500/10 text-emerald-700'}`}>
                {course.status?.label || 'Inscripción Abierta'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Roboto_Flex'] text-white">
              {course.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 font-['Nunito'] flex-1">
          
          {/* Quick Info Grid (Sin Inasistencias y Sin Vacantes/Cupos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div>
              <span className="text-xs text-[#585856] font-semibold block">Horas Cátedra</span>
              <span className="text-base font-bold text-[#166193]">{course.detail?.hour_quantity || 120} hs</span>
            </div>

            <div>
              <span className="text-xs text-[#585856] font-semibold block">Cantidad de Clases</span>
              <span className="text-base font-bold text-[#166193]">{course.detail?.classes_quantity || 32} clases</span>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#1D1E1C] font-['Roboto_Flex'] flex items-center gap-2">
              Descripción General del Curso
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {course.detail?.description}
            </p>
          </div>

          {/* Schedule & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#166193]/5 rounded-2xl border border-[#166193]/15">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#166193] uppercase tracking-wider block font-['Roboto_Flex']">
                Días y Horarios de Cursada
              </span>
              <p className="text-sm font-semibold text-[#1D1E1C] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#166193]" />
                {course.schedule}
              </p>
              <p className="text-xs text-gray-500">
                Inicia: <strong>{course.start_date}</strong> • Finaliza: <strong>{course.end_time || 'A confirmar'}</strong>
              </p>

              {/* Indicador de Fecha de Pre-Inscripción Automatizada */}
              {course.preenrollment_date && (
                <div className="mt-2 pt-2 border-t border-[#166193]/10 text-xs">
                  <span className="font-semibold text-slate-600">Apertura de Pre-inscripción: </span>
                  <strong className={preenrollmentOpen ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                    {course.preenrollment_date} {preenrollmentOpen ? '(Habilitada)' : '(Próximamente)'}
                  </strong>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#166193] uppercase tracking-wider block font-['Roboto_Flex']">
                Requisitos de Ingreso
              </span>
              <p className="text-sm font-semibold text-[#1D1E1C] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#166193]" />
                {course.detail?.title_required || 'Primario completo'}
              </p>
              <p className="text-xs text-gray-500">
                Presentar fotocopia de DNI y certificado de estudios al inscribirte.
              </p>
            </div>
          </div>

          {/* Aval Oficial e Identidad Visual (Ministerio de Educación y Trabajo PBA) */}
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-300/50 flex items-start gap-3">
            <Award className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 font-['Roboto_Flex']">
                Aval Institucional Oficial
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Este curso cuenta con la certificación oficial del <strong>{OFFICIAL_ENDORSEMENT}</strong>. Título oficial con validez laboral.
              </p>
            </div>
          </div>

          {/* Patrocinador Dinámico (Con Logo de TecPlata u otros) */}
          {sponsor && (
            <div className="p-4 bg-sky-500/10 rounded-2xl border border-sky-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {sponsor.logo ? (
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-sky-200 shrink-0">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#166193] text-white rounded-xl font-extrabold text-xs font-['Roboto_Flex'] shrink-0 shadow-sm">
                    {sponsor.badge || sponsor.name}
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold text-[#166193] uppercase tracking-wider block font-['Roboto_Flex']">
                    Patrocinador Oficial
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    {sponsor.mention}
                  </p>
                </div>
              </div>
              <Building2 className="w-6 h-6 text-[#166193] shrink-0 opacity-60 hidden sm:block" />
            </div>
          )}

        </div>

        {/* Modal Footer CTA Row (Un solo botón de cierre de texto "Cerrar" + Botón "Iniciar sesión") */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 font-['Nunito']">
          <div>
            <span className="text-xs text-[#585856] block">Costo de Formación:</span>
            <span className="text-base font-extrabold text-[#166193] font-['Roboto_Flex']">
              100% Gratuito (Educación Pública)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Único control de cierre: botón de texto Cerrar */}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-200 text-xs transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            {/* Botón Acción principal: "Iniciar sesión" */}
            <button
              type="button"
              onClick={handleActionClick}
              className="flex-1 sm:flex-initial bg-[#166193] hover:bg-[#37ACDE] text-white font-bold px-8 py-3 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer focus:ring-4 focus:ring-[#37ACDE]/40"
            >
              <span>Iniciar sesión</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
