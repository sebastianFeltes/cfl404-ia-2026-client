import React from 'react';
import { GraduationCap, ShieldCheck, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1D1E1C] text-white pt-12 pb-8 border-t border-white/10 font-['Nunito']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#166193] flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg font-['Roboto_Flex'] text-white">
                  CFP <span className="text-[#FDEA14]">Nº 404</span>
                </h3>
                <p className="text-xs text-gray-400">Módulo de Cursos & Oferta Educativa</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              Módulo de Cursos diseñado e implementado para concatenarse a la plataforma institucional del Centro a través de Git.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#37ACDE] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#FDEA14]" />
              <span>Certificación Oficial con Validez Nacional</span>
            </div>
          </div>

          {/* Cursos Stages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FDEA14] font-['Roboto_Flex']">
              Etapas del Módulo
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><a href="#cursos" className="hover:text-white transition-colors">Segunda Etapa (Julio - Diciembre 2026)</a></li>
              <li><a href="#cursos" className="hover:text-white transition-colors">Primera Etapa (Marzo - Julio 2026)</a></li>
              <li><a href="#cursos" className="hover:text-white transition-colors">Catálogo Completo (15 Cursos)</a></li>
            </ul>
          </div>

          {/* Quick Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FDEA14] font-['Roboto_Flex']">
              Navegación
            </h4>
            <button
              onClick={scrollToTop}
              className="bg-[#166193] hover:bg-[#37ACDE] text-white p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Volver arriba</span>
            </button>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 Centro de Formación Profesional Nº 404 — Módulo Cursos.</p>
          <p className="text-gray-400">Desarrollado para concatenación en Git.</p>
        </div>

      </div>
    </footer>
  );
}
