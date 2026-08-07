import React, { useState } from 'react';
import { X, CheckCircle2, User, Mail, Phone, FileCheck, Send, ShieldCheck, AlertCircle } from 'lucide-react';

export default function EnrollmentModal({ course, onClose, onSuccessSubmit }) {
  if (!course) return null;

  const [formData, setFormData] = useState({
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    educationLevel: 'Secundario completo',
    acceptTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName || !formData.dni || !formData.email || !formData.phone) {
      setErrorMsg('Por favor completa todos los campos obligatorios del formulario.');
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMsg('Debes aceptar el régimen de asistencias y el reglamento del CFP.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to student_course table insert
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessSubmit({
        courseName: course.name,
        studentName: formData.fullName,
        dni: formData.dni,
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="bg-[#166193] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold uppercase tracking-wider text-[#FDEA14]">
            Formulario Oficial de Pre-Inscripción
          </span>

          <h2 className="text-xl sm:text-2xl font-bold font-['Roboto_Flex'] mt-1">
            {course.name}
          </h2>

          <p className="text-xs text-gray-200 font-['Nunito'] mt-1">
            Dictado en la <strong>{course.stage}</strong> • Horario: {course.schedule}
          </p>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 font-['Nunito']">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name & DNI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1D1E1C] uppercase mb-1">
                Nombre y Apellido *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej: María González"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#166193] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1D1E1C] uppercase mb-1">
                DNI / Documento *
              </label>
              <div className="relative">
                <FileCheck className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  placeholder="Ej: 38.450.123"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#166193] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1D1E1C] uppercase mb-1">
                Correo Electrónico *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="maria@ejemplo.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#166193] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1D1E1C] uppercase mb-1">
                Teléfono de Contacto *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="291 456-7890"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#166193] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-xs font-bold text-[#1D1E1C] uppercase mb-1">
              Nivel de Estudios Alcanzado
            </label>
            <select
              value={formData.educationLevel}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#166193] focus:bg-white"
            >
              <option value="Primario completo">Primario completo</option>
              <option value="Secundario en curso">Secundario en curso</option>
              <option value="Secundario completo">Secundario completo</option>
              <option value="Terciario / Universitario">Terciario / Universitario</option>
            </select>
          </div>

          {/* Terms Agreement */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 rounded text-[#166193] focus:ring-[#166193] w-4 h-4"
              />
              <span className="text-xs text-[#585856]">
                Declaro conocer que el límite de inasistencias para este curso es de <strong>{course.max_absences} clases</strong> y me comprometo a cumplir el régimen de asistencia oficial del CFP.
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#37ACDE] hover:bg-[#2892c5] text-white font-bold px-7 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirmar Pre-Inscripción</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
