import React, { useState } from 'react';
import { Calendar, Clock, Award, Users, ChevronDown, ChevronUp, ArrowRight, CheckCircle2, Lock, FileText, Sparkles } from 'lucide-react';

export default function CourseCard({ course, onSelectCourse, onEnrollCourse, forceMobileMode }) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const isFinished = course.stageKey === 'primera' || course.status.id === 4;
  const hasQuotas = course.detail.quota > 0 && !isFinished;

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <div className={`group transition-all duration-300 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#37ACDE]/40 overflow-hidden ${
      isAccordionOpen ? 'ring-2 ring-[#37ACDE]/40' : ''
    }`}>
      
      {/* ========================================== */}
      {/* MOBILE ACCORDION MODE (Triggered on small screens or simulator) */}
      {/* ========================================== */}
      <div className={`md:hidden ${forceMobileMode ? '!block' : ''}`}>
        
        {/* Accordion Compact Header */}
        <button
          onClick={toggleAccordion}
          className="w-full p-4 flex items-center justify-between text-left gap-3 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
          aria-expanded={isAccordionOpen}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail / Avatar */}
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-sm">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60';
                }}
              />
            </div>

            {/* Course Title & Stage Badge */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 text-[#585856]">
                  {course.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${course.status.color}`}>
                  {course.status.label}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1D1E1C] font-['Roboto_Flex'] truncate mt-0.5">
                {course.name}
              </h3>
            </div>
          </div>

          {/* Accordion Chevron Icon */}
          <div className="p-1.5 rounded-full bg-gray-100 text-[#166193] shrink-0">
            {isAccordionOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {/* Accordion Expandable Content Panel */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden border-t border-gray-100 ${
            isAccordionOpen ? 'max-h-[650px] opacity-100 p-4 bg-gray-50/70' : 'max-h-0 opacity-0 p-0'
          }`}
        >
          {/* Expanded Image */}
          <div className="relative h-44 rounded-xl overflow-hidden mb-3 border border-gray-200 shadow-inner">
            <img
              src={course.image}
              alt={course.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <p className="text-xs font-semibold text-gray-200">{course.stage}</p>
              <p className="text-xs font-bold text-[#FDEA14]">Inicio: {course.start_date}</p>
            </div>
          </div>

          {/* Expanded Specs */}
          <div className="space-y-2 mb-4 text-xs font-['Nunito'] text-[#585856]">
            <p className="line-clamp-2 text-gray-700 leading-relaxed">
              {course.detail.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#166193]" />
                <span><strong>Duración:</strong> {course.detail.hour_quantity} hs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#166193]" />
                <span><strong>Cupos:</strong> {hasQuotas ? `${course.detail.quota} disp.` : 'Agotado'}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#166193]" />
              <span><strong>Horarios:</strong> {course.schedule}</span>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => onSelectCourse(course)}
              className="flex-1 bg-white hover:bg-gray-100 text-[#166193] border border-[#166193] font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <span>Ver ficha completa</span>
              <FileText className="w-3.5 h-3.5" />
            </button>

            {hasQuotas ? (
              <button
                onClick={() => onEnrollCourse(course)}
                className="flex-1 bg-[#37ACDE] hover:bg-[#2892c5] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors shadow-sm"
              >
                <span>Inscribirme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-200 text-gray-500 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isFinished ? 'Finalizado' : 'Sin cupos'}</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* DESKTOP & TABLET CARD VIEW */}
      {/* ========================================== */}
      <div className={`hidden md:flex flex-col h-full ${forceMobileMode ? '!hidden' : ''}`}>
        
        {/* Card Top Image Header */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={course.image}
            alt={course.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="bg-[#1D1E1C]/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/10 uppercase tracking-wide">
              {course.category}
            </span>

            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-sm ${course.status.color}`}>
              {course.status.label}
            </span>
          </div>

          {/* Stage Footer Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-200 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FDEA14]" />
              {course.stageKey === 'segunda' ? 'Julio - Diciembre' : 'Marzo - Julio'}
            </span>

            {hasQuotas && (
              <span className="font-bold text-[#FDEA14] bg-[#166193]/80 px-2 py-0.5 rounded text-[11px]">
                {course.detail.quota} vacantes
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#1D1E1C] font-['Roboto_Flex'] group-hover:text-[#166193] transition-colors leading-snug">
              {course.name}
            </h3>

            <p className="text-xs text-[#585856] font-['Nunito'] line-clamp-2 leading-relaxed">
              {course.detail.description}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-[#585856] font-['Nunito'] pt-3 border-t border-gray-100 bg-gray-50/50 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#166193] shrink-0" />
              <span>{course.detail.hour_quantity} Horas Cátedra</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#166193] shrink-0" />
              <span>{course.detail.classes_quantity} Clases totales</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => onSelectCourse(course)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#166193] font-bold py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ver más</span>
              <FileText className="w-3.5 h-3.5" />
            </button>

            {hasQuotas ? (
              <button
                onClick={() => onEnrollCourse(course)}
                className="flex-1 bg-[#166193] hover:bg-[#37ACDE] text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#166193]"
              >
                <span>Inscribirme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-200 text-gray-500 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isFinished ? 'Finalizado' : 'Sin cupos'}</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
