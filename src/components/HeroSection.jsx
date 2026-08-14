import React from 'react';
import { Award, Briefcase, Users, CheckCircle2, ArrowRight, Search, ShieldCheck } from 'lucide-react';

export default function HeroSection({ onSearchClick }) {
  return (
    <section id="hero" className="relative bg-gradient-to-b from-[#166193] via-[#166193]/95 to-[#1D1E1C] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Subtle Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#37ACDE_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-[#37ACDE]/20 border border-[#37ACDE]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-[#FDEA14]">
              <ShieldCheck className="w-4 h-4 text-[#FDEA14]" />
              <span>Certificación Oficial con Validez Nacional</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-['Roboto_Flex'] leading-tight text-white tracking-tight">
              Capacitación Profesional <br className="hidden sm:inline" />
              <span className="text-[#FDEA14] drop-shadow-sm">con Salida Laboral Real</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-200 font-['Nunito'] font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Formación gratuita y pública para potenciar tu inserción en el mercado de trabajo. 
              Aprende oficios modernos, tecnología y herramientas para emprender con docentes calificados.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#cursos"
                className="w-full sm:w-auto bg-[#37ACDE] hover:bg-[#2c91bd] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-base focus:ring-4 focus:ring-[#37ACDE]/50"
              >
                <span>Explorar Oferta Educativa</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#recursos"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition-all text-center text-base"
              >
                Información Institucional
              </a>
            </div>

            {/* Badges / Value Props */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/15 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#FDEA14] font-['Roboto_Flex']">100%</span>
                <span className="text-xs text-gray-300 font-['Nunito']">Gratuito y Oficial</span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-white/15 px-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-['Roboto_Flex']">15+</span>
                <span className="text-xs text-gray-300 font-['Nunito']">Cursos por Etapas</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#37ACDE] font-['Roboto_Flex']">92%</span>
                <span className="text-xs text-gray-300 font-['Nunito']">Inserción Laboral</span>
              </div>
            </div>

          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Accent Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#37ACDE] to-[#FDEA14] rounded-2xl blur-lg opacity-40"></div>

              <div className="relative bg-[#1D1E1C] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#37ACDE]">
                    Próximos Inicios - 2ª Etapa
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Julio 2026
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#37ACDE]/40 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-[#166193] flex items-center justify-center text-white font-bold text-sm">
                      DG
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">Diseño Gráfico</h4>
                      <p className="text-xs text-gray-400">Duración: 120 hs • Modalidad presencial</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      Inscripción
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#37ACDE]/40 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-[#37ACDE] flex items-center justify-center text-white font-bold text-sm">
                      3D
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">Impresión 3D & CAD</h4>
                      <p className="text-xs text-gray-400">Duración: 100 hs • Modelado e impresión</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      Cupos
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#37ACDE]/40 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-[#585856] flex items-center justify-center text-white font-bold text-sm">
                      RC
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">Reparación de PCs</h4>
                      <p className="text-xs text-gray-400">Duración: 130 hs • Hardware & Redes</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                      Últimos 2
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href="#cursos"
                    className="text-xs font-bold text-[#FDEA14] hover:underline inline-flex items-center gap-1"
                  >
                    Ver los 15 cursos disponibles &rarr;
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
