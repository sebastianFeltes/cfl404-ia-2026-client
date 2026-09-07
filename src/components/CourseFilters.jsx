import React from 'react';
import { Search, Filter, Calendar, Clock } from 'lucide-react';
import { CATEGORIES } from '../data/coursesData';

export default function CourseFilters({
  searchTerm,
  setSearchTerm,
  selectedStage,
  setSelectedStage,
  selectedCategory,
  setSelectedCategory,
  totalResults
}) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-200/80 mb-8 space-y-6">
      
      {/* Top Header & Search Bar Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Roboto_Flex'] text-[#1D1E1C] flex items-center gap-2">
            <Filter className="w-6 h-6 text-[#166193]" />
            Catálogo de Oferta Educativa
          </h2>
          <p className="text-sm text-[#585856] font-['Nunito']">
            Explora las capacitaciones profesionales dictadas por el CFP
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por curso, tecnología u oficio..."
            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Nunito'] text-sm focus:outline-none focus:ring-2 focus:ring-[#166193] focus:bg-white text-[#1D1E1C] placeholder-gray-400 transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center font-bold text-gray-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Stage Selector Tabs (Etapas calculadas según fecha de inicio: Primera mitad del año VS Segunda mitad del año) */}
      <div className="pt-2 border-t border-gray-100 font-['Nunito']">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#585856] mb-2 font-['Roboto_Flex']">
          Seleccionar Etapa de Cursada (Por Fecha de Inicio):
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Segunda mitad del año */}
          <button
            onClick={() => setSelectedStage('segunda')}
            className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all duration-200 cursor-pointer ${
              selectedStage === 'segunda'
                ? 'bg-[#166193] text-white border-[#166193] shadow-md ring-2 ring-[#166193]/30'
                : 'bg-gray-50 text-[#1D1E1C] border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm font-['Roboto_Flex']">Segunda mitad del año</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedStage === 'segunda' ? 'bg-[#FDEA14] text-[#1D1E1C]' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Julio - Diciembre
                </span>
              </div>
              <p className={`text-xs mt-1 ${selectedStage === 'segunda' ? 'text-gray-200' : 'text-[#585856]'}`}>
                Cursos que inician en el 2° semestre + Cursos Anuales
              </p>
            </div>
            <Calendar className={`w-5 h-5 shrink-0 ${selectedStage === 'segunda' ? 'text-[#FDEA14]' : 'text-[#166193]'}`} />
          </button>

          {/* Primera mitad del año */}
          <button
            onClick={() => setSelectedStage('primera')}
            className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all duration-200 cursor-pointer ${
              selectedStage === 'primera'
                ? 'bg-[#166193] text-white border-[#166193] shadow-md ring-2 ring-[#166193]/30'
                : 'bg-gray-50 text-[#1D1E1C] border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm font-['Roboto_Flex']">Primera mitad del año</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedStage === 'primera' ? 'bg-gray-200 text-gray-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  Marzo - Junio
                </span>
              </div>
              <p className={`text-xs mt-1 ${selectedStage === 'primera' ? 'text-gray-200' : 'text-[#585856]'}`}>
                Cursos que inician en el 1° semestre + Cursos Anuales
              </p>
            </div>
            <Clock className={`w-5 h-5 shrink-0 ${selectedStage === 'primera' ? 'text-[#FDEA14]' : 'text-gray-400'}`} />
          </button>

          {/* Todas las Etapas */}
          <button
            onClick={() => setSelectedStage('todas')}
            className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all duration-200 cursor-pointer ${
              selectedStage === 'todas'
                ? 'bg-[#166193] text-white border-[#166193] shadow-md ring-2 ring-[#166193]/30'
                : 'bg-gray-50 text-[#1D1E1C] border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div>
              <span className="font-bold text-sm font-['Roboto_Flex']">Todas las Etapas</span>
              <p className={`text-xs mt-1 ${selectedStage === 'todas' ? 'text-gray-200' : 'text-[#585856]'}`}>
                Catálogo completo de capacitaciones del CFP
              </p>
            </div>
            <Filter className={`w-5 h-5 shrink-0 ${selectedStage === 'todas' ? 'text-[#FDEA14]' : 'text-gray-500'}`} />
          </button>

        </div>
      </div>

      {/* Category Pills & Filters (Mantenido INTACTO por requerimiento) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-gray-100 font-['Nunito']">
        
        {/* Área Temática */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-[#585856] uppercase tracking-wider font-['Roboto_Flex']">
            Área Temática:
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-['Nunito'] transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#37ACDE] text-white shadow-sm'
                    : 'bg-gray-100 text-[#585856] hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Badge */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          <div className="text-xs text-[#585856] font-semibold bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
            Mostrando <strong className="text-[#166193]">{totalResults}</strong> cursos
          </div>
        </div>

      </div>

    </div>
  );
}
