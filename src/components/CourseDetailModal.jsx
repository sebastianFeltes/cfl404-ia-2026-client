import React, { useState } from 'react';
import { X, Download, Calendar, Clock, Award, ShieldCheck, CheckCircle2, FileText, ArrowRight, Lock, BookOpen, User, Building } from 'lucide-react';

export default function CourseDetailModal({ course, onClose, onEnroll, onDownloadPlanilla }) {
  if (!course) return null;

  const isFinished = course.stageKey === 'primera' || course.status.id === 4;
  const hasQuotas = course.detail.quota > 0 && !isFinished;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      {/* Modal Container Card */}
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200 my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header Bar with Close Button */}
        <div className="relative h-56 sm:h-64 w-full shrink-0 bg-gray-900">
          <img
            src={course.image}
            alt={course.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1E1C] via-[#1D1E1C]/40 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white z-10"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Badges Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#37ACDE] text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                {course.category}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                {course.stage}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${course.status.color}`}>
                {course.status.label}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Roboto_Flex'] text-white">
              {course.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 font-['Nunito'] flex-1">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div>
              <span className="text-xs text-[#585856] font-semibold block">Horas Cátedra</span>
              <span className="text-base font-bold text-[#166193]">{course.detail.hour_quantity} hs</span>
            </div>

            <div>
              <span className="text-xs text-[#585856] font-semibold block">Cantidad de Clases</span>
              <span className="text-base font-bold text-[#166193]">{course.detail.classes_quantity} clases</span>
            </div>

            <div>
              <span className="text-xs text-[#585856] font-semibold block">Vacantes</span>
              <span className={`text-base font-bold ${hasQuotas ? 'text-emerald-600' : 'text-rose-600'}`}>
                {hasQuotas ? `${course.detail.quota} / ${course.detail.total_quota}` : 'Agotadas'}
              </span>
            </div>

            <div>
              <span className="text-xs text-[#585856] font-semibold block">Inasistencias Máx.</span>
              <span className="text-base font-bold text-[#1D1E1C]">{course.max_absences} inasistencias</span>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#1D1E1C] font-['Roboto_Flex'] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#166193]" />
              Descripción General del Curso
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {course.detail.description}
            </p>
          </div>

          {/* Schedule & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#166193]/5 rounded-2xl border border-[#166193]/15">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#166193] uppercase tracking-wider block">
                Días y Horarios de Cursada
              </span>
              <p className="text-sm font-semibold text-[#1D1E1C] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#166193]" />
                {course.schedule}
              </p>
              <p className="text-xs text-gray-500">
                Inicia: <strong>{course.start_date}</strong> • Finaliza: <strong>{course.end_time}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#166193] uppercase tracking-wider block">
                Requisitos de Ingreso
              </span>
              <p className="text-sm font-semibold text-[#1D1E1C] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#166193]" />
                {course.detail.title_required}
              </p>
              <p className="text-xs text-gray-500">
                Presentar fotocopia de DNI y certificado de estudios.
              </p>
            </div>
          </div>

          {/* Syllabus / Plan de Estudios */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1D1E1C] font-['Roboto_Flex'] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#166193]" />
                Plan de Estudios
              </h3>

              <button
                onClick={() => onDownloadPlanilla(course)}
                className="bg-white hover:bg-gray-100 text-[#166193] border border-[#166193] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Planilla / Programa PDF</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {course.detail.syllabus.map((modulo, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-gray-50 hover:bg-gray-100/80 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-3 transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#166193] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{modulo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Endorsement & Official Title */}
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-300/40 flex items-start gap-3">
            <Award className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900 font-['Roboto_Flex']">
                Aval Institucional & Certificación Oficial
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Certificado emitido por: <strong>{course.detail.endorsement_by}</strong>. Otorga puntaje y validez para inserción laboral en empresas de la región.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA Row */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-[#585856] block">Costo de Formación:</span>
            <span className="text-lg font-extrabold text-[#166193] font-['Roboto_Flex']">
              100% Gratuito (Educación Pública)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-200 text-sm transition-colors"
            >
              Cerrar
            </button>

            {hasQuotas ? (
              <button
                onClick={() => {
                  onClose();
                  onEnroll(course);
                }}
                className="flex-1 sm:flex-initial bg-[#37ACDE] hover:bg-[#2892c5] text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 focus:ring-4 focus:ring-[#37ACDE]/40"
              >
                <span>Inscribirme Ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled
                className="flex-1 sm:flex-initial bg-gray-300 text-gray-600 font-bold px-8 py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                <span>{isFinished ? 'Edición Finalizada' : 'Cupos Agotados'}</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
