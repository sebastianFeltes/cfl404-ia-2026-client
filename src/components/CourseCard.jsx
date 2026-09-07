import React, { useState } from 'react';
import { Calendar, Clock, Award, ChevronDown, ChevronUp, ArrowRight, FileText, Building2, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_ENDORSEMENT } from '../data/coursesData';

export default function CourseCard({ course, onSelectCourse, onLogin, onOpenQueue, forceMobileMode }) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const sponsor = course.sponsor || {
    name: 'TecPlata',
    logo: '/images/tecplata_logo.jpg',
    mention: 'Patrocinado por TecPlata',
    badge: 'TecPlata'
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const preenrollmentOpen = !course.preenrollment_date || todayStr >= course.preenrollment_date;

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleAction = (e) => {
    e.stopPropagation();
    if (onOpenQueue && preenrollmentOpen) {
      onOpenQueue(course);
    } else if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className={`group transition-all duration-300 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#37ACDE]/40 overflow-hidden ${
      isAccordionOpen ? 'ring-2 ring-[#37ACDE]/40' : ''
    }`}>
      
      {/* ========================================== */}
      {/* MOBILE ACCORDION MODE */}
      {/* ========================================== */}
      <div className={`md:hidden ${forceMobileMode ? '!block' : ''}`}>
        
        {/* Accordion Compact Header */}
        <button
          onClick={toggleAccordion}
          className="w-full p-4 flex items-center justify-between text-left gap-3 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
          aria-expanded={isAccordionOpen}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-sm">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/Herreria.webp';
                }}
              />
            </div>

            {/* Course Title & Category */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 text-[#585856]">
                  {course.category}
                </span>
                {sponsor && (
                  sponsor.logo ? (
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="h-5 w-auto object-contain bg-white rounded px-1 border border-gray-200"
                    />
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#166193]/10 text-[#166193]">
                      {sponsor.badge || sponsor.name}
                    </span>
                  )
                )}
              </div>

              <h3 className="text-base font-bold text-[#1D1E1C] font-['Roboto_Flex'] truncate mt-0.5">
                {course.name}
              </h3>
            </div>
          </div>

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
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/Herreria.webp';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-2 left-3 right-3 text-white">
              <p className="text-xs font-semibold text-gray-200">{course.stage}</p>
              <p className="text-xs font-bold text-[#FDEA14]">Inicio: {course.start_date}</p>
            </div>
          </div>

          {/* Expanded Specs (Sin Cupos) */}
          <div className="space-y-2 mb-4 text-xs font-['Nunito'] text-[#585856]">
            <p className="line-clamp-2 text-gray-700 leading-relaxed">
              {course.detail?.description}
            </p>

            <div className="flex items-center gap-1.5 pt-2 border-t border-gray-200/60">
              <Clock className="w-3.5 h-3.5 text-[#166193]" />
              <span><strong>Duración:</strong> {course.detail?.hour_quantity || 120} hs ({course.detail?.classes_quantity || 32} clases)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#166193]" />
              <span><strong>Horarios:</strong> {course.schedule}</span>
            </div>

            {/* Aval institucional */}
            <div className="pt-2 border-t border-gray-200 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Aval oficial del Ministerio de Educación y Trabajo PBA</span>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => onSelectCourse(course)}
              className="flex-1 bg-white hover:bg-gray-100 text-[#166193] border border-[#166193] font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>Ver más</span>
              <FileText className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleAction}
              className="flex-1 bg-[#166193] hover:bg-[#37ACDE] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
            >
              <span>Iniciar sesión</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
              e.target.src = '/images/Herreria.webp';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="bg-[#1D1E1C]/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/10 uppercase tracking-wide">
              {course.category}
            </span>

            {sponsor && (
              sponsor.logo ? (
                <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-md border border-white/20 flex items-center justify-center">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-6 w-auto max-w-[100px] object-contain"
                  />
                </div>
              ) : (
                <span className="bg-[#166193] text-white text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-sm border border-white/20">
                  {sponsor.badge || sponsor.name}
                </span>
              )
            )}
          </div>

          {/* Stage & Date Footer Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-200 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FDEA14]" />
              {course.stage}
            </span>
            <span className="text-[11px] font-bold text-[#FDEA14] bg-black/40 px-2 py-0.5 rounded">
              Inicio: {course.start_date}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 font-['Nunito']">
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#1D1E1C] font-['Roboto_Flex'] group-hover:text-[#166193] transition-colors leading-snug">
              {course.name}
            </h3>

            <p className="text-xs text-[#585856] line-clamp-2 leading-relaxed">
              {course.detail?.description}
            </p>
          </div>

          {/* Quick Specs Grid (Sin Vacantes/Cupos) */}
          <div className="grid grid-cols-2 gap-2 text-xs text-[#585856] pt-3 border-t border-gray-100 bg-gray-50/50 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#166193] shrink-0" />
              <span>{course.detail?.hour_quantity || 120} hs Cátedra</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#166193] shrink-0" />
              <span>{course.detail?.classes_quantity || 32} Clases</span>
            </div>
          </div>

          {/* Aval Oficial Ministerio PBA & Sponsor Mention */}
          <div className="space-y-1.5 text-[11px] border-t border-gray-100 pt-2">
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span className="truncate">Aval oficial Ministerio de Educación y Trabajo PBA</span>
            </div>
            {sponsor && (
              <div className="flex items-center gap-2 text-slate-600 font-semibold truncate bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                {sponsor.logo ? (
                  <img src={sponsor.logo} alt={sponsor.name} className="h-5 w-auto object-contain shrink-0" />
                ) : (
                  <Building2 className="w-3.5 h-3.5 text-[#166193] shrink-0" />
                )}
                <span className="truncate">{sponsor.mention}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => onSelectCourse(course)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#166193] font-bold py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ver más</span>
              <FileText className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleAction}
              className="flex-1 bg-[#166193] hover:bg-[#37ACDE] text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#166193] cursor-pointer"
            >
              <span>Iniciar sesión</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
