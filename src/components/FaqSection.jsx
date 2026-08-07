import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '../data/coursesData';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="preguntas" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#166193]/10 text-[#166193] text-xs font-bold px-3 py-1 rounded-full">
            <HelpCircle className="w-4 h-4" />
            <span>Resolución de Dudas Frecuentes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-['Roboto_Flex'] text-[#1D1E1C]">
            Preguntas Frecuentes
          </h2>
          <p className="text-sm text-[#585856] font-['Nunito']">
            Todo lo que necesitas saber antes de iniciar tu cursada en el CFP.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#166193] bg-[#166193]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-base font-['Roboto_Flex'] text-[#1D1E1C]">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full transition-transform ${
                    isOpen ? 'bg-[#166193] text-white rotate-180' : 'bg-gray-100 text-[#585856]'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#585856] font-['Nunito'] leading-relaxed border-t border-gray-200/50 pt-3 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
