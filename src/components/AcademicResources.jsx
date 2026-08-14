import React from 'react';
import { FileText, ShieldCheck, Briefcase, BookOpen, Download, ExternalLink, GraduationCap, Building2 } from 'lucide-react';
import { ACADEMIC_RESOURCES } from '../data/coursesData';

export default function AcademicResources({ onDownloadResource }) {
  const getIcon = (type) => {
    switch (type) {
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-[#37ACDE]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#166193]" />;
      default: return <FileText className="w-6 h-6 text-[#166193]" />;
    }
  };

  return (
    <section id="recursos" className="py-16 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#37ACDE] bg-[#37ACDE]/10 px-3 py-1 rounded-full border border-[#37ACDE]/20">
            Documentación & Instituciones
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-['Roboto_Flex'] text-[#1D1E1C]">
            Recursos Académicos y Portal Docente/Empresarial
          </h2>
          <p className="text-sm sm:text-base text-[#585856] font-['Nunito']">
            Descarga resoluciones de validez oficial, normativa del estudiante y accede a canales de vinculación laboral para empresas.
          </p>
        </div>

        {/* Resources Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {ACADEMIC_RESOURCES.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#166193]/30 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#166193]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(res.icon)}
                </div>

                <h3 className="text-base font-bold text-[#1D1E1C] font-['Roboto_Flex'] group-hover:text-[#166193] transition-colors">
                  {res.title}
                </h3>

                <p className="text-xs text-[#585856] font-['Nunito'] leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-400">
                  {res.type} • {res.size}
                </span>

                <button
                  onClick={() => onDownloadResource(res)}
                  className="text-xs font-bold text-[#166193] hover:text-[#37ACDE] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Acceder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Banner for Companies & Teachers */}
        <div className="bg-[#1D1E1C] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-white/10">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
            <Building2 className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-[#FDEA14] uppercase tracking-wider">
                Vínculo Institucional & Empleabilidad
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-['Roboto_Flex']">
                ¿Sos Empresa o Buscás Incorporar Talento Técnico?
              </h3>
              <p className="text-sm text-gray-300 font-['Nunito'] max-w-2xl leading-relaxed">
                El CFP 404 coordina pasantías laborales no rentadas, bolsas de empleo y capacitaciones a medida para cámaras industriales y empresas de la zona.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href="#contacto"
                className="bg-[#37ACDE] hover:bg-[#2c92c1] text-white font-bold px-6 py-3 rounded-xl text-xs text-center transition-all shadow-md"
              >
                Portal de Empresas & Pasantías
              </a>
              <a
                href="#contacto"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl text-xs text-center border border-white/20 transition-all"
              >
                Contacto para Docentes
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
